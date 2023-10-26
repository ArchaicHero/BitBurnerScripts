import { NS } from "@ns";
import { getServersHostnames } from "scripts/start.hacks";
import HackableBaseServer from "./if.server.hackable";

export async function main(ns: NS) {
    const servers = getServersHostnames(ns);
    if (servers.includes(ns.args[0] as string)) {
        ns.tprintf("'%s' was found, printing path", ns.args[0]);
        if (ns.args[1]) {
            let serv = new HackableBaseServer(ns, ns.args[0] as string);
            serv.root;
        }
        let curServer = ns.args[0] as string;
        let path = [];
        while (curServer !== "home") {
            path.push(curServer);
            curServer = ns.scan(curServer)[0];
        }
        let connect = ''
        while (path.length > 0) {
            connect = connect + "connect " + path.pop() + "; ";
        }
        ns.tprintf("%s", connect);

    } else {
        ns.tprintf("'%s' was not found", ns.args[0]);
    }
}