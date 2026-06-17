'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { LayoutGrid, Plus, LogOut, Settings } from 'lucide-react'

export default function DashboardNav({ profile }: { profile: any }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,8,16,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #ef4444 50%, #000 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '12px' }}>MX</div>
            <div>
              <div style={{ color: '#f1f5f9', fontWeight: '800', fontSize: '13px', lineHeight: 1 }}>MODSxTOOLS</div>
              <div style={{ color: '#ef4444', fontSize: '9px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Toolkit Maker</div>
            </div>
          </Link>
          <div style={{ display: 'flex', gap: '4px' }}>
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '500', background: pathname === '/dashboard' ? 'rgba(239,68,68,0.1)' : 'transparent', color: pathname === '/dashboard' ? '#ef4444' : '#475569' }}>
              <LayoutGrid size={14} /> Toolkits
            </Link>
            <Link href="/dashboard/toolkit/new" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '500', background: pathname === '/dashboard/toolkit/new' ? 'rgba(239,68,68,0.1)' : 'transparent', color: pathname === '/dashboard/toolkit/new' ? '#ef4444' : '#475569' }}>
              <Plus size={14} /> New
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#334155', fontSize: '13px' }}>{profile?.username}</span>
          <button onClick={logout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', padding: '6px 10px', borderRadius: '6px' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
