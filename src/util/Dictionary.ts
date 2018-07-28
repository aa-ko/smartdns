export interface IDictionary<TKey, TValue> {
    Add(key: TKey, value: TValue): void;
    Remove(key: TKey): void;
    Get(key: TKey): TValue | undefined;
    ContainsKey(key: TKey): boolean;
}

export interface IStringDictionary<TValue> extends IDictionary<string, TValue> {
    // Only changed key type.
}

export class Dictionary<TValue> implements IStringDictionary<TValue> {
    private _values: { [key: string]: TValue };

    constructor() {
        this._values = {};
    }

    Add(key: string, value: TValue): void {
        this.Remove(key);
        this._values[key] = value;
    }

    Remove(key: string): void {
        delete this._values.key;
    }

    Get(key: string): TValue | undefined {
        return this._values[key];
    }
    
    ContainsKey(key: string): boolean {
        var result = this.Get(key);
        return result !== undefined;
    }
}