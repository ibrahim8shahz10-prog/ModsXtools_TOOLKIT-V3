import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: toolkits } = await supabase
    .from('toolkits').select('*').eq('owner_id', user!.id)
    .order('created_at', { ascending: false })

  const { data: profile } = await supabase
    .from('profiles').select('username').eq('id', user!.id).single()

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Your Toolkits
          </h1>
          <p style={{ color: '#334155', fontSize: '14px', marginTop: '4px' }}>
            Welcome back, <span style={{ color: '#ef4444' }}>{profile?.username}</span>
          </p>
        </div>
        <Link href="/dashboard/toolkit/new" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '14px' }}>
          + Create Toolkit
        </Link>
      </div>

      {/* Empty state */}
      {(!toolkits || toolkits.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🧰</div>
          <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>No toolkits yet</h2>
          <p style={{ color: '#334155', fontSize: '14px', marginBottom: '24px' }}>Create your first toolkit and start building tools</p>
          <Link href="/dashboard/toolkit/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            🚀 Create your first Toolkit
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {toolkits.map((tk: any) => (
            <div key={tk.id} className="card" style={{ padding: '0', overflow: 'hidden', transition: 'all 0.2s' }}>
              {/* Color banner */}
              <div style={{ height: '80px', background: `linear-gradient(135deg, ${tk.color_primary} 50%, ${tk.color_secondary} 50%)`, position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '-20px', left: '20px', width: '40px', height: '40px', borderRadius: tk.logo_shape === 'circle' ? '50%' : '8px', background: tk.logo_url ? `url(${tk.logo_url}) center/cover` : tk.color_primary, border: '3px solid #080810', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '16px' }}>
                  {!tk.logo_url && tk.name[0].toUpperCase()}
                </div>
              </div>
              <div style={{ padding: '28px 20px 20px' }}>
                <h3 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{tk.name}</h3>
                {tk.description && <p style={{ color: '#475569', fontSize: '13px', marginBottom: '12px' }}>{tk.description}</p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ background: tk.is_public ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)', color: tk.is_public ? '#4ade80' : '#64748b', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '99px' }}>
                    {tk.is_public ? '🌐 Public' : '🔒 Private'}
                  </span>
                  <span style={{ color: '#334155', fontSize: '12px' }}>{tk.views} views</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href={`/dashboard/toolkit/${tk.id}`} className="btn btn-ghost" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center', fontSize: '13px', padding: '8px' }}>
                    Manage
                  </Link>
                  <a href={`/u/${tk.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center', fontSize: '13px', padding: '8px' }}>
                    View →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
                                 }
