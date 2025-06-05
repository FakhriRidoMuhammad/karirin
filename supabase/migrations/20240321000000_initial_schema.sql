-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Set up storage for profile pictures and task attachments
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('task-attachments', 'task-attachments', true);

-- Create custom types
create type user_role as enum ('student', 'mentor', 'admin');
create type task_status as enum ('draft', 'published', 'in_progress', 'submitted', 'completed');
create type submission_status as enum ('pending', 'approved', 'rejected', 'revision_needed');
create type session_status as enum ('pending', 'approved', 'cancelled', 'completed');
create type notification_type as enum ('task', 'feedback', 'achievement', 'message', 'session');
create type visibility_type as enum ('public', 'private', 'mentors');

-- Profiles table (extends Supabase auth.users)
create table profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    full_name text,
    avatar_url text,
    career_title text,
    company text,
    bio text,
    career_level text,
    skills text[],
    battle_power integer default 0,
    rank text default 'Rookie',
    role user_role default 'student',
    visibility visibility_type default 'public',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tasks/Gigs table
create table tasks (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    requirements text[],
    attachments text[],
    difficulty_level integer check (difficulty_level between 1 and 5),
    points integer default 0,
    status task_status default 'draft',
    created_by uuid references profiles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Task submissions table
create table submissions (
    id uuid default uuid_generate_v4() primary key,
    task_id uuid references tasks(id) on delete cascade,
    student_id uuid references profiles(id) on delete cascade,
    content text,
    attachments text[],
    status submission_status default 'pending',
    submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Feedback table
create table feedback (
    id uuid default uuid_generate_v4() primary key,
    submission_id uuid references submissions(id) on delete cascade,
    mentor_id uuid references profiles(id) on delete set null,
    content text not null,
    rating integer check (rating between 1 and 5),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Achievements table
create table achievements (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    icon_url text,
    points integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User achievements junction table
create table user_achievements (
    profile_id uuid references profiles(id) on delete cascade,
    achievement_id uuid references achievements(id) on delete cascade,
    earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (profile_id, achievement_id)
);

-- Career map nodes table
create table career_nodes (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    requirements text[],
    level integer not null,
    position_x integer,
    position_y integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User progress in career map
create table career_progress (
    profile_id uuid references profiles(id) on delete cascade,
    node_id uuid references career_nodes(id) on delete cascade,
    completed boolean default false,
    completed_at timestamp with time zone,
    primary key (profile_id, node_id)
);

-- Notifications table
create table notifications (
    id uuid default uuid_generate_v4() primary key,
    profile_id uuid references profiles(id) on delete cascade,
    type notification_type not null,
    title text not null,
    content text,
    read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Forum topics table
create table forum_topics (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    content text not null,
    created_by uuid references profiles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Forum replies table
create table forum_replies (
    id uuid default uuid_generate_v4() primary key,
    topic_id uuid references forum_topics(id) on delete cascade,
    content text not null,
    created_by uuid references profiles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mentor sessions table
create table mentor_sessions (
    id uuid default uuid_generate_v4() primary key,
    mentor_id uuid references profiles(id) on delete set null,
    student_id uuid references profiles(id) on delete cascade,
    title text not null,
    description text,
    scheduled_at timestamp with time zone not null,
    duration interval not null,
    status session_status default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Career assessments table
create table career_assessments (
    id uuid default uuid_generate_v4() primary key,
    profile_id uuid references profiles(id) on delete cascade,
    answers jsonb not null,
    results jsonb,
    recommendations text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index idx_profiles_username on profiles(username);
create index idx_tasks_status on tasks(status);
create index idx_submissions_task_id on submissions(task_id);
create index idx_submissions_student_id on submissions(student_id);
create index idx_feedback_submission_id on feedback(submission_id);
create index idx_notifications_profile_id on notifications(profile_id);
create index idx_forum_topics_created_by on forum_topics(created_by);
create index idx_mentor_sessions_mentor_id on mentor_sessions(mentor_id);
create index idx_mentor_sessions_student_id on mentor_sessions(student_id);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table tasks enable row level security;
alter table submissions enable row level security;
alter table feedback enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;
alter table career_nodes enable row level security;
alter table career_progress enable row level security;
alter table notifications enable row level security;
alter table forum_topics enable row level security;
alter table forum_replies enable row level security;
alter table mentor_sessions enable row level security;
alter table career_assessments enable row level security;

-- Create policies
-- Profiles: Users can read public profiles, but only edit their own
create policy "Public profiles are viewable by everyone"
    on profiles for select
    using (visibility = 'public' or auth.uid() = id);

create policy "Users can update own profile"
    on profiles for update
    using (auth.uid() = id);

-- Tasks: Published tasks are viewable by everyone, draft only by creator
create policy "Published tasks are viewable by everyone"
    on tasks for select
    using (status = 'published' or auth.uid() = created_by);

create policy "Creators can update own tasks"
    on tasks for update
    using (auth.uid() = created_by);

-- More policies will be added as needed for other tables

-- Functions for updating timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updating timestamps
create trigger update_profiles_updated_at
    before update on profiles
    for each row
    execute function update_updated_at_column();

create trigger update_tasks_updated_at
    before update on tasks
    for each row
    execute function update_updated_at_column();

create trigger update_submissions_updated_at
    before update on submissions
    for each row
    execute function update_updated_at_column();

create trigger update_forum_topics_updated_at
    before update on forum_topics
    for each row
    execute function update_updated_at_column();

create trigger update_mentor_sessions_updated_at
    before update on mentor_sessions
    for each row
    execute function update_updated_at_column();

create trigger update_career_assessments_updated_at
    before update on career_assessments
    for each row
    execute function update_updated_at_column(); 