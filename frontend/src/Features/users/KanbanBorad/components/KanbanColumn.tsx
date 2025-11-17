import React, { useState } from 'react';
import type { KanbanColumnProps, Task } from '../types';
import KanbanCard from './KanbanCard';
import AddTaskCard from './AddTaskCard';

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  addTask,
  updateTask,
}) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    approxTimeToFinish: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleEditTask = (task: Task) => {
    setIsAdding(false);
    setEditingTaskId(task.taskId);
    setForm({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      approxTimeToFinish: task.approxTimeToFinish || '',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTask = () => {
    if (!form.title.trim()) return alert('Title is required');

    const newTask: Task = {
      taskId: crypto.randomUUID(),
      title: form.title,
      description: form.description,
      dueDate: form.dueDate,
      approxTimeToFinish: form.approxTimeToFinish,
    };
    console.log(newTask, 'new task');
    addTask(column.columnId, newTask);

    setForm({
      title: '',
      description: '',
      dueDate: '',
      approxTimeToFinish: '',
    });
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col rounded-xl bg-purple-50 p-4 w-72 max-h-[80vh] overflow-y-auto border border-purple-300">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-purple-900">{column?.title}</h3>
        <span className="text-xs text-purpel-500">{column.tasks.length}</span>
      </header>

      {column.tasks.map((task: Task) => (
        <KanbanCard
          key={task.taskId}
          task={task}
          editTask={() => handleEditTask(task)}
        />
      ))}
      {isAdding || editingTaskId ? (
        <div className="mt-3 p-3 rounded-lg bg-white border border-purple-200 shadow-sm">
          <input
            name="title"
            type="text"
            placeholder="Title (required)"
            value={form.title}
            onChange={handleChange}
            className="w-full mb-2 p-2 border border-purple-300 rounded text-sm focus:outline-none focus:ring focus:ring-purple-200"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full mb-2 p-2 border border-purple-300 rounded text-sm focus:outline-none focus:ring focus:ring-purple-200"
          />

          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full mb-2 p-2 border border-purple-300 rounded text-sm"
          />

          <input
            name="approxTimeToFinish"
            type="text"
            placeholder="Approx time to finish"
            value={form.approxTimeToFinish}
            onChange={handleChange}
            className="w-full mb-3 p-2 border border-purple-300 rounded text-sm"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingTaskId(null);
              }}
              className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                if (!form.title.trim()) return alert('Title is required');

                if (editingTaskId) {
                  updateTask(column.columnId, editingTaskId, {
                    title: form.title,
                    description: form.description,
                    dueDate: form.dueDate,
                    approxTimeToFinish: form.approxTimeToFinish,
                  });
                } else {
                  handleAddTask();
                }

                setForm({
                  title: '',
                  description: '',
                  dueDate: '',
                  approxTimeToFinish: '',
                });

                setEditingTaskId(null);
                setIsAdding(false);
              }}
              className="text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              {editingTaskId ? 'Save Task' : 'Add Task'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <AddTaskCard onClick={() => setIsAdding(true)} />
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;
