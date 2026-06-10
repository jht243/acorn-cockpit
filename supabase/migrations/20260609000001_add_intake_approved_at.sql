-- Track when an admin (Karli) approves a submitted intake and sends the booking invite.
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS intake_approved_at TIMESTAMP WITH TIME ZONE;
