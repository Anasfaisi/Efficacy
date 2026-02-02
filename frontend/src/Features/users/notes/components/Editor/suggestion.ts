import React from 'react';
import { ReactRenderer } from '@tiptap/react';
import tippy, { type Instance } from 'tippy.js';
import { SlashCommandList, type CommandItemProps, type SlashCommandListRef } from './SlashCommandList';
import { Heading1, Heading2, List, ListOrdered, Quote, Text } from 'lucide-react';
import type { Editor, Range } from '@tiptap/core';
import '@tiptap/starter-kit';

export const suggestion = {
    items: ({ query }: { query: string }): CommandItemProps[] => {
        return [
            {
                title: 'Text',
                description: 'Just start writing with plain text.',
                icon: React.createElement(Text, { size: 18 }),
                command: ({ editor, range }: { editor: Editor; range: Range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode('paragraph')
                        .run();
                },
            },
            {
                title: 'Heading 1',
                description: 'Big section heading.',
                icon: React.createElement(Heading1, { size: 18 }),
                command: ({ editor, range }: { editor: Editor; range: Range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode('heading', { level: 1 })
                        .run();
                },
            },
            {
                title: 'Heading 2',
                description: 'Medium section heading.',
                icon: React.createElement(Heading2, { size: 18 }),
                command: ({ editor, range }: { editor: Editor; range: Range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode('heading', { level: 2 })
                        .run();
                },
            },
            {
                title: 'Bullet List',
                description: 'Create a simple bullet list.',
                icon: React.createElement(List, { size: 18 }),
                command: ({ editor, range }: { editor: Editor; range: Range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .toggleBulletList()
                        .run();
                },
            },
            {
                title: 'Numbered List',
                description: 'Create a list with numbering.',
                icon: React.createElement(ListOrdered, { size: 18 }),
                command: ({ editor, range }: { editor: Editor; range: Range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .toggleOrderedList()
                        .run();
                },
            },
            {
                title: 'Quote',
                description: 'Capture a quote.',
                icon: React.createElement(Quote, { size: 18 }),
                command: ({ editor, range }: { editor: Editor; range: Range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .toggleBlockquote()
                        .run();
                },
            },
        ].filter((item) =>
            item.title.toLowerCase().startsWith(query.toLowerCase())
        );
    },

    render: () => {
        let component: ReactRenderer<SlashCommandListRef>;
        let popup: Instance[];

        return {
            onStart: (props: any) => {
                component = new ReactRenderer(SlashCommandList, {
                    props,
                    editor: props.editor,
                });

                if (!props.clientRect) {
                    return;
                }

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                });
            },

            onUpdate(props: any) {
                component.updateProps(props);

                if (!props.clientRect) {
                    return;
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },

            onKeyDown(props: any) {
                if (props.event.key === 'Escape') {
                    popup[0].hide();
                    return true;
                }

                return component.ref?.onKeyDown(props);
            },

            onExit() {
                popup[0].destroy();
                component.destroy();
            },
        };
    },

    command: ({ editor, range, props }: { editor: Editor; range: Range; props: CommandItemProps }) => {
        props.command({ editor, range });
    },
};
