import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { Editor, Range } from '@tiptap/core';

export interface CommandItemProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    command: (props: { editor: Editor; range: Range }) => void;
}

interface SlashCommandListProps {
    items: CommandItemProps[];
    command: (item: CommandItemProps) => void;
    editor: Editor; 
}

export interface SlashCommandListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const SlashCommandList = forwardRef<SlashCommandListRef, SlashCommandListProps>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];
        if (item) {
            props.command(item);
        }
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
                return true;
            }
            if (event.key === 'ArrowDown') {
                setSelectedIndex((selectedIndex + 1) % props.items.length);
                return true;
            }
            if (event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
            }
            return false;
        },
    }));

    return (
        <div className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-xl transition-all">
            {props.items.length > 0 ? (
                props.items.map((item, index) => (
                    <button
                        key={index}
                        className={`flex w-full items-center space-x-2 rounded-md px-2 py-2 text-left text-sm transition-colors ${
                            index === selectedIndex ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                        onClick={() => selectItem(index)}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm">
                            {item.icon}
                        </div>
                        <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-gray-400">{item.description}</p>
                        </div>
                    </button>
                ))
            ) : (
                <div className="p-2 text-sm text-gray-500">No results</div>
            )}
        </div>
    );
});

SlashCommandList.displayName = 'SlashCommandList';
