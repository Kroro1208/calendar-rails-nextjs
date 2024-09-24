import Cookies from "js-cookie";
import client from "./client";

interface EventProps {
    id?: number
    title: string;
    description: string;
    startDate: string;
    endDate: string
}

export const getEventCalendars = () => {
    const accessToken = Cookies.get("_access_token");
    const clientToken = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    if(!accessToken || !clientToken || !uid) {
        return "認証エラーです";
    }

    return client.get("/event_calendars", {
        headers: {
            "access-token": accessToken,
            "client": clientToken,
            "uid": uid
        }
    });
}

export const createEventCalendar = (params: EventProps) => {
    const accessToken = Cookies.get("_access_token");
    const clientToken = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    if(!accessToken || !clientToken || !uid) {
        return "認証エラーです";
    }

    return client.post("/event_calendars", params, {
        headers: {
            "access-token": accessToken,
            "client": clientToken,
            "uid": uid
        }
    })
}

export const updateEventCalendar = (id: number, params: EventProps) => {
    const accessToken = Cookies.get("_access_token");
    const clientToken = Cookies.get("_client");
    const uid = Cookies.get("_uid");

    if(!accessToken || !clientToken || !uid) {
        return "認証エラーです";
    }

    return client.put(`/event_calendars/${id}`, params, {
        headers: {
            "access-token": accessToken,
            "client": clientToken,
            "uid": uid
        }
    })
}