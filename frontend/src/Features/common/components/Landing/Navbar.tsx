import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Mentors', href: '#mentors' },
        { name: 'Testimonials', href: '#testimonials' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'glass bg-slate-100 py-3' : 'bg-transparent py-5'
            }`}
        >
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <img
                        src="/mascot.png"
                        alt="Efficacy Logo"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-2xl font-bold gradient-text">
                        Efficacy
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="hover:text-primary transition-colors cursor-pointer"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-4 border-r border-slate-200 pr-4">
                        <Link
                            to="/login"
                            className="text-slate-600 font-semibold hover:text-primary transition-colors text-sm"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="btn-gradient px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
