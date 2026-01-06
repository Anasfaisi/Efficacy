import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Award, Zap, Users } from 'lucide-react';

const MentorSection: React.FC = () => {
    return (
        <section
            id="mentors"
            className="py-24 bg-gradient-to-br from-primary to-accent relative overflow-hidden bg-blue-900"
        >
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-white text-center lg:text-left">
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-extrabold leading-tight"
                        >
                            Share Knowledge. <br />
                            Earn. Make Impact.
                        </motion.h2>
                        <p className="mt-6 text-white/80 text-lg md:text-xl max-w-xl">
                            Join our community of elite mentors. Help the next
                            generation of learners while building your personal
                            brand and earning extra income.
                        </p>

                        <div className="mt-10 space-y-4">
                            {[
                                'Flexible schedule - you choose when you are available',
                                'Set your own rates for sessions and mentorship',
                                'Access to a growing pool of dedicated students',
                                'Easy-to-use platform for calls, chats, and feedback',
                            ].map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-3 justify-center lg:justify-start"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                                    <span className="text-white/90 font-medium">
                                        {benefit}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="mt-12"
                        >
                            <Link
                                to="/mentor/register"
                                className="inline-block px-10 py-4 bg-white text-black font-bold text-lg rounded-2xl shadow-xl hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all"
                            >
                                Apply as a Mentor
                            </Link>
                        </motion.div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                        {[
                            {
                                icon: <Award className="w-8 h-8" />,
                                title: 'Certified Experts',
                                desc: 'Verified skills and background.',
                            },
                            {
                                icon: <Zap className="w-8 h-8" />,
                                title: 'Direct Impact',
                                desc: 'Help students achieve goals.',
                            },
                            {
                                icon: <Users className="w-8 h-8" />,
                                title: 'Large Community',
                                desc: 'Millions of monthly active users.',
                            },
                            {
                                icon: <CheckCircle2 className="w-8 h-8" />,
                                title: 'Easy Setup',
                                desc: 'Get started in minutes.',
                            },
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl"
                            >
                                <div className="w-16 h-16 mb-6 rounded-2xl bg-white text-primary flex items-center justify-center shadow-lg">
                                    {card.icon}
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">
                                    {card.title}
                                </h4>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MentorSection;
