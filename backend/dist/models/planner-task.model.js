"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Priority = void 0;
const mongoose_1 = require("mongoose");
var Priority;
(function (Priority) {
    Priority["HIGH"] = "High";
    Priority["MEDIUM"] = "Medium";
    Priority["LOW"] = "Low";
})(Priority || (exports.Priority = Priority = {}));
const PlannerTaskSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Users', required: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: {
        type: String,
        enum: Object.values(Priority),
        default: Priority.LOW,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    subtasks: [
        {
            title: { type: String, required: true },
            completed: { type: Boolean, default: false },
        },
    ],
    completed: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('PlannerTasks', PlannerTaskSchema);
//# sourceMappingURL=planner-task.model.js.map