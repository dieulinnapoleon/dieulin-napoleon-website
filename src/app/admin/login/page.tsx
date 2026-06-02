'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFirebaseClient } from '@/lib/firebase-client';
import { signInWithEmailAndPassword } from 'firebase/auth';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { auth } = getFirebaseClient();
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();

      // Exchange ID token for session cookie via server
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Authentication failed');
      }

      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : err.message || 'Authentication failed';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-gold" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-sm text-white/40 mt-2">Sign in to manage your site</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-300 rounded-xl text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 placeholder:text-white/20"
              placeholder="admin@dieulinnapoleon.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/60 mb-1.5">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 placeholder:text-white/20"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" loading={loading} className="w-full justify-center mt-2">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
          <Lock size={24} className="text-gold animate-pulse" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
