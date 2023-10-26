import { NS } from "@ns";
import BasePlayer from "scripts/if.player";
import { FULL_FILENAME_DEPLOY_HACKS, FULL_FILENAME_GROW, FULL_FILENAME_HACK, FULL_FILENAME_MANAGE_GANG, FULL_FILENAME_MANAGE_HACKS, FULL_FILENAME_MANAGE_SERVERS, FULL_FILENAME_SERVER_COUNTER, FULL_FILENAME_WEAKEN } from "scripts/constants";

const DEFAULT_STARTING_TARGET = "foodnstuff"

export async function main(ns: NS) {
    let player = new BasePlayer(ns, "player")
   
    // TODO:  Startup player working.  Might need to modify how much ram is reservef on home server.

    // TODO:  Startup initial hacking with home server
    ns.nuke(DEFAULT_STARTING_TARGET);
    ns.exec(FULL_FILENAME_MANAGE_HACKS, "home", 1, 
      DEFAULT_STARTING_TARGET, ns.getScriptRam(FULL_FILENAME_HACK), ns.getScriptRam(FULL_FILENAME_GROW), ns.getScriptRam(FULL_FILENAME_WEAKEN),
      FULL_FILENAME_HACK, FULL_FILENAME_GROW, FULL_FILENAME_WEAKEN);
    // TODO:  Startup purchasing scripts: private servers? hacknet?
    ns.write(FULL_FILENAME_SERVER_COUNTER, '', "w");
    const pidPurchasing = ns.exec(FULL_FILENAME_MANAGE_SERVERS, "home", 1)

    const pidDeploy = ns.exec(FULL_FILENAME_DEPLOY_HACKS, "home", 1);

    if (ns.gang.inGang()) {
      ns.exec(FULL_FILENAME_MANAGE_GANG, "home", 1);
    }

    while(ns.isRunning(pidPurchasing)) {
        // Await servers purchased then start running hacks on all
        await ns.sleep(60000)
    }

    ns.kill(pidDeploy);
    ns.exec(FULL_FILENAME_DEPLOY_HACKS, "home", 1);
    // TODO:  possibly loop with big sleeps waiting for big hacking skill, 1000?
}