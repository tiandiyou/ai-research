"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnAboutFfmpegVersion = void 0;
const log_1 = require("./log");
const printMessage = (ffmpegVersion) => {
    log_1.Log.warn('⚠️Old FFMPEG version detected: ' + ffmpegVersion.join('.'));
    log_1.Log.warn('   For audio support, you need at least version 4.1.0.');
    log_1.Log.warn('   Upgrade FFMPEG to get rid of this warning.');
};
const printBuildConfMessage = () => {
    log_1.Log.error('⚠️  Unsupported FFMPEG version detected.');
    log_1.Log.error("   Your version doesn't support the -buildconf flag");
    log_1.Log.error('   Audio will not be supported and you may experience other issues.');
    log_1.Log.error('   Upgrade FFMPEG to at least v4.1.0 to get rid of this warning.');
};
const warnAboutFfmpegVersion = ({ ffmpegVersion, buildConf, }) => {
    if (buildConf === null) {
        printBuildConfMessage();
        return;
    }
    if (ffmpegVersion === null) {
        return null;
    }
    const [major, minor] = ffmpegVersion;
    // 3.x and below definitely is too old
    if (major < 4) {
        printMessage(ffmpegVersion);
        return;
    }
    // 5.x will be all good
    if (major > 4) {
        return;
    }
    if (minor < 1) {
        printMessage(ffmpegVersion);
    }
};
exports.warnAboutFfmpegVersion = warnAboutFfmpegVersion;
//# sourceMappingURL=warn-about-ffmpeg-version.js.map