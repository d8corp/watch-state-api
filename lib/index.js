'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var Fetch = require('@watch-state/fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Fetch__default = /*#__PURE__*/_interopDefaultLegacy(Fetch);

var dataReg = /\{(\w+)\}/g;
function apiReplace(url, values) {
    return url.replace(dataReg, function (str, key) { return key in values ? String(values[key]) : ''; });
}
var Api = /** @class */ (function () {
    function Api(url, options) {
        if (options === void 0) { options = {}; }
        this.url = url;
        this.options = options;
        this.cache = Object.create(null);
    }
    Api.prototype.get = function (data) {
        var values = data || this.options.data ? tslib.__assign(tslib.__assign({}, this.options.data), data) : undefined;
        var url = values ? apiReplace(this.url, values) : this.url;
        if (url in this.cache) {
            return this.cache[url];
        }
        return this.cache[url] = new Fetch__default['default'](url, this.options);
    };
    return Api;
}());

exports.apiReplace = apiReplace;
exports.dataReg = dataReg;
exports.default = Api;
