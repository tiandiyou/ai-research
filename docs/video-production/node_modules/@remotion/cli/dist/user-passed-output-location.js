"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPassedFileExtension = exports.getUserPassedOutputLocation = void 0;
const log_1 = require("./log");
const parse_command_line_1 = require("./parse-command-line");
const getUserPassedOutputLocation = () => {
    if (!parse_command_line_1.parsedCli._[3]) {
        log_1.Log.error('Pass an extra argument <output-filename>.');
        process.exit(1);
    }
    const filename = parse_command_line_1.parsedCli._[3];
    return filename;
};
exports.getUserPassedOutputLocation = getUserPassedOutputLocation;
const getUserPassedFileExtension = () => {
    const filename = (0, exports.getUserPassedOutputLocation)();
    const filenameArr = filename.split('.');
    const hasExtension = filenameArr.length >= 2;
    const filenameArrLength = filenameArr.length;
    const extension = hasExtension ? filenameArr[filenameArrLength - 1] : null;
    return extension;
};
exports.getUserPassedFileExtension = getUserPassedFileExtension;
//# sourceMappingURL=user-passed-output-location.js.map