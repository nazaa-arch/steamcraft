import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, FlaskConical, Wifi, Layers, Check, X, Plus, Calendar } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { currentUser, resourceRequests, updateResourceStatus, openModal, projects } = useApp();
  const isLecturerOrAdmin = currentUser?.role === 'lecturer' || currentUser?.role === 'admin';

  const campusFacilities = [
    {
      name: 'GPU Workstation (NVIDIA RTX 4090)',
      category: 'Komputasi & AI',
      desc: 'Server komputasi akselerasi paralel untuk pelatihan model Deep Learning, Computer Vision, dan komputasi sains.',
      specs: '24GB VRAM GDDR6X, CUDA 12.4, PyTorch, TensorFlow',
      status: 'Tersedia (Quota 4 Jam / Sesi)'
    },
    {
      name: 'Printer 3D & Rapid Prototyping Workshop',
      category: 'Rekayasa & Fabrikasi',
      desc: 'Pencetakan casing sirkuit terpadu, enclosure sensor outdoor tahan air, dan mounting robotika asistif.',
      specs: 'Filamen PLA/PETG/ABS, Nozzle 0.4mm, Akurasi 0.05mm',
      status: 'Tersedia (Bahan Disediakan Lab)'
    },
    {
      name: 'Kit Mikrokontroler & Modul LoRa SX1278',
      category: 'Sensor & IoT',
      desc: 'Modul transmisi telemetri nirkabel jarak jauh (Long Range) berdaya rendah untuk jaringan stasiun sensor outdoor.',
      specs: 'Frekuensi 433/915 MHz, SPI Interface, Antena 5dBi',
      status: 'Tersedia (Peminjaman Maksimal 14 Hari)'
    },
    {
      name: 'Spektrofotometer UV-Vis & FTIR',
      category: 'Kimia & Bioteknologi',
      desc: 'Analisis kualitatif dan kuantitatif gugus fungsi organik, adsorpsi polimer, dan uji konsentrasi larutan.',
      specs: 'Rentang 190 - 1100 nm, Dual Beam Optik, Kuvet Kuarsa',
      status: 'Perlu Pendampingan Asisten Lab'
    }
  ];

  return (
    <section className="page active">
      <div className="section-head">
        <div>
          <div className="eyebrow">Infrastruktur & Sarana Penelitian</div>
          <h2 className="h1">
            {isLecturerOrAdmin ? 'Tata Kelola Lab & Fasilitas' : 'Ajukan Fasilitas & Laboratorium'}
          </h2>
          <p className="sub">
            Akses fasilitas komputasi kinerja tinggi, laboratorium basah terpadu, dan perlengkapan fabrikasi prototipe.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => openModal('resource')}>
          <Plus size={15} />
          <span>Ajukan Permohonan Fasilitas</span>
        </button>
      </div>

      {/* Facilities Showcase Cards */}
      <div className="section-head" style={{ marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>
            Katalog Fasilitas Laboratorium Terpadu
          </h3>
        </div>
      </div>

      <div className="projects-grid" style={{ marginBottom: '32px' }}>
        {campusFacilities.map((fac, i) => (
          <div key={i} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span className="badge badge-teal">{fac.category}</span>
              <span className="badge badge-blue" style={{ fontSize: '10px' }}>{fac.status}</span>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy)', marginBottom: '6px' }}>
              {fac.name}
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', marginBottom: '12px' }}>
              {fac.desc}
            </p>
            <div style={{ fontSize: '11px', color: 'var(--muted)', background: 'var(--surface-alt)', padding: '6px 10px', borderRadius: '8px' }}>
              ⚙️ <strong>Spesifikasi:</strong> {fac.specs}
            </div>
          </div>
        ))}
      </div>

      {/* Requests History & Management */}
      <div className="section-head">
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>
            Daftar Permohonan Fasilitas ({resourceRequests.length})
          </h3>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {resourceRequests.map(req => {
          const proj = projects.find(p => p.id === req.project_id);
          return (
            <div
              key={req.id}
              className="card"
              style={{
                padding: '18px 20px',
                borderLeft: `5px solid ${req.status === 'Disetujui' ? '#22c55e' : req.status === 'Ditolak' ? '#ef4444' : '#f59e0b'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '14.5px', color: 'var(--navy)' }}>{req.resource_name}</strong>
                    <span
                      className={`badge ${
                        req.status === 'Disetujui' ? 'badge-teal' : req.status === 'Ditolak' ? 'badge-rose' : 'badge-orange'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                    Pemohon: <strong>{req.student_name}</strong> {proj ? `(Proyek: ${proj.name})` : ''} · Tanggal Pemakaian:{' '}
                    <strong>{new Date(req.date_needed).toLocaleDateString('id-ID')}</strong>
                  </div>
                  {req.note && (
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                      Keperluan: "{req.note}"
                    </div>
                  )}
                  {req.feedback && (
                    <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px', fontWeight: 600 }}>
                      Catatan Lab: "{req.feedback}"
                    </div>
                  )}
                </div>

                {isLecturerOrAdmin && req.status === 'Menunggu' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateResourceStatus(req.id, 'Disetujui', 'Disetujui untuk pemakaian sesuai jadwal.')}
                    >
                      <Check size={13} />
                      <span>Setujui</span>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => updateResourceStatus(req.id, 'Ditolak', 'Fasilitas sedang dalam jadwal pemeliharaan.')}
                    >
                      <X size={13} />
                      <span>Tolak</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
