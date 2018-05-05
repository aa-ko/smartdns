import { HandlerBase } from "./HandlerBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";

export class FinalHandler extends HandlerBase {
    Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void {
        request.AppendLog("FinalHandler", "No result found until end of chain.", InternalState.Error);
    }
}