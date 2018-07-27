import * as redis from "redis";
import * as packet from "dns-packet";
import { CacheBase } from "./CacheBase";
import { GlobalLogger } from "../logging/GlobalLogger";

export class RedisDnsCache extends CacheBase {
    private Logger: GlobalLogger;
    private _redisClient: redis.RedisClient;

    constructor(redisIp: string, redisPort: number) {
        super();
        this.Logger = GlobalLogger.Get("RedisDnsCache");
        this._redisClient = redis.createClient(redisPort, redisIp);
    }

    // TODO: This should only use Buffer objects and not the whole Wrapper, right?

    SetOrUpdate(key: Buffer, value: Buffer, ttl: number) {
        let hash = this.DecodeAndHash(key, ["id"]);
        this.Logger.LogDebug(`Caching object with key '${hash}' for ${ttl} seconds.`);
        // TODO: Log
        let toCache = this.DecodePacket(value);
        delete toCache["id"];
        this._redisClient.set(hash, JSON.stringify(toCache), "EX", ttl);
    }

    Get(key: Buffer, callback: (err: boolean, value: Buffer) => void): void {
        // TODO: Log
        let decoded = this.DecodePacket(key);
        let requestId = decoded["id"];
        delete decoded["id"];
        let hash = this.ComputeHash(decoded);
        let hasValue = this._redisClient.get(hash, (err, value) => {
            if (hasValue && !err && value != null) {
                // TODO: Log
                let result = JSON.parse(value);
                result["id"] = requestId;
                callback(false, this.EncodePacket(result));
            }
            else {
                // TODO: Log
                callback(true, undefined);
            }
        });
    }
}