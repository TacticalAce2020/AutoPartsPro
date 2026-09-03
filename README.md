# Modern E-Commerce Store Template

Welcome to your new fully functional online store. This template is designed to be highly customizable so you can sell any type of product, and it can be deployed instantly with zero coding required.

## 1-Click Deployment

Click the link below to clone this repository and deploy it straight to your own Vercel account. You will be prompted to enter your API keys during setup.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TacticalAce2020/AutoPartsPro&env=SUPABASE_URL,SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,RESEND_API_KEY)

---

## How to Get Your API Keys

Before you deploy, you need to set up free accounts on three platforms to handle your database, payments, and emails. Keep these keys handy for the Vercel deployment screen.

### 1. Supabase (Database & Authentication)
1. Go to [Supabase](https://supabase.com) and create a new project.
2. In your project dashboard, go to **Project Settings** (the gear icon) > **API**.
3. Copy the following:
- **Project URL** -> `SUPABASE_URL`
- **anon public key** -> `SUPABASE_ANON_KEY`
- **service_role secret** -> `SUPABASE_SERVICE_ROLE_KEY`

### 2. Stripe (Payments)
1. Go to [Stripe](https://stripe.com) and create an account.
2. Go to the **Developers** dashboard > **API keys**.
3. Copy the following:
- **Publishable key** -> `STRIPE_PUBLISHABLE_KEY`
- **Secret key** -> `STRIPE_SECRET_KEY`
4. To get your Webhook Secret:
- Go to **Developers** > **Webhooks**.
- Click **Add endpoint**.
- Enter your future live domain followed by `/api/webhooks/stripe` (e.g., `https://your-domain.com/api/webhooks/stripe`).
- Select events to listen to (e.g., `checkout.session.completed`).
- Click Add endpoint, then reveal and copy the **Signing secret** -> `STRIPE_WEBHOOK_SECRET`.

### 3. Resend (Emails)
1. Go to [Resend](https://resend.com) and create an account.
2. Navigate to **API Keys** on the sidebar.
3. Click **Create API Key**, name it, and copy the generated key (starts with `re_`) -> `RESEND_API_KEY`.
