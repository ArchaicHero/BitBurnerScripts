export const SERVER_PREFIX = "pserv"
export const FILENAME_HACK = "bin.hack.js"
export const FILENAME_GROW = "bin.grow.js"
export const FILENAME_WEAKEN = "bin.weaken.js"
export const FILENAME_DEPLOY_HACKS = "start.hacks.js"
export const FILENAME_MANAGE_HACKS = "manage.hacks.js"
export const FILENAME_MANAGE_SERVERS = "manage.servers.js"
export const FILENAME_SERVER_COUNTER = "server.counter.txt"
export const FILENAME_MANAGE_GANG = "manage.gang.ts"
export const SCRIPT_PREFIX = "scripts/"
export const DATA_PREFIX = "data/"

export const FULL_FILENAME_HACK = SCRIPT_PREFIX + FILENAME_HACK
export const FULL_FILENAME_GROW = SCRIPT_PREFIX + FILENAME_GROW
export const FULL_FILENAME_WEAKEN = SCRIPT_PREFIX + FILENAME_WEAKEN 
export const FULL_FILENAME_DEPLOY_HACKS = SCRIPT_PREFIX + FILENAME_DEPLOY_HACKS
export const FULL_FILENAME_MANAGE_HACKS = SCRIPT_PREFIX + FILENAME_MANAGE_HACKS
export const FULL_FILENAME_MANAGE_SERVERS = SCRIPT_PREFIX + FILENAME_MANAGE_SERVERS
export const FULL_FILENAME_MANAGE_GANG = SCRIPT_PREFIX + FILENAME_MANAGE_GANG

export const FULL_FILENAME_SERVER_COUNTER = DATA_PREFIX + FILENAME_SERVER_COUNTER

 // List all the servers to AVOID including stuff to avoid such as home
export const PROTECTED_TARGETS = [".", "home", "darkweb", "CSEC", "I.I.I.I", "run4theh111z", "avmnite-02h", "The-Cave", "w0r1d_d43m0n",
        "pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9",
        "pserv-10", "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19", "pserv-20",
        "pserv-21", "pserv-22", "pserv-23", "pserv-24", SERVER_PREFIX];