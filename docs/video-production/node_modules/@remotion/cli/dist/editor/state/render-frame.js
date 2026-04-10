"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderFrame = void 0;
const renderFrame = (frame, fps) => {
    const minutes = Math.floor(frame / fps / 60);
    const remainingSec = frame - minutes * fps * 60;
    const seconds = Math.floor(remainingSec / fps);
    const frameAfterSec = Math.round(frame % fps);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(frameAfterSec).padStart(2, '0')}`;
};
exports.renderFrame = renderFrame;
//# sourceMappingURL=render-frame.js.map