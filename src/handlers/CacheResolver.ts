import { HandlerBase } from "./HandlerBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";
import { DnsCache } from "../caching/DnsCache";
import { CachePool } from "../caching/CachePool";

export class CacheResolver extends HandlerBase {
    _internalCache: DnsCache;

    constructor() {
        super();
        this._internalCache = CachePool.GetRegion("default");
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