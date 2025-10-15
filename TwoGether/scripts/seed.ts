import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";

// Define the category type
type EventCategory = 'study' | 'sport' | 'party' | 'food' | 'volunteer' | 'carpool' | 'social' | 'academic';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample data
const SAMPLE_PROFILES = [
    {
        username: "alex_chen",
        full_name: "Alex Chen",
        class_year: 2024,
        major: "Computer Science",
        bio: "CS student who loves coding and coffee ☕",
        interests: ["Technology", "Gaming", "Coffee"],
    },
    {
        username: "maya_patel",
        full_name: "Maya Patel",
        class_year: 2025,
        major: "Biology",
        bio: "Pre-med student passionate about helping others",
        interests: ["Science", "Volunteering", "Fitness"],
    },
    {
        username: "jordan_smith",
        full_name: "Jordan Smith",
        class_year: 2023,
        major: "Business",
        bio: "Entrepreneur in the making 🚀",
        interests: ["Entrepreneurship", "Networking", "Travel"],
    },
    {
        username: "sam_wilson",
        full_name: "Sam Wilson",
        class_year: 2024,
        major: "Psychology",
        bio: "Psychology major with a love for music and art",
        interests: ["Music", "Art", "Psychology"],
    },
    {
        username: "taylor_jones",
        full_name: "Taylor Jones",
        class_year: 2025,
        major: "Engineering",
        bio: "Mechanical engineering student and sports enthusiast",
        interests: ["Sports", "Engineering", "Fitness"],
    },
    {
        username: "riley_davis",
        full_name: "Riley Davis",
        class_year: 2024,
        major: "English",
        bio: "Writer, reader, and lover of all things literature",
        interests: ["Literature", "Writing", "Movies"],
    },
    {
        username: "casey_brown",
        full_name: "Casey Brown",
        class_year: 2023,
        major: "Environmental Science",
        bio: "Environmental advocate and outdoor enthusiast",
        interests: ["Environment", "Hiking", "Photography"],
    },
    {
        username: "quinn_miller",
        full_name: "Quinn Miller",
        class_year: 2025,
        major: "Communications",
        bio: "Future journalist with a passion for storytelling",
        interests: ["Communications", "Politics", "Languages"],
    },
];

const EVENT_CATEGORIES: EventCategory[] = [
    "study", "sport", "party", "food", "volunteer", "carpool", "social", "academic"
];

const EVENT_TITLES: Record<EventCategory, string[]> = {
    study: [
        "Study Group for Midterm",
        "Late Night Coding Session",
        "Math Problem Solving",
        "Group Project Meeting",
        "Exam Prep Session",
    ],
    sport: [
        "Basketball Game",
        "Morning Run Group",
        "Tennis Tournament",
        "Soccer Match",
        "Gym Workout Session",
    ],
    party: [
        "Birthday Celebration",
        "Halloween Party",
        "End of Semester Bash",
        "Game Night",
        "Dance Party",
    ],
    food: [
        "Pizza Night",
        "Cooking Class",
        "Food Truck Tour",
        "Potluck Dinner",
        "Coffee Study Session",
    ],
    volunteer: [
        "Community Cleanup",
        "Food Bank Volunteering",
        "Tutoring Session",
        "Animal Shelter Help",
        "Environmental Project",
    ],
    carpool: [
        "Campus to Airport",
        "Shopping Trip",
        "Concert Carpool",
        "Beach Day Trip",
        "City Exploration",
    ],
    social: [
        "Networking Event",
        "Speed Dating",
        "Movie Night",
        "Book Club Meeting",
        "Art Gallery Visit",
    ],
    academic: [
        "Research Presentation",
        "Academic Conference",
        "Guest Speaker Event",
        "Career Fair",
        "Graduate School Info Session",
    ],
};

const LOCATIONS = [
    "Student Center",
    "Library",
    "Campus Quad",
    "Sports Complex",
    "Dining Hall",
    "Coffee Shop",
    "Park",
    "Beach",
    "Downtown",
    "Mall",
];

