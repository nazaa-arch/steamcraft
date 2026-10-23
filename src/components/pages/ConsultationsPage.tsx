import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, Plus, CheckCircle, MessageSquare, FileEdit, X, Save } from 'lucide-react';

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
  const [openNoteId, setOpenNoteId] = useState<number | null>(null);

  // Automatically mark user's consultations as read upon viewing the page
  useEffect(() => {
    markConsultationsRead();
  }, []);

  const handleQuickComplete = (id: number) => {
    const feedback = feedbackNoteInput[id] || 'Bimbingan telah selesai dilaksanakan dengan baik.';
    updateConsultation(id, { status: 'Selesai', feedback, is_read: 1 });
  };

  const handleSaveNoteOnly = (id: number) => {
    const feedback = feedbackNoteInput[id] || 'Catatan arahan bimbingan telah diperbarui.';
    updateConsultation(id, { feedback, is_read: 1 });
    setOpenNoteId(null);
  };

  const handleSaveAndComplete = (id: number) => {
    const feedback = feedbackNoteInput[id] || 'Bimbingan telah selesai dilaksanakan dengan baik.';
    updateConsultation(id, { status: 'Selesai', feedback, is_read: 1 });
    setOpenNoteId(null);
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
                      <div style={{ marginTop: '12px', fontSize: '12.5px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 14px', borderRadius: '10px', color: '#166534' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div>
                            <strong>✓ Arahan & Umpan Balik Dosen:</strong>
                            <div style={{ marginTop: '4px', lineHeight: 1.5, color: '#14532d' }}>{c.feedback}</div>
                          </div>
                          {isLecturer && openNoteId !== c.id && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-xs"
                              onClick={() => {
                                setFeedbackNoteInput(prev => ({ ...prev, [c.id]: c.feedback || '' }));
                                setOpenNoteId(c.id);
                              }}
                              style={{
                                fontSize: '11px',
                                color: '#15803d',
                                padding: '3px 8px',
                                border: '1px solid #86efac',
                                background: '#ffffff',
                                borderRadius: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                flexShrink: 0
                              }}
                              title="Perbarui arahan / catatan bimbingan"
                            >
                              <FileEdit size={12} />
                              <span>Edit Catatan</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions for Lecturer */}
                  {isLecturer && c.status !== 'Selesai' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px', alignItems: 'stretch' }}>
                      <button
                        type="button"
                        className={`btn ${openNoteId === c.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                        onClick={() => {
                          if (openNoteId === c.id) {
                            setOpenNoteId(null);
                          } else {
                            setOpenNoteId(c.id);
                            if (!feedbackNoteInput[c.id] && c.feedback) {
                              setFeedbackNoteInput(prev => ({ ...prev, [c.id]: c.feedback || '' }));
                            }
                          }
                        }}
                        style={{
                          fontSize: '12px',
                          padding: '7px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontWeight: 700
                        }}
                      >
                        <FileEdit size={14} />
                        <span>{openNoteId === c.id ? 'Tutup Kotak Arahan' : 'Tulis Arahan / Catatan'}</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleQuickComplete(c.id)}
                        style={{
                          fontSize: '12px',
                          padding: '7px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontWeight: 700
                        }}
                        title="Tandai selesai langsung dengan konfirmasi kehadiran"
                      >
                        <CheckCircle size={14} />
                        <span>Tandai Selesai Langsung</span>
                      </button>
                    </div>
                  )}

                  {/* If already completed, but lecturer wants to add feedback */}
                  {isLecturer && c.status === 'Selesai' && !c.feedback && openNoteId !== c.id && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '180px', alignItems: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setOpenNoteId(c.id)}
                        style={{ fontSize: '11.5px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <FileEdit size={13} />
                        <span>+ Beri Catatan</span>
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

                {/* Expandable Guidance Input Box for Lecturer */}
                {isLecturer && openNoteId === c.id && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '16px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MessageSquare size={15} style={{ color: 'var(--primary)' }} />
                        <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>
                          {c.status === 'Selesai' ? 'Edit Arahan & Catatan Bimbingan' : 'Kotak Pengisian Arahan & Catatan Bimbingan'}
                        </strong>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        Catatan akan tersimpan dan tampil langsung di dashboard mahasiswa
                      </span>
                    </div>

                    {/* Quick Guidance Chips */}
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px' }}>
                        Pilihan Rekomendasi Cepat (Klik untuk menyisipkan):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {[
                          { label: '✓ Metodologi Disetujui', text: 'Metodologi & hipotesis disetujui. Lanjutkan ke tahap pengambilan data empiris.' },
                          { label: '⚠️ Perbaiki Metodologi', text: 'Perbaiki bab metodologi riset dan parameter kontrol replikasi.' },
                          { label: '📊 Lengkapi Dataset', text: 'Unggah dataset primer ke repositori dan verifikasi logbook STEAM.' },
                          { label: '🎯 Siapkan Manuskrip', text: 'Hasil validasi memuaskan. Mulai penyusunan naskah artikel ilmiah.' }
                        ].map((chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => {
                              const current = feedbackNoteInput[c.id] || '';
                              const newText = current ? `${current} ${chip.text}` : chip.text;
                              setFeedbackNoteInput({ ...feedbackNoteInput, [c.id]: newText });
                            }}
                            style={{
                              fontSize: '11px',
                              padding: '4px 10px',
                              background: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              color: 'var(--navy)',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                            title={`Sisipkan: "${chip.text}"`}
                          >
                            <span>{chip.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                      rows={3}
                      placeholder="Tuliskan arahan metodologis, tindak lanjut riset, atau evaluasi bimbingan untuk tim mahasiswa..."
                      value={feedbackNoteInput[c.id] || ''}
                      onChange={e => setFeedbackNoteInput({ ...feedbackNoteInput, [c.id]: e.target.value })}
                      autoFocus
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        fontSize: '12.5px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontFamily: 'inherit',
                        lineHeight: 1.5,
                        resize: 'vertical'
                      }}
                    />

                    {/* Action Buttons Footer */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setOpenNoteId(null)}
                        style={{ fontSize: '11.5px', padding: '5px 12px' }}
                      >
                        <X size={13} />
                        <span>Batal</span>
                      </button>
                      {c.status !== 'Selesai' && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleSaveNoteOnly(c.id)}
                          style={{ fontSize: '11.5px', padding: '5px 12px', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                          title="Simpan catatan tanpa mengubah status sesi menjadi Selesai"
                        >
                          <Save size={13} />
                          <span>Simpan Catatan Saja</span>
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleSaveAndComplete(c.id)}
                        style={{ fontSize: '11.5px', padding: '5px 14px', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <CheckCircle size={13} />
                        <span>{c.status === 'Selesai' ? 'Perbarui Catatan Selesai' : 'Simpan & Tandai Selesai'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
