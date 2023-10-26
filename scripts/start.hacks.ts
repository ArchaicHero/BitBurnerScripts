import HackableBaseServer from 'scripts/if.server.hackable'
import { SERVER_PREFIX, PROTECTED_TARGETS, FULL_FILENAME_GROW, FULL_FILENAME_HACK, FULL_FILENAME_WEAKEN, FILENAME_MANAGE_HACKS, FULL_FILENAME_MANAGE_HACKS } from 'scripts/constants'
import { NS } from '@ns';

/** @param {NS} ns */
export async function main(ns: NS) {
  const REDEPLOY = true;
	const curLvl = ns.getHackingLevel();
  const ramHack = ns.getScriptRam(FULL_FILENAME_HACK);
  const ramGrow = ns.getScriptRam(FULL_FILENAME_GROW);
  const ramWeaken = ns.getScriptRam(FULL_FILENAME_WEAKEN);

	let serverNameList = getServersHostnames(ns);
	let privServers = serverNameList.filter(s => s.includes(SERVER_PREFIX));
	let servers = [];

  // Remove servers now to not create objects for servers to avoid
  serverNameList = serverNameList.filter(s => !PROTECTED_TARGETS.includes(s));
	for (let s of serverNameList) {
		let server = new HackableBaseServer(ns, s);
		servers.push(server);
	}

  //TODO: find most profitable to target with hacks
  // MaxMoney / weaken time I'll use that for now
  let prioTargets = [];
  for (let s of servers) {
    if (ns.getServerRequiredHackingLevel(s.hostname) <= curLvl && !PROTECTED_TARGETS.includes(s.hostname)) {
      // ns.printf("%20s:\ts.money.max %f, s.time.we %f", s.hostname, s.money.max, s.time.we);
      prioTargets.push({ "rate":  (s.money.max / (s.time.we)), "server": s})
    }
  }
  prioTargets.sort(function(a, b) {
    return b.rate < a.rate ? -1
      : b.rate > a.rate ? 1
      : 0;
  })

  // ns.print("INFO dumping simple priority list");
  prioTargets.forEach(t => { t.server.root() })

  // Setup servers if needed
  for (let s of servers) {
    if (!s.admin) {
      s.root();
    }
    if (!ns.fileExists(FULL_FILENAME_MANAGE_HACKS, s.hostname) || REDEPLOY){
      ns.scp([FULL_FILENAME_MANAGE_HACKS, FULL_FILENAME_GROW, FULL_FILENAME_HACK, FULL_FILENAME_WEAKEN], s.hostname, "home");
    }
  }

  // cull invalid hosts/targets for when not enough programs to open ports
  servers = servers.filter(s => { return s.admin && s.ram.max >= 4});
  prioTargets = prioTargets.filter(s => { return s.server.admin })


  let i = 0;  
  let target = prioTargets[0].server;
  ns.printf("INFO %s stats:\nsecurity\tcur:%20f\tmin:%20f\nmoney\t\tcur:%20f\tmax:%20f", target.hostname, target.security.level, target.security.min, target.money.available, target.money.max);
  for (let worker of servers) {
    target = prioTargets[i++ % prioTargets.length].server;
    ns.printf("INFO starting hacking on %s with target %s", worker.hostname, target.hostname);
    ns.killall(worker.hostname)

    ns.exec(FULL_FILENAME_MANAGE_HACKS, worker.hostname, 1, 
      target.hostname, ramHack, ramGrow, ramWeaken,
      FULL_FILENAME_HACK, FULL_FILENAME_GROW, FULL_FILENAME_WEAKEN);
  }

  // TODO:  Break into 2 scripts so we can setup batching with priv workers.
  i = 0;
  for (let worker of privServers) {
    target = prioTargets[i++ % prioTargets.length].server;
    if (!ns.fileExists(FULL_FILENAME_MANAGE_HACKS, worker) || REDEPLOY){
      ns.scp([FULL_FILENAME_MANAGE_HACKS, FULL_FILENAME_GROW, FULL_FILENAME_HACK, FULL_FILENAME_WEAKEN], worker, "home");
    }
    ns.printf("INFO starting hacking on %s with target %s", worker, target.hostname);
    ns.killall(worker)

    ns.exec(FULL_FILENAME_MANAGE_HACKS, worker, 1, 
      target.hostname, ramHack, ramGrow, ramWeaken,
      FULL_FILENAME_HACK, FULL_FILENAME_GROW, FULL_FILENAME_WEAKEN);
  }
}

export function getServersHostnames(ns: NS, current="home", set=new Set<string>()): string[]{
	let con = ns.scan(current);
	let next = con.filter(c => !set.has(c));
	next.forEach(n => {
		set.add(n);
		return getServersHostnames(ns, n, set);
	})
	return Array.from(set.keys());
}