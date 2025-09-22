import "@/config/env.config";

import { injectable, inject } from "inversify";
import Stripe from "stripe";
import { TYPES } from "@/types/inversify-key.types";
import { IPaymentService } from "./Interfaces/IPayment.service";
import { RequestPaymentDto } from "@/Dto/requestDto";
import { ResponsePaymentDto } from "@/Dto/responseDto";
import { IUserRepository } from "@/repositories/interfaces/IUser.repository";

@injectable()
export class PaymentService implements IPaymentService {
  private _stripe: Stripe;
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository
  ) {
    this._stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });
  }

  async createCheckoutSession(
    dto: RequestPaymentDto
  ): Promise<ResponsePaymentDto> {
    const session = await this._stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: dto.priceId, quantity: 1 }],
      success_url: dto.successUrl,
      cancel_url: dto.cancelUrl,
      customer_email: (await this._userRepository.findById(dto.userId))?.email,
    });
    return new ResponsePaymentDto(session.id, session.url!);
  }

  async verifyCheckoutSession(sessionId: string): Promise<ResponsePaymentDto> {
    const session = await this._stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      throw new Error("checkout session not valid or not paid");
    }
    return new ResponsePaymentDto(session.id, session.url!);
  }

  async handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event;
    console.log("reaching in webhook service layer");

    event = this._stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (!event) {
      throw new Error("webhook signature verification failed");
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      const customerEmail = session.customer_email;

      const subscription =await this._stripe.subscriptions.retrieve(subscriptionId);

  
         const startDate = new Date();
const endDate = new Date(startDate);
endDate.setFullYear(endDate.getFullYear() + 1);
      await this._userRepository.updateSubscriptionByEmail(customerEmail!, {
        id: subscriptionId,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        current_period_end: endDate
      });
    }
  }
}
