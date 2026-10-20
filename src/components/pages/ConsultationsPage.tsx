import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, Plus, CheckCircle, MessageSquare } from 'lucide-react';

export const ConsultationsPage: React.FC = () => {
  const {
    currentUser,
    consultations,
    updateConsultation,
    markConsultationsRead,
    openModal,
    projects
  } = useApp();

  const isLecturer = currentUser?.role === 'lecturer';
  const [feedbackNoteInput, setFeedbackNoteInput] = useState<{ [id: number]: string }>({});

  // Automatically mark user's consultations as read upon viewing the page
  useEffect(() => {
    markConsultationsRead();
  }, []);

  const handleCompleteConsultation = (id: number) => {
    const feedback = feedbackNoteInput[id] || 'Bimbingan telah selesai dilaksanakan dengan baik.';
    updateConsultation(id, { status: 'Selesai', feedback, is_read: 1 });
  };

  return (
    <section className="page active">
      <div className="section-head">
        <div>
          <div className="eyebrow">
            {isLecturer ? 'Supervisi Dosen Pembimbing' : 'Bimbingan Akademik & Metodologi'}
          </div>
          <h2 className="h1">
            {isLecturer ? 'Bimbingan & Klinik Riset' : 'Jadwal & Bimbingan Saya'}
          </h2>
          <p className="sub">
            {isLecturer
              ? 'Kelola permohonan konsultasi checkpoint, klinik blocker metodologi, dan berikan umpan balik ilmiah.'
              : 'Jadwalkan sesi konsultasi dengan dosen pembimbing untuk validasi tahapan riset dan penanganan blocker.'}
          </p>
        </div>

        {!isLecturer && (
          <button className="btn btn-primary" onClick={() => openModal('consultation')}>
            <Plus size={15} />
            <span>Ajukan Bimbingan Baru</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {consultations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
            Belum ada jadwal bimbingan riset saat ini.
          </div>
        ) : (
          consultations.map(c => {
            const proj = projects.find(p => p.id === c.project_id);
            return (
              <div
                key={c.id}
                className="card"
                style={{
                  borderLeft: `5px solid ${c.status === 'Selesai' ? '#22c55e' : c.status === 'Terjadwal' ? '#2563eb' : '#f59e0b'}`,
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge badge-blue">{c.type}</span>
                      <span
                        className={`badge ${
                          c.status === 'Selesai' ? 'badge-teal' : c.status === 'Terjadwal' ? 'badge-blue' : 'badge-orange'
                        }`}
                      >
                        {c.status}
                      </span>
                      {proj && <span className="badge badge-purple">{proj.name.slice(0, 45)}...</span>}
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
                      {c.topic}
                    </h3>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={13} style={{ color: 'var(--primary)' }} />
                        <span>{new Date(c.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={13} style={{ color: 'var(--primary)' }} />
                        <span>Pukul {c.time} WIB</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={13} style={{ color: 'var(--primary)' }} />
                        <span>{c.mode}</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                      Mahasiswa: <strong>{c.student_name}</strong> · Dosen: <strong>{c.lecturer_name}</strong>
                    </div>

                    {c.note && (
                      <div style={{ marginTop: '10px', fontSize: '12.5px', background: 'var(--surface-alt)', padding: '10px 14px', borderRadius: '8px' }}>
                        <strong>Agenda / Catatan Awal:</strong> {c.note}
                      </div>
                    )}

                    {c.feedback && (
                      <div style={{ marginTop: '10px', fontSize: '12.5px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '8px', color: '#166534' }}>
                        <strong>✓ Arahan & Umpan Balik Dosen:</strong> {c.feedback}
                      </div>
                    )}
                  </div>

                  {/* Actions for Lecturer */}
                  {isLecturer && c.status !== 'Selesai' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
                      <input
                        type="text"
                        placeholder="Tuliskan arahan / catatan bimbingan..."
                        value={feedbackNoteInput[c.id] || ''}
                        onChange={e => setFeedbackNoteInput({ ...feedbackNoteInput, [c.id]: e.target.value })}
                        style={{ fontSize: '12px', padding: '6px 10px' }}
                      />
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleCompleteConsultation(c.id)}
                      >
                        <CheckCircle size={13} />
                        <span>Tandai Selesai & Beri Catatan</span>
                      </button>
                    </div>
                  )}

                  {/* Actions for Student */}
                  {!isLecturer && c.status !== 'Selesai' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => updateConsultation(c.id, { status: 'Selesai', is_read: 1 })}
                        style={{ fontSize: '11.5px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                        title="Tandai bahwa sesi bimbingan telah dihadiri dan selesai"
                      >
                        <CheckCircle size={13} style={{ color: '#16a34a' }} />
                        <span>Tandai Selesai Dilaksanakan</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
