import Cookies from "js-cookie";
import client from "./client";
import type { ApiResponse, EventProps } from "../types/type";

const getAuthHeaders = () => {
    const accessToken = Cookies.get("_access_token");
    const clientToken = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    if (!accessToken || !clientToken || !uid) {
        throw new Error("認証エラーです");
    }

    return {
        "access-token": accessToken,
        "client": clientToken,
        "uid": uid
    };
};

export const getEvents = ():Promise<ApiResponse<EventProps[]>> => {
    return client.get("/events", {
        headers: getAuthHeaders()
    });
}

export const createEvent = (params: EventProps) => {

    return client.post("/events", params, {
        headers: getAuthHeaders()
    });
}

export const updateEvent = (eventId: number, params: EventProps) => {

    return client.put(`/events/${eventId}`, params, {
        headers: getAuthHeaders()
    });
}

export const deleteEvent = (eventId: number):Promise<ApiResponse<void>> => {
    return client.delete(`/events/${eventId}`, {
        headers: getAuthHeaders()
    });
}

export const getEvent = (eventId: number): Promise<ApiResponse<EventProps>> => {
    return client.get(`/events/${eventId}`, {
        headers: getAuthHeaders()
    })
}