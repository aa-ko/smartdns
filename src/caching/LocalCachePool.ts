import { Dictionary } from "../util/Dictionary";
import { LocalDnsCache } from "./LocalDnsCache";

export class LocalCachePool {
    static DefaultCacheRegion: string = "DEFAULT";
    
    private static _regions: Dictionary<LocalDnsCache>;

    static GetRegion(regionKey: string): LocalDnsCache {
        if(this._regions === undefined) {
            this._regions = new Dictionary<LocalDnsCache>();
        }
        
        var region = this._regions.Get(regionKey);
        if (!region) {
            region = new LocalDnsCache();
            this._regions.Add(regionKey, region);
        }
        return region;
    }
}