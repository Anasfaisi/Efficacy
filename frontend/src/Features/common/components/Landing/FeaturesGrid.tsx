import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckSquare,
    Timer,
    Calendar,
    FileText,
    Headphones,
    GraduationCap,
} from 'lucide-react';

const features = [
    {
        icon: <CheckSquare className="w-6 h-6" />,
        title: 'Task Management',
        description:
            'Organize your daily to-dos, set priorities, and track progress with ease.',
        color: 'bg-blue-500',
    },
    {
        icon: <Timer className="w-6 h-6" />,
        title: 'Pomodoro Timer',
        description:
            'Boost focus with customizable sessions, break reminders, and daily goals.',
        color: 'bg-red-500',
    },
    {
        icon: <Calendar className="w-6 h-6" />,
        title: 'Smart Planner',
        description:
            'Sync your calendar and plan your study or work schedule effectively.',
        color: 'bg-orange-500',
    },
    {
        icon: <FileText className="w-6 h-6" />,
        title: 'Digital Notes',
        description:
            'Rich-text note-taking with markdown support and organized folders.',
        color: 'bg-emerald-500',
    },
    {
        icon: <Headphones className="w-6 h-6" />,
        title: 'Focus Music',
        description:
            'Curated Lo-Fi and ambient playlists to keep you in the flow state.',
        color: 'bg-indigo-500',
    },
    {
        icon: <GraduationCap className="w-6 h-6" />,
        title: 'Mentor Support',
        description:
            'Get personalized guidance and answers from verified experts.',
        color: 'bg-purple-500',
    },
];

const FeaturesGrid: React.FC = () => {
    return (
        <section
            id="features"
            className="py-24 bg-white relative overflow-hidden"
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wider uppercase"
                    >
                        Features
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-slate-900"
                    >
                        Everything You Need to{' '}
                        <span className="gradient-text">Succeed</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
                        >
                            <div
                                className={`w-14 h-14 mb-6 rounded-2xl ${feature.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                            >
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover Reveal Gradient */}
                            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
