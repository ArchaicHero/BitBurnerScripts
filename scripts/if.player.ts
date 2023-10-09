import { NS } from "@ns";

export default class BasePlayer {
    ns: NS;
    private _id: string;

    constructor(ns: NS, id: string) {
        this.ns = ns;
        this._id = id;
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

    get id() { return this._id}
    /**
     *  @returns {import(".").Player}
     */
    get data() { return this.ns.getPlayer(); }
    get dataReset() { return this.ns.getResetInfo()}
    get updated_at() { return new Date().valueOf() }
    get hp() { return {
        current: this.data.hp.current,
        max: this.data.hp.max
    }}
    // get level() { return this.data.}
    get money() { return this.data.money }
    get intelligence() { return this.data.skills.intelligence }
    get city() { return this.data.city }
    //get className() { return this.data.className }
    // get company() { return {
    //     companyName: this.data.companyName,
    //     multipliers: {
    //         rep: this.data.company_rep_mult
    //     }
    // }}
    // get bladeburner() { return { multipliers: {
    //         analysis: this.data.bladeburner_analy,
    //         max_stamina: this.data.bladeburner_max_stamina_mult,
    //         stamina_gain: this.data.bladeburner_stamina_gain_mult,
    //         success_chance: this.data.bladeburner_success_chance_mult,
    //     }}
    // }
    // get createProg() {return {
    //     progName: this.data["createProgramName"],
    //     reqLevel: this.data["createProgramReqLvl"]
    // }}
    // get crime() { return {
    //     type: this.data.crimeType,
    //     multipliers: {
    //         money: this.data.crime_money_mult,
    //         success: this.data.crime_success_mult
    //     },
    //     kills: this.data.numPeopleKilled,
    //     karma: this.ns.heart.break()
    // }}
    // get work() { return {
    //     isWorking: this.data.isWorking,
    //     type: this.data.workType,
    //     jobs: this.data.jobs,
    //     current: {
    //         factionName: this.data.currentWorkFactionName,
    //         factionDesc: this.data.currentWorkFactionDescription
    //     },
    //     multipliers: {
    //         money: this.data.work_money_mult
    //     },
    //     stats: {
    //         agi: {
    //             gained: this.data.workAgiExpGained,
    //             rate: this.data.workAgiExpGainRate
    //         },
    //         str: {
    //             gained: this.data.workStrExpGained,
    //             rate: this.data.workStrExpGainRate
    //         },
    //         cha: {
    //             gained: this.data.workChaExpGained,
    //             rate: this.data.workChaExpGainRate
    //         },
    //         dex: {
    //             gained: this.data.workDexExpGained,
    //             rate: this.data.workDexExpGainRate
    //         },
    //         def: {
    //             gained: this.data.workDefExpGained,
    //             rate: this.data.workDefExpGainRate
    //         },
    //         hack: {
    //             gained: this.data.workHackExpGained,
    //             rate: this.data.workHackExpGainRate
    //         },
    //         money: {
    //             gained: this.data.workMoneyExpGained,
    //             rate: this.data.workMoneyExpGainRate,
    //             loss: this.data.workMoneyLossRate
    //         },
    //         rep: {
    //             gained: this.data.workRepGained,
    //             rate: this.data.workRepGainRate
    //         }
    //     }
    // }}
    // get charisma() { return {
    //     level: this.data.charisma,
    //     exp: this.data.charisma_exp,
    //     multipliers: {
    //         exp: this.data.charisma_exp_mult,
    //         level: this.data.charisma_mult,
    //     }
    // }}
    // get agility() { return {
    //     level: this.data.agility,
    //     exp: this.data.agility_exp,
    //     multipliers: {
    //         exp: this.data.agility_exp_mult,
    //         level: this.data.agility_mult,
    //     }
    // }}
    // get dexterity() { return {
    //     level: this.data.dexterity,
    //     exp: this.data.dexterity_exp,
    //     multipliers: {
    //         exp: this.data.dexterity_exp_mult,
    //         level: this.data.dexterity_mult,
    //     }
    // }}
    // get defense() { return {
    //     level: this.data.defense,
    //     exp: this.data.defense_exp,
    //     multipliers: {
    //         exp: this.data.defense_exp_mult,
    //         level: this.data.defense_mult,
    //     }
    // }}
    // get strength() { return {
    //     level: this.data.strength,
    //     exp: this.data.strength_exp,
    //     multipliers: {
    //         exp: this.data.strength_exp_mult,
    //         level: this.data.strength_mult,
    //     }
    // }}
    // get faction() {return {
    //     membership: this.data.factions,
    //     multipliers: {
    //         rep: this.data.faction_rep_mult
    //     }
    // }}
    // get hacking() {return {
    //     exp: this.data.hacking_exp,
    //     level: this.data.hacking,
    //     next_level_exp: Math.pow(Math.E,((this.data.hacking + 1)/(32*this.data.hacking_mult)+(25/4))) - (1069/2),
    //     tnl: Math.pow(Math.E,((this.data.hacking + 1)/(32*this.data.hacking_mult)+(25/4))) - (1069/2) - this.data.hacking_exp,
    //     multipliers: {
    //         chance: this.data.hacking_chance_mult,
    //         exp: this.data.hacking_exp_mult,
    //         grow: this.data.hacking_grow_mult,
    //         money: this.data.hacking_money_mult,
    //         level: this.data.hacking_mult,
    //         speed: this.data.hacking_speed_mult
    //     }
    // }}
    // get hnet() {return {
    //     multipliers: {
    //         coreCost: this.data.hacknet_node_core_cost_mult,
    //         levelCost: this.data.hacknet_node_level_cost_mult,
    //         production: this.data.hacknet_node_money_mult,
    //         purchaseCost: this.data.hacknet_node_purchase_cost_mult,
    //         ramCost: this.data.hacknet_node_ram_cost_mult,
    //     }
    // }}
    // get market() {return {
    //     api: {
    //         tix: this.data.hasTixApiAccess,
    //         fourSigma: this.data.has4SDataTixApi
    //     },
    //     manual: {
    //         wse: this.data.hasWseAccount,
    //         fourSigma: this.data.has4SData
    //     }
    // }}
    get playtime() {return {
        total: this.data.totalPlaytime,
        sinceAug: this.dataReset.lastAugReset,
        sinceBitnode: this.dataReset.lastNodeReset
    }}

    get ports() { return this.ns.ls("home").filter((file: string) => [
        "BruteSSH.exe",
        "FTPCrack.exe",
        "relaySMTP.exe",
        "HTTPWorm.exe",
        "SQLInject.exe"
    ].includes(file)).length}

    get software() { return {
        tor: this.ns.hasTorRouter(),
        ssh: this.ns.ls("home").some((file: string) => file === "BruteSSH.exe"),
        ftp: this.ns.ls("home").some((file: string) => file === "FTPCrack.exe"),
        smtp: this.ns.ls("home").some((file: string) => file === "relaySMTP.exe"),
        http: this.ns.ls("home").some((file: string) => file === "HTTPWorm.exe"),
        sql: this.ns.ls("home").some((file: string) => file === "SQLInject.exe"),
        formulas: this.ns.ls("home").some((file: string) => file === "Formulas.exe"),
    }}
}