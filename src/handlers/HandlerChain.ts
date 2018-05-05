import { HandlerBase } from "../handlers/HandlerBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";
import { FinalHandler } from "../handlers/FinalHandler";
import { HookBase } from "../hooks/HookBase";
import { CacheRefreshHook } from "../hooks/CacheRefreshHook";

export class HandlerChain extends HandlerBase {
    private _start: HandlerBase;
    private _hooks: HookBase[];

    constructor(handlers: HandlerBase[]) {
        super();

        // Setup handlers.
        if (!handlers || handlers.length <= 0) {
            throw new Error("No handlers defined.");
        }
        handlers.push(new FinalHandler());
        this._start = handlers[0];
        if (handlers.length > 1) {
            var numberOfHandlers = handlers.length;
            for (var i = 0; i < (numberOfHandlers - 1); i++) {
                handlers[i].SetSuccessor(handlers[i + 1]);
            }
        }

        // Setup hooks
        this._hooks = [
            new CacheRefreshHook()
        ];
    }

    Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void {
        this._start.Handle(request, (result) => {
            this.ExecuteHooks(result);
            cb(result);
        });
    }

    private ExecuteHooks(result: RequestWrapper): void {
        switch(result.CurrentState()) {
            case InternalState.Success:
                (new CacheRefreshHook()).Process(result);
        }
    }
}