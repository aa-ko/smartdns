import { HandlerBase } from "./HandlerBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";
import { HelperMethods } from "../adblockutils/HelperMethods";
import { RedisAdapter, DefaultRedisCallback } from "../communication/RedisAdapter";
import { GlobalLogger } from "../logging/GlobalLogger";

export class AdblockResolver extends HandlerBase {
    private Logger: GlobalLogger;
    private _redisAdapter: RedisAdapter;
    private _openCallbacks: Set<string>;

    constructor(redisIp: string, redisPort: number) {
        super();
        this.Logger = GlobalLogger.Get("AdblockHandler");
        this._redisAdapter = new RedisAdapter(redisIp, redisPort);
        this._openCallbacks = new Set<string>();
    }

    Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void {
        let questions = request.GetDecodedRequest()["questions"];
        questions.forEach(q => {
            let name = q["name"];
            this.Logger.LogInfo("Checking blocklist for name '" + name + "'.");
            this._openCallbacks.add(name);
            this.IsBlocked(name, blocked => {
                if (this._openCallbacks.has(name)) {
                    if (blocked) {
                        // TODO: Log
                        // TODO: Send own IP as response?
                        request.AppendLog("AdblockHandler", "Domain blocked by filter list", InternalState.Blocked);
                        this.Logger.LogInfo("Blocked request for name '" + name + "'.");
                        cb(request);
                    }
                    else {
                        this._successor.Handle(request, cb);
                    }
                    this._openCallbacks.delete(name);
                }
            })
        })
    }

    IsBlocked(domain: string, cb: (blocked: boolean) => void): void {
        if (domain.length <= 2 || domain.indexOf(".") < 0) {
            cb(false);
        }

        let candidates = this.GenerateSubdomainCandidates(domain);
        candidates.forEach(c => {
            HelperMethods.GenerateGetBlockedDomain(c)(this._redisAdapter, (err: Error, value: string) => {
                if (err != undefined && value == "1") {
                    cb(true);
                }
                else {
                    cb(false);
                }
            })
        });
    }

    GenerateSubdomainCandidates(domain: string): string[] {
        let result = [];
        let reversedParts = domain.split(".").reverse();
        for (let i = 0; i < reversedParts.length - 1; i++) {
            result[i] = reversedParts.slice(0, i + 1).reverse().join(".");
        }
        return result;
    }
}