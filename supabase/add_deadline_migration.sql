-- Add deadline column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deadline DATE;

-- Create index for deadline queries
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
