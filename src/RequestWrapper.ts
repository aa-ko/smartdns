import * as dgram from "dgram";
import * as packet from "dns-packet";

export class RequestWrapper {
    _requestMessage: Buffer;
    _requestInfo: dgram.AddressInfo;
    _requestDecoded: any;

    _responseMessage: Buffer;
    _responseInfo: dgram.AddressInfo;

    _log: HandlerLog[];

    constructor(message: Buffer, info: dgram.AddressInfo) {
        this._requestMessage = message;
        this._requestInfo = info;
        this._requestDecoded = packet.decode(this._requestMessage);
    }

    CurrentState(): InternalState {
        return this._log[this._log.length - 1]._newState;
    }

    AppendLog(handler: string, message: string, newState: InternalState) {
        this._log.push(new HandlerLog(handler, message, newState));
    }
}

class HandlerLog {
    constructor(handler: string, message: string, newState: InternalState) {
        this._handler = handler;
        this._message = message;
        this._newState = newState;
    }
    _handler: string;
    _message: string;
    _newState: InternalState;
}

export enum InternalState {
    Unprocessed = 0,
    Queued = 1,
    Assigned = 2,
    Success = 5,
    Error = 6
}