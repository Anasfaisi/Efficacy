"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanTaskSchema = void 0;
const mongoose_1 = require("mongoose");
exports.KanbanTaskSchema = new mongoose_1.Schema({
    taskId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String },
    priority: { type: String, default: 'Low' },
    completed: { type: Boolean, default: false },
    approxTimeToFinish: { type: String },
});
exports.default = (0, mongoose_1.model)('KanbanTasks', exports.KanbanTaskSchema);
//# sourceMappingURL=kanban-task.model.js.map