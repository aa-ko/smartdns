import { HandlerBase } from "./HandlerBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";

// TODO: Is this okay or can I avoid using "require" here?
const redis = require("redis");

export class RedisCacheResolver extends HandlerBase {
    _redisClient: any;

    constructor(redisIpOrHostname: string, redisPort: number) {
        super();
        this._redisClient = redis.createClient(redisPort, redisIpOrHostname);
    }
    
    Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void {
        this._redisClient.set("")
    }
}