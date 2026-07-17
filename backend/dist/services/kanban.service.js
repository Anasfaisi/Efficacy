"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanService = void 0;
const response_dto_1 = require("@/dto/response.dto");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const inversify_1 = require("inversify");
const response_messages_types_1 = require("@/types/response-messages.types");
let KanbanService = class KanbanService {
    _kanbanRepository;
    constructor(_kanbanRepository) {
        this._kanbanRepository = _kanbanRepository;
    }
    async getKanbanBoard(dto) {
        const kanbanBoard = await this._kanbanRepository.findKanbanBoardByUserId(dto.id);
        return new response_dto_1.KanbanBoardResponseDto(kanbanBoard.columns);
    }
    async addkanbanTask(dto) {
        const board = await this._kanbanRepository.findKanbanBoardByUserId(dto.id);
        const column = board?.columns.find((col) => col.columnId == dto.columnId);
        column?.tasks.push(dto.task);
        board.id = dto.id;
        const updatedBoard = await this._kanbanRepository.saveKanbanBoard(board);
        return new response_dto_1.KanbanBoardResponseDto(updatedBoard.columns);
    }
    async updateKanbanTask(dto) {
        const board = await this._kanbanRepository.findKanbanBoardByUserId(dto.id);
        const column = board.columns.find((c) => c.columnId === dto.columnId);
        if (!column)
            throw new Error(response_messages_types_1.ErrorMessages.InvalidColumn);
        const task = column.tasks.find((t) => t.taskId === dto.taskId);
        if (!task)
            throw new Error(response_messages_types_1.ErrorMessages.TaskNotFound);
        Object.assign(task, dto.data);
        const saved = await this._kanbanRepository.saveKanbanBoard(board);
        return new response_dto_1.KanbanBoardResponseDto(saved.columns);
    }
    async deleteKanbanTask(dto) {
        const board = await this._kanbanRepository.findKanbanBoardByUserId(dto.id);
        if (!board)
            throw new Error(response_messages_types_1.ErrorMessages.NoBoard);
        const column = board.columns.find((c) => c.columnId === dto.columnId);
        if (!column)
            throw new Error(response_messages_types_1.ErrorMessages.InvalidColumn);
        const taskIndex = column.tasks.findIndex((t) => t.taskId === dto.taskId);
        if (taskIndex === -1)
            throw new Error(response_messages_types_1.ErrorMessages.TaskNotFound);
        column.tasks.splice(taskIndex, 1);
        const updated = await this._kanbanRepository.saveKanbanBoard(board);
        return new response_dto_1.KanbanBoardResponseDto(updated.columns);
    }
    async reorderKanbanTask(dto) {
        const board = await this._kanbanRepository.findKanbanBoardByUserId(dto.id);
        const sourceCol = board.columns.find((c) => c.columnId === dto.sourceColumnId);
        const destCol = board.columns.find((c) => c.columnId === dto.destColumnId);
        if (!sourceCol || !destCol)
            throw new Error(response_messages_types_1.ErrorMessages.InvalidColumn);
        const [task] = sourceCol.tasks.splice(dto.sourceTaskIndex, 1);
        destCol.tasks.splice(dto.destTaskIndex, 0, task);
        const updated = await this._kanbanRepository.saveKanbanBoard(board);
        console.log(updated, '===========');
        return new response_dto_1.KanbanBoardResponseDto(updated.columns);
    }
};
exports.KanbanService = KanbanService;
exports.KanbanService = KanbanService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.KanbanRepository)),
    __metadata("design:paramtypes", [Object])
], KanbanService);
//# sourceMappingURL=kanban.service.js.map