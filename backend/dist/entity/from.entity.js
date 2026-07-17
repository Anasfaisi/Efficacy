"use strict";
//====================   kanban  =========================//
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanBoardFromEntity = exports.kanbanColumnFromEntity = exports.kanbanTaskFromEntity = void 0;
class kanbanTaskFromEntity {
    taskId;
    title;
    description;
    dueDate;
    approxTimeToFinish;
    constructor(taskId, title, description, dueDate, approxTimeToFinish) {
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.approxTimeToFinish = approxTimeToFinish;
    }
}
exports.kanbanTaskFromEntity = kanbanTaskFromEntity;
class kanbanColumnFromEntity {
    columnId;
    title;
    tasks;
    constructor(columnId, title, tasks = []) {
        this.columnId = columnId;
        this.title = title;
        this.tasks = tasks;
    }
}
exports.kanbanColumnFromEntity = kanbanColumnFromEntity;
class KanbanBoardFromEntity {
    id;
    columns;
    constructor(id, columns) {
        this.id = id;
        this.columns = columns;
    }
}
exports.KanbanBoardFromEntity = KanbanBoardFromEntity;
//# sourceMappingURL=from.entity.js.map