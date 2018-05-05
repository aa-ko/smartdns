import * as NodeCache from "node-cache";
import * as packet from "dns-packet";
import * as objectHash from "object-hash";
import { GlobalLogger, LoggerFactory } from "../logging/GlobalLogger";

// TODO: Rework id hack?
export class DnsCache {
    private Logger: GlobalLogger;
    private _cache: NodeCache;

    constructor() {
        this.Logger = LoggerFactory.Get("DnsCache");
        this._cache = new NodeCache();
    }

    // TODO: Fix types.
    Set(key: Buffer, value: Buffer, ttl: number): void {
        // TODO: Id values are simply not stored. Is this okay?
        var hash = DnsCache.DecodeAndHash(key, ["id"]);
        this.Logger.LogDebug(`Caching object with key '${hash}' for ${ttl} seconds.`);
        var toCache = DnsCache.DecodePacket(value);
        delete toCache["id"];
        this._cache.set(hash, toCache, ttl);
    }

    Get(key: Buffer, callback: (err: boolean, data: any) => void): void {
        // Why???
        this.InternalGet(key, callback);
    }

    private InternalGet(key: Buffer, callback: (err: boolean, result: Buffer) => void): void {
        var decoded = DnsCache.DecodePacket(key);
        var requestId = decoded["id"];
        delete decoded["id"];
        var hash = DnsCache.ComputeHash(decoded);
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

    static DecodeAndHash(input: Buffer, omittedKeys: string[]): string {
        var decoded = this.DecodePacket(input);
        omittedKeys.forEach(key => {
            delete decoded[key];
        });
        return this.ComputeHash(decoded);
    }

    static ComputeHash(input: any): string {
        // TODO: Implement generically for any possible key and define mappings based on the request type.
        return objectHash(input);
    }

    static DecodePacket(input: Buffer): any {
        return packet.decode(input);
    }
}