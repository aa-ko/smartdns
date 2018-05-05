import { HandlerBase } from "./HandlerBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";
import * as dgram from "dgram";

// TODO: Encapsulate socket creation to make IPv6 and TCP connections possible.
export class ExternalResolver extends HandlerBase {
    private _ip: string;
    private _socket: dgram.Socket;

    constructor(ip: string) {
        super();
        this._ip = ip;
        this._socket = dgram.createSocket("udp4");
    }

    Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void {
        this._socket.on("message", (msg: Buffer, rinfo: dgram.AddressInfo) => {
            request.AppendLog("ExternalResolver", `Received response from external DNS resolver at '${this._ip}'`, InternalState.Success);
            request._responseMessage = msg;
            request._responseInfo = rinfo;
            cb(request);
        });

        this._socket.send(request._requestMessage, 53, this._ip);
    }
}