
export type EventProps = {
    id?: number
    title: string;
    description: string;
    startDate: string;
    endDate: string
}

export type ApiResponse<T> = {
    data: T;
    status: number;
    statusText: string;
}