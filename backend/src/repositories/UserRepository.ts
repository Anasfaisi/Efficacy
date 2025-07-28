import User,{IUser} from "../models/User.ts" // Adjust the path if your IUser type/interface is elsewhere

class UserRepository{
    async findByEmail(email:string):Promise<IUser|null>{
        return await User.findOne({email})
    }

    async create(userData:Partial<IUser>):Promise <IUser>{
        return await User.create(userData)
    }

    async updateRefreshToken(userId:string,refreshToken:string|null):Promise<void> {
        await User.updateOne({_id :userId},{refreshToken})
}

    async findByRefreshToken(refreshToken:string):Promise<IUser |null>{
       return await User.findOne({refreshToken})
    }
}
export default UserRepository