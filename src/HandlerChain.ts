import { HandlerBase } from "./HandlerBase";
import { RequestWrapper } from "./RequestWrapper";

export class HandlerChain extends HandlerBase {
    _start: HandlerBase;

    constructor(handlers: HandlerBase[]) {
        super();
        if (!handlers || handlers.length <= 0) {
            throw new Error("No handlers defined.");
        }
        this._start = handlers[0];
        if (handlers.length > 1) {
            var numberOfHandlers = handlers.length;
            for (var i = 0; i < (numberOfHandlers - 1); i++) {
                handlers[i].SetSuccessor(handlers[i + 1]);
            }
        }
    }

    Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void {
        this._start.Handle(request, cb);
    }
}