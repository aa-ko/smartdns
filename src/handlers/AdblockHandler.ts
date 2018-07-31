import { HandlerBase } from "./HandlerBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";
import { HelperMethods } from "../adblockutils/HelperMethods";
import { RedisAdapter, DefaultRedisCallback } from "../communication/RedisAdapter";
import { GlobalLogger } from "../logging/GlobalLogger";

export class AdblockHandler extends HandlerBase {
    private Logger: GlobalLogger;
    private _redisAdapter: RedisAdapter;

    constructor(adapter: RedisAdapter) {
        super();
        this.Logger = GlobalLogger.Get("AdblockHandler");
        this._redisAdapter = adapter;
    }

    Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void {
        let questions = request.GetDecodedRequest()["questions"];
        questions.forEach(q => {
            this.IsBlocked(q, blocked => {
                if (blocked) {
                    // TODO: Log
                    // TODO: Send own IP as response?
                    request.AppendLog("AdblockHandler", "Domain blocked by filter list", InternalState.Blocked);
                    this.Logger.LogInfo("Blocked request for name '" + q + "'.");
                    cb(request);
                }
            })
        })
    }

    IsBlocked(domain: string, cb: (blocked: boolean) => void): void {
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