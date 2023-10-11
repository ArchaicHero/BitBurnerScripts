import HackableBaseServer from 'scripts/if.server.hackable'
import BasePlayer from 'scripts/if.player'
import { SERVER_PREFIX, PROTECTED_TARGETS, FULL_FILENAME_GROW, FULL_FILENAME_HACK, FULL_FILENAME_WEAKEN, FILENAME_MANAGE_HACKS } from 'scripts/constants'
import { NS } from '@ns';
import { sleepPids } from '/utils.pids';

/** @param {NS} ns */
export async function main(ns: NS) {
	const curLvl = ns.getHackingLevel();
  const ramHack = ns.getScriptRam(FULL_FILENAME_HACK);
  const ramGrow = ns.getScriptRam(FULL_FILENAME_GROW);
  const ramWeaken = ns.getScriptRam(FULL_FILENAME_WEAKEN);

	let serverNameList = getServers(ns);
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
      // ns.tprintf("%20s:\ts.money.max %f, s.time.we %f", s.hostname, s.money.max, s.time.we);
      prioTargets.push({ "rate":  (s.money.max / (s.time.we)), "Server": s})
    }
  }
  prioTargets.sort(function(a, b) {
    return b.rate < a.rate ? -1
      : b.rate > a.rate ? 1
      : 0;
  })

  // ns.tprint("INFO dumping simple priority list");
  prioTargets.forEach(t => { ns.tprintf("server = %20s \t\trate = %f", t.Server.hostname, t.rate)});

  let toRemove = [];
  // Setup servers if needed
  for (let s of servers) {
    if (!s.admin) {
      s.root();
    }
    if (!s.admin || (s.ram.max < 2)) {
      toRemove.push(s);
      continue;
    }
    if (!ns.fileExists(FULL_FILENAME_HACK, s.hostname)){
      ns.scp([FULL_FILENAME_GROW, FULL_FILENAME_HACK, FULL_FILENAME_WEAKEN], s.hostname, "home");
    }
  }

  ns.tail()
  // Remove invalid servers
  for (let s of toRemove) {
    servers.splice(servers.indexOf(s), 1)
  }

  servers.forEach(s => { ns.tprintf("Ready to run hack on %s", s.hostname) })

  let i = 0;
  let target;
  while(true) {
    let pids:number[] = [];
    for (let server of servers) {
      target = prioTargets[i % prioTargets.length].Server;
      ns.printf("INFO starting hacking on %s with target %s", server.hostname, target.hostname);
      ns.killall(server.hostname)

      // TODO:  add batching use link for batching concept
      // https://github.com/DarkTechnomancer/darktechnomancer.github.io/tree/main

      if (target.security.level > target.security.min + 3) {
         let threads = Math.floor(Math.min((target.security.level - target.security.min) / ns.growthAnalyzeSecurity(1, target.hostname), server.threadCount(ramWeaken)));
         ns.printf("INFO executing weaken with %d threads", threads);
         pids.push(ns.exec(FULL_FILENAME_WEAKEN, server.hostname, threads, target.hostname));
      } else if (target.money.available < target.money.max) {
         ns.printf("INFO executing growth with %d threads", server.threadCount(ramGrow));
         pids.push(ns.exec(FULL_FILENAME_GROW, server.hostname, server.threadCount(ramGrow), target.hostname));
      } else {
         ns.printf("INFO executing hack with %d threads", server.threadCount(ramHack));
         pids.push(ns.exec(FULL_FILENAME_HACK, server.hostname, server.threadCount(ramHack), target.hostname));
      }

    }
  if (pids.length > 0) {
    ns.print("INFO Sleeping on pids: " + pids);
    await sleepPids(ns, pids);
  } else {
    ns.printf("ERROR No pids found, something likely went wrong");
    ns.tail();
    await ns.sleep(5000);
  }
  }
}

function getServers(ns: NS, current="home", set=new Set<string>()): string[]{
	let con = ns.scan(current);
	let next = con.filter(c => !set.has(c));
	next.forEach(n => {
		set.add(n);
		return getServers(ns, n, set);
	})
	return Array.from(set.keys());
}