import { useMemo, useState } from 'react';

function getBackendBase() {
  const envBase = import.meta.env.VITE_BACKEND_URL;
  if (envBase && typeof envBase === 'string') return envBase.replace(/\/$/, '');
  try {
    const loc = window.location;
    // If running on 3000, assume backend on 8000; otherwise keep origin
    if (loc.port === '3000') {
      return `${loc.protocol}//${loc.hostname}:8000`;
    }
    return `${loc.protocol}//${loc.host}`;
  } catch {
    return '';
  }
}

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const base = useMemo(() => getBackendBase(), []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (!base) throw new Error('Backend URL not configured');
      if (mode === 'register') {
        const r = await fetch(`${base}/auth/register`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (!r.ok) {
          const t = await r.text();
          throw new Error(t || 'Registration failed');
        }
        const data = await r.json();
        onAuth(data.access_token);
      } else if (mode === 'guest') {
        const r = await fetch(`${base}/auth/guest`, { method: 'POST' });
        if (!r.ok) {
          const t = await r.text();
          throw new Error(t || 'Guest login failed');
        }
        const data = await r.json();
        onAuth(data.access_token);
      } else {
        const body = new URLSearchParams();
        body.set('username', email);
        body.set('password', password);
        const r = await fetch(`${base}/auth/login`, { method: 'POST', body });
        if (!r.ok) {
          const t = await r.text();
          throw new Error(t || 'Login failed');
        }
        const data = await r.json();
        onAuth(data.access_token);
      }
    } catch (err) {
      setError(err.message || 'שגיאה בלתי צפויה');
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-md mx-auto bg-white/80 backdrop-blur rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-4">כניסה מאובטחת</h2>
      <form onSubmit={submit} className="space-y-3" dir="rtl">
        {mode !== 'guest' && (
          <>
            <input className="w-full border rounded px-3 py-2" placeholder="אימייל" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="w-full border rounded px-3 py-2" placeholder="סיסמה" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </>
        )}
        {error && <p className="text-red-600 text-sm" dir="ltr">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-50">{loading ? '...' : (mode==='login' ? 'כניסה' : mode==='register' ? 'הרשמה' : 'כניסה כאורח')}</button>
      </form>
      <div className="mt-3 flex items-center justify-between" dir="rtl">
        <button onClick={()=>setMode(mode==='login'?'register':'login')} className="text-blue-700 underline text-sm">
          {mode==='login' ? 'חדש כאן? הרשמה' : 'יש לכם חשבון? כניסה'}
        </button>
        <button onClick={()=>setMode('guest')} className="text-sm text-gray-700 hover:text-gray-900">
          אורח
        </button>
      </div>
    </div>
  );
}
