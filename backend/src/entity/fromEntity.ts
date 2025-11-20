//====================   kanban  =========================//

import { ColumnId } from '@/types/columnEnum.types';

export class kanbanTaskFromEntity {
    constructor(
        public taskId: string,
        public title: string,
        public description?: string,
        public dueDate?: string,
        public approxTimeToFinish?: string
    ) {}
}

export class kanbanColumnFromEntity {
    constructor(
        public columnId: ColumnId,
        public title: string,
        public tasks: kanbanTaskFromEntity[] = []
    ) {}
}

export class KanbanBoardFromEntity {
    constructor(
        public id: string,
        public columns: kanbanColumnFromEntity[]
    ) {}
}
