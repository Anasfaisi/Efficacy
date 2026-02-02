import { Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Underline,
    Heading1,
    Heading2,
    ListOrdered,
    CheckSquare,
    Quote
} from 'lucide-react';
import React from 'react';

interface MenuBarProps {
    editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const items = [
        {
            icon: <ListOrdered size={18} />,
            title: 'Numbered',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            icon: <CheckSquare size={18} />,
            title: 'Checkbox',
            action: () => editor.chain().focus().toggleTaskList().run(),
            isActive: () => editor.isActive('taskList'),
        },
        {
            icon: <Heading1 size={18} />,
            title: 'H1 Headline',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            icon: <Heading2 size={18} />,
            title: 'H2 Subheading',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            icon: <Underline size={18} />,
            title: 'Underline',
            action: () => editor.chain().focus().toggleUnderline().run(),
            isActive: () => editor.isActive('underline'),
        },
        {
            icon: <Bold size={18} />,
            title: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            icon: <Italic size={18} />,
            title: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            icon: <Quote size={18} />,
            title: 'Quote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
    ];

    return (
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-t-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white mb-4 shadow-md sticky top-0 z-30">
            {items.map((item, index) => (
                <button
                    key={index}
                    onClick={item.action}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all hover:bg-white/20 min-w-[60px] ${
                        item.isActive() ? 'bg-white/30 shadow-inner' : ''
                    }`}
                    title={item.title}
                >
                    <div className="mb-1">{item.icon}</div>
                    <span className="text-[10px] font-medium opacity-90 whitespace-nowrap">
                        {item.title}
                    </span>
                </button>
            ))}
            
            {/* Visual dividers or extra actions can be added here */}
            {/* <div className="h-8 w-px bg-white/20 mx-1"></div> */}
        </div>
    );
};

export default MenuBar;
