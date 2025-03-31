-- Drop the view first
DROP VIEW IF EXISTS task_details;

-- Drop triggers
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_subcategories_updated_at ON subcategories;
DROP TRIGGER IF EXISTS update_sections_updated_at ON sections;
DROP TRIGGER IF EXISTS update_technologies_updated_at ON technologies;
DROP TRIGGER IF EXISTS update_sources_updated_at ON sources;
DROP TRIGGER IF EXISTS update_topics_updated_at ON topics;

-- Drop trigger function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_tasks_status;
DROP INDEX IF EXISTS idx_tasks_priority;
DROP INDEX IF EXISTS idx_tasks_type;
DROP INDEX IF EXISTS idx_tasks_level;
DROP INDEX IF EXISTS idx_tasks_progress;
DROP INDEX IF EXISTS idx_tasks_dates;
DROP INDEX IF EXISTS idx_tasks_done;
DROP INDEX IF EXISTS idx_tasks_order;

-- Drop junction table first to avoid foreign key constraints
DROP TABLE IF EXISTS task_topics;

-- Drop main table
DROP TABLE IF EXISTS tasks;

-- Drop reference tables
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS sources;
DROP TABLE IF EXISTS technologies;
DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS subcategories;
DROP TABLE IF EXISTS categories;

-- Drop ENUMs
DROP TYPE IF EXISTS task_status;
DROP TYPE IF EXISTS task_priority;
DROP TYPE IF EXISTS task_type;
DROP TYPE IF EXISTS task_level; 