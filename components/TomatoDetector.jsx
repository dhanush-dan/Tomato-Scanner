'use client';
import { useState, useRef, useCallback } from 'react';

const DISEASES = {
  'Tomato Bacterial Spot':           { color: '#8e44ad', cause: 'Bacterial (Xanthomonas)', spray: 'Copper hydroxide spray', urgency: 'Treat within 2–3 days', icon: '🔬' },
  'Tomato Early Blight':             { color: '#e8650a', cause: 'Fungal (Alternaria solani)', spray: 'Copper fungicide or Mancozeb', urgency: 'Treat within 3–5 days', icon: '🍂' },
  'Tomato Late Blight':              { color: '#c0392b', cause: 'Fungal (Phytophthora infestans)', spray: 'Metalaxyl + Mancozeb (Ridomil)', urgency: 'URGENT — treat within 24 hours', icon: '⚠️' },
  'Tomato Leaf Mold':                { color: '#7f8c00', cause: 'Fungal (Passalora fulva)', spray: 'Chlorothalonil or Copper fungicide', urgency: 'Treat within 4–5 days', icon: '🌿' },
  'Tomato Septoria Leaf Spot':       { color: '#d4a017', cause: 'Fungal (Septoria lycopersici)', spray: 'Chlorothalonil or Mancozeb', urgency: 'Treat within 3–4 days', icon: '🟡' },
  'Tomato Spider Mites':             { color: '#e74c3c', cause: 'Pest (Tetranychus urticae)', spray: 'Abamectin or Neem oil spray', urgency: 'Treat within 2 days', icon: '🕷️' },
  'Tomato Target Spot':              { color: '#c0392b', cause: 'Fungal (Corynespora cassiicola)', spray: 'Azoxystrobin or Chlorothalonil', urgency: 'Treat within 3–5 days', icon: '🎯' },
  'Tomato Yellow Leaf Curl Virus':   { color: '#f39c12', cause: 'Viral — spread by whiteflies', spray: 'Control whiteflies with Imidacloprid', urgency: 'No cure — remove infected plants', icon: '🦟' },
  'Tomato Mosaic Virus':             { color: '#e67e22', cause: 'Viral (ToMV)', spray: 'No chemical cure — remove plant', urgency: 'Isolate immediately', icon: '🧬' },
  'Tomato Healthy':                  { color: '#27ae60', cause: 'No disease detected', spray: 'No treatment needed', urgency: 'Continue regular monitoring', icon: '✅' },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Syne',sans-serif;background:#0a0f0a;color:#e8f0e8;min-height:100vh}
  .app{max-width:780px;margin:0 auto;padding:0 20px 60px}
  .hdr{padding:40px 0 32px;border-bottom:1px solid #1e2e1e;margin-bottom:36px}
  .eye{font-family:'DM Mono',monospace;font-size:11px;font-weight:400;letter-spacing:.15em;text-transform:uppercase;color:#4caf50;margin-bottom:10px}
  .ttl{font-size:clamp(28px,5vw,42px);font-weight:800;line-height:1.05;letter-spacing:-.02em;color:#f0f7f0}
  .ttl span{color:#4caf50}
  .sub{font-family:'DM Mono',monospace;font-size:13px;color:#5a7a5a;margin-top:10px;line-height:1.6}
  .zone{border:1.5px dashed #2a402a;border-radius:16px;padding:48px 24px;text-align:center;cursor:pointer;transition:all .2s;background:#0d140d;position:relative;overflow:hidden}
  .zone::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(76,175,80,.06) 0%,transparent 70%);pointer-events:none}
  .zone:hover,.zone.over{border-color:#4caf50;background:#0f180f}
  .uicon{width:56px;height:56px;border-radius:14px;background:#1a2a1a;border:1px solid #2a402a;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:24px}
  .utitle{font-size:16px;font-weight:600;color:#c8e6c8;margin-bottom:6px}
  .usub{font-family:'DM Mono',monospace;font-size:12px;color:#4a6a4a}
  .ubtn{margin-top:20px;display:inline-block;padding:10px 24px;background:#4caf50;color:#0a0f0a;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;letter-spacing:.05em;border-radius:8px;border:none;cursor:pointer;transition:all .15s}
  .ubtn:hover{background:#66bb6a;transform:translateY(-1px)}
  .pgrid{margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
  @media(max-width:560px){.pgrid{grid-template-columns:1fr}}
  .pcard{background:#0d140d;border:1px solid #1e2e1e;border-radius:14px;overflow:hidden}
  .pcard img{width:100%;display:block;max-height:280px;object-fit:cover}
  .plbl{font-family:'DM Mono',monospace;font-size:11px;color:#4a6a4a;padding:10px 14px;letter-spacing:.08em;text-transform:uppercase}
  .abtn{width:100%;margin-top:20px;padding:16px;background:#4caf50;color:#0a0f0a;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;letter-spacing:.04em;border-radius:12px;border:none;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:10px}
  .abtn:hover:not(:disabled){background:#66bb6a;transform:translateY(-1px)}
  .abtn:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .scan{margin-top:28px;background:#0d140d;border:1px solid #1e2e1e;border-radius:14px;padding:32px;text-align:center}
  .ring{width:56px;height:56px;border:2px solid #1e2e1e;border-top-color:#4caf50;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 16px}
  @keyframes spin{to{transform:rotate(360deg)}}
  .stxt{font-family:'DM Mono',monospace;font-size:13px;color:#4caf50;letter-spacing:.08em}
  .ssub{font-family:'DM Mono',monospace;font-size:11px;color:#3a5a3a;margin-top:6px}
  .rshdr{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px}
  .rstitle{font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4a7a4a;font-family:'DM Mono',monospace}
  .rscnt{font-family:'DM Mono',monospace;font-size:11px;color:#3a5a3a}
  .dcard{background:#0d140d;border-radius:14px;padding:20px;margin-bottom:12px;border:1px solid #1a2a1a;position:relative;overflow:hidden;animation:sli .3s ease forwards;opacity:0;transform:translateY(8px)}
  @keyframes sli{to{opacity:1;transform:translateY(0)}}
  .dcard::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:3px 0 0 3px}
  .dtop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}
  .dnrow{display:flex;align-items:center;gap:10px}
  .dicon{font-size:20px;line-height:1}
  .dname{font-size:16px;font-weight:700;line-height:1.2;color:#e8f0e8}
  .cbadge{font-family:'DM Mono',monospace;font-size:12px;font-weight:500;padding:4px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0}
  .cbar{height:3px;background:#1a2a1a;border-radius:2px;margin-bottom:14px;overflow:hidden}
  .cfill{height:100%;border-radius:2px;transition:width .6s ease}
  .ddetails{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  @media(max-width:480px){.ddetails{grid-template-columns:1fr}}
  .chip{background:#111811;border:1px solid #1e2e1e;border-radius:8px;padding:9px 12px}
  .clbl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#3a5a3a;margin-bottom:3px}
  .cval{font-size:12px;color:#a8c8a8;line-height:1.4;font-weight:500}
  .fmap{margin-top:28px;background:#0d140d;border:1px solid #1e2e1e;border-radius:14px;padding:20px}
  .fmtitle{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#4a6a4a;margin-bottom:14px}
  .srec{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#111811;border-radius:10px;margin-bottom:8px;border:1px solid #1a2a1a}
  .sdot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
  .stx{font-size:13px;color:#c8e6c8;font-weight:500;flex:1}
  .sact{font-family:'DM Mono',monospace;font-size:11px;color:#4a7a4a;white-space:nowrap}
  .hbanner{background:#0a1a0a;border:1px solid #2a4a2a;border-radius:14px;padding:28px;text-align:center}
  .hicon{font-size:40px;margin-bottom:12px}
  .htitle{font-size:20px;font-weight:700;color:#4caf50;margin-bottom:6px}
  .hsub{font-family:'DM Mono',monospace;font-size:12px;color:#4a7a4a}
  .rbtn{margin-top:28px;width:100%;padding:13px;background:transparent;color:#4a7a4a;font-family:'Syne',sans-serif;font-size:13px;font-weight:600;letter-spacing:.05em;border-radius:10px;border:1px solid #1e2e1e;cursor:pointer;transition:all .15s}
  .rbtn:hover{border-color:#3a5a3a;color:#7ab87a}
  .ebox{margin-top:20px;background:#1a0a0a;border:1px solid #4a1a1a;border-radius:12px;padding:16px 18px;font-family:'DM Mono',monospace;font-size:12px;color:#e88}
  .foot{margin-top:40px;padding-top:24px;border-top:1px solid #1a2a1a;font-family:'DM Mono',monospace;font-size:11px;color:#3a5a3a;text-align:center;line-height:1.8}
`;

export default function TomatoDetector() {
  const [image, setImage]       = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [results, setResults]   = useState(null);
  const [error, setError]       = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setResults(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const analyze = async () => {
    if (!imageFile) return;
    setScanning(true);
    setError(null);
    setResults(null);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(',')[1]);
        r.onerror = rej;
        r.readAsDataURL(imageFile);
      });
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, mediaType: imageFile.type || 'image/jpeg' }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results);
    } catch (err) {
      setError('Analysis failed. Please try again with a clear tomato plant photo.');
    } finally {
      setScanning(false);
    }
  };

  const reset = () => { setImage(null); setImageFile(null); setResults(null); setError(null); setScanning(false); };
  const isAllHealthy = results && results.every(r => r.disease === 'Tomato Healthy');
  const hasDisease   = results && !isAllHealthy;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="hdr">
          <div className="eye">AI-powered · Precision Agriculture</div>
          <h1 className="ttl">Tomato<br /><span>Disease</span> Scanner</h1>
          <p className="sub">Upload a photo → instant disease detection → know exactly where to spray</p>
        </header>

        {!image && (
          <div className={`zone ${dragOver ? 'over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current.click()}>
            <div className="uicon">📷</div>
            <div className="utitle">Drop a tomato plant photo here</div>
            <div className="usub">or click to browse · JPG, PNG, WEBP</div>
            <button className="ubtn" onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>Choose Photo</button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])} />
          </div>
        )}

        {image && !results && (
          <>
            <div className="pgrid">
              <div className="pcard">
                <img src={image} alt="Tomato plant" />
                <div className="plbl">📷 uploaded photo</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#0d140d', border: '1px solid #1e2e1e', borderRadius: '14px', padding: '18px' }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#4a6a4a', marginBottom: '10px' }}>How it works</div>
                  {['AI scans leaf texture, colour & patterns', 'Matches against 10 tomato diseases', 'Returns disease name + treatment', 'Tells you exactly which plants to spray'].map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ color: '#4caf50', fontFamily: "'DM Mono',monospace", fontSize: '11px', marginTop: '1px', flexShrink: 0 }}>0{i + 1}</span>
                      <span style={{ fontSize: '12px', color: '#8aaa8a', lineHeight: '1.5' }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#0a150a', border: '1px solid #1e2e1e', borderRadius: '14px', padding: '14px' }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#3a5a3a', marginBottom: '6px' }}>Detects</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {Object.entries(DISEASES).filter(([k]) => k !== 'Tomato Healthy').map(([name, d]) => (
                      <span key={name} style={{ fontSize: '10px', padding: '3px 7px', borderRadius: '20px', background: '#111811', border: `1px solid ${d.color}44`, color: d.color, fontFamily: "'DM Mono',monospace" }}>
                        {d.icon} {name.replace('Tomato ', '')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {scanning ? (
              <div className="scan">
                <div className="ring" />
                <div className="stxt">SCANNING PLANT...</div>
                <div className="ssub">Analysing leaf patterns · Checking for disease signatures</div>
              </div>
            ) : (
              <button className="abtn" onClick={analyze}>🔬 Analyse for Disease</button>
            )}
            {error && <div className="ebox">⚠ {error}</div>}
          </>
        )}

        {results && (
          <div>
            {image && <img src={image} alt="Analysed plant" style={{ width: '100%', borderRadius: '14px', maxHeight: '220px', objectFit: 'cover', border: '1px solid #1e2e1e', marginBottom: '20px' }} />}

            {isAllHealthy ? (
              <div className="hbanner">
                <div className="hicon">🌿</div>
                <div className="htitle">Plant looks healthy</div>
                <div className="hsub">No disease detected · No spray needed · Continue monitoring</div>
              </div>
            ) : (
              <>
                <div className="rshdr">
                  <div className="rstitle">Disease Report</div>
                  <div className="rscnt">{results.filter(r => r.disease !== 'Tomato Healthy').length} condition(s) detected</div>
                </div>
                {results.map((r, i) => {
                  const info = DISEASES[r.disease] || { color: '#4caf50', cause: 'Unknown', spray: 'Consult agronomist', urgency: 'Monitor closely', icon: '🔍' };
                  const conf = Math.round(r.confidence * 100);
                  return (
                    <div className="dcard" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                      <style>{`.dcard:nth-child(${i+1})::before{background:${info.color}}`}</style>
                      <div className="dtop">
                        <div className="dnrow">
                          <span className="dicon">{info.icon}</span>
                          <span className="dname">{r.disease}</span>
                        </div>
                        <span className="cbadge" style={{ background: info.color + '22', color: info.color }}>{conf}% confident</span>
                      </div>
                      <div className="cbar"><div className="cfill" style={{ width: `${conf}%`, background: info.color }} /></div>
                      <div className="ddetails">
                        <div className="chip"><div className="clbl">Cause</div><div className="cval">{info.cause}</div></div>
                        <div className="chip"><div className="clbl">Affected area</div><div className="cval">{r.affected_area}</div></div>
                        <div className="chip"><div className="clbl">Treatment</div><div className="cval">{info.spray}</div></div>
                        <div className="chip" style={{ gridColumn: '1/-1' }}>
                          <div className="clbl">Urgency</div>
                          <div className="cval" style={{ color: r.disease.includes('Late Blight') || r.disease.includes('Virus') ? '#e88' : '#a8c8a8' }}>{info.urgency}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {hasDisease && (
                  <div className="fmap">
                    <div className="fmtitle">Spray recommendation</div>
                    {results.filter(r => r.disease !== 'Tomato Healthy').map((r, i) => {
                      const info = DISEASES[r.disease] || {};
                      return (
                        <div className="srec" key={i}>
                          <div className="sdot" style={{ background: info.color }} />
                          <div className="stx">{r.disease.replace('Tomato ', '')}: {info.spray}</div>
                          <div className="sact">SPRAY</div>
                        </div>
                      );
                    })}
                    <div className="srec" style={{ marginBottom: 0 }}>
                      <div className="sdot" style={{ background: '#27ae60' }} />
                      <div className="stx">All healthy-looking plants in the field</div>
                      <div className="sact" style={{ color: '#27ae60' }}>SKIP</div>
                    </div>
                  </div>
                )}
              </>
            )}
            <button className="rbtn" onClick={reset}>↺ Scan another plant</button>
          </div>
        )}

        <div className="foot">
          Detects 10 tomato diseases · AI-powered · For farm use in India<br />
          Always confirm with a local agronomist before large-scale treatment
        </div>
      </div>
    </>
  );
}
