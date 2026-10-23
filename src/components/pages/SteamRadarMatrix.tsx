import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

/* ──────────────────────────────────────────────────────────
   FITUR 1 — STEAM RADAR MATRIX
   Diagram radar interaktif 5 pilar (S-T-E-A-M)
   dengan Smart Warning & rekomendasi rekrutmen pilar lemah.
   ────────────────────────────────────────────────────────── */

const PILLARS = [
  { key: 'S', label: 'Science', color: '#2563eb', desc: 'Eksplorasi fenomena alam, hipotesis, dan analisis data empiris' },
  { key: 'T', label: 'Technology', color: '#0d9488', desc: 'Implementasi perangkat lunak/keras, IoT, AI, dan komputasi' },
  { key: 'E', label: 'Engineering', color: '#ea580c', desc: 'Perancangan, prototipe, rekayasa sistem, dan fabrikasi' },
  { key: 'A', label: 'Art', color: '#e11d48', desc: 'Desain UI/UX, visualisasi data, estetika, dan humaniora' },
  { key: 'M', label: 'Mathematics', color: '#7c3aed', desc: 'Pemodelan matematika, statistik, optimasi, dan logika formal' },
];

const CHECKLIST_ITEMS: Record<string, string[]> = {
  S: [
    'Mengidentifikasi fenomena / masalah ilmiah riil',
    'Merumuskan hipotesis yang dapat diuji',
    'Melakukan pengumpulan data empiris / observasi',
    'Menganalisis data dengan metode ilmiah',
    'Menulis kesimpulan berbasis bukti (evidence-based)',
  ],
  T: [
    'Menggunakan perangkat lunak / framework modern',
    'Mengimplementasikan algoritma / model komputasi',
    'Memanfaatkan sensor / IoT / cloud computing',
    'Menerapkan version control (Git) & CI/CD',
    'Membangun sistem yang scalable & maintainable',
  ],
  E: [
    'Merancang arsitektur sistem / blueprint solusi',
    'Membangun prototipe fungsional',
    'Menguji dan mengiterasi desain secara sistematis',
    'Membuat dokumentasi teknis / SOP standar',
    'Mempertimbangkan keamanan, efisiensi & ketahanan',
  ],
  A: [
    'Merancang antarmuka pengguna (UI) yang intuitif',
    'Menerapkan prinsip desain visual & tipografi',
    'Memvisualisasikan data secara naratif & estetis',
    'Mempertimbangkan aspek budaya / sosial / humaniora',
    'Membuat presentasi / poster ilmiah yang menarik',
  ],
  M: [
    'Menggunakan model matematika formal',
    'Menerapkan statistik inferensial / uji hipotesis',
    'Melakukan optimasi / simulasi numerik',
    'Menganalisis kompleksitas / efisiensi algoritma',
    'Memvalidasi hasil dengan metrik kuantitatif',
  ],
};

// Pure SVG Radar Chart
const RadarChart: React.FC<{ scores: Record<string, number> }> = ({ scores }) => {
  const cx = 160, cy = 160, maxR = 120;
  const n = PILLARS.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (i: number, val: number) => {
    const angle = startAngle + i * angleStep;
    const r = (val / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridLevels = [20, 40, 60, 80, 100];

  const dataPoints = PILLARS.map((_, i) => getPoint(i, scores[PILLARS[i].key] || 0));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <svg viewBox="0 0 320 320" style={{ width: '100%', maxWidth: '340px', margin: '0 auto', display: 'block' }}>
      {/* Grid lines */}
      {gridLevels.map(level => {
        const points = PILLARS.map((_, i) => getPoint(i, level));
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
        return <path key={level} d={path} fill="none" stroke="#e2e8f0" strokeWidth={level === 100 ? 1.5 : 0.8} />;
      })}

      {/* Axis lines */}
      {PILLARS.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#cbd5e1" strokeWidth={0.7} />;
      })}

      {/* Data area */}
      <path d={dataPath} fill="rgba(37, 99, 235, 0.15)" stroke="#2563eb" strokeWidth={2.5} strokeLinejoin="round" />

      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={5} fill={PILLARS[i].color} stroke="white" strokeWidth={2} />
      ))}

      {/* Labels */}
      {PILLARS.map((pillar, i) => {
        const labelP = getPoint(i, 130);
        return (
          <text
            key={i}
            x={labelP.x}
            y={labelP.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="13"
            fontWeight="800"
            fill={pillar.color}
          >
            {pillar.key}
          </text>
        );
      })}

      {/* Center score */}
      {(() => {
        const avg = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5);
        return (
          <>
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="900" fill="#0f172a">{avg}%</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">INTEGRASI</text>
          </>
        );
      })()}
    </svg>
  );
};

