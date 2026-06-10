ALTER TABLE clients ADD COLUMN IF NOT EXISTS meeting_notes text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS reminders jsonb DEFAULT '[]'::jsonb;
