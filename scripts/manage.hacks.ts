import { NS } from "@ns";
import HackableBaseServer from "./if.server.hackable";
import { FILENAME_GROW, FILENAME_HACK, FILENAME_MANAGE_HACKS, FILENAME_WEAKEN } from "./constants";


/** @param {NS} ns */
export async function main(ns: NS) {

   
   const SLEEP_TIME = 5000;

   const server = new HackableBaseServer(ns, ns.getHostname());
   const target = new HackableBaseServer(ns, ns.args[0] as string);

   const ramHack = ns.args.length > 1 ? ns.args[1] as number : 1.70;
   const ramGrow = ns.args.length > 1 ? ns.args[2] as number : 1.75;
   const ramWeaken = ns.args.length > 1 ? ns.args[3] as number : 1.75;

   const adjustment = 2000
   // const maxRAM = server.ram.max - ns.getScriptRam(FILENAME_MANAGE_HACKS);
   // const weakenThreads = (adjustment - (target.security.min / 0.05));
   // const maxGrowthThreads = (server.ram.free / ramGrow) - (ramWeaken * adjustment);

   // Loop forever dispatching threads available to run optimal grow/weaken/hack
   while(true) {
      let pid;

      

      ns.sleep(SLEEP_TIME);
      /** 
       * Working on a batching approach based on 
       * https://github.com/afsanchez001/BitburnerRepo/blob/main/insane-money/insane-money.js 
      // Priming server money
      if (target.money.available < target.money.max) {
         let pid = ns.exec(FILENAME_WEAKEN, server.hostname, adjustment, target.hostname)
         ns.exec(FILENAME_GROW, server.hostname, Math.floor(maxGrowthThreads), target.hostname)

         while (ns.isRunning(pid)) { ns.sleep(SLEEP_TIME) };
      }

      // Priming server security
      if (target.security.level > target.security.min) {
         let pid = ns.exec(FILENAME_WEAKEN, server.hostname, adjustment, target.hostname);

         while (ns.isRunning(pid)) { ns.sleep(SLEEP_TIME) };
      }

      // Priming done execute hack and re-prime if needed

      let threadsGrow = ns.growthAnalyze(target.hostname, 2);
      let threadsHack = ns.hackAnalyzeThreads(target.hostname, target.money.max / 2); 
      **/
   }
}