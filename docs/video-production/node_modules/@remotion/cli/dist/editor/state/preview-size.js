"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewSizeContext = exports.loadPreviewSizeOption = exports.persistPreviewSizeOption = void 0;
const react_1 = require("react");
const persistPreviewSizeOption = (option) => {
    localStorage.setItem('previewSize', String(option));
};
exports.persistPreviewSizeOption = persistPreviewSizeOption;
const loadPreviewSizeOption = () => {
    const item = localStorage.getItem('previewSize');
    if (item === null) {
        return 'auto';
    }
    return item;
};
exports.loadPreviewSizeOption = loadPreviewSizeOption;
exports.PreviewSizeContext = (0, react_1.createContext)({
    setSize: () => undefined,
    size: (0, exports.loadPreviewSizeOption)(),
});
//# sourceMappingURL=preview-size.js.map