import { useState } from 'react';

export default function CreateMentorForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    mentorId: '',
    name: '',
    expertise: '',
    availability: '',
    currentActive: true,
  });

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-semibold mb-3">Create Mentor</h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Mentor ID"
          value={form.mentorId}
          required={true}
          onChange={(e) => setForm({ ...form, mentorId: e.target.value })}
        />

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Name"
          value={form.name}
          required={true}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Expertise"
          value={form.expertise}
          required={true}
          onChange={(e) => setForm({ ...form, expertise: e.target.value })}
        />

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Availability"
          value={form.availability}
          required={true}
          onChange={(e) => setForm({ ...form, availability: e.target.value })}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => onSave(form)}
        >
          Save
        </button>

        <button
          className="px-4 py-2 bg-gray-400 text-white rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
