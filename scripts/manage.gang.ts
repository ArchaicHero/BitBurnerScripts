import { GangMemberAscension, GangMemberInfo, NS } from "@ns";

const UNASSIGNED = "Unassigned";
const TRAINING = "Train Combat";
const TRAFFICKING = "Human Trafficking"; // Money task
const WARFARE = "Territory Warfare"; // Conquering
const TERROR = "Terrorism"; // For rep grinding.  When would I use this?
const JUSTICE = "Vigilante Justice"; // For decreasing wanted
const BATMAN = "BATMAN"

const NAMES = ["FBI", "The Punisher", BATMAN, "Ryan Reynolds", "Neo", "Trinity", "Fate", "Yor Forger", "Anya", "The Backup"]

/** @param {NS} ns */
export async function main(ns: NS) {
    if (ns.gang.inGang()) {
        ns.tprint("Not in a gang!");
        return;
    }

    let memberNames = ns.gang.getMemberNames();
    let gangMembers = new Map<string, GangMemberInfo>();
    let equipNames = ns.gang.getEquipmentNames();
    for (let name in memberNames){
        gangMembers.set(name, ns.gang.getMemberInformation(name));
    }

    let target;
    while(true) {
        let us = ns.gang.getGangInformation();

        // Get new gang members if possible cycling names in case of gang member death loop through all names
        while (ns.gang.canRecruitMember()) {
            let mem = NAMES.pop() as string;
            ns.gang.recruitMember(mem);
            NAMES.push(mem);
        }

        // Iterate through gangMembers using keys
        for (let [name, info] of gangMembers) {
            if (info.task == UNASSIGNED) {
                ns.gang.setMemberTask(name, TRAINING);
            }

            if (!info.upgrades.includes(equipNames[0]) ||
            !info.upgrades.includes(equipNames[1]) ||
            !info.upgrades.includes(equipNames[2])) {
                ns.printf("Missing equipment on %s, attempting to buy the first 3:  %s %s %s", name, equipNames[0], equipNames[1], equipNames[2]);
                ns.gang.purchaseEquipment(name, equipNames[0]);
                ns.gang.purchaseEquipment(name, equipNames[1]);
                ns.gang.purchaseEquipment(name, equipNames[2]);
            }

            // Check if worth ascending if so ascend
            if ((ns.gang.getAscensionResult(name) as GangMemberAscension).str >= 1.4) {
                ns.gang.ascendMember(name);
            } else if (info.str > 600 && us.territory < 80) {
                ns.gang.setMemberTask(name, WARFARE);
                // TODO:  update from just using 1 member for wanted level to smart updating.
            } else if (us.territory == 100  && us.territoryWarfareEngaged) {
                if (name === BATMAN) {
                    ns.gang.setMemberTask(name, JUSTICE);
                } else {
                    ns.gang.setMemberTask(name, TRAFFICKING);
                }
            }
        }

        
        if (us.territory == 100) {
            ns.gang.setTerritoryWarfare(false);
        }
        // update every 2 seconds for now
        await ns.sleep(2000);
    }
}