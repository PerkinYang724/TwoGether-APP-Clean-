import { z } from "zod";

// Campus schemas
export const campusSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(100),
    domain: z.string().email().optional(),
    city: z.string().max(100),
    state: z.string().max(50),
    country: z.string().max(50),
    timezone: z.string().max(50),
    created_at: z.string().datetime(),
});

// Profile schemas (enhanced)
export const profileSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    username: z.string().min(3).max(30).optional(),
    full_name: z.string().min(1).max(100),
    avatar_url: z.string().url().optional(),
    campus_id: z.string().uuid(),
    class_year: z.number().int().min(2020).max(2030).optional(),
    major: z.string().max(100).optional(),
    bio: z.string().max(500).optional(),
    vibe_line: z.string().max(100).optional(), // Short personality description
    interests: z.array(z.string()).max(10).optional(),
    rating_avg: z.number().min(0).max(5).default(0),
    rating_count: z.number().int().min(0).default(0),
    verified: z.boolean().default(false),
    badges: z.array(z.string()).optional(), // Newbie, Connector, Host, Legend
    streaks: z.number().int().min(0).default(0),
    privacy_settings: z.object({
        discoverable: z.boolean().default(true),
        show_class_year: z.boolean().default(true),
        allow_ride_requests: z.boolean().default(true),
        show_interests: z.boolean().default(true),
    }).optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export const createProfileSchema = profileSchema.omit({
    id: true,
    rating_avg: true,
    rating_count: true,
    verified: true,
    badges: true,
    streaks: true,
    created_at: true,
    updated_at: true,
});

export const updateProfileSchema = createProfileSchema.partial();

