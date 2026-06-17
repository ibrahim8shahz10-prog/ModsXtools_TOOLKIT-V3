import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export default async function ToolPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: tool } = await supabase
    .from('tools').select('*, toolkits(name, slug, color_primary, color_secondary, logo_url, logo_shape)')
    .eq('slug', params.slug).single()

  if (!tool || !tool.is_public) notFound()

  await supabase.from('tools').update({ views: (tool.views || 0) + 1 }).eq('id', tool.id)

  const toolkit = (tool as any).toolkits
  const primary = toolkit?.color_primary || '#ef4444'
  const srcDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${tool.css_code}</style></head><body>${tool.html_code}<script>${tool.js_code}<\/script></body></html>`

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050508', fontFamily: 'Inter, sans-serif' }}>
      {/* Mini header */}
      <header style={{ height: '48px', borderBottom: `1px solid ${primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {toolkit?.logo_url && (
            <div style={{ width: '24px', height: '24px', borderRadius: toolkit.logo_shape === 'circle' ? '50%' : '4px', background: `url(${toolkit.logo_url}) center/cover`, flexShrink: 0 }} />
          )}
          <span style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '13px' }}>{tool.title}</span>
          {toolkit && <span style={{ color: '#334155', fontSize: '12px' }}>· {toolkit.name}</span>}
        </div>
        {toolkit && (
          <a href={`/u/${toolkit.slug}`} style={{ color: primary, fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>
            View Toolkit →
          </a>
        )}
      </header>
      <iframe srcDoc={srcDoc} sandbox="allow-scripts allow-modals allow-forms"
        title={tool.title} style={{ flex: 1, border: 'none', background: 'white' }} />
    </div>
  )
}
