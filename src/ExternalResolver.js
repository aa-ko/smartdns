"use strict";

var dgram = require("dgram");

class ExternalResolver {
    constructor(localResolver, externalResolver) {
        this._localResolver = localResolver;
        this._externalResolver = externalResolver;
    }

    get localResolver() {
        return this._localResolver;
    }
    set localResolver(socket) {
        this._localResolver = socket;
    }

    get externalResolver() {
        return this._externalResolver;
    }
    set externalResolver(socket) {
        this._externalResolver = socket;
    }

    resolve(request) {

    }
}

class SocketWrapper {
    constructor(ip, name, type) {
        this._ip = ip;
        this._name = name;
        this._socket = dgram.createSocket(type);
    }
}

module.exports = {
    Resolver: ExternalResolver
}