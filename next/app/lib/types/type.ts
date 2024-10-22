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

export type CreateEventFunction = (event: EventProps) => Promise<void>;
export type UpdateEventFunction = (eventId: number, event: EventProps) => Promise<void>;