import * as schedule from "node-schedule";
import { GlobalLogger } from "../../logging/GlobalLogger";
//import { exec } from "child_process";

const Logger = GlobalLogger.Get("blocklist");

function RefreshDomainBlacklist() {
    throw new Error("Not implemented.");
    
    //exec("")
}

function CreateScript(): string {
    let path = __dirname;
    throw new Error("Not implemented.");
}

schedule.scheduleJob("Reload domain blacklist.", { hour: 0, minute: 0 }, RefreshDomainBlacklist);