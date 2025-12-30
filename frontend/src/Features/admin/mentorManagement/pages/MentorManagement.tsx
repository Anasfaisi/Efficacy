import React, { useState } from 'react'
import CreateMentorForm from '../components/CreateMentorPage';
import type { Mentor } from '@/types/auth';

const MentorMangement = () => {
  const [showForm, setShowForm] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>([
    {
      id: "MNDR-001",
      name: "Sanjay Kumar",
      email: "sanjay@example.com",
      role: 'mentor',
      expertise: "Web Development",
      availableDays: "Mon–Fri / 10am–5pm",
      status: 'active',
    },
    {
      id: "MNDR-002",
      name: "Anitha R",
      email: "anitha@example.com",
      role: 'mentor',
      expertise: "Data Structures",
      availableDays: "Sat–Sun / 9am–1pm",
      status: 'inactive',
    },
  ]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mentor Management</h2>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
          Create Mentor
        </button>
      </div>
      {showForm && (
        <CreateMentorForm onSave={(mentor) => {
          setMentors([...mentors, mentor]);
          setShowForm(false);
        }}
          onCancel={() => setShowForm(false)}
        />
      )}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Mentor ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Expertise</th>
              <th className="p-3 border">Availability</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {mentors.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="p-3 border">{m.id}</td>
                <td className="p-3 border">{m.name}</td>
                <td className="p-3 border">{m.expertise}</td>
                <td className="p-3 border">{m.availableDays}</td>

                <td className="p-3 border">
                  <span
                    className={`px-3 py-1 text-xs rounded-full text-white ${m.status === 'active' ? "bg-green-600" : "bg-red-500"
                      }`}
                  >
                    {m.status === 'active' ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-3 border space-x-2">
                  <button className="px-2 py-1 text-xs bg-gray-600 text-white rounded">
                    View
                  </button>
                  <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded">
                    Edit
                  </button>
                  <button className="px-2 py-1 text-xs bg-red-600 text-white rounded">
                    Block
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default MentorMangement


