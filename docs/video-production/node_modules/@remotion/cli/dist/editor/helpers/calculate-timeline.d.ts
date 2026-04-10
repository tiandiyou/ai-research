import { TSequence } from 'remotion';
import { TrackWithHash } from './get-timeline-sequence-sort-key';
export declare type SequenceWithOverlap = {
    sequence: TSequence;
    overlaps: TSequence[];
};
export declare const calculateTimeline: ({ sequences, sequenceDuration, }: {
    sequences: TSequence[];
    sequenceDuration: number;
}) => TrackWithHash[];
//# sourceMappingURL=calculate-timeline.d.ts.map