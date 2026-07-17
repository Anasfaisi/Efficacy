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
exports.PomodoroController = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
let PomodoroController = class PomodoroController {
    _pomodoroService;
    constructor(_pomodoroService) {
        this._pomodoroService = _pomodoroService;
    }
    logSession = async (req, res) => {
        const userId = req.currentUser.id;
        const { duration, type } = req.body;
        if (!duration || !type) {
            res.status(400 /* code.BAD_REQUEST */).json({
                message: response_messages_types_1.ErrorMessages.PomodoroRequiredFields,
            });
            return;
        }
        const updatedLog = await this._pomodoroService.logSession(userId, {
            duration,
            type,
        });
        res.status(200 /* code.OK */).json(updatedLog);
    };
    getDailyStats = async (req, res) => {
        const userId = req.currentUser.id;
        const { date } = req.query;
        if (!date || typeof date !== 'string') {
            res.status(400 /* code.BAD_REQUEST */).json({
                message: response_messages_types_1.ErrorMessages.DateRequired,
            });
            return;
        }
        const stats = await this._pomodoroService.getStats(userId, date);
        res.status(200 /* code.OK */).json(stats || {
            date,
            totalFocusTime: 0,
            totalCycles: 0,
            sessions: [],
        });
    };
};
exports.PomodoroController = PomodoroController;
exports.PomodoroController = PomodoroController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.PomodoroService)),
    __metadata("design:paramtypes", [Object])
], PomodoroController);
//# sourceMappingURL=pomodoro.controller.js.map