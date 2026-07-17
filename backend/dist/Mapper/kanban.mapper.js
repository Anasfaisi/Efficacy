"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanMapper = void 0;
const from_entity_1 = require("@/entity/from.entity");
const to_entity_1 = require("@/entity/to.entity");
const column_enum_types_1 = require("@/types/column-enum.types");
const mongoose_1 = require("mongoose");
class KanbanMapper {
    static toDomain(board) {
        const columns = board.columns.map((col) => {
            const tasks = col.tasks.map((task) => new to_entity_1.kanbanTaskToEntity(task.taskId, task.title, task.description ?? '', task.dueDate ?? '', task.approxTimeToFinish ?? ''));
            return new to_entity_1.kanbanColumnToEntity(col.columnId, col.title, tasks);
        });
        return new to_entity_1.KanbanBoardToEntity(board.userId.toString(), columns);
    }
    static toPersistence(domainBoard, userId) {
        return {
            userId: new mongoose_1.Types.ObjectId(userId),
            columns: domainBoard.columns.map((col) => ({
                columnId: col.columnId,
                title: col.title,
                tasks: col.tasks.map((task) => ({
                    taskId: task.taskId,
                    title: task.title,
                    description: task.description,
                    dueDate: task.dueDate,
                    approxTimeToFinish: task.approxTimeToFinish,
                })),
            })),
        };
    }
    static emptyBoard(id) {
        const columns = [
            new from_entity_1.kanbanColumnFromEntity(column_enum_types_1.ColumnId.TODO, 'To Do', []),
            new from_entity_1.kanbanColumnFromEntity(column_enum_types_1.ColumnId.IN_PROGRESS, 'In Progress', []),
            new from_entity_1.kanbanColumnFromEntity(column_enum_types_1.ColumnId.DONE, 'Done', []),
        ];
        return new from_entity_1.KanbanBoardFromEntity(id, columns);
    }
}
exports.KanbanMapper = KanbanMapper;
//# sourceMappingURL=kanban.mapper.js.map