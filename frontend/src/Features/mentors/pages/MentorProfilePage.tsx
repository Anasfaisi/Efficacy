import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import type { Mentor } from '@/types/auth';
import {
  Mail,
  MapPin,
  Phone,
  Globe,
  Linkedin,
  Github,
  BookOpen,
  Camera,
} from 'lucide-react';

const MentorProfilePage = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const mentor = currentUser as Mentor;
  const [isEditing, setIsEditing] = useState(false); // Placeholder for future edit functionality

  if (!mentor) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header / Cover Area placeholder */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-sm overflow-hidden">
             
        </div>

        {/* Profile Header (overlaps cover) */}
        <div className="relative px-8 -mt-20">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative group">
                {mentor.profilePic ? (
                  <img
                    src={mentor.profilePic}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-4xl">
                    {mentor.name?.charAt(0)}
                  </div>
                )}
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white w-8 h-8" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 pb-2">
               <h1 className="text-3xl font-bold text-gray-900">{mentor.name}</h1>
               <div className="flex items-center gap-2 mt-1 text-gray-600 font-medium">
                  <span className="capitalize">{mentor.mentorType} Mentor</span>
                  {mentor.role && <span className="text-gray-300">•</span>}
                  <span>{mentor.currentRole || 'Mentor'}</span>
               </div>
            </div>

            <div className="pb-2">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors text-sm font-semibold"
                >
                    Edit Profile
                </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
            
            {/* Left Column */}
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">About</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {mentor.bio || 'No bio added yet.'}
                    </p>

                    <div className="mt-6 space-y-3">
                         <div className="flex items-center gap-3 text-sm text-gray-600">
                             <Mail size={16} className="text-gray-400" />
                             {mentor.email}
                         </div>
                         {mentor.phone && (
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone size={16} className="text-gray-400" />
                                {mentor.phone}
                            </div>
                         )}
                         <div className="flex items-center gap-3 text-sm text-gray-600">
                             <MapPin size={16} className="text-gray-400" />
                             {[mentor.city, mentor.country].filter(Boolean).join(', ') || 'Remote'}
                         </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Socials</h3>
                    <div className="space-y-3">
                        {mentor.linkedin ? (
                             <a href={mentor.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-blue-700 hover:underline">
                                <Linkedin size={18} /> LinkedIn
                             </a>
                        ) : <span className="text-gray-400 text-sm italic">LinkedIn not connected</span>}
                        
                        {mentor.github ? (
                             <a href={mentor.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-900 hover:underline">
                                <Github size={18} /> GitHub
                             </a>
                        ) : null}

                         {mentor.personalWebsite ? (
                             <a href={mentor.personalWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-indigo-600 hover:underline">
                                <Globe size={18} /> Website
                             </a>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* expertise */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                   <h3 className="text-lg font-bold text-gray-900 mb-4">Expertise & Skills</h3>
                   <div className="flex flex-wrap gap-2 mb-6">
                       {mentor.skills?.split(',').map(s => (
                           <span key={s} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                               {s.trim()}
                           </span>
                       )) || <p className="text-gray-500 text-sm">No specific skills listed.</p>}
                   </div>

                   <hr className="border-gray-100 my-4" />
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                           <span className="text-xs font-semibold text-gray-400 uppercase">Domain</span>
                           <p className="text-gray-900 font-medium">{mentor.domain || mentor.industryCategory || 'N/A'}</p>
                       </div>
                       <div>
                           <span className="text-xs font-semibold text-gray-400 uppercase">Experience</span>
                           <p className="text-gray-900 font-medium">{mentor.experienceYears || '0'} Years</p>
                       </div>
                   </div>
                </div>

                {/* Education */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen size={20} className="text-indigo-500"/> Education
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-900">{mentor.university}</h4>
                                <p className="text-sm text-gray-600">{mentor.qualification}</p>
                            </div>
                            <span className="text-sm text-gray-500 font-medium">{mentor.graduationYear}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfilePage;