// Event schemas (enhanced)
export const eventSchema = z.object({
    id: z.string().uuid(),
    host_id: z.string().uuid(),
    campus_id: z.string().uuid(),
    title: z.string().min(1).max(100),
    description: z.string().max(1000).optional(),
    category: z.enum([
        "study",
        "sport",
        "party",
        "food",
        "volunteer",
        "carpool",
        "social",
        "academic",
        "fitness",
        "music",
        "tech",
        "other",
    ]),
    is_carpool: z.boolean().default(false),
    location_text: z.string().max(200),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
    max_attendees: z.number().int().min(1).max(100).default(20),
    current_attendees: z.number().int().min(0).default(0),
    cover_url: z.string().url().optional(),
    image_url: z.string().url().optional(), // Legacy field
    tags: z.array(z.string()).max(10).optional(),
    cost: z.number().min(0).optional(), // Cost in cents
    accessibility_notes: z.string().max(500).optional(),
    safety_notes: z.string().max(500).optional(),
    auto_approve: z.boolean().default(true),
    is_public: z.boolean().default(true),
    status: z.enum(["draft", "active", "cancelled", "completed"]).default("active"),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export const createEventSchema = eventSchema.omit({
    id: true,
    host_id: true,
    campus_id: true,
    current_attendees: true,
    status: true,
    created_at: true,
    updated_at: true,
});

export const updateEventSchema = createEventSchema.partial();

// Event member schemas (enhanced)
export const eventMemberSchema = z.object({
    id: z.string().uuid(),
    event_id: z.string().uuid(),
    user_id: z.string().uuid(),
    status: z.enum(["joined", "requested", "denied", "waitlisted"]).default("joined"),
    joined_at: z.string().datetime(),
    checked_in: z.boolean().default(false),
    checked_in_at: z.string().datetime().optional(),
    notes: z.string().max(200).optional(),
});

export const joinEventSchema = z.object({
    event_id: z.string().uuid(),
    notes: z.string().max(200).optional(),
});

// Rating schemas (enhanced)
export const ratingSchema = z.object({
    id: z.string().uuid(),
    event_id: z.string().uuid(),
    rater_id: z.string().uuid(),
    ratee_id: z.string().uuid(),
    stars: z.number().int().min(1).max(5),
    quick_tags: z.array(z.enum([
        "fun_crew",
        "chill",
        "organized",
        "no_show",
        "helpful",
        "friendly",
        "punctual",
        "creative"
    ])).optional(),
    comment: z.string().max(500).optional(),
    is_anonymous: z.boolean().default(false),
    created_at: z.string().datetime(),
});

export const createRatingSchema = ratingSchema.omit({
    id: true,
    rater_id: true,
    created_at: true,
});

// Carpool schemas (enhanced)
export const carpoolSchema = z.object({
    id: z.string().uuid(),
    event_id: z.string().uuid(),
    driver_id: z.string().uuid(),
    campus_id: z.string().uuid(),
    origin_text: z.string().max(200),
    origin_latitude: z.number().optional(),
    origin_longitude: z.number().optional(),
    destination_text: z.string().max(200),
    destination_latitude: z.number().optional(),
    destination_longitude: z.number().optional(),
    depart_time: z.string().datetime(),
    depart_window: z.number().int().min(0).max(120).default(15), // Minutes
    seats_total: z.number().int().min(1).max(8),
    seats_available: z.number().int().min(0),
    cost_per_person: z.number().min(0).optional(), // Cost in cents
    route_json: z.record(z.any()).optional(),
    meeting_spot: z.string().max(200).optional(),
    safety_notes: z.string().max(500).optional(),
    vehicle_info: z.string().max(200).optional(),
    status: z.enum(["active", "full", "cancelled", "completed"]).default("active"),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export const createCarpoolSchema = carpoolSchema.omit({
    id: true,
    driver_id: true,
    campus_id: true,
    seats_available: true,
    status: true,
    created_at: true,
    updated_at: true,
});

export const carpoolRequestSchema = z.object({
    id: z.string().uuid(),
    carpool_id: z.string().uuid(),
    rider_id: z.string().uuid(),
    seats_requested: z.number().int().min(1).max(4).default(1),
    pickup_location: z.string().max(200).optional(),
    pickup_latitude: z.number().optional(),
    pickup_longitude: z.number().optional(),
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

// Message schemas (enhanced)
export const messageSchema = z.object({
    id: z.string().uuid(),
    thread_id: z.string().uuid(),
    sender_id: z.string().uuid(),
    content: z.string().min(1).max(1000),
    message_type: z.enum(["text", "image", "location", "rsvp_sticker", "reaction"]).default("text"),
    attachments_json: z.record(z.any()).optional(),
    reply_to_id: z.string().uuid().optional(),
    reactions: z.record(z.array(z.string())).optional(), // emoji -> user_ids
    is_edited: z.boolean().default(false),
    edited_at: z.string().datetime().optional(),
    created_at: z.string().datetime(),
});

export const createMessageSchema = messageSchema.omit({
    id: true,
    sender_id: true,
    is_edited: true,
    edited_at: true,
    created_at: true,
});

// Thread schemas
export const threadSchema = z.object({
    id: z.string().uuid(),
    type: z.enum(["event", "carpool", "dm"]),
    event_id: z.string().uuid().optional(),
    carpool_id: z.string().uuid().optional(),
    participants: z.array(z.string().uuid()),
    last_message_at: z.string().datetime().optional(),
    is_archived: z.boolean().default(false),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

// Filter schemas (enhanced)
export const eventFiltersSchema = z.object({
    campus_id: z.string().uuid().optional(),
    category: z.string().optional(),
    time_window: z.enum(["today", "tomorrow", "this_week", "this_weekend", "next_week", "all"]).optional(),
    max_distance: z.number().min(0).max(50).optional(), // Miles
    min_rating: z.number().min(0).max(5).optional(),
    max_cost: z.number().min(0).optional(),
    only_carpools: z.boolean().optional(),
    only_free: z.boolean().optional(),
    accessibility_required: z.boolean().optional(),
    group_size: z.enum(["small", "medium", "large", "any"]).optional(),
    tags: z.array(z.string()).optional(),
    friends_attending: z.boolean().optional(),
});

// Notification schemas
export const notificationSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    type: z.enum([
        "new_event_match",
        "carpool_match",
        "rating_reminder",
        "new_message",
        "event_reminder",
        "ride_confirmed",
        "event_cancelled",
        "friend_joined_event"
    ]),
    title: z.string().max(100),
    body: z.string().max(200),
    data_json: z.record(z.any()).optional(),
    is_read: z.boolean().default(false),
    created_at: z.string().datetime(),
});

// Report schemas
export const reportSchema = z.object({
    id: z.string().uuid(),
    reporter_id: z.string().uuid(),
    reported_user_id: z.string().uuid().optional(),
    reported_event_id: z.string().uuid().optional(),
    reported_carpool_id: z.string().uuid().optional(),
    reason: z.enum([
        "inappropriate_content",
        "harassment",
        "spam",
        "fake_profile",
        "unsafe_behavior",
        "other"
    ]),
    description: z.string().max(500).optional(),
    status: z.enum(["pending", "reviewed", "resolved", "dismissed"]).default("pending"),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export const createReportSchema = reportSchema.omit({
    id: true,
    reporter_id: true,
    status: true,
    created_at: true,
    updated_at: true,
});

// Type exports
export type Campus = z.infer<typeof campusSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type CreateProfile = z.infer<typeof createProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export type Event = z.infer<typeof eventSchema>;
export type CreateEvent = z.infer<typeof createEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;

export type EventMember = z.infer<typeof eventMemberSchema>;
export type JoinEvent = z.infer<typeof joinEventSchema>;

export type Rating = z.infer<typeof ratingSchema>;
export type CreateRating = z.infer<typeof createRatingSchema>;

export type Carpool = z.infer<typeof carpoolSchema>;
export type CreateCarpool = z.infer<typeof createCarpoolSchema>;
export type CarpoolRequest = z.infer<typeof carpoolRequestSchema>;
export type CreateCarpoolRequest = z.infer<typeof createCarpoolRequestSchema>;

export type Message = z.infer<typeof messageSchema>;
export type CreateMessage = z.infer<typeof createMessageSchema>;
export type Thread = z.infer<typeof threadSchema>;

export type EventFilters = z.infer<typeof eventFiltersSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type Report = z.infer<typeof reportSchema>;
export type CreateReport = z.infer<typeof createReportSchema>;