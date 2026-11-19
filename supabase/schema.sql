-- Intellobyte Toys schema. Idempotent: safe to re-run.
create extension if not exists pgcrypto;

create table if not exists categories (
  slug text primary key,
  name text not null,
  tagline text,
  image text,
  sort int not null default 0
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand text,
  category text references categories(slug),
  tags text[] not null default '{}',
  price int not null check (price >= 0),
  mrp int,
  badge text,
  short text,
  description text,
  features text[] not null default '{}',
  images text[] not null default '{}',
  stock int not null default 25 check (stock >= 0),
  rating numeric(2,1) not null default 0,
  review_count int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists products_category_idx on products(category);
create index if not exists products_tags_idx on products using gin(tags);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author text not null,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  created_at timestamptz not null default now()
);

create table if not exists coupons (
  code text primary key,
  percent int not null check (percent between 1 and 90),
  min_total int not null default 0,
  active boolean not null default true
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_no bigint generated always as identity (start with 10001),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  name text not null,
  phone text not null,
  address jsonb not null,
  subtotal int not null,
  discount int not null default 0,
  shipping int not null default 0,
  total int not null,
  coupon text,
  payment_method text not null default 'cod',
  status text not null default 'placed' check (status in ('placed','packed','shipped','delivered','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name text not null,
  image text,
  price int not null,
  qty int not null check (qty > 0)
);

create table if not exists subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Keep product rating in sync with reviews.
create or replace function refresh_rating() returns trigger language plpgsql security definer set search_path = public as $$
declare pid uuid := coalesce(new.product_id, old.product_id);
begin
  update products set
    rating = coalesce((select round(avg(rating)::numeric, 1) from reviews where product_id = pid), 0),
    review_count = (select count(*) from reviews where product_id = pid)
  where id = pid;
  return null;
end $$;
drop trigger if exists reviews_rating on reviews;
create trigger reviews_rating after insert or update or delete on reviews for each row execute function refresh_rating();

-- Atomic checkout: prices come from the DB, stock is locked and decremented.
create or replace function place_order(
  p_user uuid, p_email text, p_name text, p_phone text, p_address jsonb,
  p_items jsonb, p_coupon text, p_payment text
) returns table(order_id uuid, order_no bigint, total int)
language plpgsql security definer set search_path = public as $$
declare
  it jsonb; pr products%rowtype; q int;
  v_sub int := 0; v_disc int := 0; v_ship int; v_total int; v_order uuid; v_no bigint; c coupons%rowtype;
begin
  if jsonb_array_length(p_items) = 0 then raise exception 'Cart is empty'; end if;
  for it in select * from jsonb_array_elements(p_items) loop
    q := (it->>'qty')::int;
    if q is null or q < 1 or q > 10 then raise exception 'Invalid quantity'; end if;
    select * into pr from products where id = (it->>'id')::uuid and active for update;
    if not found then raise exception 'Product unavailable'; end if;
    if pr.stock < q then raise exception '% is out of stock', pr.name; end if;
    v_sub := v_sub + pr.price * q;
  end loop;

  if p_coupon is not null and p_coupon <> '' then
    select * into c from coupons where code = upper(p_coupon) and active;
    if found and v_sub >= c.min_total then v_disc := (v_sub * c.percent) / 100; end if;
  end if;
  v_ship := case when v_sub - v_disc >= 999 then 0 else 99 end;
  v_total := v_sub - v_disc + v_ship;

  insert into orders(user_id, email, name, phone, address, subtotal, discount, shipping, total, coupon, payment_method)
  values (p_user, p_email, p_name, p_phone, p_address, v_sub, v_disc, v_ship, v_total,
          case when v_disc > 0 then upper(p_coupon) end, coalesce(p_payment, 'cod'))
  returning id, orders.order_no into v_order, v_no;

  for it in select * from jsonb_array_elements(p_items) loop
    q := (it->>'qty')::int;
    update products set stock = stock - q where id = (it->>'id')::uuid returning * into pr;
    insert into order_items(order_id, product_id, name, image, price, qty)
    values (v_order, pr.id, pr.name, pr.images[1], pr.price, q);
  end loop;

  return query select v_order, v_no, v_total;
end $$;
revoke all on function place_order from public, anon, authenticated;
grant execute on function place_order to service_role;

-- Row level security
alter table categories enable row level security;
alter table products enable row level security;
alter table reviews enable row level security;
alter table coupons enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table subscribers enable row level security;

drop policy if exists "read categories" on categories;
create policy "read categories" on categories for select using (true);
drop policy if exists "read products" on products;
create policy "read products" on products for select using (active);
drop policy if exists "read reviews" on reviews;
create policy "read reviews" on reviews for select using (true);
drop policy if exists "write own review" on reviews;
create policy "write own review" on reviews for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "read own orders" on orders;
create policy "read own orders" on orders for select to authenticated using (user_id = auth.uid());
drop policy if exists "read own order items" on order_items;
create policy "read own order items" on order_items for select to authenticated
  using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));
-- coupons & subscribers: no client policies; server uses the service role.

-- Explicit grants (new Supabase projects don't auto-grant). RLS above still filters rows.
grant usage on schema public to anon, authenticated, service_role;
grant select on categories, products, reviews to anon, authenticated;
grant insert on reviews to authenticated;
grant select on orders, order_items to authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
