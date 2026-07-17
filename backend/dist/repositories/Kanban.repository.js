"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanRepository = void 0;
const base_repository_1 = require("./base.repository");
const kanban_mapper_1 = require("@/Mapper/kanban.mapper");
const kanban_board_model_1 = __importDefault(require("@/models/kanban-board.model"));
class KanbanRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(kanban_board_model_1.default);
    }
    async findKanbanBoardByUserId(id) {
        const kanbanBoard = await this.model.findOne({ userId: id });
        if (!kanbanBoard) {
            return kanban_mapper_1.KanbanMapper.emptyBoard(id);
        }
        return kanban_mapper_1.KanbanMapper.toDomain(kanbanBoard);
    }
    async saveKanbanBoard(board) {
        const persistence = kanban_mapper_1.KanbanMapper.toPersistence(board, board.id);
        const updatedBoard = await this.model.findOneAndUpdate({ userId: board.id }, persistence, { upsert: true, new: true });
        return kanban_mapper_1.KanbanMapper.toDomain(updatedBoard);
    }
}
exports.KanbanRepository = KanbanRepository;
//# sourceMappingURL=Kanban.repository.js.map