import * as packet from "dns-packet";
import * as dgram from "dgram";
//const dns = require("dns");
import * as DnsCache from "./caching/DnsCache";
import { LoggerFactory } from "./logging/GlobalLogger";
import { RequestWrapper } from "./RequestWrapper";
import { LocalResolver } from "./handlers/LocalResolver";
import { HandlerChain } from "./handlers/HandlerChain";
import { CacheResolver } from "./handlers/CacheResolver";
import { ExternalResolver } from "./handlers/ExternalResolver";

var Logger = LoggerFactory.Get("app");

Logger.LogInfo("Init.");

var proxySocketUdp4 = dgram.createSocket("udp4");
var proxySocketUdp6 = dgram.createSocket("udp6");

let chain = new HandlerChain([
    // TODO: Remove constant IP addresses and fetch dynamically from config file.
    new CacheResolver(),
    new LocalResolver("192.168.0.16"),
    new ExternalResolver("1.1.1.1")
]);

proxySocketUdp4.on("message", (proxyMsg, proxyRinfo) => {
    Logger.LogDebug("Received proxy request on port '" + proxyRinfo.port + "'.");
    var request = new RequestWrapper(proxyMsg, proxyRinfo);
    chain.Handle(request, result => {
        proxySocketUdp4.send(result._responseMessage, proxyRinfo.port, proxyRinfo.address);
    });
});

proxySocketUdp4.bind(53);

Logger.LogInfo("Started DNS Proxy");