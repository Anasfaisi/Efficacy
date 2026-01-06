import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA: React.FC = () => {
    return (
        <section className="py-24  px-6 bg-purple-900! opactiy-95">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-r from-primary/95 to-accent/95 rounded-[40px] px-8 py-20 md:py-32 text-center text-white overflow-hidden shadow-2xl shadow-primary/20"
                >
                    {/* Background Pattern */}
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px',
                        }}
                    />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                    />

                    <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 font-bold mb-4">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                            <span>Join 10,000+ students today</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black leading-tight text-white">
                            Start Building Your <br />
                            <span className="text-yellow-300 underline decoration-wavy underline-offset-8">
                                Consistent
                            </span>{' '}
                            Journey Today
                        </h2>

                        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                            Stop procrastinating and start achieving. Get all
                            the tools you need to stay focused, organized, and
                            mentored.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/register"
                                    className="px-12 py-5 bg-white  font-black text-black text-xl rounded-2xl shadow-2xl hover:bg-slate-50 transition-all flex items-center gap-3 group"
                                >
                                    Get Started Free
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/login"
                                    className="px-12 py-5 border-2 border-white/30 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all"
                                >
                                    Existing User
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
