"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteModel = void 0;
const mongoose_1 = require("mongoose");
const NoteSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        default: 'Untitled Note',
    },
    content: {
        type: String,
        default: '',
    },
    isSticky: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.NoteModel = (0, mongoose_1.model)('Note', NoteSchema);
//# sourceMappingURL=note.model.js.map