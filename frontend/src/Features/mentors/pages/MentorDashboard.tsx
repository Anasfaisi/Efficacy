import React, { useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { type Mentor } from '@/types/auth';
import { toast } from 'sonner';

const MentorDashboard: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role === 'mentor') {
      const mentor = currentUser as Mentor;
      const status = mentor.status;

      if (status === 'incomplete' || !status) {
        navigate('/mentor/onboarding');
      } else if (status === 'pending') {
        navigate('/mentor/application-received');
      } else if (status === 'approved') {
        navigate('/mentor/approved');
      } else if (status === 'inactive') {
        toast.error('Your account is currently inactive. Please contact support.');
        navigate('/mentor/login');
      }
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null; // Or loading spinner

  return (
    <div className="h-screen w-full flex bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-8">Mentor Panel</h1>
        <nav className="space-y-4">
          <Link
            to="/mentor/home"
            className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/mentor/students"
            className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium"
          >
            Mentees
          </Link>
          <Link
            to="/mentor/sessions"
            className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium"
          >
            Sessions
          </Link>
          <Link
            to="/mentor/profile"
            className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium"
          >
            Profile
          </Link>
          <Link
            to="/mentor/guidelines"
            className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium"
          >
            Guidelines
          </Link>
        </nav>
      </aside>

      {/* Right Section */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="w-full bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-blue-700">Home</h2>

          {currentUser && (
            <Link
              to="/mentor/logout"
              className="bg-blue-700 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              Logout
            </Link>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 p-10">
          <div className="max-w-3xl bg-white border border-gray-200 shadow-md rounded-xl p-8">
            {currentUser ? (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Hey, {currentUser.email} 👋
                </h3>
                <p className="text-gray-600">
                  Welcome to your mentor dashboard. More features will appear
                  here soon.
                </p>
              </>
            ) : (
              <p className="text-red-500 font-medium">
                No authentication data found.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MentorDashboard;
