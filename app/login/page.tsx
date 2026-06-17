'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #ef4444 50%, #000 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '18px', margin: '0 auto 16px', boxShadow: '0 0 30px rgba(239,68,68,0.3)' }}>MX</div>
          <h1 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p style={{ color: '#334155', fontSize: '14px', marginTop: '6px' }}>Log in to your toolkit</p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" />
            </div>
            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', color: '#fca5a5', fontSize: '13px' }}>{error}</div>}
            <button disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '4px', fontSize: '15px', padding: '12px' }}>
              {loading ? 'Logging in...' : 'Log in →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#1e293b', fontSize: '13px', marginTop: '20px' }}>
          No account?{' '}
          <Link href="/signup" style={{ color: '#ef4444', fontWeight: '600', textDecoration: 'none' }}>Sign up free</Link>
        </p>
      </div>
    </div>
  )
      }
