declare global {
    interface Document {
        webkitFullscreenEnabled?: boolean;
        webkitFullscreenElement?: Element;
        webkitExitFullscreen?: Document['exitFullscreen'];
    }
    interface HTMLDivElement {
        webkitRequestFullScreen: HTMLDivElement['requestFullscreen'];
    }
}
export declare const browserSupportsFullscreen: boolean | undefined;
//# sourceMappingURL=browser-supports-fullscreen.d.ts.map