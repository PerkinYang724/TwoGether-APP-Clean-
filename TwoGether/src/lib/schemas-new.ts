import { z } from "zod";

// Simplified User Profile Schema
export const profileSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    username: z.string().min(3).max(30).optional(),
    full_name: z.string().min(1).max(100),
    avatar_url: z.string().url().optional(),
    campus_name: z.string().max(100), // Simplified - just campus name instead of full campus table
    class_year: z.number().int().min(2020).max(2030).optional(),
    major: z.string().max(100).optional(),
    bio: z.string().max(500).optional(),
    interests: z.array(z.string()).max(10).optional(),
    rating_avg: z.number().min(0).max(5).default(0),
    rating_count: z.number().int().min(0).default(0),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export const createProfileSchema = profileSchema.omit({
    id: true,
    rating_avg: true,
    rating_count: true,
    created_at: true,
    updated_at: true,
});

export const updateProfileSchema = createProfileSchema.partial();

// Simplified Event Schema
export const eventSchema = z.object({
    id: z.string().uuid(),
    host_id: z.string().uuid(),
    title: z.string().min(1).max(100),
    description: z.string().max(1000).optional(),
    category: z.enum([
        "study",
        "sport",
        "party",
        "food",
        "volunteer",
        "social",
        "academic",
        "fitness",
        "music",
        "tech",
        "other",
    ]),
    location_text: z.string().max(200),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
    max_attendees: z.number().int().min(1).max(100).default(20),
    current_attendees: z.number().int().min(0).default(0),
    cover_url: z.string().url().optional(),
    tags: z.array(z.string()).max(10).optional(),
    cost: z.number().min(0).optional(), // Cost in cents
    is_public: z.boolean().default(true),
    status: z.enum(["active", "cancelled", "completed"]).default("active"),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export const createEventSchema = eventSchema.omit({
    id: true,
    host_id: true,
    current_attendees: true,
    status: true,
    created_at: true,
    updated_at: true,
});

export const updateEventSchema = createEventSchema.partial();

// Event Attendees Schema
export const eventAttendeeSchema = z.object({
    id: z.string().uuid(),
    event_id: z.string().uuid(),
    user_id: z.string().uuid(),
    status: z.enum(["joined", "requested", "denied"]).default("joined"),
    joined_at: z.string().datetime(),
    notes: z.string().max(200).optional(),
});

export const joinEventSchema = z.object({
    event_id: z.string().uuid(),
    notes: z.string().max(200).optional(),
});

// Simplified Carpool Schema
export const carpoolSchema = z.object({
    id: z.string().uuid(),
    event_id: z.string().uuid(),
    driver_id: z.string().uuid(),
    origin_text: z.string().max(200),
    destination_text: z.string().max(200),
    depart_time: z.string().datetime(),
    seats_total: z.number().int().min(1).max(8),
    seats_available: z.number().int().min(0),
    cost_per_person: z.number().min(0).optional(),
    vehicle_info: z.string().max(200).optional(),
    status: z.enum(["active", "full", "cancelled", "completed"]).default("active"),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export const createCarpoolSchema = carpoolSchema.omit({
    id: true,
    driver_id: true,
    seats_available: true,
    status: true,
    created_at: true,
    updated_at: true,
});

// Carpool Request Schema
export const carpoolRequestSchema = z.object({
    id: z.string().uuid(),
    carpool_id: z.string().uuid(),
    rider_id: z.string().uuid(),
    seats_requested: z.number().int().min(1).max(4).default(1),
    status: z.enum(["pending", "accepted", "denied", "cancelled"]).default("pending"),
    message: z.string().max(200).optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export const createCarpoolRequestSchema = carpoolRequestSchema.omit({
    id: true,
    rider_id: true,
    status: true,
    created_at: true,
    updated_at: true,
});

// Rating Schema
export const ratingSchema = z.object({
    id: z.string().uuid(),
    event_id: z.string().uuid(),
    rater_id: z.string().uuid(),
    ratee_id: z.string().uuid(),
    stars: z.number().int().min(1).max(5),
    comment: z.string().max(500).optional(),
    created_at: z.string().datetime(),
});

export const createRatingSchema = ratingSchema.omit({
    id: true,
    rater_id: true,
    created_at: true,
});

// Message Schema
export const messageSchema = z.object({
    id: z.string().uuid(),
    thread_id: z.string().uuid(),
    sender_id: z.string().uuid(),
    content: z.string().min(1).max(1000),
    message_type: z.enum(["text", "image", "location"]).default("text"),
    created_at: z.string().datetime(),
});

export const createMessageSchema = messageSchema.omit({
    id: true,
    sender_id: true,
    created_at: true,
});

// Thread Schema
export const threadSchema = z.object({
    id: z.string().uuid(),
    type: z.enum(["event", "carpool", "dm"]),
    event_id: z.string().uuid().optional(),
    carpool_id: z.string().uuid().optional(),
    participants: z.array(z.string().uuid()),
    last_message_at: z.string().datetime().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

// Type exports
export type Profile = z.infer<typeof profileSchema>;
export type CreateProfile = z.infer<typeof createProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export type Event = z.infer<typeof eventSchema>;
export type CreateEvent = z.infer<typeof createEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;

export type EventAttendee = z.infer<typeof eventAttendeeSchema>;
export type JoinEvent = z.infer<typeof joinEventSchema>;

export type Carpool = z.infer<typeof carpoolSchema>;
export type CreateCarpool = z.infer<typeof createCarpoolSchema>;
export type CarpoolRequest = z.infer<typeof carpoolRequestSchema>;
export type CreateCarpoolRequest = z.infer<typeof createCarpoolRequestSchema>;

export type Rating = z.infer<typeof ratingSchema>;
export type CreateRating = z.infer<typeof createRatingSchema>;

export type Message = z.infer<typeof messageSchema>;
export type CreateMessage = z.infer<typeof createMessageSchema>;
export type Thread = z.infer<typeof threadSchema>;
