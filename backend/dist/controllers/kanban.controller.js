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
exports.KanbanController = void 0;
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
const inversify_1 = require("inversify");
let KanbanController = class KanbanController {
    _kanbanService;
    constructor(_kanbanService) {
        this._kanbanService = _kanbanService;
    }
    async getKanbanBoard(req, res) {
        if (!req.body.id) {
            throw new Error(response_messages_types_1.ErrorMessages.NoBody);
        }
        const kanbanBoard = await this._kanbanService.getKanbanBoard(req.body);
        if (!kanbanBoard) {
            res.status(204 /* HttpStatus.NO_CONTENT */).json({
                message: response_messages_types_1.ErrorMessages.NoBoard,
            });
            return;
        }
        res.status(200 /* HttpStatus.OK */).json({
            message: response_messages_types_1.SuccessMessages.ResourceDelivered,
            kanbanBoard,
        });
    }
    async addKanbanTask(req, res) {
        if (!req.body)
            throw new Error(response_messages_types_1.ErrorMessages.NoBody);
        const kanbanBoard = await this._kanbanService.addkanbanTask(req.body);
        if (!kanbanBoard) {
            res.status(204 /* HttpStatus.NO_CONTENT */).json({
                message: response_messages_types_1.ErrorMessages.NotAdded,
            });
            return;
        }
        res.status(200 /* HttpStatus.OK */).json({
            message: response_messages_types_1.SuccessMessages.ResourceDelivered,
            kanbanBoard,
        });
    }
    async updateKanbanTask(req, res) {
        const kanbanBoard = await this._kanbanService.updateKanbanTask(req.body);
        if (!kanbanBoard) {
            res.status(204 /* HttpStatus.NO_CONTENT */).json({
                message: response_messages_types_1.ErrorMessages.NotAdded,
            });
            return;
        }
        res.status(200 /* HttpStatus.OK */).json({
            message: response_messages_types_1.SuccessMessages.ResourceDelivered,
            kanbanBoard,
        });
    }
    async deleteKanbanTask(req, res) {
        const request = req.body;
        request.id = req.params.id;
        const kanbanBoard = this._kanbanService.deleteKanbanTask(request);
        if (!kanbanBoard) {
            res.status(204 /* HttpStatus.NO_CONTENT */).json({
                message: response_messages_types_1.ErrorMessages.NotAdded,
            });
            return;
        }
    }
    async reorderKanbanTask(req, res) {
        const kanbanBoard = await this._kanbanService.reorderKanbanTask(req.body);
        if (!kanbanBoard) {
            res.status(204 /* HttpStatus.NO_CONTENT */).json({
                message: response_messages_types_1.ErrorMessages.NotAdded,
            });
            return;
        }
        res.status(200 /* HttpStatus.OK */).json({
            message: response_messages_types_1.SuccessMessages.ResourceDelivered,
            kanbanBoard,
        });
    }
};
exports.KanbanController = KanbanController;
exports.KanbanController = KanbanController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.KanbanService)),
    __metadata("design:paramtypes", [Object])
], KanbanController);
//# sourceMappingURL=kanban.controller.js.map