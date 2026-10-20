# Emoline Home Decor — E-Commerce Platform

*Where Every Corner Feels Like Home.* A full-stack storefront + admin panel for a home decor business, in a single Next.js app.

**Stack:** Next.js 15 (App Router, TypeScript) · MongoDB / Mongoose · Tailwind CSS v4 · Zod · JWT (jose) · Nodemailer · Cloudinary (optional) · Recharts

---

## 1. Setup (first time)

```bash
npm install
```

Open **`.env.local`** and fill in:

| Variable | What to put |
|---|---|
| `MONGODB_URI` | Replace `<db_username>` and `<db_password>` with your Atlas user. Keep `/emoline` before the `?` — that's the database name. In Atlas → Network Access, allow your IP (or `0.0.0.0/0` for hosting). |
| `AUTH_SECRET` | Already generated for you. Keep it secret. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Your first owner login (change the password after first login). |
| `SMTP_*`, `MAIL_FROM` | For invoice emails. Gmail: enable 2-Step Verification → create an **App Password** → use it as `SMTP_PASS`. |
| `ADMIN_NOTIFY_EMAIL` | Optional — get an email for every new order. |
| `CLOUDINARY_URL` | Optional — replace `<your_api_key>:<your_api_secret>` (cloud `dbey77goh` is already set). Enables the **Upload** button; without it, paste image URLs. |
| `NEXT_PUBLIC_SITE_URL` | Your live domain in production (used in emails, SEO, sitemap). |

Then create the admin account, default decor categories, pages and hero banner — and optionally 24 demo products:

```bash
npm run seed
npm run seed:products   # optional demo catalogue (illustrated placeholder images in /public/demo)
npm run dev
```

The logo and banner in `public/brand/` are generated placeholders (`npm run brand:assets` re-creates them). Upload your real logo in **Site Settings**.

- Store → http://localhost:3000
- Admin → http://localhost:3000/admin/login

## 2. Daily use (admin panel)

| Section | What you can do |
|---|---|
| **Dashboard** | Today's/month sales, net profit, order pipeline, 30-day chart, low-stock alerts |
| **Orders** | Filter/search, change status (pending → confirmed → processing → shipped → delivered), verify bKash/Nagad TrxID and mark paid, courier tracking code, actual courier cost, print / re-send invoice. Cancelling/returning restocks automatically. |
| **Products** | Images (URL or upload), options & stock (Small/Large, Set of 2, 16"/18"…; a single *Standard* option hides the picker), colors, **material**, **dimensions**, price, **discount %**, **cost price** (private, for profit). One-click toggles for **New Arrival**, **Best Seller/Hot**, **Featured**, **Visible**. Click a price to set a discount. |
| **Categories / Coupons** | Collections shown on the homepage; % or fixed coupons with min order, cap, usage limit and dates |
| **Banners** | Hero slider + promo banners (desktop & mobile images) |
| **Pages** | About, shipping, returns & damage policy, care guide… (`## ` heading, `- ` bullet, blank line = paragraph) |
| **Site Settings** | Brand, logo, announcement bar, contact & socials, homepage texts, delivery fees/zones, free-delivery threshold, delivery days & weekend, payment methods (COD, bKash, Nagad, Rocket, Bank), invoice note, SEO, change password |
| **P&L / ROI** *(owner)* | Revenue, COGS, gross & net profit, margins, monthly chart, expense breakdown, ROI, payback progress, cash position, stock value, top products |
| **Expenses / Investments** | Log every cost and every capital injection/withdrawal |
| **Admin Users** *(owner)* | Add staff (no finance access) or other owners |

### How profit is calculated
- **COGS** = units sold × product cost price (snapshotted at order time, so editing costs later won't rewrite history).
- **Net profit** = (sales − discounts − COGS) + delivery charges collected − courier costs − operating expenses.
- **Inventory purchases** are tracked for cash flow but *not* counted as an operating expense (that would double-count with COGS).
- **ROI** = lifetime net profit ÷ capital invested. Cancelled/returned orders are excluded everywhere.

## 3. Customer flow
Browse (filter by category, material, price) → product (option/color/qty) → bag → checkout (contact, address, delivery zone, coupon, payment) → server re-prices everything and reserves stock atomically → order confirmation + printable invoice with **estimated delivery (2–5 working days, weekends skipped)** → invoice email (if email given) → track any time at `/track-order` with order number + phone.

## 4. Deploying (Vercel recommended)
1. Push to GitHub (`.env.local` and `test.txt` are git-ignored).
2. Import the repo on vercel.com, add all `.env.local` variables in *Project → Settings → Environment Variables*, set `NEXT_PUBLIC_SITE_URL` to your domain.
3. In MongoDB Atlas → Network Access, allow `0.0.0.0/0`.

## 5. Engineering notes
- **Security:** httpOnly JWT session cookie, middleware + per-route auth checks, owner/staff roles, bcrypt (12 rounds), login & checkout rate-limiting, Zod validation on every input, security headers, cost price never sent to the storefront, order lookup requires matching phone.
- **Integrity:** prices, discounts, coupons and delivery fees are always computed on the server; stock is decremented with conditional atomic updates and rolled back on failure; atomic order-number counter.
- **Performance/SEO:** tag-based data caching invalidated instantly on admin edits, `next/image`, metadata per page, Product JSON-LD, `sitemap.xml`, `robots.txt`.
- The rate limiter is in-memory (per server instance). For multi-instance hosting, swap `src/lib/rate-limit.ts` for Upstash Redis.

```
src/
  app/(store)/      storefront pages       app/admin/       admin panel
  app/api/          REST API routes        components/      UI (store/, admin/)
  models/           Mongoose schemas       services/        business logic (orders, reports, catalog)
  lib/              auth, db, validation, email, utils
scripts/seed.ts     initial data
```

Scripts: `npm run dev` · `npm run build` · `npm start` · `npm run lint` · `npm run typecheck` · `npm run seed`
