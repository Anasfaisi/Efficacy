import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ApplicationReceived() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-slate-100">
                <div className="mb-6 flex justify-center">
                    <div className="h-20 w-20 bg-sky-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-sky-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Application Received!
                </h2>
                <p className="text-slate-500 mb-8">
                    Thank you for applying to be a mentor. Your application status is currently{' '}
                    <span className="font-semibold text-sky-600">Pending</span>.
                    <br />
                    <br />
                    Our admin team will review your profile and notify you within 2 business days.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-sky-600 text-white font-medium py-3 rounded-lg shadow-lg hover:bg-sky-700 transition-colors"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
}
