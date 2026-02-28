import React from 'react';

type Subscription = {
    id?: string;
    status?: string;
    priceId?: string;
    current_period_end?: Date;
};

type Props = {
    subscription: Subscription;
};

const plans = [
    {
        id: 'price_1SAOE4B0Ekw2NoJyBHjx4edX',
        name: 'Basic',
        price: '₹200',
        description: '2 sessions per week',
        duration: '1 week',
        sessions: 2,
        features: ['1 hour per session', 'Mentorship included'],
    },
    {
        id: 'price_1S4pOZB0Ekw2NoJy6Eq6QL7F',
        name: 'Pro',
        price: '₹500',
        description: '5 sessions in 2 weeks',
        duration: '2 weeks',
        sessions: 5,
        features: [
            '1 hour per session',
            'Mentorship included',
            'Progress tracking',
        ],
        popular: true,
    },
    {
        id: 'price_1SAOAqB0Ekw2NoJysDIkJTrs',
        name: 'Premium',
        price: '₹900',
        description: '10 sessions in 1 month',
        duration: '1 month',
        sessions: 10,
        features: [
            '1 hour per session',
            'Mentorship included',
            'Progress tracking',
            'Priority support',
        ],
    },
];

const SubscriptionInfo: React.FC<Props> = ({ subscription }) => {
    const plan = plans.find((p) => p.id === subscription.priceId);

    if (!plan) return <p>Plan not found</p>;

    const endDate = subscription.current_period_end
        ? new Date(subscription.current_period_end)
        : new Date();

    const today = new Date();
    const daysLeft = Math.max(
        Math.ceil(
            (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        ),
        0
    );

    return (
        <div className="bg-purple-50 p-6 rounded-lg shadow-md mb-6 w-80">
            <h3 className="text-2xl font-bold mb-4">{plan.name} Plan</h3>

            <table className="w-full text-left border-collapse">
                <tbody>
                    <tr className="border-b">
                        <td className="py-2 font-semibold w-1/3">Price</td>
                        <td className="py-2">{plan.price}</td>
                    </tr>
                    <tr className="border-b">
                        <td className="py-2 font-semibold">Duration</td>
                        <td className="py-2">{plan.duration}</td>
                    </tr>
                    <tr className="border-b">
                        <td className="py-2 font-semibold">Sessions</td>
                        <td className="py-2">{plan.sessions}</td>
                    </tr>
                    <tr className="border-b">
                        <td className="py-2 font-semibold">Days Left</td>
                        <td className="py-2">{daysLeft}</td>
                    </tr>
                    <tr>
                        <td className="py-2 font-semibold">Status</td>
                        <td className="py-2">{subscription.status}</td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-4">
                <p className="font-semibold mb-1">Features:</p>
                <ul className="list-disc list-inside text-gray-700">
                    {plan.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                    ))}
                </ul>
            </div>

            {plan.popular && (
                <span className="inline-block mt-3 px-3 py-1 text-xs font-bold text-white bg-purple-600 rounded">
                    Popular
                </span>
            )}
        </div>
    );
};

export default SubscriptionInfo;
