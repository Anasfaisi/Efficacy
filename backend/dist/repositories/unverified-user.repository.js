"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnverifiedUserRepository = void 0;
const unverified_user_model_1 = __importDefault(require("@/models/unverified-user.model"));
class UnverifiedUserRepository {
    async findByEmail(email) {
        return unverified_user_model_1.default.findOne({ email });
    }
    async create(data) {
        return unverified_user_model_1.default.create(data);
    }
    async deleteByEmail(email) {
        return unverified_user_model_1.default.deleteOne({ email });
    }
    async updateByEmail(email, updateData) {
        return unverified_user_model_1.default.findOneAndUpdate({ email }, { $set: updateData }, { new: true });
    }
}
exports.UnverifiedUserRepository = UnverifiedUserRepository;
//# sourceMappingURL=unverified-user.repository.js.map