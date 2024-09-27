import { createEvent, deleteEvent, getEvent, getEvents, updateEvent } from '@/app/lib/api/events';
import type { ApiResponse, EventProps } from '@/app/lib/types/type';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useEvents() {
  return useQuery<ApiResponse<EventProps[]>, Error>({
    queryKey: ['events'],
    queryFn: getEvents
  });
}

export function useEvent(eventId: number) {
  return useQuery<ApiResponse<EventProps>, Error>({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId)
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<EventProps>, Error, EventProps>({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<EventProps>, Error, { eventId: number; params: EventProps }>({
    mutationFn: ({ eventId, params }) => updateEvent(eventId, params),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}