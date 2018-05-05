import { HookBase } from "./HookBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";
import { DnsCache } from "../caching/DnsCache";
import { CachePool } from "../caching/CachePool";

export class CacheRefreshHook extends HookBase {
    Entrypoint: InternalState;
    private _cache: DnsCache;

    constructor() {
        super();
        this.Entrypoint = InternalState.Success;
        this._cache = CachePool.GetRegion("default");
    }

    Process(result: RequestWrapper): void {
        this._cache.Set(result._requestMessage, result._responseMessage, 60);
    }
}