import * as NodeCache from "node-cache";
import * as packet from "dns-packet";
import * as objectHash from "object-hash";

export interface IDnsCache {
    Set(key: any, value: any, ttl: any): void;
    Get(key: any, callback: any): void;
}

export class DnsCache implements IDnsCache {
    _cache: NodeCache;

    constructor() {
        this._cache = new NodeCache();
    }

    // TODO: Fix types.
    Set(key: any, value: any, ttl: any): void {
        var valueWrapper = {
            response: value
        }
        this.ComputeHash(key, (hash, omitted) => {
            valueWrapper["id"] = omitted["id"];
            console.log(`Caching object with key '${hash}' for ${ttl} seconds.`);
            this._cache.set(hash, valueWrapper, ttl);
        });
    }

    Get(key, callback: (err : boolean, data: any) => void): void {
        this.InternalGet(key, callback, "response");
    }

    GetId(key, callback): void {
        return this.InternalGet(key, callback, "id");
    }

    InternalGet(key, callback, identifier): void {
        this.ComputeHash(key, (hash, omitted) => {
            this._cache.get(hash, (err, data) => {
                if (err || data == undefined) {
                    console.log(`Cache MISS for object with key '${hash}'.`);
                    callback(err, data);
                }
                else {
                    console.log(`Cache HIT for object with key '${hash}'.`);
                    callback(err, data[identifier]);
                }
            });
        });
    }

    ComputeHash(input, callback): void {
        // TODO: Implement generically for any possible key and define mappings based on the request type.
        var decoded = packet.decode(input);
        var omitted = {
            id: decoded["id"]
        };

        delete decoded["id"];
        callback(objectHash(decoded), omitted);
    }
}