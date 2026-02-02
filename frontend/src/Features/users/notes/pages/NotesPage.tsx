import React, { useState } from 'react';
import Sidebar from '../../home/layouts/Sidebar';
import Navbar from '../../home/layouts/Navbar';
import { useNotes } from '../hooks/useNotes';
import TiptapEditor from '../components/Editor/TiptapEditor';
import { Plus, Trash2, StickyNote, X } from 'lucide-react';
import { format } from 'date-fns';

const NotesPage: React.FC = () => {
    const {
        notes,
        activeNoteId,
        setActiveNoteId,
        createNote,
        updateNote,
        deleteNote,
    } = useNotes();

    const [isStickyMode, setIsStickyMode] = useState(false);

    const activeNote = notes.find((note) => note._id === activeNoteId);

    const handleCreateNote = () => {
        createNote();
    };

    const handleUpdateActiveNote = (content: string) => {
        if (activeNoteId) {
            updateNote(activeNoteId, { content });
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (activeNoteId) {
            updateNote(activeNoteId, { title: e.target.value });
        }
    };

    if (isStickyMode) {
        return (
            <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-yellow-50 shadow-2xl rounded-xl z-50 flex flex-col border border-yellow-200 overflow-hidden animate-in slide-in-from-bottom-5">
                <div className="bg-yellow-100 p-2 flex justify-between items-center border-b border-yellow-200">
                    <div className="flex items-center gap-2">
                        <StickyNote size={16} className="text-yellow-600" />
                        <span className="text-xs font-bold text-yellow-800 uppercase tracking-wider">Sticky Note</span>
                    </div>
                    <div className="flex gap-1">
                         <button 
                            onClick={() => setIsStickyMode(false)}
                            className="p-1 hover:bg-yellow-200 rounded text-yellow-700"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
                {activeNote ? (
                    <div className="flex-1 flex flex-col bg-yellow-50">
                        <input
                            type="text"
                            value={activeNote.title}
                            onChange={handleTitleChange}
                            placeholder="Note Title"
                            className="bg-transparent text-lg font-bold p-4 pb-2 outline-none text-gray-800 placeholder:text-gray-400"
                        />
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                            <TiptapEditor
                                content={activeNote.content}
                                onChange={handleUpdateActiveNote}
                                editable={true}
                                // Pass a prop to hide complex toolbar or make it simpler? 
                                // For now reusing the same editor.
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-yellow-700/50 p-4 text-center">
                        <p>No active note.</p>
                        <button onClick={handleCreateNote} className="text-sm underline mt-2">Create one</button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />

                <div className="flex-1 flex overflow-hidden">
                    {/* Notes Sidebar List */}
                    <div className="w-80 bg-white border-r border-gray-100 flex flex-col">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Notes</h2>
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                    {notes.length}
                                </span>
                            </div>
                            <button
                                onClick={handleCreateNote}
                                className="w-full bg-[#7F00FF] hover:bg-[#6a00d6] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all shadow-lg shadow-[#7F00FF]/25"
                            >
                                <Plus size={20} />
                                New Note
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                            {notes.length === 0 && (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    No notes yet. <br/> Click "New Note" to start.
                                </div>
                            )}
                            {notes.map((note) => (
                                <div
                                    key={note._id}
                                    onClick={() => setActiveNoteId(note._id)}
                                    className={`group p-4 rounded-xl cursor-pointer transition-all border ${
                                        activeNoteId === note._id
                                            ? 'bg-purple-50 border-purple-100 shadow-sm'
                                            : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-semibold truncate pr-2 ${activeNoteId === note._id ? 'text-[#7F00FF]' : 'text-gray-900'}`}>
                                            {note.title || 'Untitled Note'}
                                        </h3>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                             <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNote(note._id);
                                                }}
                                                className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 flex items-center gap-2">
                                        {format(new Date(note.updatedAt), 'MMM d, h:mm a')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Editor Area */}
                    <div className="flex-1 flex flex-col bg-gray-50/50 relative">
                        {activeNote ? (
                            <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto w-full p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <input
                                        type="text"
                                        value={activeNote.title}
                                        onChange={handleTitleChange}
                                        placeholder="Note Title"
                                        className="bg-transparent text-4xl font-black text-gray-900 placeholder:text-gray-300 outline-none w-full"
                                    />
                                    
                                    <button
                                        onClick={() => setIsStickyMode(true)}
                                        className="ml-4 flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors font-medium text-sm"
                                        title="Switch to Sticky Note Mode"
                                    >
                                        <StickyNote size={18} />
                                        Sticky
                                    </button>
                                </div>

                                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden flex flex-col">
                                    {/* Recreate editor key when switching active note to force remount/reset */}
                                    <div className="flex-1 overflow-hidden" key={activeNote._id}>
                                         <TiptapEditor
                                            content={activeNote.content}
                                            onChange={handleUpdateActiveNote}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <StickyNote size={40} className="text-gray-300" />
                                </div>
                                <p className="text-lg font-medium">Select a note to view</p>
                                <p className="text-sm">or create a new one</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesPage;
