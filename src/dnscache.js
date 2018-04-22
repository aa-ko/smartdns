const NodeCache = require("node-cache");
const cache = new NodeCache();
const packet = require('dns-packet');
const objectHash = require("object-hash");

var set = function (key, value, ttl) {
    var valueWrapper = {
        response: value
    }
    computeHash(key, (hash, omitted) => {
        valueWrapper["id"] = omitted["id"];
        console.log(`Caching object with key '${hash}' for ${ttl} seconds.`);
        cache.set(hash, valueWrapper, ttl);
    });
};

var get = function (key, callback) {
    return internalGet(key, callback, "response");
}

var getId = function (key, callback) {
    return internalGet(key, callback, "id");
}

var internalGet = function(key, callback, identifier) {
    computeHash(key, (hash, omitted) => {
        cache.get(hash, (err, data) => {
            if (err || data == undefined) {
                console.log(`Cache MISS for object with key '${hash}'.`);
                callback(err, data);
            }
            else {
                console.log(`Cache HIT for object with key '${hash}'.`);
                callback(err, data[identifier]);
            }
        });
    });
}

var computeHash = function(input, callback) {
    // TODO: Implement generically for any possible key and define mappings based on the request type.
    var decoded = packet.decode(input);
    var omitted = {
        id: decoded["id"]
    };
    
    delete decoded["id"];
    callback(objectHash(decoded), omitted);
}

module.exports = {
    set : set,
    get : get,
    getId : getId
}