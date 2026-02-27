

## Setting Up Google OAuth for MedCoreOps

### Step 1: Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
3. Navigate to **APIs & Services → OAuth consent screen**
4. Choose **External** user type, click Create
5. Fill in App name, support email, and developer email
6. Under **Authorized domains**, add: `jwkulukrmouiqhhbpsqy.supabase.co`
7. Click **Save and Continue** through Scopes and Test Users

### Step 2: Create OAuth Credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth Client ID**
3. Application type: **Web application**
4. Under **Authorized JavaScript origins**, add:
   - `https://medcore-pulse-dash.lovable.app`
   - `https://id-preview--47727bdb-fb6e-463a-9fe1-34522fd9a747.lovable.app`
5. Under **Authorized redirect URIs**, add:
   - `https://jwkulukrmouiqhhbpsqy.supabase.co/auth/v1/callback`
6. Click **Create** and copy the **Client ID** and **Client Secret**

### Step 3: Enable Google in Supabase

1. Go to [Supabase Auth Providers](https://supabase.com/dashboard/project/jwkulukrmouiqhhbpsqy/auth/providers)
2. Find **Google** and toggle it **ON**
3. Paste the **Client ID** and **Client Secret**
4. Click **Save**

### Step 4: Verify Redirect URLs

1. In Supabase, go to **Authentication → URL Configuration**
2. Ensure **Site URL** is set to: `https://medcore-pulse-dash.lovable.app`
3. Under **Redirect URLs**, add:
   - `https://medcore-pulse-dash.lovable.app/**`
   - `https://id-preview--47727bdb-fb6e-463a-9fe1-34522fd9a747.lovable.app/**`

No code changes needed — the Google sign-in button is already implemented in your Login page.

