# AutoPartsPro - E-Commerce Template

A high-performance Next.js e-commerce template integrated with Stripe, Supabase, and Resend. Built for seamless zero-code deployment via Vercel.

## Features
- **Framework:** Next.js (App Router)
- **Payments:** Stripe Checkout & Webhook handler
- **Database:** Supabase Postgres
- **Emails:** Resend transactional emails with dynamic dark-mode receipts

---

## Quick Start Setup

### 1. Environment Variables
Copy `.env.example` to `.env.local` and add your API credentials:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_SUPABASE_URL=[https://your-supabase-url.supabase.co](https://your-supabase-url.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

RESEND_API_KEY=re_...

2. Supabase Setup

Create an orders table in your Supabase database with the following structure:

    id (uuid, primary key)
    stripe_session_id (text, unique)
    customer_email (text)
    amount_total (numeric)
    items (jsonb)
    status (text)
    created_at (timestamp)

3. Stripe Webhook Configuration

    Go to your Stripe Dashboard -> Developers -> Webhooks.
    Click Add endpoint and set the URL to: https://your-domain.vercel.app/api/webhook
    Select the event to listen for: checkout.session.completed
    Copy the Signing secret and paste it into your STRIPE_WEBHOOK_SECRET variable.

Deploy to Vercel

    Push your repository to GitHub.
    Import the repo into Vercel.
    Add all environment variables listed above under Project Settings -> Environment Variables.
    Hit Deploy.

Commit that file and your template is officially packaged and ready to list for sale.
