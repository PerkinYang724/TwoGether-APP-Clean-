import { faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Campus data
const campuses = [
    "Stanford University",
    "UC Berkeley",
    "UCLA",
    "USC",
    "UC San Diego",
    "UC Irvine",
    "UC Santa Barbara",
    "UC Davis",
    "UC Santa Cruz",
    "UC Riverside",
];

// Event categories
const categories = [
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
];

// Event tags
const eventTags = [
    "study-group",
    "basketball",
    "party",
    "pizza",
    "volunteer",
    "networking",
    "exam-prep",
    "workout",
    "concert",
    "hackathon",
    "movie-night",
    "coffee",
    "hiking",
    "dance",
    "book-club",
];

// Interest tags
const interestTags = [
    "basketball",
    "coding",
    "music",
    "photography",
    "cooking",
    "travel",
    "fitness",
    "art",
    "gaming",
    "reading",
    "dancing",
    "hiking",
    "volunteering",
    "entrepreneurship",
    "sustainability",
];

async function createProfiles(count: number = 50) {
    console.log(`Creating ${count} profiles...`);

    const profiles = [];

    for (let i = 0; i < count; i++) {
        const campus = faker.helpers.arrayElement(campuses);
        const interests = faker.helpers.arrayElements(interestTags, { min: 2, max: 6 });

        profiles.push({
            email: faker.internet.email(),
            username: faker.internet.userName(),
            full_name: faker.person.fullName(),
            avatar_url: faker.image.avatar(),
            campus_name: campus,
            class_year: faker.number.int({ min: 2020, max: 2027 }),
            major: faker.person.jobTitle(),
            bio: faker.lorem.sentence({ min: 10, max: 50 }),
            interests,
            rating_avg: faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }),
            rating_count: faker.number.int({ min: 0, max: 20 }),
        });
    }

    const { data, error } = await supabase
        .from("profiles")
        .insert(profiles)
        .select("id");

    if (error) {
        console.error("Error creating profiles:", error);
        return [];
    }

    console.log(`Created ${data.length} profiles`);
    return data.map(p => p.id);
}

async function createEvents(profileIds: string[], count: number = 100) {
    console.log(`Creating ${count} events...`);

    const events = [];

    for (let i = 0; i < count; i++) {
        const hostId = faker.helpers.arrayElement(profileIds);
        const category = faker.helpers.arrayElement(categories);
        const tags = faker.helpers.arrayElements(eventTags, { min: 1, max: 4 });
        const startTime = faker.date.future();
        const endTime = new Date(startTime.getTime() + faker.number.int({ min: 1, max: 6 }) * 60 * 60 * 1000);

        events.push({
            host_id: hostId,
            title: generateEventTitle(category),
            description: faker.lorem.paragraphs({ min: 1, max: 3 }),
            category,
            location_text: generateLocation(),
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            max_attendees: faker.number.int({ min: 5, max: 50 }),
            current_attendees: 0,
            cover_url: faker.image.url(),
            tags,
            cost: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 2000 }) : null,
            is_public: true,
            status: "active",
        });
    }

    const { data, error } = await supabase
        .from("events")
        .insert(events)
        .select("id");

    if (error) {
        console.error("Error creating events:", error);
        return [];
    }

    console.log(`Created ${data.length} events`);
    return data.map(e => e.id);
}

async function createEventAttendees(eventIds: string[], profileIds: string[]) {
    console.log("Creating event attendees...");

    const attendees = [];

    for (const eventId of eventIds) {
        // Each event gets 2-15 random attendees
        const attendeeCount = faker.number.int({ min: 2, max: 15 });
        const eventAttendees = faker.helpers.arrayElements(profileIds, attendeeCount);

        for (const profileId of eventAttendees) {
            attendees.push({
                event_id: eventId,
                user_id: profileId,
                status: "joined",
                joined_at: faker.date.past().toISOString(),
                notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
            });
        }
    }

    const { data, error } = await supabase
        .from("event_attendees")
        .insert(attendees);

    if (error) {
        console.error("Error creating attendees:", error);
    } else {
        console.log(`Created ${attendees.length} event attendees`);
    }
}

async function createCarpools(eventIds: string[], profileIds: string[]) {
    console.log("Creating carpools...");

    const carpools = [];

    // Create carpools for about 30% of events
    const carpoolEvents = faker.helpers.arrayElements(eventIds, Math.floor(eventIds.length * 0.3));

    for (const eventId of carpoolEvents) {
        const driverId = faker.helpers.arrayElement(profileIds);
        const seatsTotal = faker.number.int({ min: 2, max: 6 });

        carpools.push({
            event_id: eventId,
            driver_id: driverId,
            origin_text: generateLocation(),
            destination_text: generateLocation(),
            depart_time: faker.date.future().toISOString(),
            seats_total: seatsTotal,
            seats_available: seatsTotal,
            cost_per_person: faker.datatype.boolean() ? faker.number.int({ min: 500, max: 2000 }) : null,
            vehicle_info: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
            status: "active",
        });
    }

    const { data, error } = await supabase
        .from("carpools")
        .insert(carpools)
        .select("id");

    if (error) {
        console.error("Error creating carpools:", error);
        return [];
    }

    console.log(`Created ${data.length} carpools`);
    return data.map(c => c.id);
}

