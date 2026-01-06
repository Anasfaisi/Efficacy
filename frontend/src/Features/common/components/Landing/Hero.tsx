import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Timer, CheckSquare, FileText } from 'lucide-react';

const Hero: React.FC = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
                                Build Focus. <br />
                                Plan Smarter. <br />
                                <span className="gradient-text">
                                    Learn with the Right Mentor.
                                </span>
                            </h1>
                            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto md:mx-0">
                                Efficacy is your all-in-one productivity and
                                mentorship platform designed to help students
                                and self-learners master their time and reach
                                their goals.
                            </p>

                            <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
                                <Link
                                    to="/register"
                                    className="btn-gradient px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    Get Started Free
                                </Link>
                                <Link
                                    to="/mentor/register"
                                    className="px-8 py-4 border-2 border-slate-200 rounded-2xl font-bold text-lg text-slate-700 hover:bg-slate-50 hover:border-primary/50 transition-all"
                                >
                                    Become a Mentor
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative z-10"
                        >
                            <img
                                src="/mascot.png"
                                alt="Panda Mentor"
                                className="w-[250px] md:w-[400px] mx-auto drop-shadow-2xl animate-float"
                            />
                        </motion.div>

                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="absolute -top-4 -left-4 md:-left-12 glass p-4 rounded-2xl shadow-soft flex items-center gap-3 z-20"
                        >
                            <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center text-success">
                                <CheckSquare size={24} />
                            </div>
                            <div>
                                <p className="text-base font-bold text-slate-800">
                                    Tasks Completed
                                </p>
                                <p className="text-xs text-slate-500">
                                    12 today • +20%
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.5,
                            }}
                            className="absolute top-1/2 -right-4 md:-right-8 glass p-5 rounded-3xl shadow-soft flex items-center gap-4 z-20"
                        >
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                                <Timer size={24} />
                            </div>
                            <div>
                                <p className="text-base font-bold text-slate-800">
                                    Deep Work
                                </p>
                                <p className="text-xs text-slate-500">
                                    2h 45m session
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 1,
                            }}
                            className="absolute -bottom-8 left-1/4 glass p-5 rounded-3xl shadow-soft flex items-center gap-4 z-20"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <FileText size={24} />
                            </div>
                            <div>
                                <p className="text-base font-bold text-slate-800">
                                    New Notes
                                </p>
                                <p className="text-xs text-slate-500">
                                    Physics Module 3
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
