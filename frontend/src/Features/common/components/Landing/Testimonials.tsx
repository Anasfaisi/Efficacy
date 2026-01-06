import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
    {
        name: 'Alex Johnson',
        role: 'Computer Science Student',
        avatar: 'https://i.pravatar.cc/150?u=alex',
        content:
            'Efficacy has completely transformed how I study. The Pomodoro timer and task management combined with mentor support is a game-changer.',
        rating: 5,
    },
    {
        name: 'Sarah Chen',
        role: 'Self-taught Developer',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        content:
            'I found an amazing mentor through Efficacy who helped me land my first job. The platform is so intuitive and beautiful.',
        rating: 5,
    },
    {
        name: 'Michael Smith',
        role: 'Medical Student',
        avatar: 'https://i.pravatar.cc/150?u=michael',
        content:
            "The focus music and notes feature help me stay productive during long 12-hour study sessions. I couldn't imagine studying without it.",
        rating: 4,
    },
];

const Testimonials: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const next = () =>
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () =>
        setActiveIndex(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length,
        );

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section
            id="testimonials"
            className="py-24 bg-slate-50/50 overflow-hidden"
        >
            <div className="container mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-slate-900"
                    >
                        What Our Students{' '}
                        <span className="gradient-text">Say</span>
                    </motion.h2>
                </div>

                <div className="max-w-4xl mx-auto relative px-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.9, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: -50 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl shadow-primary/5 border border-slate-100 flex flex-col items-center text-center space-y-8"
                        >
                            <div className="relative">
                                <img
                                    src={testimonials[activeIndex].avatar}
                                    alt={testimonials[activeIndex].name}
                                    className="w-24 h-24 rounded-full border-4 border-primary/20 p-1"
                                />
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                                    <Quote size={20} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-center gap-1 text-warning">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            fill={
                                                i <
                                                testimonials[activeIndex].rating
                                                    ? 'currentColor'
                                                    : 'none'
                                            }
                                        />
                                    ))}
                                </div>
                                <p className="text-xl md:text-2xl text-slate-700 italic leading-relaxed font-medium">
                                    "{testimonials[activeIndex].content}"
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xl font-bold text-slate-900">
                                    {testimonials[activeIndex].name}
                                </h4>
                                <p className="text-primary font-bold">
                                    {testimonials[activeIndex].role}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-3 mt-12">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    i === activeIndex
                                        ? 'bg-primary w-8'
                                        : 'bg-slate-200 hover:bg-slate-300'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary hover:shadow-lg transition-all active:scale-90 bg-white shadow-sm z-20"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary hover:shadow-lg transition-all active:scale-90 bg-white shadow-sm z-20"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
