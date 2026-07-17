"use strict";
///=================== kanban ====================//
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanBoardToEntity = exports.kanbanColumnToEntity = exports.kanbanTaskToEntity = void 0;
class kanbanTaskToEntity {
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
exports.kanbanTaskToEntity = kanbanTaskToEntity;
class kanbanColumnToEntity {
    columnId;
    title;
    tasks;
    constructor(columnId, title, tasks = []) {
        this.columnId = columnId;
        this.title = title;
        this.tasks = tasks;
    }
}
exports.kanbanColumnToEntity = kanbanColumnToEntity;
class KanbanBoardToEntity {
    id;
    columns;
    constructor(id, columns) {
        this.id = id;
        this.columns = columns;
    }
}
exports.KanbanBoardToEntity = KanbanBoardToEntity;
//# sourceMappingURL=to.entity.js.map