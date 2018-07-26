import { RequestWrapper } from "../RequestWrapper";
import * as redis from "redis";
import { CacheBase } from "./CacheBase";

export class RedisDnsCache extends CacheBase {
    private _redisClient: any;

    constructor(redisIp: string, redisPort: number) {
        super();
        this._redisClient = redis.createClient(redisPort, redisIp);
    }

    SetOrUpdate(request: RequestWrapper) {
        let decodedRequest = request.GetDecodedRequest();
        let requestId = decodedRequest["id"];
        delete decodedRequest["id"];
        let hash = this.ComputeHash(decodedRequest);
        // TODO: Log
        this._redisClient.set(hash, request, "EX", 60);
    }

    Get(request: RequestWrapper, callback: (err: boolean, response: RequestWrapper) => void): void {
        // TODO: Log
        let hash = this.ComputeHash(request.GetDecodedRequest());
        let maybeValue = this._redisClient.get(hash);
        if (maybeValue == null) {
            callback(true, null);
        }
        else {
            callback(false, maybeValue);
        }
    }
}