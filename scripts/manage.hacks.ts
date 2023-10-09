import { NS } from "@ns";
import HackableBaseServer from "./if.server.hackable";

/** @param {NS} ns */
export async function main(ns: NS) {
   const server = new HackableBaseServer(ns, ns.args[0]);
}