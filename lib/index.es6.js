import Fetch from '@watch-state/fetch';

const dataReg = /\{(\w+)\}/g;
class Api {
    constructor(url, options = {}) {
        this.url = url;
        this.options = options;
        this.cache = Object.create(null);
        if (options.getKeys) {
            this.keyCache = Object.create(null);
            this.keyCacheMap = Object.create(null);
        }
    }
    get(data) {
        const values = Object.assign(Object.assign({}, this.options.data), data);
        const foundKeys = Object.create(null);
        let url = this.url.replace(dataReg, (str, key) => {
            if (key in values) {
                foundKeys[key] = true;
                return String(values[key]);
            }
            return '';
        });
        let search = '';
        for (const key in values) {
            if (key in foundKeys)
                continue;
            const value = values[key];
            if (value === undefined)
                continue;
            if (Array.isArray(value)) {
                for (const subValue of value) {
                    search += `${key}[]=${subValue}&`;
                }
            }
            else {
                search += `${key}=${values[key]}&`;
            }
        }
        if (search) {
            url += `?${search.slice(0, -1)}`;
        }
        if (url in this.cache) {
            return this.cache[url];
        }
        const request = new Fetch(url, this.options);
        this.cache[url] = request;
        const { getKeys } = this.options;
        if (getKeys) {
            request.on('resolve', () => {
                var _a;
                (_a = this.keyCacheMap[url]) === null || _a === void 0 ? void 0 : _a.forEach(key => {
                    this.keyCache[key].delete(request);
                });
                const map = this.keyCacheMap[url] = [];
                const data = request.value;
                const keys = getKeys(data);
                for (const key of keys) {
                    map.push(key);
                    if (!this.keyCache[key]) {
                        this.keyCache[key] = new Set([request]);
                    }
                    else {
                        this.keyCache[key].add(request);
                    }
                }
            });
        }
        return request;
    }
    update(keys, timeout) {
        if (!keys) {
            for (const key in this.cache) {
                this.cache[key].update(timeout);
            }
            return;
        }
        if (!this.keyCache) {
            return;
        }
        for (const key of keys) {
            const cache = this.keyCache[key];
            if (cache) {
                for (const request of cache) {
                    request.update(timeout);
                }
            }
        }
    }
}

export { dataReg, Api as default };
