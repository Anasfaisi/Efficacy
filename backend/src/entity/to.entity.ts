///=================== kanban ====================//

import { ColumnId } from '@/types/column-enum.types';

export class kanbanTaskToEntity {
    constructor(
        public taskId: string,
        public title: string,
        public description?: string,
        public dueDate?: string,
        public approxTimeToFinish?: string
    ) {}
}

export class kanbanColumnToEntity {
    constructor(
        public columnId: ColumnId,
        public title: string,
        public tasks: kanbanTaskToEntity[] = []
    ) {}
}

export class KanbanBoardToEntity {
    constructor(
        public id: string,
        public columns: kanbanColumnToEntity[]
    ) {}
}
