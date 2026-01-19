-- Create checklist_items table
CREATE TABLE IF NOT EXISTS checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checklist_items_task_id ON checklist_items(task_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_position ON checklist_items(task_id, position);

-- Enable Row Level Security
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for checklist_items (based on task ownership)
CREATE POLICY "Users can view checklist items for their own tasks"
    ON checklist_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = checklist_items.task_id
            AND tasks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create checklist items for their own tasks"
    ON checklist_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = checklist_items.task_id
            AND tasks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update checklist items for their own tasks"
    ON checklist_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = checklist_items.task_id
            AND tasks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete checklist items for their own tasks"
    ON checklist_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = checklist_items.task_id
            AND tasks.user_id = auth.uid()
        )
    );

-- Create trigger for updated_at
CREATE TRIGGER update_checklist_items_updated_at
    BEFORE UPDATE ON checklist_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
