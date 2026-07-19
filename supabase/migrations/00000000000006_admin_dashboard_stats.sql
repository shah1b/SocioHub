-- Aggregate stats for the admin dashboard. SECURITY DEFINER so the
-- console can show live totals before full admin sign-in exists —
-- exposes only counts and the top item, never user rows.
create function public.admin_dashboard_stats()
returns jsonb
language sql
security definer set search_path = ''
stable
as $$
  select jsonb_build_object(
    'generated_at', now(),
    'total_users', (select count(*) from public.profiles),
    'new_users_7d', (
      select count(*) from public.profiles
      where created_at > now() - interval '7 days'
    ),
    'new_users_30d', (
      select count(*) from public.profiles
      where created_at > now() - interval '30 days'
    ),
    'total_creators', (select count(*) from public.creators),
    'total_items', (select count(*) from public.feed_items),
    'items_24h', (
      select count(*) from public.feed_items
      where created_at > now() - interval '24 hours'
    ),
    'total_reactions', (
      select coalesce(sum(reactions), 0) from public.feed_items
    ),
    'items_by_platform', (
      select coalesce(
        jsonb_object_agg(platform, item_count order by platform), '{}'::jsonb
      )
      from (
        select platform, count(*) as item_count
        from public.feed_items group by platform
      ) counts
    ),
    'top_item', (
      select jsonb_build_object(
        'title', title, 'reactions', reactions, 'platform', platform
      )
      from public.feed_items order by reactions desc limit 1
    ),
    'latest_item_at', (select max(published_at) from public.feed_items)
  );
$$;

grant execute on function public.admin_dashboard_stats() to anon, authenticated;
