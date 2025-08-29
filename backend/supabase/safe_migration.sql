-- Safe Database Migration Script for BaoAfrik
-- This script checks for existing objects before creating them

-- Enable necessary extensions (safe to run multiple times)
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;

-- Create custom types only if they don't exist
do $$
begin
    if not exists (select 1 from pg_type where typname = 'user_role') then
        create type user_role as enum ('admin', 'seller', 'buyer');
    end if;
    
    if not exists (select 1 from pg_type where typname = 'verification_status') then
        create type verification_status as enum ('pending', 'verified', 'rejected');
    end if;
    
    if not exists (select 1 from pg_type where typname = 'order_status') then
        create type order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
    end if;
end
$$;

-- Create profiles table only if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  phone text,
  role user_role default 'buyer',
  is_verified boolean default false,
  verification_status verification_status default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create categories table only if it doesn't exist
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table only if it doesn't exist
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text not null,
  description text,
  price decimal(10, 2) not null,
  currency text default 'USD',
  stock_quantity integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create other tables only if they don't exist
create table if not exists public.product_images (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  url text not null,
  is_primary boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  total_amount decimal(10, 2) not null,
  status order_status default 'pending',
  payment_intent_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null,
  price_per_unit decimal(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  rating integer not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint rating_range check (rating >= 1 and rating <= 5)
);

create table if not exists public.favorites (
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, product_id)
);

create table if not exists public.conversations (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes only if they don't exist
do $$
begin
    if not exists (select 1 from pg_indexes where indexname = 'idx_products_seller_id') then
        create index idx_products_seller_id on public.products(seller_id);
    end if;
    
    if not exists (select 1 from pg_indexes where indexname = 'idx_products_category_id') then
        create index idx_products_category_id on public.products(category_id);
    end if;
    
    if not exists (select 1 from pg_indexes where indexname = 'idx_product_images_product_id') then
        create index idx_product_images_product_id on public.product_images(product_id);
    end if;
    
    if not exists (select 1 from pg_indexes where indexname = 'idx_orders_user_id') then
        create index idx_orders_user_id on public.orders(user_id);
    end if;
    
    if not exists (select 1 from pg_indexes where indexname = 'idx_order_items_order_id') then
        create index idx_order_items_order_id on public.order_items(order_id);
    end if;
    
    if not exists (select 1 from pg_indexes where indexname = 'idx_reviews_product_id') then
        create index idx_reviews_product_id on public.reviews(product_id);
    end if;
    
    if not exists (select 1 from pg_indexes where indexname = 'idx_favorites_user_id') then
        create index idx_favorites_user_id on public.favorites(user_id);
    end if;
    
    if not exists (select 1 from pg_indexes where indexname = 'idx_favorites_product_id') then
        create index idx_favorites_product_id on public.favorites(product_id);
    end if;
    
    if not exists (select 1 from pg_indexes where indexname = 'idx_messages_conversation_id') then
        create index idx_messages_conversation_id on public.messages(conversation_id);
    end if;
    
    if not exists (select 1 from pg_indexes where indexname = 'idx_messages_sender_id') then
        create index idx_messages_sender_id on public.messages(sender_id);
    end if;
end
$$;

-- Enable Row Level Security (safe to run multiple times)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

-- Create policies only if they don't exist
do $$
begin
    -- Profiles policies
    if not exists (select 1 from pg_policies where policyname = 'Users can view all profiles' and tablename = 'profiles') then
        create policy "Users can view all profiles" on public.profiles
            for select using (true);
    end if;
    
    if not exists (select 1 from pg_policies where policyname = 'Users can update their own profile' and tablename = 'profiles') then
        create policy "Users can update their own profile" on public.profiles
            for update using (auth.uid() = id);
    end if;
    
    -- Products policies
    if not exists (select 1 from pg_policies where policyname = 'Products are viewable by everyone' and tablename = 'products') then
        create policy "Products are viewable by everyone" on public.products
            for select using (true);
    end if;
    
    if not exists (select 1 from pg_policies where policyname = 'Sellers can manage their own products' and tablename = 'products') then
        create policy "Sellers can manage their own products" on public.products
            for all using (auth.uid() = seller_id) with check (auth.uid() = seller_id);
    end if;
    
    -- Categories policies
    if not exists (select 1 from pg_policies where policyname = 'Categories are viewable by everyone' and tablename = 'categories') then
        create policy "Categories are viewable by everyone" on public.categories
            for select using (true);
    end if;
    
    -- Orders policies
    if not exists (select 1 from pg_policies where policyname = 'Users can view their own orders' and tablename = 'orders') then
        create policy "Users can view their own orders" on public.orders
            for select using (auth.uid() = user_id);
    end if;
    
    if not exists (select 1 from pg_policies where policyname = 'Users can create orders' and tablename = 'orders') then
        create policy "Users can create orders" on public.orders
            for insert with check (auth.uid() = user_id);
    end if;
    
    -- Favorites policies
    if not exists (select 1 from pg_policies where policyname = 'Users can manage their own favorites' and tablename = 'favorites') then
        create policy "Users can manage their own favorites" on public.favorites
            for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
    end if;
end
$$;

-- Create or replace functions (safe to run multiple times)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    phone = excluded.phone;
  return new;
end;
$$ language plpgsql security definer;

create or replace function public.handle_user_delete()
returns trigger as $$
begin
  delete from auth.users where id = old.id;
  return old;
end;
$$ language plpgsql security definer;

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers only if they don't exist
do $$
begin
    if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
        create trigger on_auth_user_created
            after insert on auth.users
            for each row execute procedure public.handle_new_user();
    end if;
    
    if not exists (select 1 from pg_trigger where tgname = 'on_profile_deleted') then
        create trigger on_profile_deleted
            before delete on public.profiles
            for each row execute procedure public.handle_user_delete();
    end if;
    
    if not exists (select 1 from pg_trigger where tgname = 'update_profiles_updated_at') then
        create trigger update_profiles_updated_at
            before update on public.profiles
            for each row execute procedure public.update_updated_at_column();
    end if;
    
    if not exists (select 1 from pg_trigger where tgname = 'update_products_updated_at') then
        create trigger update_products_updated_at
            before update on public.products
            for each row execute procedure public.update_updated_at_column();
    end if;
end
$$;

-- Enable realtime (safe to run multiple times)
do $$
begin
    -- Check if tables are already in the publication
    if not exists (
        select 1 from pg_publication_tables 
        where pubname = 'supabase_realtime' and tablename = 'products'
    ) then
        alter publication supabase_realtime add table public.products;
    end if;
    
    if not exists (
        select 1 from pg_publication_tables 
        where pubname = 'supabase_realtime' and tablename = 'messages'
    ) then
        alter publication supabase_realtime add table public.messages;
    end if;
exception
    when others then
        -- Ignore errors if publication doesn't exist
        null;
end
$$;
