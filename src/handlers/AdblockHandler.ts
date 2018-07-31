import { HandlerBase } from "./HandlerBase";
import { RequestWrapper } from "../RequestWrapper";

export class AdblockHandler extends HandlerBase {
    Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void {
        let questions = request.GetDecodedRequest()["questions"];
        questions.forEach(q => {
            if (this.IsBlocked(q)) {
                // TODO: Log
                // TODO: Send own IP as response?
            }
        })
    }

    IsBlocked(domain: string): boolean {
        let candidates = this.GenerateSubdomainCandidates(domain);
        candidates.forEach(c => {
            // TODO: Lookup c in Redis.

        });
        return false;
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