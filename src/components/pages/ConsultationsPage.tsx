import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  CheckCircle,
  MessageSquare,
  FileEdit,
  X,
  Save,
  Check,
  XCircle,
  History,
  AlertTriangle,
  Info,
  RotateCcw,
  BookOpen
} from 'lucide-react';

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
  const [consultFilter, setConsultFilter] = useState<'all' | 'pending' | 'scheduled' | 'history'>('all');
  const [feedbackNoteInput, setFeedbackNoteInput] = useState<{ [id: number]: string }>({});
  const [openNoteId, setOpenNoteId] = useState<number | null>(null);

  // State for rejecting a consultation
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState<{ [id: number]: string }>({});

  // Automatically mark user's consultations as read upon viewing the page
  useEffect(() => {
    markConsultationsRead();
  }, []);

  const handleApprove = (id: number) => {
    updateConsultation(id, {
      status: 'Terjadwal',
      is_read: 1
    });
  };

  const handleConfirmReject = (id: number) => {
    const reason = rejectReasonInput[id]?.trim() || 'Mohon lengkapi data riset dan perbaiki agenda bimbingan sebelum mengajukan kembali.';
    updateConsultation(id, {
      status: 'Ditolak',
      rejection_reason: reason,
      is_read: 1
    });
    setRejectingId(null);
  };

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

  const handleCancelByStudent = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pengajuan bimbingan ini?')) {
      updateConsultation(id, { status: 'Dibatalkan', is_read: 1 });
    }
  };

  // Counts for tabs
  const pendingCount = consultations.filter(c => c.status === 'Menunggu respons').length;
  const scheduledCount = consultations.filter(c => c.status === 'Terjadwal').length;
  const historyCount = consultations.filter(c => c.status === 'Selesai' || c.status === 'Ditolak').length;

  // Filtered consultations
  const filteredConsultations = consultations.filter(c => {
    if (consultFilter === 'pending') return c.status === 'Menunggu respons';
    if (consultFilter === 'scheduled') return c.status === 'Terjadwal';
    if (consultFilter === 'history') return c.status === 'Selesai' || c.status === 'Ditolak';
    return true; // 'all'
  });

  return (
    <section className="page active" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <div className="section-head" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="eyebrow">
            {isLecturer ? 'Supervisi Dosen Pembimbing' : 'Bimbingan Akademik & Metodologi'}
          </div>
          <h2 className="h1">
            {isLecturer ? 'Bimbingan & Klinik Riset' : 'Jadwal & Bimbingan Saya'}
          </h2>
          <p className="sub">
            {isLecturer
              ? 'Kelola persetujuan bimbingan, klinik kendala metodologi, dan verifikasi riwayat arahan riset mahasiswa.'
              : 'Jadwalkan sesi bimbingan dengan dosen pembimbing, pantau status persetujuan, dan telusuri riwayat arahan.'}
          </p>
        </div>

        {!isLecturer && (
          <button className="btn btn-primary" onClick={() => openModal('consultation')} style={{ whiteSpace: 'nowrap' }}>
            <Plus size={15} />
            <span>Ajukan Bimbingan Baru</span>
          </button>
        )}
      </div>

      {/* Filter Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <button
          type="button"
          className={`btn ${consultFilter === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setConsultFilter('all')}
          style={{ borderRadius: '20px', padding: '6px 14px', fontSize: '12.5px', whiteSpace: 'nowrap' }}
        >
          Semua Sesi ({consultations.length})
        </button>

        <button
          type="button"
          className={`btn ${consultFilter === 'pending' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setConsultFilter('pending')}
          style={{
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12.5px',
            whiteSpace: 'nowrap',
            borderColor: pendingCount > 0 ? '#f59e0b' : undefined,
            color: consultFilter !== 'pending' && pendingCount > 0 ? '#d97706' : undefined
          }}
        >
          ⏳ Menunggu Respons ({pendingCount})
        </button>

        <button
          type="button"
          className={`btn ${consultFilter === 'scheduled' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setConsultFilter('scheduled')}
          style={{ borderRadius: '20px', padding: '6px 14px', fontSize: '12.5px', whiteSpace: 'nowrap' }}
        >
          📅 Terjadwal ({scheduledCount})
        </button>

        <button
          type="button"
          className={`btn ${consultFilter === 'history' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setConsultFilter('history')}
          style={{
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12.5px',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <History size={14} />
          <span>Riwayat Bimbingan ({historyCount})</span>
        </button>
      </div>

      {/* History Summary Banner when History tab is selected */}
      {consultFilter === 'history' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}
        >
          <div
            className="card"
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#22c55e',
                color: 'white',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0
              }}
            >
              <CheckCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                Bimbingan Selesai
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#14532d' }}>
                {consultations.filter(c => c.status === 'Selesai').length} Sesi
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#fef2f2',
              border: '1px solid #fecaca'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#ef4444',
                color: 'white',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0
              }}
            >
              <XCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>
                Pengajuan Ditolak
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#7f1d1d' }}>
                {consultations.filter(c => c.status === 'Ditolak').length} Sesi
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#2563eb',
                color: 'white',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                Catatan Ilmiah Tersimpan
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e3a8a' }}>
                {consultations.filter(c => c.feedback).length} Arahan
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consultations List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredConsultations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
            {consultFilter === 'history'
              ? 'Belum ada riwayat bimbingan lampau (selesai atau ditolak).'
              : consultFilter === 'pending'
              ? 'Tidak ada permohonan bimbingan yang menunggu respons saat ini.'
              : consultFilter === 'scheduled'
              ? 'Tidak ada jadwal bimbingan aktif yang sedang berlangsung.'
              : 'Belum ada jadwal bimbingan riset saat ini.'}
          </div>
        ) : (
          filteredConsultations.map(c => {
            const proj = projects.find(p => p.id === c.project_id);
            const isCompleted = c.status === 'Selesai';
            const isScheduled = c.status === 'Terjadwal';
            const isPending = c.status === 'Menunggu respons';
            const isRejected = c.status === 'Ditolak';

            const borderLeftColor = isCompleted
              ? '#22c55e'
              : isScheduled
              ? '#2563eb'
              : isRejected
              ? '#ef4444'
              : '#f59e0b';

            return (
              <div
                key={c.id}
                className="card"
                style={{
                  borderLeft: `5px solid ${borderLeftColor}`,
                  padding: '20px',
                  boxSizing: 'border-box',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}
                >
                  <div style={{ flex: '1 1 300px', minWidth: 0, wordBreak: 'break-word' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span className="badge badge-blue">{c.type}</span>

                      {/* Status Badges */}
                      {isPending && (
                        <span className="badge badge-orange" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                          ⏳ Menunggu Respons Dosen
                        </span>
                      )}
                      {isScheduled && (
                        <span className="badge badge-blue">
                          📅 Terjadwal
                        </span>
                      )}
                      {isCompleted && (
                        <span className="badge badge-teal" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}>
                          ✓ Selesai Dilaksanakan
                        </span>
                      )}
                      {isRejected && (
                        <span className="badge badge-red" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' }}>
                          ✕ Pengajuan Ditolak
                        </span>
                      )}
                      {c.status === 'Dibatalkan' && (
                        <span className="badge badge-gray">
                          Dibatalkan
                        </span>
                      )}

                      {proj && <span className="badge badge-purple">{proj.name.slice(0, 40)}...</span>}
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px', lineHeight: 1.4 }}>
                      {c.topic}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        gap: '14px',
                        flexWrap: 'wrap',
                        fontSize: '12px',
                        color: 'var(--ink-secondary)',
                        marginTop: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <span>{new Date(c.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <span>Pukul {c.time} WIB</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <span>{c.mode}</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                      Mahasiswa: <strong>{c.student_name}</strong> · Dosen: <strong>{c.lecturer_name}</strong>
                    </div>

                    {/* Pending notification for student */}
                    {isPending && !isLecturer && (
                      <div
                        style={{
                          marginTop: '10px',
                          fontSize: '12px',
                          background: '#fffbeb',
                          border: '1px solid #fde68a',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          color: '#92400e',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                        <span>Permohonan bimbingan ini sedang dalam proses menunggu verifikasi dan persetujuan dari Dosen Pembimbing.</span>
                      </div>
                    )}

                    {/* Rejection reason box */}
                    {isRejected && (
                      <div
                        style={{
                          marginTop: '12px',
                          fontSize: '12.5px',
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          color: '#991b1b'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <XCircle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong>Catatan Alasan Penolakan dari Dosen:</strong>
                            <div style={{ marginTop: '4px', lineHeight: 1.5, color: '#7f1d1d' }}>
                              {c.rejection_reason || c.feedback || 'Permohonan bimbingan belum disetujui. Silakan periksa kembali kelengkapan riset Anda.'}
                            </div>
                            {!isLecturer && (
                              <div style={{ marginTop: '8px', fontSize: '11.5px', color: '#b91c1c' }}>
                                💡 <em>Saran: Lengkapi catatan perbaikan di atas, kemudian klik "Ajukan Bimbingan Baru" untuk memilih slot waktu baru.</em>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Agenda note */}
                    {c.note && (
                      <div
                        style={{
                          marginTop: '10px',
                          fontSize: '12.5px',
                          background: 'var(--surface-alt)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          lineHeight: 1.5
                        }}
                      >
                        <strong>Agenda / Catatan Awal:</strong> {c.note}
                      </div>
                    )}

                    {/* Guidance / Feedback box */}
                    {c.feedback && (
                      <div
                        style={{
                          marginTop: '12px',
                          fontSize: '12.5px',
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          color: '#166534'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                          <div style={{ flex: '1 1 240px', minWidth: 0 }}>
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
                                padding: '4px 8px',
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

                  {/* Action Buttons Column (Mobile Responsive) */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      width: '100%',
                      maxWidth: '260px',
                      flexShrink: 0,
                      alignItems: 'stretch'
                    }}
                  >
                    {/* LECTURER ACTIONS: When Pending ('Menunggu respons') */}
                    {isLecturer && isPending && (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleApprove(c.id)}
                          style={{
                            fontSize: '12px',
                            padding: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontWeight: 700,
                            background: '#2563eb'
                          }}
                        >
                          <Check size={14} />
                          <span>Setujui & Jadwalkan</span>
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            setRejectingId(rejectingId === c.id ? null : c.id);
                            if (openNoteId === c.id) setOpenNoteId(null);
                          }}
                          style={{
                            fontSize: '12px',
                            padding: '7px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontWeight: 700,
                            background: '#fee2e2',
                            color: '#b91c1c',
                            borderColor: '#fca5a5'
                          }}
                        >
                          <X size={14} />
                          <span>{rejectingId === c.id ? 'Tutup Form Penolakan' : 'Tolak Pengajuan'}</span>
                        </button>
                      </>
                    )}

                    {/* LECTURER ACTIONS: When Scheduled ('Terjadwal') */}
                    {isLecturer && isScheduled && (
                      <>
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
                      </>
                    )}

                    {/* LECTURER ACTIONS: When Completed ('Selesai') without feedback */}
                    {isLecturer && isCompleted && !c.feedback && openNoteId !== c.id && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setOpenNoteId(c.id)}
                        style={{ fontSize: '11.5px', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                      >
                        <FileEdit size={13} />
                        <span>+ Beri Catatan Ilmiah</span>
                      </button>
                    )}

                    {/* STUDENT ACTIONS: When Pending ('Menunggu respons') */}
                    {!isLecturer && isPending && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleCancelByStudent(c.id)}
                        style={{
                          fontSize: '11.5px',
                          padding: '6px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          color: '#dc2626'
                        }}
                        title="Batalkan permohonan bimbingan ini"
                      >
                        <X size={13} />
                        <span>Batalkan Permohonan</span>
                      </button>
                    )}

                    {/* STUDENT ACTIONS: When Scheduled ('Terjadwal') */}
                    {!isLecturer && isScheduled && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => updateConsultation(c.id, { status: 'Selesai', is_read: 1 })}
                        style={{ fontSize: '11.5px', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                        title="Tandai bahwa sesi bimbingan telah dihadiri dan selesai"
                      >
                        <CheckCircle size={13} style={{ color: '#16a34a' }} />
                        <span>Konfirmasi Sesi Selesai</span>
                      </button>
                    )}

                    {/* Re-apply shortcut for rejected session */}
                    {!isLecturer && isRejected && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => openModal('consultation', { projectId: c.project_id, lecturer: c.lecturer_name, topic: c.topic })}
                        style={{
                          fontSize: '11.5px',
                          padding: '6px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <RotateCcw size={13} />
                        <span>Ajukan Jadwal Baru</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Rejection Reason Box for Lecturer */}
                {isLecturer && rejectingId === c.id && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '16px',
                      background: '#fff1f2',
                      border: '1px solid #fecdd3',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={15} style={{ color: '#e11d48' }} />
                      <strong style={{ fontSize: '13px', color: '#9f1239' }}>
                        Alasan Penolakan Permohonan Bimbingan
                      </strong>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#881337' }}>
                      Pilih alasan cepat atau ketikkan masukan agar mahasiswa dapat memperbaiki bahan bimbingannya:
                    </div>

                    {/* Quick Rejection Preset Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {[
                        { label: '📅 Jadwal Bentrok', text: 'Jadwal bentrok dengan agenda akademik lain. Silakan ajukan di jam bimbingan hari berikutnya.' },
                        { label: '📊 Logbook Belum Lengkap', text: 'Mohon lengkapi catatan logbook eksperimen dan lampirkan dataset primer terlebih dahulu.' },
                        { label: '🎯 Perjelas Rumusan Masalah', text: 'Topik terlalu umum. Harap perjelas rumusan masalah dan hipotesis sebelum review.' },
                        { label: '📑 Siapkan Manuskrip Terkini', text: 'Silakan unggah draf manuskrip revisi ke repositori sebelum sesi review.' }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={() => {
                            setRejectReasonInput(prev => ({ ...prev, [c.id]: preset.text }));
                          }}
                          style={{
                            fontSize: '11px',
                            padding: '4px 8px',
                            background: '#ffffff',
                            border: '1px solid #fbcfe8',
                            borderRadius: '6px',
                            color: '#9f1239',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Tuliskan catatan alasan penolakan dan arahan perbaikan untuk mahasiswa..."
                      value={rejectReasonInput[c.id] || ''}
                      onChange={e => setRejectReasonInput(prev => ({ ...prev, [c.id]: e.target.value }))}
                      autoFocus
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        fontSize: '12.5px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #fecdd3',
                        fontFamily: 'inherit',
                        lineHeight: 1.4,
                        resize: 'vertical'
                      }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setRejectingId(null)}
                        style={{ fontSize: '11.5px', padding: '5px 12px' }}
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleConfirmReject(c.id)}
                        style={{ fontSize: '11.5px', padding: '5px 14px', background: '#e11d48', color: '#ffffff' }}
                      >
                        <XCircle size={13} style={{ marginRight: '4px' }} />
                        <span>Kirim Penolakan</span>
                      </button>
                    </div>
                  </div>
                )}

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
