export function getSupabaseCredentials() {
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
// Return safe fallbacks just for the build phase
return {
url: 'https://placeholder.supabase.co',
key: 'placeholder-key'
};
}

return { url, key };
}
