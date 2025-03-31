-- Create ENUMs for various status and type fields
CREATE TYPE task_status AS ENUM (
    'not_started',
    'in_progress',
    'completed',
    'on_hold',
    'cancelled'
);

CREATE TYPE task_priority AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

CREATE TYPE task_type AS ENUM (
    'learning',
    'implementation',
    'research',
    'documentation',
    'maintenance'
);

CREATE TYPE task_level AS ENUM (
    'beginner',
    'intermediate',
    'advanced',
    'expert'
);

-- Create categories table to normalize category data
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create subcategories table with foreign key to categories
CREATE TABLE subcategories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, category_id)
);

-- Create sections table
CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create technologies table
CREATE TABLE technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sources table
CREATE TABLE sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create topics table
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create main tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    done BOOLEAN NOT NULL DEFAULT FALSE,
    task VARCHAR(255) NOT NULL,
    technology_id INTEGER NOT NULL REFERENCES technologies(id),
    subcategory_id INTEGER NOT NULL REFERENCES subcategories(id),
    section_id INTEGER NOT NULL REFERENCES sections(id),
    estimated_duration INTEGER NOT NULL CHECK (estimated_duration > 0),
    actual_duration INTEGER CHECK (actual_duration > 0),
    "order" INTEGER NOT NULL,
    status task_status NOT NULL DEFAULT 'not_started',
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    priority task_priority NOT NULL DEFAULT 'medium',
    type task_type NOT NULL,
    level task_level NOT NULL,
    source_id INTEGER NOT NULL REFERENCES sources(id),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (
        (start_date IS NULL AND end_date IS NULL) OR
        (start_date IS NOT NULL AND end_date IS NULL) OR
        (start_date IS NOT NULL AND end_date IS NOT NULL AND end_date >= start_date)
    )
);

-- Create junction table for tasks and topics (many-to-many)
CREATE TABLE task_topics (
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id, topic_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_level ON tasks(level);
CREATE INDEX idx_tasks_progress ON tasks(progress);
CREATE INDEX idx_tasks_dates ON tasks(start_date, end_date);
CREATE INDEX idx_tasks_done ON tasks(done);
CREATE INDEX idx_tasks_order ON tasks("order");

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables to maintain updated_at
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at
    BEFORE UPDATE ON subcategories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at
    BEFORE UPDATE ON sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technologies_updated_at
    BEFORE UPDATE ON technologies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sources_updated_at
    BEFORE UPDATE ON sources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topics_updated_at
    BEFORE UPDATE ON topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to tables and columns for documentation
COMMENT ON TABLE tasks IS 'Main tasks table storing all task-related information';
COMMENT ON TABLE categories IS 'Normalized categories for tasks';
COMMENT ON TABLE subcategories IS 'Normalized subcategories related to main categories';
COMMENT ON TABLE sections IS 'Normalized sections for task organization';
COMMENT ON TABLE technologies IS 'Normalized technologies used in tasks';
COMMENT ON TABLE sources IS 'Normalized sources of tasks';
COMMENT ON TABLE topics IS 'Normalized topics associated with tasks';
COMMENT ON TABLE task_topics IS 'Junction table for many-to-many relationship between tasks and topics';

-- Create a view for easier querying of complete task information
CREATE VIEW task_details AS
SELECT 
    t.id,
    t.done,
    t.task,
    tech.name AS technology,
    sub.name AS subcategory,
    cat.name AS category,
    sec.name AS section,
    t.estimated_duration,
    t.actual_duration,
    t."order",
    t.status,
    t.progress,
    t.priority,
    t.type,
    t.level,
    src.name AS source,
    array_agg(top.name) AS topics,
    t.start_date,
    t.end_date,
    t.created_at,
    t.updated_at
FROM tasks t
JOIN technologies tech ON t.technology_id = tech.id
JOIN subcategories sub ON t.subcategory_id = sub.id
JOIN categories cat ON sub.category_id = cat.id
JOIN sections sec ON t.section_id = sec.id
JOIN sources src ON t.source_id = src.id
LEFT JOIN task_topics tt ON t.id = tt.task_id
LEFT JOIN topics top ON tt.topic_id = top.id
GROUP BY 
    t.id, t.done, t.task, tech.name, sub.name, cat.name, sec.name,
    t.estimated_duration, t.actual_duration, t."order", t.status,
    t.progress, t.priority, t.type, t.level, src.name,
    t.start_date, t.end_date, t.created_at, t.updated_at; 