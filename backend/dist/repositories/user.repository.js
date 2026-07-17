"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_repository_1 = require("./base.repository");
const user_model_1 = __importDefault(require("../models/user.model"));
const role_types_1 = require("@/types/role.types");
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(user_model_1.default);
    }
    async findByEmail(email) {
        return await this.findOne({ email });
    }
    async createUser(data) {
        return this.create(data);
    }
    async findById(id) {
        return await user_model_1.default.findById(id);
    }
    async updatePasswordById(userId, newPassword) {
        await user_model_1.default.updateOne({ _id: userId }, { $set: { password: newPassword } });
    }
    async updateSubscriptionByEmail(email, subscriptionData) {
        return user_model_1.default.findOneAndUpdate({ email }, { $set: { subscription: subscriptionData } }, { new: true });
    }
    async updateSubscriptionById(userId, subscriptionData) {
        return user_model_1.default.findByIdAndUpdate(userId, { $set: { subscription: subscriptionData } }, { new: true });
    }
    async findByStripeCustomerId(customerId) {
        return user_model_1.default.findOne({ stripeCustomerId: customerId }).exec();
    }
    async updateUser(id, updatedData) {
        const updatedUser = await user_model_1.default.findByIdAndUpdate(id, { ...updatedData }, { new: true, runValidators: true }).exec();
        return updatedUser;
    }
    async updateProfilePic(id, fileUrl) {
        const updatedUser = await user_model_1.default.findByIdAndUpdate(id, { profilePic: fileUrl }, { new: true, runValidators: true }).exec();
        return updatedUser;
    }
    async getAllUsers(page, limit, search) {
        const skip = (page - 1) * limit;
        const query = { role: role_types_1.Role.User };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const [users, totalCount] = await Promise.all([
            user_model_1.default.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            user_model_1.default.countDocuments(query),
        ]);
        return { users, totalCount };
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map