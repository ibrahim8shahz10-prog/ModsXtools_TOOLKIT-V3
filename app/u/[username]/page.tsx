import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function PublicToolkitPage({ params }: { params: { username: string } }) {
  const supabase = createClient()

  const { data: toolkit } = await supabase
    .from('toolkits').select('*').eq('slug', params.username).single()

  if (!toolkit || !toolkit.is_public) notFound()

  await supabase.from('toolkits').update({ views: (toolkit.views || 0) + 1 }).eq('id', toolkit.id)

  const { data: tools } = await supabase
    .from('tools').select('*').eq('toolkit_id', toolkit.id)
    .eq('is_public', true).order('created_at', { ascending: false })

  const primary = toolkit.color_primary || '#ef4444'
  const secondary = toolkit.color_secondary || '#000000'
  const bg = toolkit.color_bg || '#0a0a0a'

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Inter, sans-serif' }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '300px', background: `linear-gradient(180deg, ${primary}15 0%, transparent 100%)`, pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 10, borderBottom: `1px solid ${primary}20` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Logo */}
          <div style={{ width: '64px', height: '64px', borderRadius: toolkit.logo_shape === 'circle' ? '50%' : '14px', background: toolkit.logo_url ? `url(${toolkit.logo_url}) center/cover` : `linear-gradient(135deg, ${primary} 50%, ${secondary} 50%)`, flexShrink: 0, boxShadow: `0 0 30px ${primary}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '26px' }}>
            {!toolkit.logo_url && toolkit.name[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: '#f1f5f9', fontSize: '26px', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '4px' }}>{toolkit.name}</h1>
            {toolkit.description && <p style={{ color: '#475569', fontSize: '14px' }}>{toolkit.description}</p>}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <span style={{ color: '#334155', fontSize: '12px' }}>{(tools || []).length} tools</span>
              <span style={{ color: '#334155', fontSize: '12px' }}>{toolkit.views} views</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tools grid */}
      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {(!tools || tools.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#334155' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔧</div>
            <p>No public tools yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {tools.map((tool: any) => (
              <a key={tool.id} href={`/t/${tool.slug}`} target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block', background: 'rgba(255,255,255,0.02)', border: `1px solid ${primary}20`, borderRadius: '16px', padding: '20px', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${primary}50`; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${primary}20`; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `linear-gradient(135deg, ${primary}, ${secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚡</div>
                  <div>
                    <h3 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '14px', margin: 0 }}>{tool.title}</h3>
                    <p style={{ color: '#334155', fontSize: '11px', margin: 0 }}>{tool.views} views</p>
                  </div>
                </div>
                {tool.description && <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.5', marginBottom: '12px' }}>{tool.description}</p>}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: primary, fontSize: '12px', fontWeight: '600' }}>
                  Open tool →
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
