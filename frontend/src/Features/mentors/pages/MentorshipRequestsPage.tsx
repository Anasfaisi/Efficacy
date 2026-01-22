
import React from 'react';
import MentorshipRequestsList from '../components/MentorshipRequestsList';

const MentorshipRequestsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mentorship Requests</h1>
                    <p className="text-gray-500">Manage incoming mentorship requests from students</p>
                </div>
            </div>
            <MentorshipRequestsList isPage={true} />
        </div>
    );
};

export default MentorshipRequestsPage;
