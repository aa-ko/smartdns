import { RequestWrapper } from "../RequestWrapper";
import * as redis from "redis";
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

    SetOrUpdate(request: RequestWrapper, ttl: number) {
        let decodedRequest = request.GetDecodedRequest();
        delete decodedRequest["id"];
        let hash = this.ComputeHash(decodedRequest);
        this.Logger.LogDebug(`Caching object with key '${hash}' for ${ttl} seconds.`);
        // TODO: Log
        this._redisClient.set(hash, JSON.stringify(request), "EX", ttl);
    }

    Get(request: RequestWrapper, callback: (err: boolean, response: RequestWrapper) => void): void {
        // TODO: Log
        let hash = this.ComputeHash(request.GetDecodedRequest());
        let hasValue = this._redisClient.get(hash, (err, value) => {
            if (hasValue && !err && value != null) {
                callback(false, JSON.parse(value));
            }
            else {
                callback(true, null);
            }
        });
    }
}