async function createCarpoolRequests(carpoolIds: string[], profileIds: string[]) {
    console.log("Creating carpool requests...");

    const requests = [];

    for (const carpoolId of carpoolIds) {
        // Each carpool gets 1-3 requests
        const requestCount = faker.number.int({ min: 1, max: 3 });
        const riders = faker.helpers.arrayElements(profileIds, requestCount);

        for (const riderId of riders) {
            requests.push({
                carpool_id: carpoolId,
                rider_id: riderId,
                seats_requested: faker.number.int({ min: 1, max: 2 }),
                status: faker.helpers.arrayElement(["pending", "accepted", "denied"]),
                message: faker.datatype.boolean() ? faker.lorem.sentence() : null,
            });
        }
    }

    const { data, error } = await supabase
        .from("carpool_requests")
        .insert(requests);

    if (error) {
        console.error("Error creating carpool requests:", error);
    } else {
        console.log(`Created ${requests.length} carpool requests`);
    }
}

async function createRatings(eventIds: string[], profileIds: string[]) {
    console.log("Creating ratings...");

    const ratings = [];

    for (const eventId of eventIds) {
        // Each event gets 3-8 ratings
        const ratingCount = faker.number.int({ min: 3, max: 8 });
        const raters = faker.helpers.arrayElements(profileIds, ratingCount);
        const ratees = faker.helpers.arrayElements(profileIds, ratingCount);

        for (let i = 0; i < ratingCount; i++) {
            if (raters[i] !== ratees[i]) { // Don't rate yourself
                ratings.push({
                    event_id: eventId,
                    rater_id: raters[i],
                    ratee_id: ratees[i],
                    stars: faker.number.int({ min: 1, max: 5 }),
                    comment: faker.datatype.boolean() ? faker.lorem.sentence() : null,
                });
            }
        }
    }

    const { data, error } = await supabase
        .from("ratings")
        .insert(ratings);

    if (error) {
        console.error("Error creating ratings:", error);
    } else {
        console.log(`Created ${ratings.length} ratings`);
    }
}

function generateEventTitle(category: string): string {
    const titles = {
        study: [
            "Study Group for Midterm",
            "Final Exam Prep Session",
            "Group Study - Calculus",
            "Library Study Session",
            "Chemistry Study Group",
        ],
        sport: [
            "Basketball Game",
            "Soccer Match",
            "Tennis Tournament",
            "Volleyball Game",
            "Swimming Practice",
        ],
        party: [
            "House Party",
            "Birthday Celebration",
            "End of Semester Party",
            "Pool Party",
            "Costume Party",
        ],
        food: [
            "Pizza Night",
            "BBQ Cookout",
            "Potluck Dinner",
            "Food Truck Festival",
            "Cooking Class",
        ],
        volunteer: [
            "Community Cleanup",
            "Food Bank Volunteer",
            "Tutoring Session",
            "Animal Shelter Help",
            "Environmental Project",
        ],
        social: [
            "Networking Event",
            "Speed Dating",
            "Game Night",
            "Movie Night",
            "Coffee Meetup",
        ],
        academic: [
            "Research Presentation",
            "Academic Conference",
            "Guest Lecture",
            "Workshop Session",
            "Panel Discussion",
        ],
        fitness: [
            "Morning Workout",
            "Yoga Class",
            "Running Group",
            "Gym Session",
            "Fitness Challenge",
        ],
        music: [
            "Concert Night",
            "Open Mic Night",
            "Music Festival",
            "Band Practice",
            "DJ Set",
        ],
        tech: [
            "Hackathon",
            "Tech Meetup",
            "Coding Workshop",
            "AI Discussion",
            "Startup Pitch",
        ],
        other: [
            "Art Exhibition",
            "Book Club",
            "Photography Walk",
            "Travel Planning",
            "Random Activity",
        ],
    };

    return faker.helpers.arrayElement(titles[category as keyof typeof titles] || titles.other);
}

function generateLocation(): string {
    const locations = [
        "Student Center",
        "Library",
        "Campus Quad",
        "Gymnasium",
        "Auditorium",
        "Coffee Shop",
        "Park",
        "Beach",
        "Mall",
        "Restaurant",
        "Community Center",
        "Sports Complex",
        "Art Gallery",
        "Theater",
        "Conference Room",
    ];

    return faker.helpers.arrayElement(locations);
}

async function main() {
    console.log("Starting seed data creation...");

    try {
        // Create profiles
        const profileIds = await createProfiles(50);

        if (profileIds.length === 0) {
            console.error("Failed to create profiles. Exiting.");
            return;
        }

        // Create events
        const eventIds = await createEvents(profileIds, 100);

        if (eventIds.length === 0) {
            console.error("Failed to create events. Exiting.");
            return;
        }

        // Create event attendees
        await createEventAttendees(eventIds, profileIds);

        // Create carpools
        const carpoolIds = await createCarpools(eventIds, profileIds);

        // Create carpool requests
        if (carpoolIds.length > 0) {
            await createCarpoolRequests(carpoolIds, profileIds);
        }

        // Create ratings
        await createRatings(eventIds, profileIds);

        console.log("Seed data creation completed successfully!");

    } catch (error) {
        console.error("Error during seed data creation:", error);
    }
}

// Run the seed script
if (require.main === module) {
    main();
}
