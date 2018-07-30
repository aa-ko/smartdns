import * as packet from "dns-packet";
import * as sha256 from "sha256";

export abstract class CacheBase {
    protected DecodeAndHash(input: Buffer, omittedKeys: string[]): string {
        var decoded = this.DecodePacket(input);
        omittedKeys.forEach(key => {
            delete decoded[key];
        });
        return this.ComputeHash(decoded);
    }

    abstract Get(key: Buffer, cb: (err: boolean, value: Buffer) => void): void;
    abstract SetOrUpdate(key: Buffer, value: Buffer, ttl: number): void;

    protected DecodePacket(input: Buffer): any {
        return packet.decode(input);
    }

    protected EncodePacket(input: any): Buffer {
        return packet.encode(input);
    }

    // TODO: Replace this with Murmur hash?
    protected ComputeHash(input: object) {
        return sha256(JSON.stringify(input));
    }
}