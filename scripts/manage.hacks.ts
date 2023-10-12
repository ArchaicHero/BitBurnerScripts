import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {

   const server = ns.getHostname();
   const target = ns.args[0] as string;

   const ramHack = ns.args[1] as number;
   const ramGrow = ns.args[2] as number;
   const ramWeaken = ns.args[3] as number;

   const FULL_FILENAME_HACK= ns.args[4] as string;
   const FULL_FILENAME_GROW = ns.args[5] as string;
   const FULL_FILENAME_WEAKEN = ns.args[6] as string;

   const minSec = ns.getServerMinSecurityLevel(target);
   const maxMon = ns.getServerMaxMoney(target);

   // Loop forever dispatching threads available to run optimal grow/weaken/hack
   while(true) {
      let pid = 0;
      let curSec = ns.getServerSecurityLevel(target);
      let curMon = ns.getServerMoneyAvailable(target);

      // TODO:  add batching use link for batching concept
      // https://github.com/DarkTechnomancer/darktechnomancer.github.io/tree/main

      if ( curSec > minSec + 3) {
         let threads = Math.floor(Math.min((curSec - minSec) / ns.growthAnalyzeSecurity(1, target), 
               threadCounter(ramWeaken)));
         ns.printf("INFO executing weaken with %d threads", threads);
         pid = ns.exec(FULL_FILENAME_WEAKEN, server, threads, target);
      } else if ( curMon < maxMon * 0.9) {
         ns.printf("INFO executing growth with %d threads", threadCounter(ramGrow));
         pid = ns.exec(FULL_FILENAME_GROW, server, threadCounter(ramGrow), target);
      } else {
         ns.printf("INFO executing hack with %d threads", threadCounter(ramHack));
         pid = ns.exec(FULL_FILENAME_HACK, server, threadCounter(ramHack), target);
      }
      
      if (pid) {
         ns.print("INFO Sleeping on pid: " + pid);
         while (ns.isRunning(pid)) {
            await ns.sleep(2000);
         }
      } else {
         ns.printf("ERROR No pids found, something likely went wrong");
         ns.tail();
         await ns.sleep(2000);
      }
         

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

      function threadCounter(scriptRam: number):number {
         return Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ramWeaken);
      }
   }
}