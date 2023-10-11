import { NS } from "@ns";


export async function sleepPids(ns: NS, pids: number[], sleepTime: number = 2000) {
  while(pids.some(pid => ns.isRunning(pid)))
    await ns.sleep(sleepTime);
}