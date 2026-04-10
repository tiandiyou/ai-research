"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompositionId = void 0;
const log_1 = require("./log");
const parse_command_line_1 = require("./parse-command-line");
const getCompositionId = (comps) => {
    if (!parse_command_line_1.parsedCli._[2]) {
        log_1.Log.error('Composition ID not passed.');
        log_1.Log.error('Pass an extra argument <composition-id>. The following video names are available:');
        log_1.Log.error(`${comps.map((c) => c.id).join(', ')}`);
        process.exit(1);
    }
    return parse_command_line_1.parsedCli._[2];
};
exports.getCompositionId = getCompositionId;
//# sourceMappingURL=get-composition-id.js.map