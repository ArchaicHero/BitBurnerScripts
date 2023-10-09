import { NS } from "@ns";

/** @param {NS} ns **/
export async function main(ns: NS) {
    const target = ns.args[0];
    const repeat = ns.args[1];
    do {
        await ns.hack(target);
    } while(repeat);
}