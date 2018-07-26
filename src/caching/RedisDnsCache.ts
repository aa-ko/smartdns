import { RequestWrapper } from "../RequestWrapper";
import * as redis from "redis";
import { CacheBase } from "./CacheBase";

export class RedisDnsCache extends CacheBase {
    private _redisClient: redis.RedisClient;

    constructor(redisIp: string, redisPort: number) {
        super();
        this._redisClient = redis.createClient(redisPort, redisIp);
    }

    // TODO: This should only use Buffer objects and not the whole Wrapper, right?

    SetOrUpdate(request: RequestWrapper) {
        let decodedRequest = request.GetDecodedRequest();
        delete decodedRequest["id"];
        let hash = this.ComputeHash(decodedRequest);
        // TODO: Log
        this._redisClient.set(hash, JSON.stringify(request), "EX", 60);
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