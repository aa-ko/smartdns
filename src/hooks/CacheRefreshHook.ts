import { HookBase } from "./HookBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";
import { LocalDnsCache } from "../caching/LocalDnsCache";
import { CachePool } from "../caching/CachePool";

export class CacheRefreshHook extends HookBase {
    Entrypoint: InternalState;
    private _cache: LocalDnsCache;

    constructor() {
        super();
        this.Entrypoint = InternalState.Success;
        this._cache = CachePool.GetRegion(CachePool.DefaultCacheRegion);
    }

    Process(result: RequestWrapper): void {
        this._cache.Set(result._requestMessage, result._responseMessage, 60);
    }
}