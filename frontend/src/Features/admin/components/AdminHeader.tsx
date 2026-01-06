import { NotificationDropdown } from './NotificationDropdown';

export const AdminHeader = () => {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Dashboard
                </h2>
            </div>

            <div className="flex items-center gap-6">
                <NotificationDropdown />
                <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                    {/* Placeholder for admin profile */}
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-700">
                            Admin User
                        </p>
                        <p className="text-xs text-gray-500">Super Admin</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold border-2 border-white shadow-sm">
                        AD
                    </div>
                </div>
            </div>
        </header>
    );
};
