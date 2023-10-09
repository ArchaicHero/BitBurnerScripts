/** @param {NS} ns **/
const reservedHomeRam = 64;

export default class BaseServer {
    _id: string;
    ns: any;

	constructor(ns: NS, hostname: string) {
		this.ns = ns;
		this._id = hostname;
	}

    listGetters(instance: object, properties=new Set()) {
        let getters = Object.entries(
            Object.getOwnPropertyDescriptors(
                Reflect.getPrototypeOf(instance)
            )).filter(e => typeof e[1]["get"] === 'function' && e[0] !== '__proto__').map(e => e[0])

        getters.forEach(g => {
            properties.add(g);
            return this.listGetters(Object.getPrototypeOf(instance), properties)
        })
        return properties
    }

	get id() { return this._id }
  get data() { return this.ns.getServer(this.id); }
  get updated_at() { return new Date().valueOf(); }
  get hostname() { return this.data.hostname; }
  get admin() { return this.data.hasAdminRights; }
  get level() { return this.data.requiredHackingSkill; }
  get purchased() { return (this.data.purchasedByPlayer && this.data.hostname !== "home"); }
  get connected() { return this.data.isConnectedTo; }
  get backdoored() { return this.data.backdoorInstalled; }
  get cores() { return this.data.cpuCores; }
  get ram() { return {
      used: this.data.ramUsed,
      max: this.data.maxRam - (this.data.hostname === "home" ? reservedHomeRam : 0),
      free: Math.max(0, this.data.maxRam - this.data.ramUsed - (this.data.hostname === "home" ? reservedHomeRam : 0)),
      trueMax: this.data.maxRam
  }}
  get power() { return Math.max(0, Math.log2(this.data.maxRam)); }
  get organization() { return this.data.organizationName; }
  get isHome() { return (this.data.hostname === "home"); }
  get ports() { return {
      required: this.data.numOpenPortsRequired,
      open: this.data.openPortCount,
      ftp: this.data.ftpPortOpen,
      http: this.data.httpPortOpen,
      smtp: this.data.smtpPortOpen,
      sql: this.data.sqlPortOpen,
      ssh: this.data.sshPortOpen
  }}
  get security() { return {
      level: this.data.hackDifficulty,
      min: this.data.minDifficulty,
  }}
  get money() { return {
      available: this.data.moneyAvailable,
      max: this.data.moneyMax,
      growth: this.data.serverGrowth
  }}
  get time() { return {
    we: this.ns.getWeakenTime(this.hostname),
    gr: this.ns.getGrowTime(this.hostname),
    ha: this.ns.getHackTime(this.hostname)
  }}

  threadCount(scriptRam: number) {
      let threads = 0;
      threads = this.ram.free / scriptRam
      return Math.floor(threads)
  }
}