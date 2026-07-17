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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomodoroRepository = void 0;
const pomodoro_log_model_1 = require("../models/pomodoro-log.model");
const base_repository_1 = require("./base.repository");
const inversify_1 = require("inversify");
let PomodoroRepository = class PomodoroRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(pomodoro_log_model_1.PomodoroLogModel);
    }
    async findByDate(userId, date) {
        return this.model.findOne({ userId, date }).exec();
    }
    async addSession(userId, date, sessionData) {
        const { duration, type, startTime, endTime } = sessionData;
        const update = {
            $push: { sessions: { startTime, endTime, duration, type } },
        };
        if (type === 'pomodoro') {
            update.$inc = {
                totalFocusTime: duration,
                totalCycles: 1,
            };
        }
        return this.model
            .findOneAndUpdate({ userId, date }, update, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        })
            .exec();
    }
};
exports.PomodoroRepository = PomodoroRepository;
exports.PomodoroRepository = PomodoroRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], PomodoroRepository);
//# sourceMappingURL=pomodoro.repository.js.map