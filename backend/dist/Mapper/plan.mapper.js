"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planMapper = void 0;
class planMapper {
    static ToResponse(data) {
        return {
            _id: data._id,
            name: data.name,
            price: data.price,
            billingCycleDays: data.billingCycleDays,
            limitations: data.limitations,
            features: data.features,
            isActive: data.isActive,
            mentorType: data.mentorType,
        };
    }
}
exports.planMapper = planMapper;
//# sourceMappingURL=plan.mapper.js.map