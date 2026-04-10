"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudioDuration = void 0;
const getAudioDuration = (src) => {
    const audio = document.createElement('audio');
    audio.src = src;
    return new Promise((resolve, reject) => {
        const onError = () => {
            reject(audio.error);
            cleanup();
        };
        const onLoadedMetadata = () => {
            resolve(audio.duration);
            cleanup();
        };
        const cleanup = () => {
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('error', onError);
        };
        audio.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
        audio.addEventListener('error', onError, { once: true });
    });
};
exports.getAudioDuration = getAudioDuration;
//# sourceMappingURL=get-audio-duration.js.map