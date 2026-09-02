"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const router = useRouter();

const supabase = createBrowserClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const handleLogin = async (e: React.FormEvent) => {
e.preventDefault();
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (error) {
setError(error.message);
} else {
router.push("/");
router.refresh();
}
};

const handleSignUp = async () => {
const { error } = await supabase.auth.signUp({ email, password });
if (error) {
setError(error.message);
} else {
alert("Check your email for the confirmation link!");
}
};

return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
<form onSubmit={handleLogin} className="p-8 bg-gray-800 rounded-lg shadow-md w-96 flex flex-col gap-4">
<h1 className="text-2xl font-bold mb-2">Login to AutoPartsPro</h1>
{error && <p className="text-red-500 text-sm">{error}</p>}
<input
type="email"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="p-2 rounded bg-gray-700 border border-gray-600"
required
/>
<input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="p-2 rounded bg-gray-700 border border-gray-600"
required
/>
<button type="submit" className="bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">
Sign In
</button>
<button type="button" onClick={handleSignUp} className="bg-gray-700 text-gray-300 py-2 rounded hover:bg-gray-600 text-sm">
Create Account
</button>
</form>
</div>
);
}
