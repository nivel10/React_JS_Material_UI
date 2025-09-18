export interface ITask {
    id: string;
    created_by: string;
    title: string;
    description: string;
    completed: boolean;
    date: string;
    is_deleted: boolean,
    created_at: number,
    updated_at: number,
}