-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  campus_name TEXT NOT NULL,
  class_year INTEGER CHECK (class_year >= 2020 AND class_year <= 2030),
  major TEXT,
  bio TEXT CHECK (LENGTH(bio) <= 500),
  interests TEXT[] DEFAULT '{}',
  rating_avg DECIMAL(3,2) DEFAULT 0 CHECK (rating_avg >= 0 AND rating_avg <= 5),
  rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (LENGTH(title) <= 100),
  description TEXT CHECK (LENGTH(description) <= 1000),
  category TEXT NOT NULL CHECK (category IN ('study', 'sport', 'party', 'food', 'volunteer', 'social', 'academic', 'fitness', 'music', 'tech', 'other')),
  location_text TEXT NOT NULL CHECK (LENGTH(location_text) <= 200),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_attendees INTEGER DEFAULT 20 CHECK (max_attendees >= 1 AND max_attendees <= 100),
  current_attendees INTEGER DEFAULT 0 CHECK (current_attendees >= 0),
  cover_url TEXT,
  tags TEXT[] DEFAULT '{}',
  cost INTEGER CHECK (cost >= 0), -- Cost in cents
  is_public BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_attendees table
CREATE TABLE event_attendees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'joined' CHECK (status IN ('joined', 'requested', 'denied')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT CHECK (LENGTH(notes) <= 200),
  UNIQUE(event_id, user_id)
);

-- Create carpools table
CREATE TABLE carpools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  origin_text TEXT NOT NULL CHECK (LENGTH(origin_text) <= 200),
  destination_text TEXT NOT NULL CHECK (LENGTH(destination_text) <= 200),
  depart_time TIMESTAMP WITH TIME ZONE NOT NULL,
  seats_total INTEGER NOT NULL CHECK (seats_total >= 1 AND seats_total <= 8),
  seats_available INTEGER NOT NULL CHECK (seats_available >= 0),
  cost_per_person INTEGER CHECK (cost_per_person >= 0),
  vehicle_info TEXT CHECK (LENGTH(vehicle_info) <= 200),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'full', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create carpool_requests table
CREATE TABLE carpool_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  carpool_id UUID REFERENCES carpools(id) ON DELETE CASCADE NOT NULL,
  rider_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seats_requested INTEGER DEFAULT 1 CHECK (seats_requested >= 1 AND seats_requested <= 4),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'denied', 'cancelled')),
  message TEXT CHECK (LENGTH(message) <= 200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(carpool_id, rider_id)
);

-- Create ratings table
CREATE TABLE ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  rater_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  ratee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  comment TEXT CHECK (LENGTH(comment) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, rater_id, ratee_id)
);

-- Create threads table
CREATE TABLE threads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('event', 'carpool', 'dm')),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  carpool_id UUID REFERENCES carpools(id) ON DELETE CASCADE,
  participants UUID[] NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (LENGTH(content) <= 1000),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'location')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_host_id ON events(host_id);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_location ON events(latitude, longitude);

CREATE INDEX idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user_id ON event_attendees(user_id);

CREATE INDEX idx_carpools_event_id ON carpools(event_id);
CREATE INDEX idx_carpools_driver_id ON carpools(driver_id);

CREATE INDEX idx_carpool_requests_carpool_id ON carpool_requests(carpool_id);
CREATE INDEX idx_carpool_requests_rider_id ON carpool_requests(rider_id);

CREATE INDEX idx_ratings_event_id ON ratings(event_id);
CREATE INDEX idx_ratings_ratee_id ON ratings(ratee_id);

CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE carpools ENABLE ROW LEVEL SECURITY;
ALTER TABLE carpool_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view public events" ON events FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view events they're attending" ON events FOR SELECT USING (
  EXISTS (SELECT 1 FROM event_attendees WHERE event_id = events.id AND user_id = auth.uid())
);
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = host_id);

-- Event attendees policies
CREATE POLICY "Users can view attendees of events they're part of" ON event_attendees FOR SELECT USING (
  EXISTS (SELECT 1 FROM event_attendees ea WHERE ea.event_id = event_attendees.event_id AND ea.user_id = auth.uid())
);
CREATE POLICY "Users can join events" ON event_attendees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attendance" ON event_attendees FOR UPDATE USING (auth.uid() = user_id);

-- Carpools policies
CREATE POLICY "Anyone can view active carpools" ON carpools FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create carpools" ON carpools FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "Users can update own carpools" ON carpools FOR UPDATE USING (auth.uid() = driver_id);

-- Carpool requests policies
CREATE POLICY "Users can view requests for their carpools" ON carpool_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM carpools WHERE id = carpool_requests.carpool_id AND driver_id = auth.uid())
);
CREATE POLICY "Users can create carpool requests" ON carpool_requests FOR INSERT WITH CHECK (auth.uid() = rider_id);
CREATE POLICY "Users can update own carpool requests" ON carpool_requests FOR UPDATE USING (auth.uid() = rider_id);

-- Ratings policies
CREATE POLICY "Users can view ratings" ON ratings FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON ratings FOR INSERT WITH CHECK (auth.uid() = rater_id);

-- Threads policies
CREATE POLICY "Users can view threads they participate in" ON threads FOR SELECT USING (
  auth.uid() = ANY(participants)
);
CREATE POLICY "Users can create threads" ON threads FOR INSERT WITH CHECK (
  auth.uid() = ANY(participants)
);

-- Messages policies
CREATE POLICY "Users can view messages in their threads" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM threads WHERE id = messages.thread_id AND auth.uid() = ANY(participants))
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carpools_updated_at BEFORE UPDATE ON carpools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carpool_requests_updated_at BEFORE UPDATE ON carpool_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_threads_updated_at BEFORE UPDATE ON threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update event attendee count
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events SET current_attendees = current_attendees + 1 WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events SET current_attendees = current_attendees - 1 WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to update attendee count
CREATE TRIGGER update_event_attendee_count_trigger
    AFTER INSERT OR DELETE ON event_attendees
    FOR EACH ROW EXECUTE FUNCTION update_event_attendee_count();

-- Function to update carpool seat count
CREATE OR REPLACE FUNCTION update_carpool_seats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE carpools SET seats_available = seats_available - NEW.seats_requested WHERE id = NEW.carpool_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'pending' AND NEW.status = 'accepted' THEN
            UPDATE carpools SET seats_available = seats_available - NEW.seats_requested WHERE id = NEW.carpool_id;
        ELSIF OLD.status = 'accepted' AND NEW.status != 'accepted' THEN
            UPDATE carpools SET seats_available = seats_available + OLD.seats_requested WHERE id = OLD.carpool_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.status = 'accepted' THEN
            UPDATE carpools SET seats_available = seats_available + OLD.seats_requested WHERE id = OLD.carpool_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to update carpool seats
CREATE TRIGGER update_carpool_seats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON carpool_requests
    FOR EACH ROW EXECUTE FUNCTION update_carpool_seats();