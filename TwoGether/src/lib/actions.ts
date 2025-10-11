"use server";

import { createClient } from "@/lib/supabase-server";
import { CreateEvent, CreateProfile, CreateRating, CreateMessage } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function createEventAction(eventData: CreateEvent) {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from("events")
            .insert({
                host_id: user.id,
                ...eventData,
            })
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/");
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function joinEventAction(eventId: string) {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        // Check if event exists and get auto_approve setting
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("auto_approve, max_attendees")
            .eq("id", eventId)
            .single();

        if (eventError) throw eventError;

        // Check current attendee count
        const { count: currentCount } = await supabase
            .from("event_members")
            .select("*", { count: "exact", head: true })
            .eq("event_id", eventId)
            .eq("status", "joined");

        if (currentCount && currentCount >= event.max_attendees) {
            throw new Error("Event is full");
        }

        const { error } = await supabase
            .from("event_members")
            .insert({
                event_id: eventId,
                user_id: user.id,
                status: event.auto_approve ? "joined" : "requested",
            });

        if (error) throw error;

        revalidatePath(`/events/${eventId}`);
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function leaveEventAction(eventId: string) {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from("event_members")
            .delete()
            .eq("event_id", eventId)
            .eq("user_id", user.id);

        if (error) throw error;

        revalidatePath(`/events/${eventId}`);
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createProfileAction(profileData: CreateProfile) {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from("profiles")
            .insert({
                id: user.id,
                ...profileData,
            });

        if (error) throw error;

        revalidatePath("/profile");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateProfileAction(profileData: Partial<CreateProfile>) {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from("profiles")
            .update(profileData)
            .eq("id", user.id);

        if (error) throw error;

        revalidatePath("/profile");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createRatingAction(ratingData: CreateRating) {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from("ratings")
            .insert({
                rater_id: user.id,
                ...ratingData,
            });

        if (error) throw error;

        revalidatePath("/profile");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function sendMessageAction(messageData: CreateMessage) {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { error } = await supabase
            .from("messages")
            .insert({
                sender_id: user.id,
                ...messageData,
            });

        if (error) throw error;

        revalidatePath(`/events/${messageData.event_id}/chat`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
