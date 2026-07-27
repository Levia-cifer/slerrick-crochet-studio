# Slerrick

Mobile-first crochet shop — Next.js + Supabase + Vercel. Launches with an
empty catalog so you list every product yourself from `/admin`.

## 1. Set up Supabase
1. Create a project at supabase.com (free tier is fine).
2. Go to SQL Editor → New query → paste everything in `supabase/schema.sql` → Run.
3. Go to Storage → create a bucket called `product-images`, set it to public,
   and upload photos there — copy each file's public URL to paste into the
   admin "Add Product" form later.
4. Go to Project Settings → API → copy the Project URL, the `anon` public
   key, and the `service_role` key.

## 2. Add your keys
Copy `.env.example` to `.env.local` and fill in the three values from step
1.4. Add the same three as Environment Variables in Vercel before deploying
(Vercel → your project → Settings → Environment Variables).

**Never put `SUPABASE_SERVICE_ROLE_KEY` behind `NEXT_PUBLIC_`** — it must
stay server-only, since it bypasses all your security rules.

## 3. Push to GitHub, deploy on Vercel
```
git init
git add .
git commit -m "Slerrick MVP"
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```
Then in Vercel: New Project → Import this repo → add the 3 env vars → Deploy.

## 4. Admin login
Your admin email is set in `lib/admin-guard.ts` (currently
`delaliserwa@gmail.com`). Sign up for a normal customer account using that
exact email at `/account/signup` — that same login then unlocks `/admin`.

## 5. App icons (for the "Install App" PWA prompt)
Already done — `public/icons/` is filled in with the real Slerrick monogram
artwork (rose-gold "S" with crochet hook, yarn ball, and florals) at every
size the manifest and browser need, plus the favicon and the transparent
`public/monogram.png` used in the nav bar, and the full dark lockup used in
the homepage hero (`public/hero-logo.png`). Nothing to generate yourself.

## Still to add later (by design — not MVP)
- Real Paystack integration (currently: manual MoMo verification)
- Affiliate / referral link system
- Product search
- Wishlist, reviews, discount codes
