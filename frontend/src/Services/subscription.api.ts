import api from "./axiosConfig";
import { PlanRoutes } from "./constant.routes";

export const subscriptionApi = {
    getPlans: async () => {
        const res = await api.get(PlanRoutes.GET_ALL_PLANS,{params:{status:'active',page:1,limit:10}});
        return res.data;
    },
    // createCheckoutSession: async (planId: string) => {
    //     const res = await api.post(PlanRoutes.CREATE_CHECKOUT_SESSION, { planId });
    //     return res.data;
    // },
}