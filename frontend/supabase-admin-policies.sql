-- Axione Solutions - recommended Supabase RLS policies
-- Run this in Supabase SQL Editor after creating the admin Auth user.
-- These policies assume the application uses authenticated users as admins.
-- Keep the number of authenticated users limited to your actual admins.

-- =========================
-- Blog
-- =========================
alter table if exists "Blog" enable row level security;

drop policy if exists "Public can read blogs" on "Blog";
create policy "Public can read blogs"
on "Blog" for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage blogs" on "Blog";
create policy "Admins can manage blogs"
on "Blog" for all
to authenticated
using (true)
with check (true);

-- =========================
-- Service
-- =========================
alter table if exists "Service" enable row level security;

drop policy if exists "Public can read services" on "Service";
create policy "Public can read services"
on "Service" for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage services" on "Service";
create policy "Admins can manage services"
on "Service" for all
to authenticated
using (true)
with check (true);

-- =========================
-- Contact
-- =========================
alter table if exists "Contact" enable row level security;

drop policy if exists "Public can submit contacts" on "Contact";
create policy "Public can submit contacts"
on "Contact" for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read contacts" on "Contact";
create policy "Admins can read contacts"
on "Contact" for select
to authenticated
using (true);

drop policy if exists "Admins can delete contacts" on "Contact";
create policy "Admins can delete contacts"
on "Contact" for delete
to authenticated
using (true);

-- =========================
-- Newsletter
-- =========================
alter table if exists "Newsletter" enable row level security;

drop policy if exists "Public can subscribe" on "Newsletter";
create policy "Public can subscribe"
on "Newsletter" for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read newsletter" on "Newsletter";
create policy "Admins can read newsletter"
on "Newsletter" for select
to authenticated
using (true);

drop policy if exists "Admins can delete newsletter" on "Newsletter";
create policy "Admins can delete newsletter"
on "Newsletter" for delete
to authenticated
using (true);
