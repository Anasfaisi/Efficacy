import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin, Github, Heart } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white text-slate-600 border-t border-slate-100 py-16">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                src="/mascot.png"
                                alt="Efficacy Logo"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                Efficacy
                            </span>
                        </Link>
                        <p className="text-slate-500 leading-relaxed">
                            The ultimate productivity and mentorship platform
                            for students who want to build consistency and
                            achieve their dreams.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Linkedin, Github].map(
                                (Icon, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                                    >
                                        <Icon size={20} />
                                    </a>
                                ),
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-slate-900 font-bold text-lg mb-6">
                            Platform
                        </h4>
                        <ul className="space-y-4">
                            {[
                                'Features',
                                'Pricing',
                                'How it Works',
                                'Mentors',
                                'Community',
                            ].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-slate-900 font-bold text-lg mb-6">
                            Company
                        </h4>
                        <ul className="space-y-4">
                            {[
                                'About Us',
                                'Contact',
                                'Privacy Policy',
                                'Terms of Service',
                                'Careers',
                            ].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-slate-900 font-bold text-lg mb-6">
                            Newsletter
                        </h4>
                        <p className="text-slate-500 mb-6 font-medium">
                            Get the latest productivity tips and updates.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex-1 focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                            <button className="bg-primary text-white p-3 rounded-xl hover:opacity-90 transition-opacity">
                                <Linkedin size={20} className="rotate-0" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500">
                    <p>© 2026 Efficacy Platform. All rights reserved.</p>
                    <p className="flex items-center gap-2">
                        Built with{' '}
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />{' '}
                        for lifelong learners.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
