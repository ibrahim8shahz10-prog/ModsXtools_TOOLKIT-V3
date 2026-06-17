'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { nanoid } from 'nanoid'

const COLOR_PRESETS = [
  { name: 'Red & Black', primary: '#ef4444', secondary: '#000000' },
  { name: 'Blue & Dark', primary: '#3b82f6', secondary: '#0a0a1a' },
  { name: 'Purple & Black', primary: '#8b5cf6', secondary: '#000000' },
  { name: 'Green & Dark', primary: '#22c55e', secondary: '#001a00' },
  { name: 'Orange & Black', primary: '#f97316', secondary: '#000000' },
  { name: 'Pink & Dark', primary: '#ec4899', secondary: '#0a0010' },
  { name: 'Cyan & Black', primary: '#06b6d4', secondary: '#000a0f' },
  { name: 'Gold & Black', primary: '#eab308', secondary: '#0a0800' },
]

export default function NewToolkitPage() {
  const supabase = createClient()
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [logoShape, setLogoShape] = useState<'circle' | 'square'>('circle')
  const [colorPreset, setColorPreset] = useState(0)
  const [customPrimary, setCustomPrimary] = useState('#ef4444')
  const [customSecondary, setCustomSecondary] = useState('#000000')
  const [useCustom, setUseCustom] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const primary = useCustom ? customPrimary : COLOR_PRESETS[colorPreset].primary
  const secondary = useCustom ? customSecondary : COLOR_PRESETS[colorPreset].secondary

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not logged in'); setLoading(false); return }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 25)}-${nanoid(5)}`

    const { data, error } = await supabase.from('toolkits').insert({
      owner_id: user.id,
      name,
      description,
      slug,
      logo_url: logoUrl,
      logo_shape: logoShape,
      color_primary: primary,
      color_secondary: secondary,
      color_text: '#ffffff',
      color_bg: '#0a0a0a',
      is_public: true,
    }).select().single()

    setLoading(false)
    if (error) { setError(error.message); return }
    router.push(`/dashboard/toolkit/${data.id}`)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Create Toolkit
        </h1>
        <p style={{ color: '#334155', fontSize: '14px' }}>Set up your branded toolkit in seconds</p>
      </div>

      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Preview */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ height: '100px', background: `linear-gradient(135deg, ${primary} 50%, ${secondary} 50%)`, display: 'flex', alignItems: 'flex-end', padding: '0 24px 0' }}>
            <div style={{ marginBottom: '-20px', width: '56px', height: '56px', borderRadius: logoShape === 'circle' ? '50%' : '12px', background: logoUrl ? `url(${logoUrl}) center/cover` : primary, border: '3px solid #080810', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '22px', boxShadow: `0 0 20px ${primary}66` }}>
              {!logoUrl && (name[0]?.toUpperCase() || 'M')}
            </div>
          </div>
          <div style={{ padding: '28px 24px 20px' }}>
            <p style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '18px' }}>{name || 'Your Toolkit Name'}</p>
            <p style={{ color: '#475569', fontSize: '13px', marginTop: '4px' }}>{description || 'Your description here'}</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Toolkit Name *</label>
          <input required value={name} onChange={e => setName(e.target.value)} className="input" placeholder="e.g. Ibrahim's Dev Tools" />
        </div>

        {/* Description */}
        <div>
          <label style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Description</label>
          <input value={description} onChange={e => setDescription(e.target.value)} className="input" placeholder="What's in your toolkit?" />
        </div>

        {/* Logo */}
        <div>
          <label style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Logo URL (optional)</label>
          <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="input" placeholder="https://your-image-url.com/logo.png" />
          <p style={{ color: '#1e293b', fontSize: '12px', marginTop: '6px' }}>Paste any image URL — upload to imgur.com for free</p>
        </div>

        {/* Logo shape */}
        <div>
          <label style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Logo Shape</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {(['circle', 'square'] as const).map(shape => (
              <button key={shape} type="button" onClick={() => setLogoShape(shape)}
                style={{ flex: 1, padding: '16px', borderRadius: '12px', border: `2px solid ${logoShape === shape ? '#ef4444' : 'rgba(255,255,255,0.06)'}`, background: logoShape === shape ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', background: primary, borderRadius: shape === 'circle' ? '50%' : '6px' }} />
                <span style={{ color: logoShape === shape ? '#ef4444' : '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>{shape}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color presets */}
        <div>
          <label style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Color Theme</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
            {COLOR_PRESETS.map((preset, i) => (
              <button key={i} type="button" onClick={() => { setColorPreset(i); setUseCustom(false) }}
                style={{ padding: '0', border: `2px solid ${!useCustom && colorPreset === i ? '#f1f5f9' : 'transparent'}`, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', height: '44px' }}>
                <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.secondary} 50%)` }} title={preset.name} />
              </button>
            ))}
          </div>

          {/* Custom colors */}
          <button type="button" onClick={() => setUseCustom(!useCustom)}
            style={{ background: useCustom ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${useCustom ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '8px', padding: '8px 14px', color: useCustom ? '#fca5a5' : '#64748b', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}>
            🎨 Custom colors
          </button>

          {useCustom && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#475569', fontSize: '11px', display: 'block', marginBottom: '6px' }}>Primary</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={customPrimary} onChange={e => setCustomPrimary(e.target.value)}
                    style={{ width: '40px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'transparent' }} />
                  <input value={customPrimary} onChange={e => setCustomPrimary(e.target.value)} className="input" style={{ flex: 1 }} placeholder="#ef4444" />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#475569', fontSize: '11px', display: 'block', marginBottom: '6px' }}>Secondary</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="color" value={customSecondary} onChange={e => setCustomSecondary(e.target.value)}
                    style={{ width: '40px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'transparent' }} />
                  <input value={customSecondary} onChange={e => setCustomSecondary(e.target.value)} className="input" style={{ flex: 1 }} placeholder="#000000" />
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '12px 14px', color: '#fca5a5', fontSize: '13px' }}>{error}</div>}

        <button disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '14px', marginTop: '4px' }}>
          {loading ? 'Creating...' : '🚀 Create Toolkit'}
        </button>
      </form>
    </div>
  )
                         }
