import { RequestWrapper } from "../RequestWrapper";
import { redis } from "redis";
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
        this._redisClient.set(hash, request, "EX", 60);
    }

    Get(request: RequestWrapper): boolean {
        //this._redisClient.get()
        return false;
    }
}