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
exports.NoteService = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
let NoteService = class NoteService {
    noteRepository;
    constructor(noteRepository) {
        this.noteRepository = noteRepository;
    }
    async createNote(data) {
        return this.noteRepository.create(data);
    }
    async getUserNotes(userId) {
        return this.noteRepository.findByUserId(userId);
    }
    async updateNote(id, updateData) {
        return this.noteRepository.update(id, updateData);
    }
    async deleteNote(id) {
        return this.noteRepository.deleteOne(id);
    }
    async getNoteById(id) {
        return this.noteRepository.findById(id);
    }
};
exports.NoteService = NoteService;
exports.NoteService = NoteService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.NoteRepository)),
    __metadata("design:paramtypes", [Object])
], NoteService);
//# sourceMappingURL=note.service.js.map