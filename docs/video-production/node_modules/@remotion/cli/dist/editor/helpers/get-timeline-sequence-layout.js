"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimelineSequenceLayout = exports.SEQUENCE_BORDER_WIDTH = void 0;
const timeline_layout_1 = require("./timeline-layout");
exports.SEQUENCE_BORDER_WIDTH = 1;
const getTimelineSequenceLayout = ({ durationInFrames, startFrom, maxMediaDuration, startFromMedia, video, windowWidth, }) => {
    var _a;
    const maxMediaSequenceDuration = (maxMediaDuration !== null && maxMediaDuration !== void 0 ? maxMediaDuration : Infinity) - startFromMedia;
    const spatialDuration = Math.min(maxMediaSequenceDuration, durationInFrames - 1);
    const lastFrame = ((_a = video.durationInFrames) !== null && _a !== void 0 ? _a : 1) - 1;
    const marginLeft = lastFrame === 0
        ? 0
        : (startFrom / lastFrame) * (windowWidth - timeline_layout_1.TIMELINE_PADDING * 2);
    const negativeMarginLeft = Math.min(marginLeft, 0);
    const width = (durationInFrames === Infinity || lastFrame === 0
        ? windowWidth - timeline_layout_1.TIMELINE_PADDING * 2
        : (spatialDuration / lastFrame) * (windowWidth - timeline_layout_1.TIMELINE_PADDING * 2)) -
        exports.SEQUENCE_BORDER_WIDTH +
        negativeMarginLeft;
    return {
        marginLeft: Math.round(Math.max(marginLeft, 0)),
        width: Math.floor(width),
    };
};
exports.getTimelineSequenceLayout = getTimelineSequenceLayout;
//# sourceMappingURL=get-timeline-sequence-layout.js.map