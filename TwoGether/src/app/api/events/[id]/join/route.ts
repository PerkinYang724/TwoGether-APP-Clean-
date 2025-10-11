import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { joinEventSchema } from "@/lib/schemas-new";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createServerSupabase();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = joinEventSchema.parse(body);

        // Check if user is already attending
        const { data: existingAttendance } = await supabase
            .from("event_attendees")
            .select("id")
            .eq("event_id", params.id)
            .eq("user_id", user.id)
            .single();

        if (existingAttendance) {
            return NextResponse.json({ error: "Already attending this event" }, { status: 400 });
        }

        // Check if event has space
        const { data: event } = await supabase
            .from("events")
            .select("max_attendees, current_attendees")
            .eq("id", params.id)
            .single();

        if (event && event.current_attendees >= event.max_attendees) {
            return NextResponse.json({ error: "Event is full" }, { status: 400 });
        }

        const { data: attendance, error } = await supabase
            .from("event_attendees")
            .insert({
                event_id: params.id,
                user_id: user.id,
                ...validatedData,
            })
            .select(`
        *,
        profiles!event_attendees_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
            .single();

        if (error) {
            return NextResponse.json({ error: "Failed to join event" }, { status: 400 });
        }

        return NextResponse.json({ attendance });
    } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createServerSupabase();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { error } = await supabase
            .from("event_attendees")
            .delete()
            .eq("event_id", params.id)
            .eq("user_id", user.id);

        if (error) {
            return NextResponse.json({ error: "Failed to leave event" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
