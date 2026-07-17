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
exports.BaseRepository = void 0;
const mongoose_1 = require("mongoose");
const inversify_1 = require("inversify");
let BaseRepository = class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findOne(query) {
        return this.model.findOne(query).exec();
    }
    async create(data) {
        const document = new this.model(data);
        return document.save();
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async updateOne(id, data) {
        await this.model.updateOne({ _id: id }, data).exec();
    }
    async updateMany(query, data) {
        await this.model.updateMany(query, data).exec();
    }
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async deleteOne(id) {
        await this.model.deleteOne({ _id: id }).exec();
    }
    async find(query) {
        return this.model.find(query).exec();
    }
    async findWithPagination(query, page, limit) {
        const skip = (page - 1) * limit;
        const data = await this.model
            .find(query)
            .skip(skip)
            .limit(limit)
            .exec();
        const total = await this.model.countDocuments(query).exec();
        return { data, total };
    }
};
exports.BaseRepository = BaseRepository;
exports.BaseRepository = BaseRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [mongoose_1.Model])
], BaseRepository);
//# sourceMappingURL=base.repository.js.map