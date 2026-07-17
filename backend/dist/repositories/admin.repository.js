"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const base_repository_1 = require("./base.repository");
const admin_model_1 = __importDefault(require("../models/admin.model"));
const role_types_1 = require("@/types/role.types");
class AdminRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(admin_model_1.default);
    }
    async findByEmail(email) {
        return this.model.findOne({ email });
    }
    async findById(id) {
        return super.findById(id);
    }
    async createUser(data) {
        return this.create(data);
    }
    async addRevenue(amount) {
        await this.model.findOneAndUpdate({ role: role_types_1.Role.Admin }, { $inc: { totalRevenue: amount } });
    }
}
exports.AdminRepository = AdminRepository;
//# sourceMappingURL=admin.repository.js.map