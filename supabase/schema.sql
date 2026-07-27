-- Slerrick Crochet Studio — Supabase schema
-- Run this whole file once in the Supabase SQL editor (Project → SQL Editor → New query)

-- 1. CATEGORIES ---------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now()
);

-- 2. PRODUCTS ------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  colors text[] default '{}',        -- e.g. {"Cream","Rose","Sage"}
  images text[] default '{}',        -- URLs from Supabase Storage
  category_id uuid references categories(id) on delete set null,
  in_stock boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index products_category_idx on products(category_id);

-- 3. CUSTOMER PROFILES ----------------------------------------------------
-- Extends Supabase's built-in auth.users with the extra fields we need.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz default now()
);

-- Auto-create a profile row whenever someone signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. CART ITEMS (persisted per account) -----------------------------------
create table cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  color text,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz default now(),
  unique (user_id, product_id, color)
);

-- 5. ORDERS ----------------------------------------------------------------
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,  -- short human-friendly ID, e.g. SLK-1042
  user_id uuid references auth.users(id) on delete set null,

  -- delivery details
  full_name text not null,
  phone_number text not null,
  whatsapp_number text,
  region text not null,
  town text not null,
  exact_location text not null,
  landmark text,
  delivery_notes text,

  -- manual MoMo payment verification
  payment_reference text not null,
  payer_number text not null,
  payer_name text not null,

  subtotal numeric(10,2) not null,
  status text not null default 'awaiting_verification'
    check (status in ('awaiting_verification','paid','processing','delivered','cancelled')),

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  product_name text not null,   -- snapshot, in case product is edited/deleted later
  color text,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0)
);

-- 6. ORDER NUMBER GENERATOR -------------------------------------------------
create sequence order_number_seq start 1000;
create function generate_order_number()
returns trigger as $$
begin
  new.order_number := 'SLK-' || nextval('order_number_seq');
  return new;
end;
$$ language plpgsql;

create trigger set_order_number
  before insert on orders
  for each row execute procedure generate_order_number();

-- 7. ROW LEVEL SECURITY ------------------------------------------------------
alter table products enable row level security;
alter table categories enable row level security;
alter table profiles enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Anyone (including logged-out visitors) can browse products/categories
create policy "Public can view products" on products for select using (true);
create policy "Public can view categories" on categories for select using (true);

-- Customers can only see/edit their own profile
create policy "Users manage own profile" on profiles
  for all using (auth.uid() = id);

-- Customers can only see/edit their own cart
create policy "Users manage own cart" on cart_items
  for all using (auth.uid() = user_id);

-- Customers can create orders and see only their own; admin sees all via service role in the dashboard
create policy "Users create own orders" on orders
  for insert with check (auth.uid() = user_id or user_id is null);
create policy "Users view own orders" on orders
  for select using (auth.uid() = user_id);
create policy "Users create own order items" on order_items
  for insert with check (
    exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid())
  );
create policy "Users view own order items" on order_items
  for select using (
    exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid())
  );

-- NOTE: product add/edit/delete and full order management happen from the
-- admin dashboard using the Supabase service role key (server-side only,
-- never shipped to the browser) — so no public write policies are needed
-- for products/categories/order status updates.

-- 8. SEED CATEGORIES (edit/add your own — no products seeded) ---------------
insert into categories (name, slug) values
  ('Bags', 'bags'),
  ('Hats', 'hats'),
  ('Tops', 'tops'),
  ('Home & Décor', 'home-decor');
