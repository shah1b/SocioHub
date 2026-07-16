-- Admin roles for the Flow admin console.

alter table public.profiles
  add column role text not null default 'user'
  check (role in ('user', 'admin'));

-- Helper used by admin policies; security definer so it can read profiles
-- without recursing through RLS.
create function public.is_admin()
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid () and role = 'admin'
  );
$$;

-- Admins can see and manage everything user-facing policies scope per-user.
create policy "Admins can view all profiles"
  on public.profiles for select using (public.is_admin ());

create policy "Admins can update all profiles"
  on public.profiles for update using (public.is_admin ());

create policy "Admins manage creators"
  on public.creators for all using (public.is_admin ());

create policy "Admins manage feed items"
  on public.feed_items for all using (public.is_admin ());

create policy "Admins manage interests"
  on public.interests for all using (public.is_admin ());

create policy "Admins can view all connections"
  on public.platform_connections for select using (public.is_admin ());
