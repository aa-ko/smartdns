import { CacheBase } from "./CacheBase";
import { GlobalLogger } from "../logging/GlobalLogger";
import { RedisAdapter } from "../communication/RedisAdapter";
import { Dictionary } from "../util/Dictionary";

export class RedisDnsCache extends CacheBase {
    private Logger: GlobalLogger;
    private _redisAdapter: RedisAdapter;

    static _instances: Dictionary<RedisDnsCache> = new Dictionary<RedisDnsCache>();

    static GetInstance(redisIp: string, redisPort: number): RedisDnsCache {
        let key = this.GenerateKey(redisIp, redisPort);
        if (this._instances.ContainsKey(key)) {
            return this._instances.Get(key);
        }
        else {
            let instance = new RedisDnsCache(redisIp, redisPort);
            this._instances.Add(key, instance);
            return instance;
        }
    }

    static GenerateKey(redisIp: string, redisPort: number): string {
        return redisIp + "-" + redisPort;
    }

    constructor(redisIp: string, redisPort: number) {
        super();
        this.Logger = GlobalLogger.Get("RedisDnsCache");
        this._redisAdapter = new RedisAdapter(redisIp, redisPort);
    }

    SetOrUpdate(key: Buffer, value: Buffer, ttl: number) {
        let hash = this.DecodeAndHash(key, ["id"]);
        this.Logger.LogDebug(`Caching object with key '${hash}' for ${ttl} seconds.`);
        // TODO: Log
        let toCache = this.DecodePacket(value);
        delete toCache["id"];
        this._redisAdapter.Set(hash, JSON.stringify(toCache), ttl);
    }

    Get(key: Buffer, callback: (err: boolean, value: Buffer) => void): void {
        // TODO: Log
        let decoded = this.DecodePacket(key);
        let requestId = decoded["id"];
        delete decoded["id"];
        let hash = this.ComputeHash(decoded);
        let hasValue = this._redisAdapter.Get(hash, (err, value) => {
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