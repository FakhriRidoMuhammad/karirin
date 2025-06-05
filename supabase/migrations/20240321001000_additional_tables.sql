-- Create enum types for various statuses
CREATE TYPE session_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'submitted', 'completed', 'rejected');
CREATE TYPE notification_type AS ENUM ('message', 'session', 'task', 'achievement', 'review');

-- Mentorship Sessions table
CREATE TABLE mentorship_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    relation_id UUID REFERENCES mentorship_relations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status session_status DEFAULT 'scheduled',
    meeting_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tasks/Assignments table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    relation_id UUID REFERENCES mentorship_relations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    status task_status DEFAULT 'pending',
    submission_text TEXT,
    submission_url TEXT,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    relation_id UUID REFERENCES mentorship_relations(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User Achievements table
CREATE TABLE user_achievements (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, achievement_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    read BOOLEAN DEFAULT false,
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for new tables
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Mentorship Sessions policies
CREATE POLICY "Sessions viewable by participants" ON mentorship_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM mentorship_relations mr
            WHERE mr.id = mentorship_sessions.relation_id
            AND (mr.mentor_id = auth.uid() OR mr.mentee_id = auth.uid())
        )
    );

CREATE POLICY "Mentors can create sessions" ON mentorship_sessions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM mentorship_relations mr
            WHERE mr.id = relation_id AND mr.mentor_id = auth.uid()
        )
    );

-- Tasks policies
CREATE POLICY "Tasks viewable by participants" ON tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM mentorship_relations mr
            WHERE mr.id = tasks.relation_id
            AND (mr.mentor_id = auth.uid() OR mr.mentee_id = auth.uid())
        )
    );

CREATE POLICY "Mentors can create tasks" ON tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM mentorship_relations mr
            WHERE mr.id = relation_id AND mr.mentor_id = auth.uid()
        )
    );

-- Reviews policies
CREATE POLICY "Reviews are publicly viewable" ON reviews FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Achievements policies
CREATE POLICY "Achievements are publicly viewable" ON achievements FOR SELECT USING (true);

-- User Achievements policies
CREATE POLICY "User achievements are publicly viewable" ON user_achievements FOR SELECT USING (true);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Add triggers for updating timestamps
CREATE TRIGGER update_mentorship_sessions_updated_at
    BEFORE UPDATE ON mentorship_sessions
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at(); 