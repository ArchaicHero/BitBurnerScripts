import { NS } from "@ns";
import BaseServer from "scripts/if.server"

export default class HackableBaseServer extends BaseServer {
	constructor(ns: NS, hostname: string) {
		super(ns, hostname);
	}

	root() {
		try {
			this.ns.brutessh(this.id)
			this.ns.ftpcrack(this.id)
			this.ns.relaysmtp(this.id)
			this.ns.httpworm(this.id)
			this.ns.sqlinject(this.id)
		} catch {}
				
		try {
			this.ns.nuke(this.id)
		} catch {}
	}
}