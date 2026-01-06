import Sidebar from '../layouts/Sidebar';
import Navbar from '../layouts/Navbar';
import UserDashboard from '../components/UserDashboard';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen flex bg-white">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <div className="flex-1 bg-gray-50 overflow-y-auto p-8 custom-scrollbar">
                    <UserDashboard />
                </div>
            </div>
        </div>
    );
};

export default Home;
