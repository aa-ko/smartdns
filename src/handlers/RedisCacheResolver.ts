import { HandlerBase } from "./HandlerBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";
import { RedisDnsCache } from "../caching/RedisDnsCache";

export class RedisCacheResolver extends HandlerBase {
    _redisCache: RedisDnsCache;

    constructor(redisIpOrHostname: string, redisPort: number) {
        super();
        this._redisCache = new RedisDnsCache(redisIpOrHostname, redisPort);
    }

    Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void {
        this._redisCache.Get(request, (err, response) => {
            if (err || response == null) {
                // TODO: Log
                request.AppendLog("RedisCacheResolver", "Cache MISS", InternalState.Assigned);
                this._successor.Handle(request, cb);
            }
            else {
                // TODO: Log
                request.AppendLog("LocalCacheResolver", "Cache HIT", InternalState.Success);
                let id = request.GetDecodedRequest()["id"];
                response._responseMessage["id"] = id;
                cb(response);
            }
        });
    }
}