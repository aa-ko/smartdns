const packet = require('dns-packet');
const dgram = require('dgram');
const dns = require("dns");
const objectHash = require('object-hash');

const cache = require("./src/dnscache");

//var cache = new nodeCache();
var proxySocket = dgram.createSocket("udp4");

proxySocket.on("message", (proxyMsg, proxyRinfo) => {
    console.log("Received proxy request on port '" + proxyRinfo.port + "'.");
    //console.log(JSON.stringify(packet.decode(proxyMsg)));
    var tempSocket = dgram.createSocket("udp4");

    // Local resolve
    if (packet.decode(proxyMsg)["questions"][0]["name"].includes("fritz.box")) {
        console.log("Resolving locally.");

        tempSocket.on("message", (msg, rinfo) => {
            console.log("Sending response to " + proxyRinfo.address + " on port " + proxyRinfo.port);
            proxySocket.send(msg, proxyRinfo.port, proxyRinfo.address);
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
                    proxySocket.send(msg, proxyRinfo.port, proxyRinfo.address);
                    tempSocket.close();

                    cache.set(proxyMsg, msg, 10);
                });

                tempSocket.send(proxyMsg, 53, "1.1.1.1");
            }
            // Cache hit
            else {
                console.log("Sending response to " + proxyRinfo.address + " on port " + proxyRinfo.port);
                proxySocket.send(data, proxyRinfo.port, proxyRinfo.address);
                tempSocket.close();
            }
        });
    }
});

proxySocket.bind(53);
