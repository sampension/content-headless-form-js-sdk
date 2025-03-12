/**
 * Class to help save data to Storage. Default is sessionStorage.
 */
export class FormCache{
    readonly _storage: Storage
    readonly _cacheKey: string

    constructor(storage?: Storage, cacheKey?: string){
        this._storage = storage ?? window.sessionStorage;
        this._cacheKey = cacheKey ? ":" + cacheKey : "";
    }

    private getCachekey(key: string): string{
        return key + this._cacheKey;
    }

    get<T>(key: string): T | undefined{
        key = this.getCachekey(key);
        let data = this._storage[key];
        if (!data) {
            return undefined;
        }

        if(typeof data === "object"){
            data = JSON.parse(data);
        }

        if (!data) {
            return undefined;
        }

        return data as T;
    }

    set<T>(key: string, data: T): T{
        try { // safari private mode does not allow local storage
            key = this.getCachekey(key);
            if(typeof data === "object"){
                this._storage.setItem(key, JSON.stringify(data));
            }
            else {
                this._storage.setItem(key, data as string);
            }
        } catch (e: any) {
            console.log("Local Storage not supported: " + e.message);
        }
        return data;
    }

    remove(key: string): void{
        key = this.getCachekey(key);
        this._storage.removeItem(key);
    }
}