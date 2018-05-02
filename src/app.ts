import * as packet from "dns-packet";
import * as dgram from "dgram";
//const dns = require("dns");

import * as DnsCache from "./DnsCache";

var proxySocketUdp4 = dgram.createSocket("udp4");
var proxySocketUdp6 = dgram.createSocket("udp6");

let cache = new DnsCache.DnsCache();

proxySocketUdp4.on("message", (proxyMsg, proxyRinfo) => {
    console.log("Received proxy request on port '" + proxyRinfo.port + "'.");
    //console.log(JSON.stringify(packet.decode(proxyMsg)));
    var tempSocket = dgram.createSocket("udp4");

    var decoded = packet.decode(proxyMsg);

    // Local resolve
    if (   decoded["questions"] != undefined
        && decoded["questions"].length == 1
        && decoded["questions"][0]["name"] != undefined
        && decoded["questions"][0]["name"].includes("fritz.box")) {
        console.log("Resolving locally.");

        tempSocket.on("message", (msg, rinfo) => {
            console.log("Sending response to " + proxyRinfo.address + " on port " + proxyRinfo.port);
            proxySocketUdp4.send(msg, proxyRinfo.port, proxyRinfo.address);
            tempSocket.close();
            cache.Set(proxyMsg, msg, 10);
        });
        tempSocket.send(proxyMsg, 53, "192.168.0.16");
    }
    else {
        cache.Get(proxyMsg, (err, data) => {
            // Cache miss
            if (err || data == undefined) {
                console.log("Fetching from external DNS.");

                tempSocket.on("message", (msg, rinfo) => {
                    console.log("Sending response to " + proxyRinfo.address + " on port " + proxyRinfo.port);
                    proxySocketUdp4.send(msg, proxyRinfo.port, proxyRinfo.address);
                    tempSocket.close();

                    cache.Set(proxyMsg, msg, 10);
                });

                tempSocket.send(proxyMsg, 53, "1.1.1.1");
            }
            // Cache hit
            else {
                console.log("Sending response to " + proxyRinfo.address + " on port " + proxyRinfo.port);
                proxySocketUdp4.send(data, proxyRinfo.port, proxyRinfo.address);
                tempSocket.close();
            }
        });
    }
});

proxySocketUdp4.bind(53);

console.log("Started.");