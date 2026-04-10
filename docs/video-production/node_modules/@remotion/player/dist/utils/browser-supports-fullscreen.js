"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserSupportsFullscreen = void 0;
exports.browserSupportsFullscreen = typeof document !== 'undefined' &&
    (document.fullscreenEnabled || document.webkitFullscreenEnabled);
//# sourceMappingURL=browser-supports-fullscreen.js.map