export const TEST_STRING = "This is a triumph";


import { NS } from "@ns";

/** @param {NS} ns **/
export async function main(ns: NS) {
    const tar = "phantasy";
    ns.tprintf('INFO stats:\nsecurity Level: %f \t\tmin security level: %f', ns.getServerSecurityLevel(tar), ns.getServerMinSecurityLevel(tar));
    ns.tprintf('Showing return values around analyze calls\ngrowthAnalyzeSecurity(1, %s):  %f', tar, ns.growthAnalyzeSecurity(1, tar));
    ns.tprintf('(current security - min security) / growthAnalyzeSecurity(1, %s):  %f', tar, (ns.getServerSecurityLevel(tar) - ns.getServerMinSecurityLevel(tar)) / ns.growthAnalyzeSecurity(1, tar));
}