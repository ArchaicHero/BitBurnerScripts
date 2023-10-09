import { NS } from "@ns";

/** @param {NS} ns **/
export async function main(ns: NS) {
	while(true) {
        // Check optimal purchase
        var nodeNum = "Default";
        var itemType = "New Node";
        var cheapest = ns.hacknet.getPurchaseNodeCost();
        var num_nodes = ns.hacknet.numNodes();
 
        // Iterate through all nodes and select lowest purchase/upgrade available
        for (var i = 0; i < num_nodes; i++) {
            var level_cost = ns.hacknet.getLevelUpgradeCost(i, 1);
            var ram_cost = ns.hacknet.getRamUpgradeCost(i, 1);
            var cpu_cost = ns.hacknet.getCoreUpgradeCost(i, 1);
 
            if (level_cost < cheapest) {
                    cheapest = level_cost;
                    nodeNum = i.toString();
                    itemType = "Level";
            } if (ram_cost < cheapest) {
                    cheapest = ram_cost;
                    nodeNum = i.toString();
                    itemType = "RAM";
            } if (cpu_cost < cheapest) {
                    cheapest = cpu_cost;
                    nodeNum = i.toString();
                    itemType = "CPU";
            }
        }
 
        // If affordable, purchase and recalculate above
        var purchased = false;
        while (!purchased) {
            var money = ns.getServerMoneyAvailable("home");
 
            if (money >= cheapest) {
                if (itemType == "New Node"){
                    ns.hacknet.purchaseNode();
                } if (itemType == "Level"){
                    ns.hacknet.upgradeLevel(parseInt(nodeNum) , 1);
                } if (itemType == "RAM"){
                    ns.hacknet.upgradeRam(parseInt(nodeNum), 1);
                } if (itemType == "CPU"){
                    ns.hacknet.upgradeCore(parseInt(nodeNum), 1);
                }
                purchased = true;
            }
 
            // If we didn't purchase, wait 1 second and try again
            if(!purchased) {
                await ns.sleep(1000);
            }
        }
 
    }
}