export type EventProps = {
    id?: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

export interface Event extends EventProps {
    id: number
}

export type ApiResponse<T> = {
    data: T;
    status: number;
    statusText: string;
}

export type CreateEventFunction = (event: Omit<EventProps, 'id'>) => Promise<ApiResponse<Event>>;
export type UpdateEventFunction = (eventId: number, event: Omit<EventProps, 'id'>) => Promise<ApiResponse<Event>>;