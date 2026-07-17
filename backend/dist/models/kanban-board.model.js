"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const kanban_column_model_1 = require("./kanban-column.model");
const KanbanBoardSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    columns: [kanban_column_model_1.KanbanColumnSchema],
});
exports.default = (0, mongoose_1.model)('KanbanBoards', KanbanBoardSchema);
//# sourceMappingURL=kanban-board.model.js.map