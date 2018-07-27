import { HookBase } from "./HookBase";
import { InternalState, RequestWrapper } from "../RequestWrapper";
import { RedisDnsCache } from "../caching/RedisDnsCache";

export class RedisCacheRefreshHook extends HookBase {
    private _cache: RedisDnsCache;

    constructor(ip: string, port: number){
        super();
        this._cache = new RedisDnsCache(ip, port);
    }
    
    GetEntrypoint(): InternalState {
        return InternalState.Success;
    }
    
    Process(result: RequestWrapper) : void {
        this._cache.SetOrUpdate(result._requestMessage, result._responseMessage, 60);
    }    
}