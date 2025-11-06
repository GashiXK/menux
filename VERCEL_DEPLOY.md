# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) if you don't have one
2. **GitHub/GitLab/Bitbucket**: Your code should be in a Git repository
3. **Supabase Credentials**: You'll need your Supabase URL and keys

## Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm i -g vercel
```

## Step 2: Environment Variables

Before deploying, you need to set these environment variables in Vercel:

### Required Environment Variables:

```
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
NUXT_EXPERIMENTAL_IMPORT_PROTECTION=false
```

**Note:** `NUXT_EXPERIMENTAL_IMPORT_PROTECTION=false` is required to fix a build issue with @nuxt/ui. This is already configured in `vercel.json`, but you can also set it as an environment variable.

### Optional (if using service role for server-side operations):

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 3: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure the project:
   - **Framework Preset**: Nuxt.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.output/public` (auto-detected)
   - **Install Command**: `npm install` (default)
4. Add all environment variables from Step 2
5. Click **Deploy**

## Step 4: Deploy via CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy (first time will ask questions)
vercel

# For production deployment
vercel --prod
```

## Step 5: Configure Environment Variables in Vercel Dashboard

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add all variables from Step 2
4. Make sure to set them for:
   - **Production**
   - **Preview**
   - **Development** (optional)

## Step 6: Domain Configuration (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Important Notes

### Supabase Configuration

Make sure your Supabase project has:
- **RLS (Row Level Security)** enabled
- **Public read policies** for menus, categories, and items
- **Auth policies** configured correctly
- **CORS** settings allowing your Vercel domain

### Supabase Auth Redirect URLs

Add your Vercel URLs to Supabase:
1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add to **Site URL**: `https://your-app.vercel.app`
3. Add to **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/**`

### Database Migrations

If you need to run migrations:
1. Use Supabase Dashboard SQL Editor, or
2. Set up a migration script that runs on deployment (not recommended for production)

## Troubleshooting

### Build Fails

- Check that all environment variables are set
- Verify `package.json` has correct build script
- Check Vercel build logs for specific errors

### Runtime Errors

- Verify Supabase credentials are correct
- Check Supabase RLS policies
- Verify redirect URLs in Supabase dashboard
- Check browser console for client-side errors

### Authentication Issues

- Ensure Supabase redirect URLs include your Vercel domain
- Check that cookies are being set correctly (may need to configure cookie domain)
- Verify `NUXT_PUBLIC_SUPABASE_URL` matches your Supabase project URL

## Post-Deployment Checklist

- [ ] Test login/logout functionality
- [ ] Test menu viewing (public pages)
- [ ] Test dashboard access (tenant admin)
- [ ] Test super admin access
- [ ] Verify QR code generation works
- [ ] Check that images load correctly
- [ ] Test on mobile devices
- [ ] Verify all API endpoints work

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main`/`master` branch
- **Preview**: All other branches and pull requests

Each deployment gets a unique URL for testing.

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Nuxt 3 Deployment](https://nuxt.com/docs/getting-started/deployment)
- [Supabase + Vercel Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

