import type { UserBadge } from "@/types/gamification";
import api from "../axiosConfig"
import { UserBadgeRoutes } from "../constant.routes";

export const userBadgeApi ={
    getUserBadges : async ()=>{
        const response = await api.get(UserBadgeRoutes.GET_USER_BADGES)
        console.log(response ,"it is calling")
        return response.data
    }
}