export const SteamRadarMatrix: React.FC = () => {
  const { projects, currentUser } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<number>(projects[0]?.id || 1);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean[]>>({
    S: [true, true, true, false, true],
    T: [true, true, false, true, true],
    E: [true, false, true, true, false],
    A: [false, true, false, false, true],
    M: [true, true, true, true, false],
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const scores = useMemo(() => {
    const result: Record<string, number> = {};
    for (const pillar of PILLARS) {
      const items = checkedItems[pillar.key] || [];
      const checked = items.filter(Boolean).length;
      result[pillar.key] = Math.round((checked / items.length) * 100);
    }
    return result;
  }, [checkedItems]);

  const avgScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5);
  const weakPillars = PILLARS.filter(p => scores[p.key] < 50);
  const strongPillars = PILLARS.filter(p => scores[p.key] >= 80);

  const toggleItem = (pillarKey: string, index: number) => {
    setCheckedItems(prev => {
      const arr = [...(prev[pillarKey] || [])];
      arr[index] = !arr[index];
      return { ...prev, [pillarKey]: arr };
    });
  };

  const getGrade = (score: number) => {
    if (score >= 90) return { label: 'Sempurna', color: '#16a34a', bg: '#f0fdf4' };
    if (score >= 70) return { label: 'Baik', color: '#0284c7', bg: '#e0f2fe' };
    if (score >= 50) return { label: 'Cukup', color: '#f59e0b', bg: '#fffbeb' };
    return { label: 'Perlu Penguatan', color: '#e11d48', bg: '#fff1f2' };
  };

  const overallGrade = getGrade(avgScore);

  return (
    <section className="page active" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="section-head" style={{ marginBottom: '24px' }}>
        <div>
          <div className="eyebrow">Analisis Keseimbangan Riset Multidisiplin</div>
          <h2 className="h1" style={{ margin: '4px 0 6px 0' }}>STEAM Radar Matrix</h2>
          <p className="sub" style={{ margin: 0 }}>
            Visualisasi interaktif tingkat integrasi 5 pilar STEAM pada setiap proyek riset. Centang kontribusi riset
            untuk mengukur keseimbangan secara otomatis.
          </p>
        </div>

        <select
          value={selectedProjectId}
          onChange={e => setSelectedProjectId(Number(e.target.value))}
          style={{
            padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--line)',
            fontSize: '13px', fontWeight: 700, background: 'white', minWidth: '220px',
            alignSelf: 'center'
          }}
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Main Content Grid */}
      <div className="steam-radar-layout">
        {/* Left: Radar Chart + Score Summary */}
        <div>
          <div className="card" style={{ padding: '24px', borderRadius: '18px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>
              Peta Integrasi 5 Pilar — {selectedProject?.name}
            </h3>
            <RadarChart scores={scores} />

            {/* Overall Score Bar */}
            <div style={{
              marginTop: '16px', padding: '12px 16px', borderRadius: '12px',
              background: overallGrade.bg, border: `1px solid ${overallGrade.color}20`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}>SKOR INTEGRASI STEAM</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: overallGrade.color }}>{avgScore}%</div>
              </div>
              <span style={{
                fontSize: '12px', fontWeight: 800, color: overallGrade.color,
                padding: '4px 10px', borderRadius: '8px', background: `${overallGrade.color}15`
              }}>
                {overallGrade.label}
              </span>
            </div>

            {/* Per-pillar score bars */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {PILLARS.map(p => {
                const score = scores[p.key];
                return (
                  <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: p.color, width: '24px' }}>{p.key}</span>
                    <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                      <div style={{
                        width: `${score}%`, height: '100%', borderRadius: '4px',
                        background: `linear-gradient(90deg, ${p.color}, ${p.color}88)`,
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: score < 50 ? '#e11d48' : '#0f172a', width: '36px', textAlign: 'right' }}>{score}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart Warnings */}
          {weakPillars.length > 0 && (
            <div className="card" style={{
              padding: '16px', borderRadius: '14px', marginTop: '16px',
              borderLeft: '5px solid #f59e0b', background: '#fffbeb'
            }}>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#92400e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚠️</span> Smart Warning — Pilar Lemah Terdeteksi
              </h4>
              {weakPillars.map(p => (
                <div key={p.key} style={{ fontSize: '12px', color: '#78350f', marginBottom: '6px', lineHeight: 1.5 }}>
                  <strong style={{ color: p.color }}>Pilar {p.label} ({scores[p.key]}%)</strong> di bawah ambang batas minimum (50%).
                  {p.key === 'A' && ' Disarankan merekrut anggota dari prodi DKV/Desain melalui Open Recruitment.'}
                  {p.key === 'E' && ' Pertimbangkan menambah komponen fabrikasi prototipe atau pengujian lapangan.'}
                  {p.key === 'S' && ' Perkuat landasan hipotesis dan analisis data empiris berbasis bukti.'}
                  {p.key === 'M' && ' Tambahkan komponen pemodelan matematika, statistik, atau analisis kuantitatif.'}
                  {p.key === 'T' && ' Tingkatkan implementasi teknologi modern seperti AI/ML, IoT, atau cloud.'}
                </div>
              ))}
            </div>
          )}

          {strongPillars.length >= 4 && (
            <div className="card" style={{
              padding: '16px', borderRadius: '14px', marginTop: '16px',
              borderLeft: '5px solid #16a34a', background: '#f0fdf4'
            }}>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🏆</span> Proyek ini memiliki integrasi STEAM yang sangat kuat!
              </h4>
              <p style={{ fontSize: '12px', color: '#15803d', margin: '4px 0 0 0' }}>
                {strongPillars.length} dari 5 pilar berada di atas 80%. Proyek ini layak diajukan ke kompetisi ilmiah nasional.
              </p>
            </div>
          )}
        </div>

        {/* Right: Interactive Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
            Checklist Kontribusi Riset per Pilar
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
            Centang setiap kontribusi yang telah diterapkan oleh tim riset pada proyek ini.
            Skor radar berubah secara real-time.
          </p>

          {PILLARS.map(pillar => {
            const items = CHECKLIST_ITEMS[pillar.key];
            const checked = (checkedItems[pillar.key] || []).filter(Boolean).length;
            const score = scores[pillar.key];
            const grade = getGrade(score);

            return (
              <div key={pillar.key} className="card" style={{
                padding: '16px', borderRadius: '14px',
                borderLeft: `4px solid ${pillar.color}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '28px', height: '28px', borderRadius: '8px', fontWeight: 900, fontSize: '13px',
                      background: `${pillar.color}15`, color: pillar.color, border: `1.5px solid ${pillar.color}30`
                    }}>{pillar.key}</span>
                    <div>
                      <strong style={{ fontSize: '13.5px', color: 'var(--navy)' }}>{pillar.label}</strong>
                      <div style={{ fontSize: '10.5px', color: 'var(--muted)' }}>{pillar.desc}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 800, color: grade.color,
                    padding: '3px 8px', borderRadius: '6px', background: grade.bg
                  }}>
                    {checked}/{items.length} · {score}%
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {items.map((item, idx) => {
                    const isChecked = checkedItems[pillar.key]?.[idx] ?? false;
                    return (
                      <label key={idx} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '8px',
                        padding: '6px 8px', borderRadius: '8px', cursor: 'pointer',
                        background: isChecked ? `${pillar.color}08` : 'transparent',
                        border: `1px solid ${isChecked ? `${pillar.color}25` : 'transparent'}`,
                        transition: 'all 0.15s ease'
                      }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(pillar.key, idx)}
                          style={{ marginTop: '2px', accentColor: pillar.color }}
                        />
                        <span style={{
                          fontSize: '12px', color: isChecked ? 'var(--navy)' : 'var(--ink-secondary)',
                          fontWeight: isChecked ? 700 : 500, lineHeight: 1.4,
                          textDecoration: isChecked ? 'none' : 'none'
                        }}>
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
