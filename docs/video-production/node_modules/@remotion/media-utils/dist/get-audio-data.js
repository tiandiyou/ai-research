"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudioData = void 0;
const is_remote_asset_1 = require("./is-remote-asset");
const metadataCache = {};
const getAudioData = async (src) => {
    if (metadataCache[src]) {
        return metadataCache[src];
    }
    const audioContext = new AudioContext();
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const wave = await audioContext.decodeAudioData(arrayBuffer);
    const channelWaveforms = new Array(wave.numberOfChannels)
        .fill(true)
        .map((_, channel) => {
        return wave.getChannelData(channel);
    });
    const metadata = {
        channelWaveforms,
        sampleRate: audioContext.sampleRate,
        durationInSeconds: wave.duration,
        numberOfChannels: wave.numberOfChannels,
        resultId: String(Math.random()),
        isRemote: (0, is_remote_asset_1.isRemoteAsset)(src),
    };
    metadataCache[src] = metadata;
    return metadata;
};
exports.getAudioData = getAudioData;
//# sourceMappingURL=get-audio-data.js.map