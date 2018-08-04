import * as dgram from "dgram";
import { RequestWrapper } from "../RequestWrapper";
import { HandlerChain } from "../handlers/HandlerChain";
import { ExternalResolver } from "../handlers/ExternalResolver";
import { RedisCacheResolver } from "../handlers/RedisCacheResolver";
import { GlobalLogger } from "../logging/GlobalLogger";
import { AdblockResolver } from "../handlers/AdblockResolver";

var Logger = GlobalLogger.Get("proxy");

const PROXY_PORT: number = 1234;

// TODO:
// If the response from the real DNS server is made up of two separate UDP packets,
// the first cached reponse is being overwritten by the second one.

Logger.LogInfo("Init.");

var proxySocketUdp4 = dgram.createSocket("udp4");
//var proxySocketUdp6 = dgram.createSocket("udp6");

let chain = new HandlerChain([
    // TODO: Remove constant IP addresses and fetch dynamically from config file.
    new AdblockResolver("127.0.0.1", 6379),
    new RedisCacheResolver("127.0.0.1", 6379),
    //new LocalResolver("192.168.0.16"),
    new ExternalResolver("8.8.8.8")
]);

proxySocketUdp4.on("message", (proxyMsg, proxyRinfo) => {
    Logger.LogDebug("Received proxy request from host '" + proxyRinfo.address + "' port '" + proxyRinfo.port + "'.");
    var request = new RequestWrapper(proxyMsg, proxyRinfo);
    //console.log(request.GetDecodedRequest());
    chain.Handle(request, result => {
        proxySocketUdp4.send(result._responseMessage, proxyRinfo.port, proxyRinfo.address);
    });
});

proxySocketUdp4.bind(PROXY_PORT);

Logger.LogInfo("Started DNS Proxy");