import * as NodeCache from "node-cache";
import * as packet from "dns-packet";
import { GlobalLogger } from "../logging/GlobalLogger";
import { CacheBase } from "./CacheBase";

// TODO: Rework id hack?
export class LocalDnsCache extends CacheBase {
    private Logger: GlobalLogger;
    private _cache: NodeCache;

    constructor() {
        super();
        this.Logger = GlobalLogger.Get("LocalDnsCache");
        this._cache = new NodeCache();
    }

    // TODO: Fix types.
    Set(key: Buffer, value: Buffer, ttl: number): void {
        // TODO: Id values are simply not stored. Is this okay?
        var hash = this.DecodeAndHash(key, ["id"]);
        this.Logger.LogDebug(`Caching object with key '${hash}' for ${ttl} seconds.`);
        var toCache = this.DecodePacket(value);
        delete toCache["id"];
        this._cache.set(hash, toCache, ttl);
    }

    Get(key: Buffer, callback: (err: boolean, data: any) => void): void {
        // Why???
        this.InternalGet(key, callback);
    }

    private InternalGet(key: Buffer, callback: (err: boolean, result: Buffer) => void): void {
        var decoded = this.DecodePacket(key);
        var requestId = decoded["id"];
        delete decoded["id"];
        var hash = this.ComputeHash(decoded);
        this._cache.get(hash, (err, data) => {
            if (err || data == undefined) {
                this.Logger.LogDebug(`Cache MISS for object with key '${hash}'.`);
                callback(err, undefined);
            }
            else {
                this.Logger.LogDebug(`Cache HIT for object with key '${hash}'.`);
                // Fake ID -> Please refactor this!
                data["id"] = requestId;
                callback(err, packet.encode(data));
            }
        });
    }
}