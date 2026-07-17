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
exports.NoteController = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("../config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
let NoteController = class NoteController {
    _noteService;
    constructor(_noteService) {
        this._noteService = _noteService;
    }
    async createNote(req, res) {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401 /* HttpStatus.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.Unauthorized,
            });
            return;
        }
        const { title, content, isSticky } = req.body;
        const note = await this._noteService.createNote({
            userId,
            title: title || 'Untitled Note',
            content: content || '',
            isSticky: isSticky || false,
        });
        res.status(201 /* HttpStatus.CREATED */).json(note);
    }
    async getNotes(req, res) {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401 /* HttpStatus.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.Unauthorized,
            });
            return;
        }
        const notes = await this._noteService.getUserNotes(userId);
        res.status(200 /* HttpStatus.OK */).json(notes);
    }
    async updateNote(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        const updatedNote = await this._noteService.updateNote(id, updateData);
        if (!updatedNote) {
            res.status(404 /* HttpStatus.NOT_FOUND */).json({
                message: response_messages_types_1.ErrorMessages.NoteNotFound,
            });
            return;
        }
        res.status(200 /* HttpStatus.OK */).json(updatedNote);
    }
    async deleteNote(req, res) {
        const { id } = req.params;
        await this._noteService.deleteNote(id);
        res.status(200 /* HttpStatus.OK */).json({
            message: response_messages_types_1.SuccessMessages.NoteDeleted,
        });
    }
};
exports.NoteController = NoteController;
exports.NoteController = NoteController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.NoteService)),
    __metadata("design:paramtypes", [Object])
], NoteController);
//# sourceMappingURL=note.controller.js.map