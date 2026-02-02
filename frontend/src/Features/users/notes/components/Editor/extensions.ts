import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import {Table} from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import StarterKit from '@tiptap/starter-kit';

export const extensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
        },
    }),
    Underline,
    Link.configure({
        openOnClick: false,
    }),
    Image,
    Table.configure({
        resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
];
