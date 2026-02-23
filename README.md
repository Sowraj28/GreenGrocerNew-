# 🌿 GreenGrocer — Full-Stack Grocery Shop

A production-ready grocery e-commerce app built with **Next.js 14**, **PostgreSQL (Neon)**, **Cloudinary**, and **NextAuth.js**.

## ⚡ Quick Setup (3 steps)

### Step 1 — Set up `.env.local`
```bash
cp .env.example .env.local
# Then edit .env.local with your credentials
```

### Step 2 — Install & setup
```bash
npm run setup
```
This installs dependencies, generates Prisma client, pushes schema to DB, and seeds demo data.

### Step 3 — Start
```bash
npm run dev
```
Open http://localhost:3000

---

## 🗄 Database (Neon PostgreSQL — FREE)
1. Go to https://neon.tech → Sign up
2. Create project → Copy **Connection string**
3. Paste as `DATABASE_URL` in `.env.local`
   Format: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`

## ☁️ Cloudinary (Image Upload — FREE)
1. Go to https://cloudinary.com → Sign up
2. Dashboard → Copy Cloud Name, API Key, API Secret
3. Settings → Upload → Create preset named `grocery_shop` (Unsigned mode)
4. Paste values in `.env.local`

## 🔑 NextAuth Secret
Run: `openssl rand -base64 32` → Paste as `NEXTAUTH_SECRET`

---

## 👤 Demo Credentials (after setup)
- **User:** user@demo.com / user123
- **Admin:** admin@greengrocer.com / admin123

---

## 🌐 Routes
| Route | Description |
|-------|-------------|
| `/shop` | Product listing |
| `/cart` | Shopping cart |
| `/checkout` | Checkout & payment |
| `/orders` | My orders |
| `/auth/login` | User login |
| `/auth/register` | Register |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin stats |
| `/admin/orders` | Order management |
| `/admin/products` | Product CRUD |
| `/admin/customers` | Customer management |

---

## 🚀 Deploy to Vercel
1. Push to GitHub
2. Import on vercel.com
3. Add all `.env.local` variables in Vercel dashboard
4. Set `NEXTAUTH_URL` = your production URL
5. Deploy — both user & admin served from same app!

---

## 🛠 Commands
```bash
npm run dev          # Development
npm run build        # Build
npm run db:push      # Push schema to DB
npm run db:seed      # Re-seed demo data
npm run db:generate  # Regenerate Prisma client
```
