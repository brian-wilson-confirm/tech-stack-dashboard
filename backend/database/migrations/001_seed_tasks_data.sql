-- Insert categories
INSERT INTO categories (name) VALUES
    ('Frontend'),
    ('Middleware'),
    ('Backend'),
    ('Database'),
    ('Messaging'),
    ('DevOps'),
    ('Security'),
    ('Monitoring');

-- Insert subcategories
INSERT INTO subcategories (name, category_id) VALUES
    ('Runtime Environment', (SELECT id FROM categories WHERE name = 'Frontend')),
    ('Build & Compile Tool', (SELECT id FROM categories WHERE name = 'Frontend')),
    ('UI Framework', (SELECT id FROM categories WHERE name = 'Frontend')),
    ('JS Library', (SELECT id FROM categories WHERE name = 'Frontend')),
    ('Testing & Debugging', (SELECT id FROM categories WHERE name = 'Frontend')),
    ('API Gateway', (SELECT id FROM categories WHERE name = 'Middleware')),
    ('API Layer', (SELECT id FROM categories WHERE name = 'Middleware')),
    ('Runtime Environment', (SELECT id FROM categories WHERE name = 'Backend')),
    ('Language', (SELECT id FROM categories WHERE name = 'Backend')),
    ('Web Framework', (SELECT id FROM categories WHERE name = 'Backend')),
    ('API Framework', (SELECT id FROM categories WHERE name = 'Backend')),
    ('Testing & Debugging', (SELECT id FROM categories WHERE name = 'Backend')),
    ('SQL Database', (SELECT id FROM categories WHERE name = 'Database')),
    ('NoSQL Database', (SELECT id FROM categories WHERE name = 'Database')),
    ('In-Memory Cache', (SELECT id FROM categories WHERE name = 'Database')),
    ('Object Storage', (SELECT id FROM categories WHERE name = 'Database')),
    ('Search & Analytics', (SELECT id FROM categories WHERE name = 'Database')),
    ('Message Broker', (SELECT id FROM categories WHERE name = 'Messaging')),
    ('Message Queue', (SELECT id FROM categories WHERE name = 'Messaging')),
    ('Task Queue', (SELECT id FROM categories WHERE name = 'Messaging')),
    ('Version Control', (SELECT id FROM categories WHERE name = 'DevOps')),
    ('CDN', (SELECT id FROM categories WHERE name = 'DevOps')),
    ('Containerization', (SELECT id FROM categories WHERE name = 'DevOps')),
    ('Orchestration', (SELECT id FROM categories WHERE name = 'DevOps')),
    ('Infrastructure as Code', (SELECT id FROM categories WHERE name = 'DevOps')),
    ('CI/CD Pipeline', (SELECT id FROM categories WHERE name = 'DevOps')),
    ('Authentication', (SELECT id FROM categories WHERE name = 'Security')),
    ('Authorization', (SELECT id FROM categories WHERE name = 'Security')),
    ('Logging', (SELECT id FROM categories WHERE name = 'Monitoring')),
    ('Tracing', (SELECT id FROM categories WHERE name = 'Monitoring')),
    ('Alerting', (SELECT id FROM categories WHERE name = 'Monitoring'));

-- Insert sections
INSERT INTO sections (name) VALUES
    ('Architecture'),
    ('Development'),
    ('Testing'),
    ('Documentation'),
    ('Infrastructure'),
    ('Security'),
    ('Performance'),
    ('Monitoring'),
    ('Maintenance'),
    ('Research'),
    ('Learning');

-- Insert technologies
INSERT INTO technologies (name) VALUES
    -- Frontend
    ('React'),
    ('Next.js'),
    ('TypeScript'),
    ('Vite'),
    ('Jest'),
    -- Middleware
    ('Kong'),
    ('GraphQL'),
    -- Backend
    ('Node.js'),
    ('Python'),
    ('FastAPI'),
    ('Django'),
    ('PyTest'),
    -- Database
    ('PostgreSQL'),
    ('MongoDB'),
    ('Redis'),
    ('MinIO'),
    ('Elasticsearch'),
    -- Messaging
    ('Apache Kafka'),
    ('RabbitMQ'),
    ('Celery'),
    -- DevOps
    ('Git'),
    ('Cloudflare'),
    ('Docker'),
    ('Kubernetes'),
    ('Terraform'),
    ('Jenkins'),
    -- Security
    ('Auth0'),
    ('Keycloak'),
    -- Monitoring
    ('ELK Stack'),
    ('Jaeger'),
    ('Grafana');

