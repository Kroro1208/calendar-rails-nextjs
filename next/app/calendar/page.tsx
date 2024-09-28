"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast";

import FullCalendar from "@fullcalendar/react";
import { Button } from "@/components/ui/button";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core/index.js";
import type { CreateEventFunction, UpdateEventFunction, Event } from "../lib/types/type";
import CreateEventModal from "../components/CreateEventModal";
import UpdateEventModal from "../components/UpdateEventModal";
import { useAuth } from "@/hooks/useAuth";
import Loading from "../Loading";
import { useCreateEvent, useDeleteEvent, useEvents, useUpdateEvent } from "@/hooks/useEvents";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
}

const Calendar = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const router = useRouter();
    const { toast } = useToast();
    const { user, isCheckingAuth, signOut } = useAuth();

    const { data: eventsData, isLoading: isEventsLoading, error: eventsError } = useEvents();
    const createEventMutation = useCreateEvent();
    const updateEventMutation = useUpdateEvent();
    const deleteEventMutation = useDeleteEvent();

    const events: CalendarEvent[] = eventsData?.data.map((event) => ({
            id: event.id ? event.id.toString() : "",
            title: event.title,
            description: event.description,
            start: new Date(event.startDate),
            end: new Date(event.endDate)
        })) || [];

        useEffect(() => {
            if(!isCheckingAuth) {
                if(!user) {
                    console.log("User not authenticated, redirecting to login");
                    router.push('/');
                } else {
                    console.log("User authenticated:", user);
                }
            }
        }, [isCheckingAuth, user, router]);

    const handleCreateEvent: CreateEventFunction = useCallback(async (event) => {
        try {
            await createEventMutation.mutateAsync(event);
            setIsCreateModalOpen(false);
            toast({
                title: "成功",
                description: "イベントが作成されました",
                variant: "success"
            })
        } catch (error) {
            toast({
                title: "失敗",
                description: "イベント登録に失敗しました",
                variant: "destructive"
            });
        }
    }, [createEventMutation, toast]);

    const handleUpdateEvent: UpdateEventFunction = useCallback(async (eventId, event) => {
        try {
           await updateEventMutation.mutateAsync({ eventId, params: event });
           setIsUpdateModalOpen(false);
           setSelectedEvent(null);
           toast({
            title: "成功",
            description: "イベント情報が更新されました",
            variant: "success"
        });
        } catch (error) {
            toast({
                title: "失敗",
                description: "更新に失敗しました",
                variant: "destructive"
            });
        } 
    }, [updateEventMutation, toast]);

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
        try {
            await deleteEventMutation.mutateAsync(eventId);
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
        }
    }, [deleteEventMutation, toast]);

    const closeUpdateModal = useCallback(() => {
        setIsUpdateModalOpen(false);
        setSelectedEvent(null);
    }, []);

    const handleLogout = () => {
        signOut();
        router.push('/')
    }

    if(isCheckingAuth || isEventsLoading) {
        return <Loading />
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
                <h1 className="text-2xl font-bold">{user?.data?.name}さんのカレンダー</h1>
                <div className="flex gap-3">
                    <Button onClick={() => setIsCreateModalOpen(true)} disabled={createEventMutation.isPending}>
                        予定を追加
                    </Button>
                    <Button onClick={() => handleLogout()} disabled={false}>
                        ログアウト
                    </Button>
                </div>
            </div>
            {!isEventsLoading && !eventsError && (
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
            )}
        </div>
    );
}

export default Calendar;