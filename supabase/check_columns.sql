-- Get detailed column information for all tables
SELECT 
    table_name,
    column_name,
    data_type,
    column_default,
    is_nullable,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name IN (
    'profiles',
    'skills',
    'user_skills',
    'mentorship_programs',
    'mentorship_relations',
    'mentor_profiles'
)
ORDER BY table_name, ordinal_position; 