import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MoveLeft } from 'lucide-react';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
            <div className="text-center space-y-8 relative z-10 max-w-lg mx-auto">
                <div className="relative">
                    <h1 className="text-9xl font-bold gradient-text opacity-20 select-none blur-sm animate-pulse">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-8xl font-bold gradient-text animate-float">
                            404
                        </h1>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                        Page Not Found
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Oops! The page you are looking for has vanished into
                        thin air or never existed in the first place.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 hover:border-primary/50 text-slate-600 hover:text-primary transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                    >
                        <MoveLeft size={20} />
                        <span>Go Back</span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-6 py-3 rounded-full btn-gradient shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300"
                    >
                        <Home size={20} />
                        <span>Back Home</span>
                    </button>
                </div>
            </div>

            {/* Decorative background elements */}
            <div
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-float"
                style={{ animationDelay: '0s' }}
            />
            <div
                className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 animate-float"
                style={{ animationDelay: '2s' }}
            />
        </div>
    );
};

export default NotFound;
