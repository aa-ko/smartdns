import { HandlerBase } from "./HandlerBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";
import { LocalDnsCache } from "../caching/LocalDnsCache";
import { LocalCachePool } from "../caching/LocalCachePool";

export class LocalCacheResolver extends HandlerBase {
    _internalCache: LocalDnsCache;

    constructor() {
        super();
        this._internalCache = LocalCachePool.GetRegion(LocalCachePool.DefaultCacheRegion);
    }
    
    Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void {
        this._internalCache.Get(request._requestMessage, (err, data) => {
            if(err || data === undefined) {
                request.AppendLog("CacheResolver", "Cache MISS", InternalState.Assigned);
                this._successor.Handle(request, cb);
            }
            else {
                request.AppendLog("CacheResolver", "Cache HIT", InternalState.Success);
                request._responseMessage = data;
                cb(request);
            }
        });
    }
}