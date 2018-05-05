import { Dictionary } from "../util/Dictionary";
import { DnsCache } from "./DnsCache";

export class CachePool {
    private static _regions: Dictionary<DnsCache>;

    static GetRegion(regionKey: string): DnsCache {
        if(this._regions === undefined) {
            this._regions = new Dictionary<DnsCache>();
        }
        
        var region = this._regions.Get(regionKey);
        if (!region) {
            region = new DnsCache();
            this._regions.Add(regionKey, region);
        }
        return region;
    }
}