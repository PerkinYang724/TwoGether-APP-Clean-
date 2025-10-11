import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Event, Profile, CreateEvent, JoinEvent } from "@/lib/schemas-new";

// Events hooks
export function useEvents(filters?: {
    category?: string;
    campus?: string;
    limit?: number;
    offset?: number;
}) {
    return useQuery({
        queryKey: ["events", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.category) params.append("category", filters.category);
            if (filters?.campus) params.append("campus", filters.campus);
            if (filters?.limit) params.append("limit", filters.limit.toString());
            if (filters?.offset) params.append("offset", filters.offset.toString());

            const response = await fetch(`/api/events?${params}`);
            if (!response.ok) throw new Error("Failed to fetch events");
            return response.json();
        },
    });
}

export function useEvent(id: string) {
    return useQuery({
        queryKey: ["event", id],
        queryFn: async () => {
            const response = await fetch(`/api/events/${id}`);
            if (!response.ok) throw new Error("Failed to fetch event");
            return response.json();
        },
        enabled: !!id,
    });
}

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateEvent) => {
            const response = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to create event");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}

export function useJoinEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ eventId, data }: { eventId: string; data: JoinEvent }) => {
            const response = await fetch(`/api/events/${eventId}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to join event");
            return response.json();
        },
        onSuccess: (_, { eventId }) => {
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}

export function useLeaveEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventId: string) => {
            const response = await fetch(`/api/events/${eventId}/join`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to leave event");
            return response.json();
        },
        onSuccess: (_, eventId) => {
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}

// Profile hooks
export function useProfile() {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await fetch("/api/profile");
            if (!response.ok) throw new Error("Failed to fetch profile");
            return response.json();
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Profile>) => {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to update profile");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}
