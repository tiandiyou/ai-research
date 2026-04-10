"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageFormat = void 0;
const remotion_1 = require("remotion");
const getImageFormat = (codec) => {
    const userPreferred = remotion_1.Internals.getUserPreferredImageFormat();
    if (typeof userPreferred !== 'undefined') {
        return userPreferred;
    }
    if (remotion_1.Internals.isAudioCodec(codec)) {
        return 'none';
    }
    if (codec === 'h264' ||
        codec === 'h264-mkv' ||
        codec === 'h265' ||
        codec === 'vp8' ||
        codec === 'vp9' ||
        codec === 'prores') {
        return 'jpeg';
    }
    if (codec === undefined) {
        return 'png';
    }
    throw new Error('Unrecognized codec ' + codec);
};
exports.getImageFormat = getImageFormat;
//# sourceMappingURL=image-formats.js.map