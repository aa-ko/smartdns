const packet = require('dns-packet');
const dgram = require('dgram');
//const dns = require("dns");

const cache = require("./src/dnscache");

var proxySocketUdp4 = dgram.createSocket("udp4");
var proxySocketUdp6 = dgram.createSocket("udp6");

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
            cache.set(proxyMsg, msg, 10);
        });
        tempSocket.send(proxyMsg, 53, "192.168.0.16");
    }
    else {
        cache.get(proxyMsg, (err, data) => {
            // Cache miss
            if (err || data == undefined) {
                console.log("Fetching from external DNS.");

                tempSocket.on("message", (msg, rinfo) => {
                    console.log("Sending response to " + proxyRinfo.address + " on port " + proxyRinfo.port);
                    proxySocketUdp4.send(msg, proxyRinfo.port, proxyRinfo.address);
                    tempSocket.close();

                    cache.set(proxyMsg, msg, 10);
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
