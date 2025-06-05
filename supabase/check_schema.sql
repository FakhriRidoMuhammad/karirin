-- Check installed extensions
SELECT extname, extversion 
FROM pg_extension;

-- Check existing schemas
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
ORDER BY schema_name;

-- Check existing tables in public schema
SELECT 
    table_name,
    (SELECT count(*) FROM information_schema.columns c WHERE c.table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check custom types (enums)
SELECT 
    t.typname as enum_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
GROUP BY t.typname
ORDER BY t.typname;

-- Check table details for each table in public schema
SELECT 
    c.table_name,
    c.column_name,
    c.data_type,
    c.column_default,
    c.is_nullable,
    c.character_maximum_length,
    (
        SELECT constraint_type 
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage cu 
            ON cu.constraint_name = tc.constraint_name
        WHERE tc.table_name = c.table_name 
            AND cu.column_name = c.column_name
            AND tc.constraint_type = 'PRIMARY KEY'
    ) is_primary_key,
    (
        SELECT constraint_type 
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage cu 
            ON cu.constraint_name = tc.constraint_name
        WHERE tc.table_name = c.table_name 
            AND cu.column_name = c.column_name
            AND tc.constraint_type = 'UNIQUE'
    ) is_unique
FROM information_schema.columns c
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Check foreign keys
SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public';

-- Check indexes
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
ORDER BY
    tablename,
    indexname;

-- Check RLS policies
SELECT
    n.nspname as schema,
    c.relname as table,
    pol.polname as policy,
    CASE pol.polpermissive
        WHEN TRUE THEN 'PERMISSIVE'
        ELSE 'RESTRICTIVE'
    END as policy_type,
    CASE pol.polroles = '{0}' 
        WHEN TRUE THEN 'PUBLIC'
        ELSE array_to_string(ARRAY(
            SELECT rolname 
            FROM pg_roles 
            WHERE oid = ANY(pol.polroles)
        ), ',')
    END as roles,
    pol.polcmd as command,
    pg_get_expr(pol.polqual, pol.polrelid) as using_expression,
    pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expression
FROM pg_policy pol
JOIN pg_class c ON (c.oid = pol.polrelid)
JOIN pg_namespace n ON (n.oid = c.relnamespace)
WHERE n.nspname = 'public'
ORDER BY schema, "table", policy;

-- Check storage buckets
SELECT name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
ORDER BY name;

-- Check triggers
SELECT 
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_name, 
    event_manipulation, 
    action_timing as timing,
    action_statement as definition
FROM information_schema.triggers
WHERE event_object_schema = 'public'
ORDER BY event_object_table, trigger_name; 