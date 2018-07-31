import { RedisAdapter, DefaultRedisCallback } from "../communication/RedisAdapter";

export class HelperMethods {
    static GenerateSetBlockedDomain(domain: string): (adapter: RedisAdapter) => void {
        return (adapter: RedisAdapter) => {
            adapter.Set(this.GenerateKey(domain), "1");
        };
    }

    static GenerateGetBlockedDomain(domain: string): (adapter: RedisAdapter, cb: DefaultRedisCallback) => boolean {
        return (adapter: RedisAdapter, cb: DefaultRedisCallback) => {
            return adapter.Get(this.GenerateKey(domain), cb);
        };
    }

    private static GenerateKey(domain: string) {
        return "BLOCKED_" + domain;
    }
}

