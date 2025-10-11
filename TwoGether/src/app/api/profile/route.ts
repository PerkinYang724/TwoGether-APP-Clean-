import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { createProfileSchema, updateProfileSchema } from "@/lib/schemas-new";

export async function GET() {
    try {
        const supabase = createServerSupabase();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (error) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json({ profile });
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
        const validatedData = createProfileSchema.parse({
            ...body,
            email: user.email,
        });

        const { data: profile, error } = await supabase
            .from("profiles")
            .insert({
                id: user.id,
                ...validatedData,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: "Failed to create profile" }, { status: 400 });
        }

        return NextResponse.json({ profile });
    } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = createServerSupabase();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = updateProfileSchema.parse(body);

        const { data: profile, error } = await supabase
            .from("profiles")
            .update(validatedData)
            .eq("id", user.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: "Failed to update profile" }, { status: 400 });
        }

        return NextResponse.json({ profile });
    } catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
