# MenuX - Multi-Tenant Digital Menu Platform

A modern, full-featured digital menu system built with **Nuxt 3**, **Nuxt UI**, **Tailwind CSS**, and **Supabase**.

## 🚀 Features

- **Multi-Tenancy**: Separate restaurant/café accounts with subdomain/domain support
- **Role-Based Access**: Super Admin and Tenant Admin roles with RLS policies
- **10 Modern Templates**: Beautiful, responsive menu designs (Neon Night, Minimal Elegance, Dark Glass, etc.)
- **Menu Management**: Full CRUD for categories, items, variants, and custom texts
- **QR Code Generation**: Auto-generate scannable QR codes for your menus
- **Ad Targeting Engine**: Schedule ads by city, tenant, page scope, and time windows
- **Design Customization**: Choose templates and configure design tokens
- **Image Uploads**: Support for logos, menu images, and ad media (Supabase Storage)
- **Authentication**: Secure auth with Supabase Auth (email/password)
- **SEO-Friendly**: Server-side rendering for public menu pages

## 📋 Prerequisites

- Node.js 18+ (or use `nvm`)
- npm or pnpm
- Supabase account and project

## 🛠️ Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

Create a `.env` file in the root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NUXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NUXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
```

3. **Setup database schema:**

Run the SQL in `database/schema.sql` via Supabase SQL Editor or MCP.

4. **Seed initial data:**

```bash
# Seed templates, cities, tenants, menus
# Run SQL in database/seed-data.sql

# Seed users and ads (requires service role key)
npm run seed
```

5. **Run development server:**

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🗂️ Project Structure

```
├── app.vue
├── nuxt.config.ts
├── tailwind.config.ts
├── components/
│   ├── primitives/       # AppButton, AppInput, AppSelect, etc.
│   ├── patterns/         # DataTable, FormDialog, Uploader
│   ├── menu-templates/   # 10 template components
│   └── ads/              # AdBanner
├── composables/
│   ├── useTenant.ts
│   ├── useMenu.ts
│   ├── useAds.ts
│   ├── useCategories.ts
│   └── useMenuItems.ts
├── layouts/
│   ├── default.vue       # Public menu layout
│   ├── dashboard.vue     # Tenant admin layout
│   └── super.vue         # Super admin layout
├── middleware/
│   ├── auth.global.ts
│   ├── super-admin.ts
│   └── tenant-admin.ts
├── pages/
│   ├── index.vue
│   ├── [menuSlug].vue    # Public menu page
│   ├── auth/
│   │   ├── login.vue
│   │   └── reset-password.vue
│   ├── dashboard/
│   │   ├── index.vue
│   │   ├── categories.vue
│   │   ├── items.vue
│   │   ├── design.vue
│   │   ├── qr.vue
│   │   └── settings.vue
│   └── super/
│       ├── index.vue
│       ├── tenants/
│       ├── ads/
│       └── cities/
├── server/
│   ├── middleware/
│   │   └── tenant.ts     # Host-based tenant resolution
│   └── api/
│       ├── ads/active.get.ts
│       ├── qr/generate.post.ts
│       └── admin/account.put.ts
├── database/
│   ├── schema.sql
│   └── seed-data.sql
├── scripts/
│   └── seed.ts
└── types/
    ├── database.ts
    └── menu-template.ts
```

## 👤 Default Users

After seeding, you can log in with:

**Super Admin:**
- Email: `gashi449116@gmail.com`
- Password: `12345678`

**Tenant Admins:**
- `skyline.admin@example.com` / `ChangeMe#1`
- `garden.admin@example.com` / `ChangeMe#1`

⚠️ **Change these credentials in production!**

## 🎨 Templates

10 modern templates included:

1. **Neon Night** - Glassmorphism with neon accents
2. **Minimal Elegance** - Clean, spacious, typographic
3. **Dark Glass** - Dark theme with frosted panels
4. **Retro Card** - Card-based with vibrant colors
5. **Photo Hero** - Large hero image header
6. **Grid Menu** - Two-column grid layout
7. **Split Panels** - Sidebar navigation
8. **Chalk Board** - Textured chalkboard aesthetic
9. **Magazine** - Editorial multi-column layout
10. **Mono Zen** - Monochrome minimalist

## 📦 Tech Stack

- **Framework**: Nuxt 3
- **UI**: Nuxt UI + Tailwind CSS
- **Database**: Supabase (Postgres with RLS)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **State**: Pinia
- **Icons**: @nuxt/icon (Heroicons)
- **Images**: @nuxt/image
- **Testing**: Vitest + Playwright
- **QR Codes**: qrcode library

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 🚢 Deployment

1. Set environment variables in your hosting platform
2. Setup Supabase storage buckets: `logos`, `menu-images`, `ads-media`, `qr-codes`
3. Configure RLS policies for storage (see `database/storage-policies.sql`)
4. Build and deploy:

```bash
npm run build
npm run preview  # or deploy to Vercel/Netlify/etc.
```

## 📝 License

MIT

## 🤝 Contributing

Pull requests are welcome! Please follow the code style and include tests.

---

Built with ❤️ using Nuxt 3 + Supabase
