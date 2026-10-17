import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Bookmark, BookmarkCheck, Search, Plus, Check } from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const {
    announcements,
    markAnnouncementRead,
    markAllAnnouncementsRead,
    toggleSaveAnnouncement,
    openModal,
    currentUser
  } = useApp();

  const isLecturerOrAdmin = currentUser?.role === 'lecturer' || currentUser?.role === 'admin';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch =
      ann.title.toLowerCase().includes(search.toLowerCase()) ||
      ann.body.toLowerCase().includes(search.toLowerCase()) ||
      ann.author_name.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === 'all' || ann.category === selectedCategory;
    const matchesSaved = !showSavedOnly || ann.is_saved;

    return matchesSearch && matchesCat && matchesSaved;
  });

  return (
    <section className="page active">
      <div className="section-head">
        <div>
          <div className="eyebrow">Pemberitahuan & Siaran Kampus</div>
          <h2 className="h1">Pengumuman & Agenda Riset</h2>
          <p className="sub">
            Informasi penting tenggat kompetisi nasional, akses fasilitas lab, panduan penyusunan reproducibility package,
            dan pengumuman hibah riset mahasiswa.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost" onClick={markAllAnnouncementsRead}>
            <Check size={14} />
            <span>Tandai Semua Dibaca</span>
          </button>
          {isLecturerOrAdmin && (
            <button className="btn btn-primary" onClick={() => openModal('newAnnouncement')}>
              <Plus size={14} />
              <span>Buat Pengumuman Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
            />
            <input
              type="text"
              placeholder="Cari pengumuman atau instruksi bimbingan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '38px', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['all', 'Akademik', 'Metodologi', 'Tenggat', 'Fasilitas'].map(cat => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'Semua Kategori' : cat}
              </button>
            ))}

            <button
              type="button"
              className={`btn btn-sm ${showSavedOnly ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              style={{ borderColor: showSavedOnly ? 'var(--primary)' : undefined }}
            >
              <Bookmark size={13} />
              <span>Tersimpan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredAnnouncements.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
            Tidak ada pengumuman yang sesuai dengan filter pencarian.
          </div>
        ) : (
          filteredAnnouncements.map(ann => (
            <div
              key={ann.id}
              className={`card ${!ann.is_read ? 'unread' : ''}`}
              style={{
                padding: '20px',
                borderLeft: !ann.is_read ? '5px solid var(--primary)' : '1px solid var(--line)',
                background: !ann.is_read ? '#f8fbff' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span
                      className={`badge badge-${
                        ann.category === 'Akademik' ? 'blue' : ann.category === 'Metodologi' ? 'teal' : 'orange'
                      }`}
                    >
                      {ann.category}
                    </span>
                    {ann.pinned === 1 && (
                      <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                        📌 Disematkan
                      </span>
                    )}
                    {!ann.is_read && (
                      <span className="badge badge-rose" style={{ fontSize: '10px' }}>
                        Baru
                      </span>
                    )}
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      {new Date(ann.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>

                  <h3
                    style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px', cursor: 'pointer' }}
                    onClick={() => {
                      markAnnouncementRead(ann.id);
                      openModal('announcementDetail', ann);
                    }}
                  >
                    {ann.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {ann.body}
                  </p>

                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '10px' }}>
                    Diumumkan oleh: <strong>{ann.author_name}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => toggleSaveAnnouncement(ann.id)}
                    title={ann.is_saved ? 'Hapus dari simpanan' : 'Simpan pengumuman ini'}
                  >
                    {ann.is_saved ? <BookmarkCheck size={14} style={{ color: 'var(--primary)' }} /> : <Bookmark size={14} />}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      markAnnouncementRead(ann.id);
                      openModal('announcementDetail', ann);
                    }}
                  >
                    <span>Baca Detail</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
