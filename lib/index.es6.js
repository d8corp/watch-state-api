import Fetch from '@watch-state/fetch';

const dataReg = /\{(\w+)\}/g;
function apiReplace(url, values) {
    return url.replace(dataReg, (str, key) => key in values ? String(values[key]) : '');
}
class Api {
    constructor(url, options = {}) {
        this.url = url;
        this.options = options;
        this.cache = Object.create(null);
    }
    get(data) {
        const values = data || this.options.data ? Object.assign(Object.assign({}, this.options.data), data) : undefined;
        const url = values ? apiReplace(this.url, values) : this.url;
        if (url in this.cache) {
            return this.cache[url];
        }
        return this.cache[url] = new Fetch(url, this.options);
    }
}

export { apiReplace, dataReg, Api as default };
