"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNodeVersion = void 0;
const log_1 = require("./log");
const semver = require('semver');
const current = process.version;
const supported = '>=12.10.0';
const checkNodeVersion = () => {
    if (!semver.satisfies(current, supported)) {
        log_1.Log.warn(`Required node version ${supported} not satisfied with current version ${current}.`);
        log_1.Log.warn(`Update your node version to ${supported}`);
    }
};
exports.checkNodeVersion = checkNodeVersion;
//# sourceMappingURL=check-version.js.map