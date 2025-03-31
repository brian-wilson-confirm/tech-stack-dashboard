-- Clean up existing data in reverse order of dependencies
TRUNCATE task_topics CASCADE;
TRUNCATE tasks CASCADE;
TRUNCATE topics CASCADE;
TRUNCATE sources CASCADE;
TRUNCATE technologies CASCADE;
TRUNCATE sections CASCADE;
TRUNCATE subcategories CASCADE;
TRUNCATE categories CASCADE; 