import { useState } from 'react';
import type { Mentor } from '@/types/auth';

interface CreateMentorFormProps {
  onSave: (mentor: Mentor) => void;
  onCancel: () => void;
}

export default function CreateMentorForm({
  onSave,
  onCancel,
}: CreateMentorFormProps) {
  const [form, setForm] = useState<Partial<Mentor>>({
    id: '',
    name: '',
    email: '',
    expertise: '',
    // availability: '', // Mapping to status or using extra field?
    // Using simple defaults for now to match the user's simple form style
    status: 'active',
    role: 'mentor',
  });

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-semibold mb-3">Create Mentor</h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Mentor ID"
          value={form.id || ''}
          required={true}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
        />

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Name"
          value={form.name || ''}
          required={true}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Email"
          value={form.email || ''}
          required={true}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Expertise"
          value={form.expertise || ''}
          required={true}
          onChange={(e) => setForm({ ...form, expertise: e.target.value })}
        />

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Availability Days"
          value={form.availableDays || ''}
          required={true}
          onChange={(e) => setForm({ ...form, availableDays: e.target.value })}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => onSave(form as Mentor)}
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
