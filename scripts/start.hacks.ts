import HackableBaseServer from 'scripts/if.server.hackable'
import BasePlayer from 'scripts/if.player'
import { SERVER_PREFIX, PROTECTED_TARGETS } from 'scripts/constants'
import { NS } from '@ns';

/** @param {NS} ns */
export async function main(ns: NS) {
	const curLvl = ns.getHackingLevel();
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
    if (ns.getServerRequiredHackingLevel(s.hostname) <= curLvl) {
      // ns.tprintf("%20s:\ts.money.max %f, s.time.we %f", s.hostname, s.money.max, s.time.we);
      prioTargets.push({ "rate":  (s.money.max / (s.time.we)), "hostname": s.hostname})
    }
  }
  prioTargets.sort(function(a, b) {
    return b.rate < a.rate ? -1
      : b.rate > a.rate ? 1
      : 0;
  })

  // ns.tprint("INFO dumping simple priority list");
  prioTargets.forEach(t => { ns.tprintf("server = %20s \t\trate = %f", t.hostname, t.rate)});

  for (let s of servers) {
    if (!s.admin) {
      s.root();
    }
    ns.printf("INFO starting hacking on %s with target %s", s.hostname)
    ns.scp(["manage.hacks.js", "bin.grow.js", "bin.hack.js", "bin.weaken.js"], s.hostname, "home");
    ns.exec("manage.hacks.js", s.hostname, 1, prioTargets[0].hostname);
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