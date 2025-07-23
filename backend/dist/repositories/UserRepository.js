import User from "../models/User"; // Adjust the path if your IUser type/interface is elsewhere
class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ email });
    }
    async create(userData) {
        return await User.create(userData);
    }
    async updateRefreshToken(userId, refreshToken) {
        await User.updateOne({ _id: userId }, { refreshToken });
    }
    async findByRefreshToken(refreshToken) {
        return await User.findOne({ refreshToken });
    }
}
export default UserRepository;
