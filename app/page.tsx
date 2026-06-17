import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#080810', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>

      {/* Background glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-100px', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* Navbar */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #ef4444 50%, #000 50%)', boxShadow: '0 0 20px rgba(239,68,68,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '14px' }}>MX</div>
          <div>
            <div style={{ color: '#f1f5f9', fontWeight: '800', fontSize: '16px', letterSpacing: '-0.02em' }}>MODSxTOOLS</div>
            <div style={{ color: '#ef4444', fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Toolkit Maker</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: '500', padding: '8px 16px', borderRadius: '8px' }}>Log in</Link>
          <Link href="/signup" className="btn btn-primary" style={{ textDecoration: 'none' }}>Create Toolkit</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '100px 40px 80px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '99px', padding: '6px 16px', marginBottom: '32px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'glow-pulse 2s infinite' }} />
          <span style={{ color: '#fca5a5', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Build · Brand · Share</span>
        </div>

        <h1 style={{ fontSize: 'clamp(48px, 9vw, 88px)', fontWeight: '900', lineHeight: '1.0', letterSpacing: '-0.04em', marginBottom: '24px' }}>
          <span style={{ color: '#f1f5f9' }}>Your tools.</span><br />
          <span style={{ background: 'linear-gradient(135deg, #ef4444, #f97316, #ef4444)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your brand.</span>
        </h1>

        <p style={{ color: '#475569', fontSize: '18px', lineHeight: '1.7', maxWidth: '540px', margin: '0 auto 48px' }}>
          Create your own toolkit with a custom name, logo and colors.
          Add any tools you build. Share one link — your page, your identity.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '16px', padding: '14px 32px' }}>
            🚀 Create your Toolkit
          </Link>
          <Link href="/login" className="btn btn-ghost" style={{ textDecoration: 'none', fontSize: '15px', padding: '14px 28px' }}>
            Log in
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', padding: '20px 40px 100px' }}>
        <h2 style={{ textAlign: 'center', color: '#f1f5f9', fontSize: '28px', fontWeight: '800', marginBottom: '48px', letterSpacing: '-0.02em' }}>
          How it works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {[
            { step: '01', icon: '🎨', title: 'Create your Toolkit', desc: 'Pick a name, upload a logo, choose your colors. Your toolkit, your identity.' },
            { step: '02', icon: '⚡', title: 'Build your tools', desc: 'Write HTML, CSS & JS with live preview. Add as many tools as you want.' },
            { step: '03', icon: '🔗', title: 'Share your link', desc: 'Get a unique URL like /u/yourname. Anyone who visits sees YOUR brand, not ours.' },
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '16px', right: '20px', color: 'rgba(239,68,68,0.15)', fontSize: '48px', fontWeight: '900' }}>{item.step}</div>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.04)', color: '#1e293b', fontSize: '13px' }}>
        MODSxTOOLS Toolkit Maker — Built by Ibrahim © 2026
      </footer>
    </main>
  )
}
