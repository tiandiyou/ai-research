"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoMetadata = void 0;
const is_remote_asset_1 = require("./is-remote-asset");
const cache = {};
const getVideoMetadata = async (src) => {
    if (cache[src]) {
        return cache[src];
    }
    const video = document.createElement('video');
    video.src = src;
    return new Promise((resolve, reject) => {
        const onError = () => {
            reject(video.error);
            cleanup();
        };
        const onLoadedMetadata = () => {
            const metadata = {
                durationInSeconds: video.duration,
                width: video.videoWidth,
                height: video.videoHeight,
                aspectRatio: video.videoWidth / video.videoHeight,
                isRemote: (0, is_remote_asset_1.isRemoteAsset)(src),
            };
            resolve(metadata);
            cache[src] = metadata;
            cleanup();
        };
        const cleanup = () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
        };
        video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
        video.addEventListener('error', onError, { once: true });
    });
};
exports.getVideoMetadata = getVideoMetadata;
//# sourceMappingURL=get-video-metadata.js.map