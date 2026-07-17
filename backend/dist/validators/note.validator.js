"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNoteSchema = exports.noteSchema = void 0;
const zod_1 = require("zod");
exports.noteSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    isSticky: zod_1.z.boolean().optional(),
});
exports.updateNoteSchema = exports.noteSchema.partial();
//# sourceMappingURL=note.validator.js.map