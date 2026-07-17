"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanColumnSchema = void 0;
const column_enum_types_1 = require("@/types/column-enum.types");
const kanban_task_model_1 = require("./kanban-task.model");
const mongoose_1 = require("mongoose");
exports.KanbanColumnSchema = new mongoose_1.Schema({
    columnId: { type: String, enum: column_enum_types_1.ColumnIdValues, required: true },
    title: { type: String, required: true },
    tasks: [kanban_task_model_1.KanbanTaskSchema],
});
//# sourceMappingURL=kanban-column.model.js.map