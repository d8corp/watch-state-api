'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var Fetch = require('@watch-state/fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Fetch__default = /*#__PURE__*/_interopDefaultLegacy(Fetch);

var dataReg = /\{(\w+)\}/g;
var Api = /** @class */ (function () {
    function Api(url, options) {
        if (options === void 0) { options = {}; }
        this.url = url;
        this.options = options;
        this.cache = Object.create(null);
    }
    Api.prototype.get = function (data) {
        var e_1, _a;
        var values = tslib.__assign(tslib.__assign({}, this.options.data), data);
        var foundKeys = Object.create(null);
        var url = this.url.replace(dataReg, function (str, key) {
            if (key in values) {
                foundKeys[key] = true;
                return String(values[key]);
            }
            return '';
        });
        var search = '';
        for (var key in values) {
            if (key in foundKeys)
                continue;
            var value = values[key];
            if (value === undefined)
                continue;
            if (Array.isArray(value)) {
                try {
                    for (var value_1 = (e_1 = void 0, tslib.__values(value)), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                        var subValue = value_1_1.value;
                        search += "".concat(key, "[]=").concat(subValue, "&");
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else {
                search += "".concat(key, "=").concat(values[key], "&");
            }
        }
        if (search) {
            url += "?".concat(search.slice(0, -1));
        }
        if (url in this.cache) {
            return this.cache[url];
        }
        return this.cache[url] = new Fetch__default["default"](url, this.options);
    };
    return Api;
}());

exports.dataReg = dataReg;
exports["default"] = Api;
