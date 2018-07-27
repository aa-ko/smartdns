import { RequestWrapper, InternalState } from "../RequestWrapper";

export abstract class HandlerBase {
    
    // TODO: Introduce name property and NoSuccessor method for graceful
    //       handling in the last chain element.
    
    protected _successor: HandlerBase;

    SetSuccessor(successor: HandlerBase) {
        this._successor = successor;
    }

    abstract Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void;

    protected ShouldProcess(request: RequestWrapper): boolean {
        if (request.GetCurrentState() <= InternalState.Assigned) return true;
        else return false;
    }
}