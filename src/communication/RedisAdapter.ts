import * as redis from "redis";
import { GlobalLogger } from "../logging/GlobalLogger";

// Wrapper object for the Redis package.
export class RedisAdapter {
    private Logger: GlobalLogger;
    private _redisClient: redis.RedisClient;

    constructor(redisIp: string, redisPort: number) {
        this.Logger = GlobalLogger.Get("RedisAdapter");
        try {
            this._redisClient = redis.createClient(redisPort, redisIp);
        }
        catch (error) {
            let message = "An error occured while initializing the connection to the Redis server.";
            this.Logger.LogError(message);
            this.Logger.LogError(JSON.stringify(error));
            throw new Error(message);
        }
    }

    Get(key: string, cb: redis.Callback<string>): boolean {
        return this._redisClient.get(key, cb);
    }

    Set(key: string, value: string, ttl: number, cb?: redis.Callback<string>): void {
        this._redisClient.setex(key, ttl, value, cb);
    }
}