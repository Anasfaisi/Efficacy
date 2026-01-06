import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Focus, Edit3, HeartHandshake } from 'lucide-react';

const steps = [
    {
        icon: <Calendar className="w-8 h-8" />,
        title: 'Plan',
        description:
            'Organize your schedule, tasks, and deadlines in one place.',
        color: 'from-blue-400 to-primary',
    },
    {
        icon: <Focus className="w-8 h-8" />,
        title: 'Focus',
        description:
            'Stay in the zone with our customizable Pomodoro timer and focus music.',
        color: 'from-primary to-purple-500',
    },
    {
        icon: <Edit3 className="w-8 h-8" />,
        title: 'Capture',
        description:
            'Take structured notes and organize them for easy retrieval later.',
        color: 'from-purple-500 to-accent',
    },
    {
        icon: <HeartHandshake className="w-8 h-8" />,
        title: 'Get Guidance',
        description:
            'Connect with expert mentors to overcome hurdles and accelerate learning.',
        color: 'from-accent to-pink-500',
    },
];

const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="py-24 bg-slate-100">
            <div className="container mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-slate-900"
                    >
                        How It <span className="gradient-text">Works</span>
                    </motion.h2>
                    <p className="mt-4 text-slate-600 max-w-2xl mx-auto italic">
                        Your roadmap to productivity and excellence.
                    </p>
                </div>

                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-200 -translate-y-8 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ scale: 1.05 }}
                                className="relative z-10 group"
                            >
                                <div className="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 h-full flex flex-col items-center text-center transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/5">
                                    <div
                                        className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        {step.icon}
                                    </div>
                                    <div className="absolute top-4 right-4 text-4xl font-black text-slate-50 group-hover:text-primary/10 transition-colors">
                                        0{index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
