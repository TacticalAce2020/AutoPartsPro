import { createClient } from '@supabase/supabase-js';

const proxyEnv = new Proxy(process.env, {
get(target, prop: string) {
if (prop === 'NEXT_PUBLIC_SUPABASE_URL') {
return target[prop] || 'https://placeholder.supabase.co';
}
if (prop === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
return target[prop] || 'placeholder-key';
}
return target[prop];
}
});

export const db = createClient(
proxyEnv.NEXT_PUBLIC_SUPABASE_URL as string,
proxyEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);
