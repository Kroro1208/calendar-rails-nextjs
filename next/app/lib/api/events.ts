import Cookies from "js-cookie";
import client from "./client";
import type { EventProps } from "../types/type";

export const getEvents = (calendarId: number) => {
    const accessToken = Cookies.get("_access_token");
    const clientToken = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    if(!accessToken || !clientToken || !uid) {
        return "認証エラーです";
    }

    return client.get(`/event_calendars/${calendarId}/events`, {
        headers: {
            "access-token": accessToken,
            "client": clientToken,
            "uid": uid
        }
    });
}

export const createEvent = (calendarId: number, params: EventProps) => {
    const accessToken = Cookies.get("_access_token");
    const clientToken = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    if(!accessToken || !clientToken || !uid) {
        return "認証エラーです";
    }

    return client.post(`/event_calendars/${calendarId}/events`, params, {
        headers: {
            "access-token": accessToken,
            "client": clientToken,
            "uid": uid
        }
    });
}

export const updateEvent = (calendarId: number, eventId: number, params: EventProps) => {
    const accessToken = Cookies.get("_access_token");
    const clientToken = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    if(!accessToken || !clientToken || !uid) {
        return "認証エラーです";
    }

    return client.put(`/event_calendars/${calendarId}/${eventId}`, params, {
        headers: {
            "access-token": accessToken,
            "client": clientToken,
            "uid": uid
        }
    });
}