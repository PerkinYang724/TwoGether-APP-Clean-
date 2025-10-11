import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { createEventSchema, updateEventSchema } from "@/lib/schemas-new";

export async function GET(request: NextRequest) {
    try {
        const supabase = createServerSupabase();
        const { searchParams } = new URL(request.url);

        const category = searchParams.get("category");
        const campus = searchParams.get("campus");
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        let query = supabase
            .from("events")
            .select(`
        *,
        profiles!events_host_id_fkey (
          id,
          full_name,
          avatar_url,
          campus_name
        ),
        event_attendees (
          id,
          user_id,
          status
        )
      `)
            .eq("status", "active")
            .order("start_time", { ascending: true })
            .range(offset, offset + limit - 1);

        if (category) {
            query = query.eq("category", category);
        }

        if (campus) {
            query = query.eq("profiles.campus_name", campus);
        }

        const { data: events, error } = await query;

        if (error) {
            return NextResponse.json({ error: "Failed to fetch events" }, { status: 400 });
        }

        return NextResponse.json({ events });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = createServerSupabase();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = createEventSchema.parse(body);

        const { data: event, error } = await supabase
            .from("events")
            .insert({
                host_id: user.id,
                ...validatedData,
            })
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
            return NextResponse.json({ error: "Failed to create event" }, { status: 400 });
        }

        return NextResponse.json({ event });
    } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
