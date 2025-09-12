import {Router } from "express"
import { PaymentController } from "@/controllers/payment.controller"

export default function paymentRoutes (PaymentController:PaymentController){
    const router = Router()

    router.post("/checkout",PaymentController.createCheckoutSession.bind(PaymentController))
    router.get('/verify/:sessionId',PaymentController.verifyCheckoutSession.bind(PaymentController))
    router.post("/webhook",PaymentController.handleWebhook.bind(PaymentController))
    

    return router
}