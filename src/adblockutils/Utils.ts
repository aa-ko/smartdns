import { RedisAdapter } from "../communication/RedisAdapter";

export class Utils {
    GenerateSetBlockedDomain(adapter: RedisAdapter): () => void {
        return function() {
            return null;
        }
    }    
}