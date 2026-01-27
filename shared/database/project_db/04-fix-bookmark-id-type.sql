-- ================================
-- Fix project_bookmarks and project_views id column types
-- Change from VARCHAR to BIGSERIAL for auto-increment
-- ================================

-- Fix project_bookmarks table
DROP TABLE IF EXISTS project_bookmarks CASCADE;

CREATE TABLE project_bookmarks (
    id BIGSERIAL PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    bookmarked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_bookmarks_project_id ON project_bookmarks(project_id);
CREATE INDEX idx_project_bookmarks_user_id ON project_bookmarks(user_id);

-- Fix project_views table
DROP TABLE IF EXISTS project_views CASCADE;

CREATE TABLE project_views (
    id BIGSERIAL PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(100),
    user_type VARCHAR(50),
    session_id VARCHAR(255),
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX idx_project_views_project_id ON project_views(project_id);
CREATE INDEX idx_project_views_user_id ON project_views(user_id);
CREATE INDEX idx_project_views_session_id ON project_views(session_id);