-- Insert sources
INSERT INTO sources (name) VALUES
    ('Internal Project'),
    ('Architecture Review'),
    ('Security Audit'),
    ('Performance Optimization'),
    ('Bug Report'),
    ('Feature Request'),
    ('Technical Debt'),
    ('Learning Path'),
    ('Research Initiative'),
    ('Compliance Requirement'),
    ('Customer Feedback'),
    ('Team Initiative'),
    ('Infrastructure Upgrade'),
    ('Documentation Sprint');

-- Insert topics
INSERT INTO topics (name) VALUES
    -- Frontend
    ('Component Design'),
    ('State Management'),
    ('Routing'),
    ('API Integration'),
    ('Unit Testing'),
    ('E2E Testing'),
    ('Performance Optimization'),
    ('Responsive Design'),
    ('Accessibility'),
    -- Backend
    ('REST API'),
    ('GraphQL API'),
    ('Authentication'),
    ('Authorization'),
    ('Data Validation'),
    ('Error Handling'),
    ('Caching'),
    ('Database Design'),
    ('Query Optimization'),
    -- DevOps
    ('CI/CD'),
    ('Container Orchestration'),
    ('Infrastructure as Code'),
    ('Monitoring'),
    ('Logging'),
    ('High Availability'),
    ('Scalability'),
    ('Security'),
    ('Backup & Recovery');

-- Insert tasks
WITH task_data (task_name, technology, subcategory, section, source, estimated_duration, topics, level, type, priority, status, progress, done, "order", start_date, end_date, actual_duration) AS (
    VALUES
    (
        'Implement user authentication with Auth0',
        'Auth0',
        'Authentication',
        'Security',
        'Security Audit',
        24,
        ARRAY['Authentication', 'Security', 'API Integration'],
        'advanced'::task_level,
        'implementation'::task_type,
        'high'::task_priority,
        'in_progress'::task_status,
        60,
        FALSE,
        1,
        '2024-03-01',
        '2024-03-15',
        NULL
    ),
    (
        'Set up Kubernetes cluster for production',
        'Kubernetes',
        'Orchestration',
        'Infrastructure',
        'Infrastructure Upgrade',
        40,
        ARRAY['Container Orchestration', 'High Availability', 'Scalability'],
        'expert'::task_level,
        'implementation'::task_type,
        'critical'::task_priority,
        'in_progress'::task_status,
        75,
        FALSE,
        2,
        '2024-03-10',
        '2024-03-30',
        NULL
    ),
    (
        'Implement GraphQL API Gateway',
        'GraphQL',
        'API Gateway',
        'Architecture',
        'Architecture Review',
        32,
        ARRAY['GraphQL API', 'API Integration', 'Performance Optimization'],
        'advanced'::task_level,
        'implementation'::task_type,
        'high'::task_priority,
        'not_started'::task_status,
        0,
        FALSE,
        3,
        NULL,
        NULL,
        NULL
    )
)
INSERT INTO tasks (
    task,
    technology_id,
    subcategory_id,
    section_id,
    source_id,
    estimated_duration,
    level,
    type,
    priority,
    status,
    progress,
    done,
    "order",
    start_date,
    end_date,
    actual_duration
)
SELECT
    d.task_name,
    tech.id,
    sub.id,
    sec.id,
    src.id,
    d.estimated_duration,
    d.level,
    d.type,
    d.priority,
    d.status,
    d.progress,
    d.done,
    d."order",
    d.start_date::date,
    d.end_date::date,
    d.actual_duration::integer
FROM task_data d
JOIN technologies tech ON tech.name = d.technology
JOIN subcategories sub ON sub.name = d.subcategory
JOIN sections sec ON sec.name = d.section
JOIN sources src ON src.name = d.source;

-- Insert task_topics relationships
WITH task_topic_data AS (
    SELECT t.id as task_id, top.id as topic_id
    FROM tasks t
    CROSS JOIN LATERAL unnest(ARRAY['Authentication', 'Security', 'API Integration']) as topic_name
    JOIN topics top ON top.name = topic_name
    WHERE t.task = 'Implement user authentication with Auth0'
    UNION ALL
    SELECT t.id as task_id, top.id as topic_id
    FROM tasks t
    CROSS JOIN LATERAL unnest(ARRAY['Container Orchestration', 'High Availability', 'Scalability']) as topic_name
    JOIN topics top ON top.name = topic_name
    WHERE t.task = 'Set up Kubernetes cluster for production'
    UNION ALL
    SELECT t.id as task_id, top.id as topic_id
    FROM tasks t
    CROSS JOIN LATERAL unnest(ARRAY['GraphQL API', 'API Integration', 'Performance Optimization']) as topic_name
    JOIN topics top ON top.name = topic_name
    WHERE t.task = 'Implement GraphQL API Gateway'
)
INSERT INTO task_topics (task_id, topic_id)
SELECT task_id, topic_id FROM task_topic_data; 