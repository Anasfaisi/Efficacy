import React, { useEffect } from 'react';
import Navbar from '../components/Landing/Navbar';
import Hero from '../components/Landing/Hero';
import HowItWorks from '../components/Landing/HowItWorks';
import FeaturesGrid from '../components/Landing/FeaturesGrid';
import MentorSection from '../components/Landing/MentorSection';
import Testimonials from '../components/Landing/Testimonials';
import CTA from '../components/Landing/CTA';
import Footer from '../components/Landing/Footer';

const LandingPage: React.FC = () => {
    useEffect(() => {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener(
                'click',
                function (this: HTMLAnchorElement, e: Event) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId) {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                            });
                        }
                    }
                },
            );
        });
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <Hero />
                <HowItWorks />
                <FeaturesGrid />
                <MentorSection />
                <Testimonials />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
