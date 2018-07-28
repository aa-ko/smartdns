import { HookBase } from "./HookBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";
import { LocalDnsCache } from "../caching/LocalDnsCache";
import { LocalCachePool } from "../caching/LocalCachePool";

export class LocalCacheRefreshHook extends HookBase {
    private _cache: LocalDnsCache;

    constructor() {
        super();
        this._cache = LocalCachePool.GetRegion(LocalCachePool.DefaultCacheRegion);
    }

    GetEntrypoint(): InternalState {
        return InternalState.Success;
    }

    Process(result: RequestWrapper): void {
        this._cache.SetOrUpdate(result._requestMessage, result._responseMessage, 60);
    }
}