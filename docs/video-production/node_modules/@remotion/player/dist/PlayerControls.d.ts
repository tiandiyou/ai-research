import React, { MouseEventHandler } from 'react';
import { usePlayer } from './use-player';
export declare const Controls: React.FC<{
    fps: number;
    durationInFrames: number;
    hovered: boolean;
    showVolumeControls: boolean;
    player: ReturnType<typeof usePlayer>;
    onFullscreenButtonClick: MouseEventHandler<HTMLButtonElement>;
    isFullscreen: boolean;
    allowFullscreen: boolean;
    onExitFullscreenButtonClick: MouseEventHandler<HTMLButtonElement>;
    spaceKeyToPlayOrPause: boolean;
}>;
//# sourceMappingURL=PlayerControls.d.ts.map