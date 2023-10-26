import { NS } from "@ns";
import { FULL_FILENAME_SERVER_COUNTER } from "scripts/constants";

/** @param {NS} ns */
export async function main(ns: NS) {
    // How much RAM each purchased server will have. In this case, it'll
    // be 1024GB / 1TB.
    const ram = 1024;
    const count_file = FULL_FILENAME_SERVER_COUNTER
   
    // Iterator we'll use for our loop
    let readResults = ns.read(count_file);
    let i = (readResults !== "") ? parseInt(readResults[0]) : 0;
  
    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers
    while (i < ns.getPurchasedServerLimit()) {
        let purchased = false;
        // Check if we have enough money to purchase a server
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Increment our iterator to indicate that we've bought a new server
            ns.purchaseServer("pserv-" + i, ram);
            purchased = true;
            ++i;
            ns.write(count_file, i.toString(), "w");
        }
        //Make the script wait for a second before looping again.
        //Removing this line will cause an infinite loop and crash the game.
        if (!purchased) {
            ns.printf("sleeping for 10 seconds as player money: %d\tneed: %d", ns.getServerMoneyAvailable("home"), ns.getPurchasedServerCost(ram));
            await ns.sleep(10000);
        }
    }
  }