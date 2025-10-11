import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { updateEventSchema, joinEventSchema } from "@/lib/schemas-new";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createServerSupabase();

        const { data: event, error } = await supabase
            .from("events")
            .select(`
        *,
        profiles!events_host_id_fkey (
          id,
          full_name,
          avatar_url,
          campus_name,
          rating_avg,
          rating_count
        ),
        event_attendees (
          id,
          user_id,
          status,
          joined_at,
          notes,
          profiles!event_attendees_user_id_fkey (
            id,
            full_name,
            avatar_url
          )
        )
      `)
            .eq("id", params.id)
            .single();

        if (error) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ event });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(
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
        const validatedData = updateEventSchema.parse(body);

        const { data: event, error } = await supabase
            .from("events")
            .update(validatedData)
            .eq("id", params.id)
            .eq("host_id", user.id)
            .select(`
        *,
        profiles!events_host_id_fkey (
          id,
          full_name,
          avatar_url,
          campus_name
        )
      `)
            .single();

        if (error) {
            return NextResponse.json({ error: "Failed to update event" }, { status: 400 });
        }

        return NextResponse.json({ event });
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
            .from("events")
            .update({ status: "cancelled" })
            .eq("id", params.id)
            .eq("host_id", user.id);

        if (error) {
            return NextResponse.json({ error: "Failed to cancel event" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
