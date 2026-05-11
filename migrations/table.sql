-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.categories (
  id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  name text NOT NULL,
  description text,
  parent_id integer,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  order_id uuid,
  is_global boolean DEFAULT false,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  products jsonb NOT NULL,
  order_status text NOT NULL DEFAULT 'pending'::text CHECK (order_status = ANY (ARRAY['pending'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])),
  payment_status text NOT NULL DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text, 'refunded'::text])),
  payment_method text NOT NULL CHECK (payment_method = ANY (ARRAY['card'::text, 'easypaisa'::text, 'jazzcash'::text, 'cash_on_delivery'::text, 'bank_transfer'::text])),
  transaction_id text,
  delivery_address text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  phone bigint,
  Receiver text NOT NULL DEFAULT ''::text,
  total_amount json NOT NULL,
  packet_tracking_id text,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.products (
  no integer NOT NULL DEFAULT nextval('products_no_seq'::regclass),
  name character varying NOT NULL,
  short_description text NOT NULL,
  long_description text NOT NULL,
  product_condition smallint NOT NULL,
  categories jsonb NOT NULL,
  price numeric NOT NULL,
  discounted_price numeric,
  offer_name character varying,
  images ARRAY NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  _id uuid NOT NULL DEFAULT gen_random_uuid(),
  problems text,
  tags ARRAY DEFAULT ARRAY[]::text[],
  additional_information jsonb,
  sold boolean DEFAULT false,
  CONSTRAINT products_pkey PRIMARY KEY (no, _id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text UNIQUE,
  role text DEFAULT 'user'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);