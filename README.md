# Intellobyte Toys

Premium adult-wellness storefront — Next.js 16 (App Router, Turbopack) + Supabase + Tailwind v4 + Motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

`.env.local` holds the Supabase keys (see `.env.example`). `SUPABASE_SECRET_KEY` is server-only.

## Database

```bash
node scripts/db.mjs schema              # tables, RLS, grants, place_order()
node scripts/db.mjs seed                # 74 products + categories + coupons (from supabase/products.json)
node scripts/db.mjs demo-reviews        # sample reviews so the UI isn't empty
node scripts/db.mjs clear-demo-reviews  # ⚠️ run before launch
```

- Orders go through the `place_order` Postgres function: prices come from the DB, stock is locked and decremented atomically. Only the service role can call it.
- RLS: catalog is public-read, customers only see their own orders, coupons/subscribers are server-only.

## Features

Home (animated hero, story bubbles, arch categories, tabbed bestsellers, mood shop, luxe spotlight, discreet-packaging scroll story, brand marquee, reviews) ·
Shop with category/tag/price/sort filters + search · Product page (zoom gallery, swipe, bundle upsell, accordions, reviews) ·
Cart drawer with free-shipping meter · Checkout (COD, coupons `WELCOME10`, `INTELLO20`) · Order confirmation ·
Email/password auth · Account with order tracking · Wishlist · "Find your match" quiz · Help/FAQ · 18+ age gate ·
Admin (`/admin`, emails listed in `ADMIN_EMAILS`): order status + product price/stock/live.

## Before launch

- Run `clear-demo-reviews`.
- Add an online payment gateway (Razorpay) — checkout is Cash/UPI on delivery only today.
- Rotate the Supabase secret key and access token (they were shared in chat).
- In Supabase Auth settings, set the Site URL to the production domain.
