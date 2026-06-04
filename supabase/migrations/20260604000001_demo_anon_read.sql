-- Demo-only: allow anon role to SELECT (the /dashboard route is gated by cookie password).
-- Drop these policies once Supabase auth is fully wired up.
CREATE POLICY "demo_anon_read_clients" ON public.clients FOR SELECT TO anon USING (true);
CREATE POLICY "demo_anon_read_assets" ON public.assets FOR SELECT TO anon USING (true);
CREATE POLICY "demo_anon_read_liabilities" ON public.liabilities FOR SELECT TO anon USING (true);
CREATE POLICY "demo_anon_read_action_items" ON public.action_items FOR SELECT TO anon USING (true);
CREATE POLICY "demo_anon_read_meetings" ON public.meetings FOR SELECT TO anon USING (true);
CREATE POLICY "demo_anon_read_documents" ON public.documents FOR SELECT TO anon USING (true);
