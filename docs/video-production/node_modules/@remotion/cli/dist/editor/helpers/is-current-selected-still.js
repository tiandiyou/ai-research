"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsStill = void 0;
const react_1 = require("react");
const remotion_1 = require("remotion");
const is_composition_still_1 = require("./is-composition-still");
const useIsStill = () => {
    const { compositions, currentComposition } = (0, react_1.useContext)(remotion_1.Internals.CompositionManager);
    const selected = (0, react_1.useMemo)(() => compositions.find((c) => c.id === currentComposition), [compositions, currentComposition]);
    if (!selected) {
        return false;
    }
    return (0, is_composition_still_1.isCompositionStill)(selected);
};
exports.useIsStill = useIsStill;
//# sourceMappingURL=is-current-selected-still.js.map