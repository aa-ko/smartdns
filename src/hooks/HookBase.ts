import { RequestWrapper, InternalState } from "../RequestWrapper";

export abstract class HookBase {
    abstract Process(result: RequestWrapper): void;
    abstract Entrypoint: InternalState;
}