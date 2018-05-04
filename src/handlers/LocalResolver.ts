import { HandlerBase } from "../HandlerBase";
import { RequestWrapper, InternalState } from "../RequestWrapper";
import * as dgram from "dgram";

export class LocalResolver extends HandlerBase {
    _ip: string;
    _socket: dgram.Socket;

    constructor(ip: string) {
        super();
        this._ip = ip;
        this._socket = dgram.createSocket("udp4");
    }

    Handle(request: RequestWrapper, cb: (result: RequestWrapper) => void): void {
        // TODO: How should an invalid state be handled?
        //  	 Callback won't be executed if no action is performed.
        if (!this.ShouldProcess(request)) {
            request.AppendLog("LocalResolver", "Nothing to process. No action performed.", request.CurrentState());
            cb(request);
        }

        if (request._requestDecoded["questions"] != undefined
            && request._requestDecoded["questions"].length == 1
            && request._requestDecoded["questions"][0]["name"] != undefined
            && request._requestDecoded["questions"][0]["name"].includes("fritz.box")) {

            this._socket.on("message", (msg: Buffer, rinfo: dgram.AddressInfo) => {
                request.AppendLog("LocalResolver", `Received response from local DNS resolver at '${this._ip}'`, InternalState.Success);
                request._responseMessage = msg;
                request._responseInfo = rinfo;
                cb(request);
            });

            this._socket.send(request._responseMessage, 53, this._ip);
        }
        else {
            request.AppendLog("LocalResolver", `Unable to resolve locally, forwarding..`, InternalState.Assigned);
            if (this._successor) {
                this._successor.Handle(request, cb);
            }
            else {
                request.AppendLog("LocalResolver", "End of chain without result!", InternalState.Error);
                cb(request);
            }
        }
    }
}