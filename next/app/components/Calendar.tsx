"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react"
import { createEvent, deleteEvent, getEvents, updateEvent } from "../lib/api/events";
import { useToast } from "@/hooks/use-toast";
import { getUser, signOut } from "../lib/api/auth";

import FullCalendar from "@fullcalendar/react";
import { Button } from "@/components/ui/button";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core/index.js";
import type { CreateEventFunction, UpdateEventFunction, Event } from "../lib/types/type";
import CreateEventModal from "./CreateEventModal";
import UpdateEventModal from "./UpdateEventModal";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
}

interface User {
    isLogin: boolean;
    name: string
}

const Calendar = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getEvents();
            const calendarEvents: CalendarEvent[] = res.data.map((event) => ({
                id: event.id ? event.id.toString() : "",
                title: event.title,
                description: event.description,
                start: new Date(event.startDate),
                end: new Date(event.endDate)
            }));
            setEvents(calendarEvents);
        } catch (error) {
            console.error(error);
            toast({
                title: "エラーが発生しました",
                description: "イベントの取得ができませんでした",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        const checkUserEvents = async () => {
            try {
                const userData = await getUser();
                console.log("User data:", userData);
                setUser(userData);
                await fetchEvents();
            } catch (error) {
                toast({
                    title: "エラーが発生しました",
                    description: "認証されていないユーザーです",
                    variant: "destructive"
                });
                router.push('/')
            }
        }
        checkUserEvents();
    }, [fetchEvents, router, toast]);

    const handleCreateEvent: CreateEventFunction = useCallback(async (event) => {
        setIsLoading(true);
        try {
            const response = await createEvent(event);
            await fetchEvents();
            setIsCreateModalOpen(false);
            toast({
                title: "成功",
                description: "イベントが登録されました",
                variant: "success"
            });
            return response;
        } catch (error) {
            toast({
                title: "失敗",
                description: "イベント登録に失敗しました",
                variant: "destructive"
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [fetchEvents, toast]);

    const handleUpdateEvent: UpdateEventFunction = useCallback(async (eventId, event) => {
        setIsLoading(true);
        try {
            const response = await updateEvent(eventId, event);
            await fetchEvents();
            setIsUpdateModalOpen(false);
            setSelectedEvent(null);
            toast({
                title: "成功",
                description: "イベント情報が更新されました",
                variant: "success"
            });
            return response;
        } catch (error) {
            toast({
                title: "失敗",
                description: "更新に失敗しました",
                variant: "destructive"
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [fetchEvents, toast]);

    const handleEventClick = useCallback((info: EventClickArg) => {
        const formatDate = (date: Date | null): string => {
            return date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        };
    
        const newSelectedEvent: Event = {
            id: Number.parseInt(info.event.id),
            title: info.event.title,
            description: info.event.extendedProps.description || '',
            startDate: formatDate(info.event.start),
            endDate: formatDate(info.event.end || info.event.start)
        };
    
        setSelectedEvent(newSelectedEvent);
        setIsUpdateModalOpen(true);
    }, []);

    const handleDelete = useCallback(async (eventId: number) => {
        setIsLoading(true);
        try {
            await deleteEvent(eventId);
            await fetchEvents();
            setIsUpdateModalOpen(false);
            setSelectedEvent(null);
            toast({
                title: "成功",
                description: "イベントが削除されました",
                variant: "success"
            });
        } catch (error) {
            toast({
                title: "失敗",
                description: "イベントの削除に失敗しました",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }, [fetchEvents, toast]);

    const closeUpdateModal = useCallback(() => {
        setIsUpdateModalOpen(false);
        setSelectedEvent(null);
    }, []);

    const handleLogout = () => {
        signOut();
        router.push('/')
    }

    return (
        <div className="container mx-auto p-4">
            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                createEvent={handleCreateEvent}
            />
            {selectedEvent && (
                <UpdateEventModal
                    isOpen={isUpdateModalOpen}
                    onClose={closeUpdateModal}
                    updateEvent={handleUpdateEvent}
                    deleteEvent={handleDelete}
                    event={selectedEvent}
                />
            )}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{user?.name}さんのカレンダー</h1>
                <div className="flex gap-3">
                    <Button onClick={() => setIsCreateModalOpen(true)} disabled={isLoading}>
                        予定を追加
                    </Button>
                    <Button onClick={() => handleLogout()} disabled={isLoading}>
                        ログアウト
                    </Button>
                </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale="ja"
                    events={events}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,dayGridWeek,dayGridDay",
                    }}
                    eventClick={handleEventClick}
                    editable={true}
                    selectable={true}
                    height="auto"
                />
            </div>
        </div>
    );
}

export default Calendar;