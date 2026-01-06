import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Don't show breadcrumbs on home
    if (pathnames.length === 0) {
        return null;
    }

    return (
        <nav aria-label="breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                    <Link
                        to="/"
                        className="flex items-center hover:text-[#7F00FF] transition-colors"
                    >
                        <Home size={16} />
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    return (
                        <li key={to} className="flex items-center">
                            <ChevronRight
                                size={16}
                                className="mx-2 text-gray-400"
                            />
                            {isLast ? (
                                <span className="font-medium text-gray-900 capitalize">
                                    {value.replace(/-/g, ' ')}
                                </span>
                            ) : (
                                <Link
                                    to={to}
                                    className="hover:text-[#7F00FF] transition-colors capitalize"
                                >
                                    {value.replace(/-/g, ' ')}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
