import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { SlashCommand } from './SlashCommandExtension';
import { suggestion } from './suggestion';
import MenuBar from './MenuBar';
import { extensions as commonExtensions } from './extensions';
import './editor.css';

interface NoteEditorProps {
    content: string;
    onChange: (content: string) => void;
    editable?: boolean;
}

const TiptapEditor: React.FC<NoteEditorProps> = ({
    content,
    onChange,
    editable = true,
}) => {
    const [_, forceUpdate] = useState(0);

    const editor = useEditor({
        extensions: [
            ...commonExtensions,
            Placeholder.configure({
                placeholder: "Type '/' to see commands...",
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            SlashCommand.configure({
                suggestion,
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
            forceUpdate((prev) => prev + 1);
        },
        onSelectionUpdate: () => {
             forceUpdate((prev) => prev + 1);
        },
        onTransaction: () => {
             forceUpdate((prev) => prev + 1);
        },
        editorProps: {
            attributes: {
                class: 'tiptap prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 max-w-none',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
           
        }
    }, [content, editor]);

 
    useEffect(() => {
        if (editor && content) {
             const currentContent = editor.getHTML();
         
             if (currentContent === '<p></p>' && content !== '<p></p>') {
                 editor.commands.setContent(content);
             }
        }
    }, []);

    return (
        <div className="flex flex-col w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <MenuBar editor={editor} />
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                <EditorContent editor={editor} className="h-full" />
            </div>
        </div>
    );
};

export default TiptapEditor;