async function seedDatabase() {
    console.log("🌱 Starting database seeding...");

    try {
        // Create sample profiles
        console.log("👥 Creating sample profiles...");
        const profilePromises = SAMPLE_PROFILES.map(async (profile) => {
            const { data, error } = await supabase
                .from("profiles")
                .insert({
                    id: faker.string.uuid(),
                    ...profile,
                    rating_avg: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
                    rating_count: faker.number.int({ min: 5, max: 50 }),
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        });

        const profiles = await Promise.all(profilePromises);
        console.log(`✅ Created ${profiles.length} profiles`);

        // Create sample events
        console.log("📅 Creating sample events...");
        const eventPromises = Array.from({ length: 20 }, async () => {
            const category = faker.helpers.arrayElement<EventCategory>(EVENT_CATEGORIES);
            const host = faker.helpers.arrayElement(profiles);
            const startTime = faker.date.future();
            const endTime = new Date(startTime.getTime() + faker.number.int({ min: 1, max: 6 }) * 60 * 60 * 1000);

            const eventData = {
                host_id: host.id,
                title: faker.helpers.arrayElement(EVENT_TITLES[category]),
                description: faker.lorem.paragraph(),
                category,
                is_carpool: category === "carpool" || faker.datatype.boolean({ probability: 0.2 }),
                location_text: faker.helpers.arrayElement(LOCATIONS),
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                max_attendees: faker.number.int({ min: 5, max: 50 }),
                tags: faker.helpers.arrayElements([
                    "fun", "educational", "social", "active", "relaxing", "creative", "outdoor", "indoor"
                ], { min: 1, max: 3 }),
                auto_approve: faker.datatype.boolean({ probability: 0.7 }),
            };

            const { data, error } = await supabase
                .from("events")
                .insert(eventData)
                .select()
                .single();

            if (error) throw error;
            return data;
        });

        const events = await Promise.all(eventPromises);
        console.log(`✅ Created ${events.length} events`);

        // Create carpool data for carpool events
        console.log("🚗 Creating carpool data...");
        const carpoolEvents = events.filter(event => event.is_carpool);
        const carpoolPromises = carpoolEvents.map(async (event) => {
            const { error } = await supabase
                .from("carpools")
                .insert({
                    event_id: event.id,
                    driver_id: event.host_id,
                    origin_text: faker.location.streetAddress(),
                    depart_time: event.start_time,
                    seats_total: faker.number.int({ min: 2, max: 6 }),
                    seats_available: faker.number.int({ min: 1, max: 4 }),
                });

            if (error) throw error;
        });

        await Promise.all(carpoolPromises);
        console.log(`✅ Created ${carpoolEvents.length} carpools`);

        // Create event memberships
        console.log("👥 Creating event memberships...");
        const membershipPromises = events.flatMap(event => {
            const numMembers = faker.number.int({ min: 2, max: Math.min(event.max_attendees, 15) });
            const members = faker.helpers.arrayElements(profiles, numMembers);

            return members.map(async (member) => {
                const { error } = await supabase
                    .from("event_members")
                    .insert({
                        event_id: event.id,
                        user_id: member.id,
                        status: "joined",
                        joined_at: faker.date.past().toISOString(),
                    });

                if (error) throw error;
            });
        });

        await Promise.all(membershipPromises);
        console.log("✅ Created event memberships");

        // Create sample ratings
        console.log("⭐ Creating sample ratings...");
        const ratingPromises = [];
        for (const event of events.slice(0, 10)) {
            const { data: members } = await supabase
                .from("event_members")
                .select("user_id")
                .eq("event_id", event.id)
                .limit(5);

            if (!members) continue;

            for (const member of members) {
                ratingPromises.push(
                    supabase
                        .from("ratings")
                        .insert({
                            event_id: event.id,
                            rater_id: member.user_id,
                            ratee_id: event.host_id,
                            stars: faker.number.int({ min: 3, max: 5 }),
                            comment: faker.lorem.sentence(),
                        })
                );
            }
        }

        await Promise.all(ratingPromises);
        console.log("✅ Created sample ratings");

        // Create sample messages
        console.log("💬 Creating sample messages...");
        const messagePromises = events.slice(0, 5).flatMap(async (event) => {
            const { data: members } = await supabase
                .from("event_members")
                .select("user_id")
                .eq("event_id", event.id)
                .limit(3);

            if (!members) return [];

            const messages = Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
                event_id: event.id,
                sender_id: faker.helpers.arrayElement(members).user_id,
                content: faker.lorem.sentence(),
                created_at: faker.date.past().toISOString(),
            }));

            const { error } = await supabase
                .from("messages")
                .insert(messages);

            if (error) throw error;
        });

        await Promise.all(messagePromises);
        console.log("✅ Created sample messages");

        console.log("🎉 Database seeding completed successfully!");
        console.log(`📊 Summary:`);
        console.log(`   - ${profiles.length} profiles`);
        console.log(`   - ${events.length} events`);
        console.log(`   - ${carpoolEvents.length} carpools`);
        console.log(`   - Sample memberships, ratings, and messages`);

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
