import * as packet from "dns-packet";
import * as objectHash from "object-hash";
import * as sha256 from "sha256";

export abstract class CacheBase {
    protected DecodeAndHash(input: Buffer, omittedKeys: string[]): string {
        var decoded = this.DecodePacket(input);
        omittedKeys.forEach(key => {
            delete decoded[key];
        });
        return this.ComputeHash(decoded);
    }

    // protected ComputeHash(input: any): string {
    //     // TODO: Implement generically for any possible key and define mappings based on the request type.
    //     return objectHash(input);
    // }

    protected DecodePacket(input: Buffer): any {
        return packet.decode(input);
    }

    protected ComputeHash(input: object) {
        return sha256(JSON.stringify(input));
    }
}