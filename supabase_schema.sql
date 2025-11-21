-- Enable UUID extension (optional, but good practice)
create extension if not exists "uuid-ossp";

-- Products Table
create table public.products (
  id bigint primary key, -- Using bigint to match existing numeric IDs
  name text not null,
  description text,
  category text,
  images text[],
  videos text[],
  nutrition jsonb,
  origin text,
  harvest_date text,
  grade text,
  purity_test text,
  storage text,
  shelf_life text,
  grind text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Variants Table
create table public.variants (
  id bigint primary key,
  product_id bigint references public.products(id) on delete cascade,
  name text not null,
  price numeric not null,
  sale_price numeric,
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reviews Table
create table public.reviews (
  id bigint primary key,
  product_id bigint references public.products(id) on delete cascade,
  author text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  verified_purchase boolean default false,
  date text,
  images text[],
  helpful integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QnA Table
create table public.qna (
  id bigint primary key,
  product_id bigint references public.products(id) on delete cascade,
  author text not null,
  question text not null,
  answer text,
  date text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.reviews enable row level security;
alter table public.qna enable row level security;

-- Create Policies (Public Read, Authenticated/Admin Write)
-- For simplicity in this demo, we'll allow public read/write, but in production, lock writes.
create policy "Public Read Products" on public.products for select using (true);
create policy "Public Read Variants" on public.variants for select using (true);
create policy "Public Read Reviews" on public.reviews for select using (true);
create policy "Public Read QnA" on public.qna for select using (true);

-- Allow insert/update/delete for now to facilitate seeding
create policy "Public Write Products" on public.products for insert with check (true);
create policy "Public Update Products" on public.products for update using (true);
create policy "Public Delete Products" on public.products for delete using (true);

create policy "Public Write Variants" on public.variants for insert with check (true);
create policy "Public Update Variants" on public.variants for update using (true);
create policy "Public Delete Variants" on public.variants for delete using (true);

create policy "Public Write Reviews" on public.reviews for insert with check (true);
create policy "Public Update Reviews" on public.reviews for update using (true);
create policy "Public Delete Reviews" on public.reviews for delete using (true);

create policy "Public Write QnA" on public.qna for insert with check (true);
create policy "Public Update QnA" on public.qna for update using (true);
create policy "Public Delete QnA" on public.qna for delete using (true);

-- Orders Table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id), -- Link to Supabase Auth user if logged in
  guest_email text, -- For guest checkout
  total numeric not null,
  status text default 'pending', -- pending, paid, shipped, delivered, cancelled
  payment_id text,
  payment_provider text default 'razorpay',
  shipping_address jsonb,
  billing_address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items Table
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id bigint references public.products(id),
  variant_id bigint references public.variants(id),
  quantity integer not null,
  price_at_purchase numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Orders
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for Orders (Users can see their own orders)
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can insert own orders" on public.orders
  for insert with check (auth.uid() = user_id);

-- Allow public insert for guest checkout (be careful in production!)
create policy "Public insert orders" on public.orders
  for insert with check (user_id is null);

-- Policies for Order Items
create policy "Users can view own order items" on public.order_items
  for select using (
    exists ( select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
  );

create policy "Public insert order items" on public.order_items
  for insert with check (
    exists ( select 1 from public.orders where orders.id = order_items.order_id ) -- Simplified check
  );

