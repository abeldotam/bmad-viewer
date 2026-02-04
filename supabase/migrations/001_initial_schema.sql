-- Repositories table: stores connected GitHub repos
CREATE TABLE IF NOT EXISTS repositories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  github_token_encrypted TEXT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, owner, name)
);

-- Cached files table: stores GitHub file contents
CREATE TABLE IF NOT EXISTS cached_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  repository_id UUID NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  content TEXT,
  sha TEXT,
  cached_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(repository_id, path)
);

-- Enable RLS
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cached_files ENABLE ROW LEVEL SECURITY;

-- Repositories: users can only access their own repos
CREATE POLICY "Users can view own repositories"
  ON repositories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own repositories"
  ON repositories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own repositories"
  ON repositories FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own repositories"
  ON repositories FOR UPDATE
  USING (auth.uid() = user_id);

-- Cached files: accessible through repository ownership
CREATE POLICY "Users can view cached files for own repos"
  ON cached_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM repositories
      WHERE repositories.id = cached_files.repository_id
      AND repositories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert cached files for own repos"
  ON cached_files FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM repositories
      WHERE repositories.id = cached_files.repository_id
      AND repositories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update cached files for own repos"
  ON cached_files FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM repositories
      WHERE repositories.id = cached_files.repository_id
      AND repositories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete cached files for own repos"
  ON cached_files FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM repositories
      WHERE repositories.id = cached_files.repository_id
      AND repositories.user_id = auth.uid()
    )
  );
