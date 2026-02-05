ALTER TABLE repositories ALTER COLUMN default_branch DROP NOT NULL;
ALTER TABLE repositories ALTER COLUMN default_branch SET DEFAULT NULL;
UPDATE repositories SET default_branch = NULL;
