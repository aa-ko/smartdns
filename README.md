# DNS proxy

## What is this?
I wanted something like [pi-hole](https://pi-hole.net/) that would also automatically choose the fastest DNS server and implement simple caching. Also I wanted to customize my DNS server configuration based on the device the request came from and define specific rules for the cache.

Since I could not find any implementation that provided all these features I started this project.

## Requirements
* NodeJS 8.11.1
* npm 5.6.0
* tsc 2.8.3

## How do I use it?
* Clone this repository
* Run **tsc** (TypeScript compiler) in the root directory of the repository
* Run `node ./dist/app.js`
* The proxy should now be listening to DNS requests on your local machine's port 53

### Please note that currenty only UDP IPv4 requests are supported!

## Roadmap
1. Implement adblock by storing a block list in Redis
    * This might split up the project to have multiple entrypoints
1. Package into docker image and bundle with traefik load balancer
1. Enable tsc compiler flags for better code quality
1. Fully implement IPv6 and requests via TCP
1. Automatically choose fastest server
2. Smarter caching
3. Monitoring
3. Web UI