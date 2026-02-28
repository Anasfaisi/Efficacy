import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mentorApi } from '@/Services/mentor.api';
import type { Mentor } from '@/types/auth';
import Sidebar from '../../home/layouts/Sidebar';
import Navbar from '../../home/layouts/Navbar';
import Breadcrumbs from '@/Components/common/Breadcrumbs';
import {
    Star,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
} from 'lucide-react';
import MentorDetailsModal from '../components/MentorDetailsModal';

const MentorListingPage: React.FC = () => {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sort, setSort] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [debouncedMinPrice, setDebouncedMinPrice] = useState('');
    const [debouncedMaxPrice, setDebouncedMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

    const resetFilters = () => {
        setSearchTerm('');
        setSort('');
        setMinPrice('');
        setMaxPrice('');
        setPage(1);
        setDebouncedSearch('');
        setDebouncedMinPrice('');
        setDebouncedMaxPrice('');
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setDebouncedMinPrice(minPrice);
            setDebouncedMaxPrice(maxPrice);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, minPrice, maxPrice]);

    useEffect(() => {
        const fetchMentors = async () => {
            setLoading(true);
            try {
                const filters: any = {};
                if (debouncedMinPrice) filters.minPrice = debouncedMinPrice;
                if (debouncedMaxPrice) filters.maxPrice = debouncedMaxPrice;

                const data = await mentorApi.getApprovedMentors(
                    page,
                    3,
                    debouncedSearch,
                    sort,
                    filters
                );
                setMentors(data.mentors);
                setTotalPages(data.pages);
            } catch (error) {
                console.error('Failed to fetch mentors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, [page, debouncedSearch, sort, debouncedMinPrice, debouncedMaxPrice]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <header className="mb-8">
                            <Breadcrumbs />
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Mentor Pool
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Connect with industry experts and academic
                                leaders to accelerate your growth.
                            </p>

                            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="relative flex-1">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search by name, expertise, or role..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF]"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            setShowFilters(!showFilters)
                                        }
                                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-[#7F00FF]/10 border-[#7F00FF] text-[#7F00FF]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <Filter size={20} />
                                        <span className="hidden sm:inline">
                                            Filters
                                        </span>
                                    </button>

                                    <select
                                        value={sort}
                                        onChange={(e) =>
                                            setSort(e.target.value)
                                        }
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF] text-gray-600 bg-white"
                                    >
                                        <option value="">Sort by</option>
                                        <option value="rating_desc">
                                            Highest Rated
                                        </option>
                                        <option value="price_asc">
                                            Price: Low to High
                                        </option>
                                        <option value="price_desc">
                                            Price: High to Low
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Active filters display */}
                            {(searchTerm || sort || minPrice || maxPrice) && (
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        Active filters:
                                    </span>
                                    <button
                                        onClick={resetFilters}
                                        className="text-sm font-medium text-[#7F00FF] hover:text-[#6c00db] transition-colors"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            )}

                            {showFilters && (
                                <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <span className="text-sm font-medium text-gray-700">
                                            Price Range:
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    ₹
                                                </span>
                                                <input
                                                    type="number"
                                                    placeholder="Min"
                                                    min="1500"
                                                    max="2500"
                                                    value={minPrice}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target.value;
                                                        setMinPrice(val);
                                                    }}
                                                    className="w-24 pl-6 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7F00FF]/20"
                                                />
                                            </div>
                                            <span className="text-gray-400">
                                                -
                                            </span>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    ₹
                                                </span>
                                                <input
                                                    type="number"
                                                    placeholder="Max"
                                                    min="1500"
                                                    max="2500"
                                                    value={maxPrice}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target.value;
                                                        setMaxPrice(val);
                                                    }}
                                                    className="w-24 pl-6 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7F00FF]/20"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 w-full mt-2">
                                            Price range between ₹1500 - ₹2500
                                        </p>
                                    </div>
                                </div>
                            )}
                        </header>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F00FF]"></div>
                            </div>
                        ) : mentors.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="text-gray-400 mb-4">
                                    <ShieldCheck
                                        size={64}
                                        className="mx-auto opacity-20"
                                    />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900">
                                    No mentors available yet
                                </h3>
                                <p className="text-gray-500 mt-2">
                                    Check back soon for approved mentors.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {mentors.map((mentor) => (
                                    <div
                                        key={mentor.id || mentor._id}
                                        onClick={() =>
                                            navigate(
                                                `/mentors/${mentor.id || mentor._id}`
                                            )
                                        }
                                        className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                                    >
                                        <div className="h-32 bg-gradient-to-r from-[#7F00FF] to-[#E100FF] opacity-10 group-hover:opacity-20 transition-opacity relative">
                                            {mentor.reviewCount === 0 && (
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-[#7F00FF] uppercase tracking-widest shadow-sm">
                                                    ✨ New
                                                </div>
                                            )}
                                        </div>
                                        <div className="px-6 pb-6 -mt-16 relative">
                                            <div className="flex items-end justify-between mb-4">
                                                <img
                                                    src={
                                                        mentor.profilePic ||
                                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=7F00FF&color=fff`
                                                    }
                                                    alt={mentor.name}
                                                    className="w-24 h-24 rounded-2xl border-4 border-white object-cover bg-white shadow-lg group-hover:scale-105 transition-transform"
                                                />
                                                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                                    <Star
                                                        size={14}
                                                        className={`mr-1 ${mentor.reviewCount && mentor.reviewCount > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                    <span className="font-black text-gray-900 text-sm">
                                                        {mentor.reviewCount &&
                                                        mentor.reviewCount > 0
                                                            ? mentor.rating?.toFixed(
                                                                  1
                                                              )
                                                            : 'No reviews'}
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#7F00FF] transition-colors line-clamp-1">
                                                {mentor.name}
                                            </h3>
                                            <p className="text-[#7F00FF] font-bold text-xs mb-3 uppercase tracking-wider">
                                                {mentor.currentRole ||
                                                    mentor.domain ||
                                                    'Expert'}
                                            </p>

                                            <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10 leading-relaxed font-medium">
                                                {mentor.bio ||
                                                    `Experienced ${mentor.expertise || 'professional'} ready to help you achieve your goal.`}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {(mentor.skills || '')
                                                    .split(',')
                                                    .slice(0, 2)
                                                    .map((skill, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black rounded-lg border border-gray-100 uppercase tracking-tight"
                                                        >
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        Starts from
                                                    </span>
                                                    <div className="flex items-center text-[#7F00FF]">
                                                        <span className="text-lg font-black mr-0.5">
                                                            ₹
                                                            {
                                                                mentor.monthlyCharge
                                                            }
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400">
                                                            /mo
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedMentor(
                                                                mentor
                                                            );
                                                        }}
                                                        className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors font-black text-[10px] uppercase tracking-widest border border-gray-100"
                                                    >
                                                        Quick View
                                                    </button>
                                                    <button className="p-2 bg-[#7F00FF]/5 text-[#7F00FF] rounded-xl group-hover:bg-[#7F00FF] group-hover:text-white transition-all duration-300">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && mentors.length > 0 && totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft
                                        size={20}
                                        className="text-gray-600"
                                    />
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() =>
                                            handlePageChange(pageNum)
                                        }
                                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                            page === pageNum
                                                ? 'bg-[#7F00FF] text-white shadow-sm shadow-[#7F00FF]/25'
                                                : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight
                                        size={20}
                                        className="text-gray-600"
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            {selectedMentor && (
                <MentorDetailsModal
                    mentor={selectedMentor}
                    onClose={() => setSelectedMentor(null)}
                />
            )}
        </div>
    );
};

export default MentorListingPage;
