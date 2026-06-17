'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { nanoid } from 'nanoid'
import { Copy, Check, ExternalLink, Trash2, Plus, Globe, Lock, Code2, Eye } from 'lucide-react'

type Toolkit = {
  id: string; name: string; slug: string; description: string
  logo_url: string; logo_shape: string
  color_primary: string; color_secondary: string
  is_public: boolean; views: number
}
type Tool = {
  id: string; title: string; description: string
  html_code: string; css_code: string; js_code: string
  is_public: boolean; slug: string; views: number
}

export default function ToolkitManager({ toolkit, tools: initialTools }: { toolkit: Toolkit; tools: Tool[] }) {
  const supabase = createClient()
  const router = useRouter()
  const [tools, setTools] = useState(initialTools)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'tools' | 'settings'>('tools')
  const [showEditor, setShowEditor] = useState(false)
  const [editingTool, setEditingTool] = useState<Tool | null>(null)

  // Tool editor state
  const [toolTitle, setToolTitle] = useState('')
  const [toolDesc, setToolDesc] = useState('')
  const [toolHtml, setToolHtml] = useState('<div class="box">\n  <h1>My Tool</h1>\n  <button id="btn">Click Me</button>\n</div>')
  const [toolCss, setToolCss] = useState('.box { font-family: sans-serif; text-align: center; padding: 40px; }\nbutton { background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; }')
  const [toolJs, setToolJs] = useState('document.getElementById("btn").onclick = () => alert("It works!")')
  const [toolPublic, setToolPublic] = useState(true)
  const [codeTab, setCodeTab] = useState<'html' | 'css' | 'js'>('html')
  const [saving, setSaving] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/u/${toolkit.slug}` : `/u/${toolkit.slug}`

  function copyLink() {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function openEditor(tool?: Tool) {
    if (tool) {
      setEditingTool(tool)
      setToolTitle(tool.title)
      setToolDesc(tool.description)
      setToolHtml(tool.html_code)
      setToolCss(tool.css_code)
      setToolJs(tool.js_code)
      setToolPublic(tool.is_public)
    } else {
      setEditingTool(null)
      setToolTitle('')
      setToolDesc('')
      setToolHtml('<div class="box">\n  <h1>My Tool</h1>\n  <button id="btn">Click Me</button>\n</div>')
      setToolCss('.box { font-family: sans-serif; text-align: center; padding: 40px; }\nbutton { background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }')
      setToolJs('document.getElementById("btn").onclick = () => alert("It works!")')
      setToolPublic(true)
    }
    setShowEditor(true)
  }

  async function saveTool() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editingTool) {
      const { data } = await supabase.from('tools').update({
        title: toolTitle, description: toolDesc,
        html_code: toolHtml, css_code: toolCss, js_code: toolJs,
        is_public: toolPublic
      }).eq('id', editingTool.id).select().single()
      if (data) setTools(tools.map(t => t.id === data.id ? data : t))
    } else {
      const slug = `${toolTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 25)}-${nanoid(5)}`
      const { data } = await supabase.from('tools').insert({
        toolkit_id: toolkit.id, owner_id: user.id,
        title: toolTitle, description: toolDesc,
        html_code: toolHtml, css_code: toolCss, js_code: toolJs,
        is_public: toolPublic, slug
      }).select().single()
      if (data) setTools([data, ...tools])
    }
    setSaving(false)
    setShowEditor(false)
  }

  async function deleteTool(id: string) {
    if (!confirm('Delete this tool?')) return
    await supabase.from('tools').delete().eq('id', id)
    setTools(tools.filter(t => t.id !== id))
  }

  const srcDoc = `<html><head><style>${toolCss}</style></head><body>${toolHtml}<script>${toolJs}<\/script></body></html>`

  if (showEditor) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
        {/* Editor topbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowEditor(false)} className="btn btn-ghost" style={{ padding: '8px 12px' }}>← Back</button>
          <input value={toolTitle} onChange={e => setToolTitle(e.target.value)} className="input" placeholder="Tool name" style={{ flex: 1, minWidth: '200px' }} />
          <input value={toolDesc} onChange={e => setToolDesc(e.target.value)} className="input" placeholder="Short description" style={{ flex: 1, minWidth: '200px' }} />
          <button onClick={() => setToolPublic(!toolPublic)} className="btn btn-ghost" style={{ padding: '8px 12px', color: toolPublic ? '#4ade80' : '#64748b' }}>
            {toolPublic ? <Globe size={14} /> : <Lock size={14} />}
            {toolPublic ? 'Public' : 'Private'}
          </button>
          <button onClick={saveTool} disabled={saving || !toolTitle} className="btn btn-primary">
            {saving ? 'Saving...' : '💾 Save Tool'}
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, gap: '16px', minHeight: 0 }}>
          {/* Code editor */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {(['html', 'css', 'js'] as const).map(tab => (
                <button key={tab} onClick={() => setCodeTab(tab)}
                  style={{ padding: '10px 16px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.05em', background: codeTab === tab ? 'rgba(239,68,68,0.1)' : 'transparent', color: codeTab === tab ? '#ef4444' : '#334155', borderBottom: codeTab === tab ? '2px solid #ef4444' : '2px solid transparent' }}>
                  {tab}
                </button>
              ))}
            </div>
            <textarea
              value={codeTab === 'html' ? toolHtml : codeTab === 'css' ? toolCss : toolJs}
              onChange={e => { if (codeTab === 'html') setToolHtml(e.target.value); else if (codeTab === 'css') setToolCss(e.target.value); else setToolJs(e.target.value) }}
              style={{ flex: 1, background: '#050508', color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', padding: '16px', border: 'none', outline: 'none', resize: 'none', lineHeight: '1.6' }}
              spellCheck={false} />
          </div>

          {/* Preview */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={13} style={{ color: '#334155' }} />
              <span style={{ color: '#334155', fontSize: '12px', fontWeight: '600' }}>Live Preview</span>
            </div>
            <iframe srcDoc={srcDoc} sandbox="allow-scripts allow-modals" title="preview" style={{ flex: 1, border: 'none', background: 'white' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Toolkit header */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px' }}>
        <div style={{ height: '100px', background: `linear-gradient(135deg, ${toolkit.color_primary} 50%, ${toolkit.color_secondary} 50%)`, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: '-24px', left: '24px', width: '48px', height: '48px', borderRadius: toolkit.logo_shape === 'circle' ? '50%' : '10px', background: toolkit.logo_url ? `url(${toolkit.logo_url}) center/cover` : toolkit.color_primary, border: '3px solid #080810', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '20px', boxShadow: `0 0 20px ${toolkit.color_primary}66` }}>
            {!toolkit.logo_url && toolkit.name[0]?.toUpperCase()}
          </div>
        </div>
        <div style={{ padding: '36px 24px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em' }}>{toolkit.name}</h1>
            {toolkit.description && <p style={{ color: '#475569', fontSize: '14px', marginTop: '4px' }}>{toolkit.description}</p>}
            <p style={{ color: '#334155', fontSize: '12px', marginTop: '8px' }}>{toolkit.views} views · {tools.length} tools</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={copyLink} className="btn btn-ghost" style={{ fontSize: '13px', padding: '8px 14px' }}>
              {copied ? <Check size={13} style={{ color: '#4ade80' }} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <a href={`/u/${toolkit.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '13px', padding: '8px 14px' }}>
              <ExternalLink size={13} /> View Public Page
            </a>
          </div>
        </div>
      </div>

      {/* Tools section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '700' }}>Tools ({tools.length})</h2>
        <button onClick={() => openEditor()} className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
          <Plus size={14} /> Add Tool
        </button>
      </div>

      {tools.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚡</div>
          <p style={{ color: '#334155', fontSize: '14px', marginBottom: '16px' }}>No tools yet — add your first one</p>
          <button onClick={() => openEditor()} className="btn btn-primary">+ Add First Tool</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {tools.map(tool => (
            <div key={tool.id} className="card" style={{ padding: '16px', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '14px' }}>{tool.title}</h3>
                <span style={{ background: tool.is_public ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)', color: tool.is_public ? '#4ade80' : '#64748b', fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '99px' }}>
                  {tool.is_public ? 'Public' : 'Private'}
                </span>
              </div>
              {tool.description && <p style={{ color: '#475569', fontSize: '12px', marginBottom: '12px' }}>{tool.description}</p>}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => openEditor(tool)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '6px' }}>
                  <Code2 size={12} /> Edit
                </button>
                <a href={`/t/${tool.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center', fontSize: '12px', padding: '6px' }}>
                  <ExternalLink size={12} /> Open
                </a>
                <button onClick={() => deleteTool(tool.id)} style={{ padding: '6px 10px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', borderRadius: '6px' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
  }
