import { HandlerBase } from "./HandlerBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";
import { RedisDnsCache } from "../caching/RedisDnsCache";
import { GlobalLogger } from "../logging/GlobalLogger";

export class RedisCacheResolver extends HandlerBase {
    private Logger: GlobalLogger;
    private _redisCache: RedisDnsCache;

    constructor(redisIpOrHostname: string, redisPort: number) {
        super();
        this.Logger = GlobalLogger.Get("RedisCacheResolver");
        this._redisCache = RedisDnsCache.GetInstance(redisIpOrHostname, redisPort);
    }

    Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void {
        this._redisCache.Get(request._requestMessage, (err, response) => {
            if (err || response == null) {
                this.Logger.LogDebug("Cache MISS.");
                request.AppendLog("RedisCacheResolver", "Cache MISS", InternalState.Assigned);
                this._successor.Handle(request, cb);
            }
            else {
                this.Logger.LogDebug("Cache HIT.");
                request.AppendLog("LocalCacheResolver", "Cache HIT", InternalState.Success);
                request._responseMessage = response;
                cb(request);
            }
        });
    }
}