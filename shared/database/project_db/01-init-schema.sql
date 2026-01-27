-- ================================
-- Project Database Schema
-- ================================

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(20) NOT NULL,
    client_id VARCHAR(100) NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    budget DECIMAL(12,2) NOT NULL,
    deadline TIMESTAMP NOT NULL,
    location VARCHAR(200),
    strict_deadline BOOLEAN NOT NULL DEFAULT FALSE,
    bidding_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    auction_end_time TIMESTAMP,
    is_draft BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for projects
CREATE INDEX IF NOT EXISTS idx_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_is_draft ON projects(is_draft);
CREATE INDEX IF NOT EXISTS idx_is_deleted ON projects(is_deleted);

-- Create project_skills table
CREATE TABLE IF NOT EXISTS project_skills (
    project_id VARCHAR(255) NOT NULL,
    skill VARCHAR(50) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_project_skills_project_id ON project_skills(project_id);

-- Create project_attachments table
CREATE TABLE IF NOT EXISTS project_attachments (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    uploaded_by VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_project_attachments_project_id ON project_attachments(project_id);

-- Create project_views table
CREATE TABLE IF NOT EXISTS project_views (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(100),
    user_type VARCHAR(50),
    session_id VARCHAR(255),
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_project_views_project_id ON project_views(project_id);
CREATE INDEX IF NOT EXISTS idx_project_views_user_id ON project_views(user_id);
CREATE INDEX IF NOT EXISTS idx_project_views_session_id ON project_views(session_id);

-- Create project_bookmarks table
CREATE TABLE IF NOT EXISTS project_bookmarks (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    bookmarked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_project_bookmarks_project_id ON project_bookmarks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_bookmarks_user_id ON project_bookmarks(user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
