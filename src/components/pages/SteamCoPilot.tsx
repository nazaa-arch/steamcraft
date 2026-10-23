import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, X, Send, Sparkles, Bot, User, ChevronDown, Minimize2 } from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   FITUR 3 — STEAM CO-PILOT / ASISTEN METODOLOGI RISET AI
   Floating research assistant widget
   ────────────────────────────────────────────────────────── */

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const KNOWLEDGE_BASE: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['hipotesis', 'rumusan', 'rumuskan', 'hypothesis'],
    response: '💡 **Panduan Perumusan Hipotesis STEAM:**\n\n1. **Identifikasi variabel** — Tentukan variabel independen (X) dan dependen (Y).\n2. **Gunakan format "Jika... maka..."** — *"Jika sensor IoT mendeteksi suhu > 35°C, maka sistem irigasi akan aktif secara otomatis."*\n3. **Pastikan falsifiable** — Hipotesis harus bisa dibuktikan salah melalui eksperimen.\n4. **Hubungkan dengan 5 pilar STEAM** — Cek apakah hipotesis menyentuh aspek sains, teknologi, dan rekayasa.\n\n📊 Gunakan **STEAM Radar Matrix** untuk mengecek keseimbangan pilar riset Anda!'
  },
  {
    keywords: ['metode', 'metodologi', 'statistik', 'analisis', 'machine learning', 'ml', 'ai'],
    response: '🔬 **Rekomendasi Metode Berdasarkan Jenis Data:**\n\n📈 **Data Time-Series** (cuaca, sensor, saham):\n• LSTM / GRU Neural Network\n• ARIMA / SARIMA\n• Prophet (Facebook)\n\n📊 **Data Tabular / Klasifikasi**:\n• XGBoost / LightGBM (baseline kuat)\n• Random Forest\n• SVM dengan kernel RBF\n\n🖼️ **Data Gambar / Citra**:\n• CNN (ResNet, EfficientNet)\n• Transfer Learning\n• YOLO untuk deteksi objek\n\n📝 **Data Teks / NLP**:\n• TF-IDF + Naive Bayes (baseline)\n• BERT / IndoBERT\n• Sentiment Analysis\n\n💡 *Tip Dr. Belgis: Selalu mulai dengan baseline sederhana, baru tingkatkan kompleksitas model.*'
  },
  {
    keywords: ['dataset', 'data', 'sumber', 'download'],
    response: '📂 **Sumber Dataset Riset Terbuka:**\n\n🌍 **Dataset Umum:**\n• [Kaggle](https://kaggle.com) — 200K+ dataset gratis\n• [UCI ML Repository](https://archive.ics.uci.edu/ml) — Dataset klasik ML\n• [Google Dataset Search](https://datasetsearch.research.google.com)\n\n🇮🇩 **Dataset Indonesia:**\n• [data.go.id](https://data.go.id) — Open Data Pemerintah RI\n• [BMKG Data Online](https://dataonline.bmkg.go.id) — Data Cuaca\n• [BPS](https://bps.go.id) — Statistik Nasional\n\n🔬 **Dataset Akademik:**\n• [Zenodo](https://zenodo.org) — Repositori sains terbuka\n• [Mendeley Data](https://data.mendeley.com)\n\n💡 *Pastikan mencantumkan lisensi dan sitasi dataset di Logbook Riset!*'
  },
  {
    keywords: ['progress', 'progres', 'siap', 'evaluasi', 'rubrik', 'penilaian', 'mission control'],
    response: '📋 **Checklist Kesiapan Evaluasi Dosen (Mission Control):**\n\n✅ Progres proyek ≥ 80%\n✅ Minimal 3 checkpoint selesai\n✅ Logbook riset ≥ 5 entri terverifikasi dosen\n✅ STEAM Radar Matrix ≥ 60% integrasi\n✅ Tidak ada status "Blocker" aktif\n✅ Repository data empiris sudah dilengkapi\n✅ Draft laporan / poster tersedia\n\n⚠️ **Rubrik Penilaian 4 Pilar:**\n1. Kelengkapan Metodologi (0-25)\n2. Bukti Empiris (0-25)\n3. Kontribusi Ilmiah (0-25)\n4. Reproduktibilitas (0-25)\n\n🎯 *Target skor minimum untuk sertifikasi: 75/100*'
  },
  {
    keywords: ['poster', 'presentasi', 'laporan', 'tulis', 'paper'],
    response: '📊 **Panduan Poster & Presentasi Ilmiah STEAM:**\n\n🎨 **Struktur Poster A1 (841×594mm):**\n1. Judul & Nama Tim (15% area)\n2. Latar Belakang & Rumusan Masalah (15%)\n3. Metode & Alat (20%)\n4. Hasil & Pembahasan (30%)\n5. Kesimpulan & Referensi (20%)\n\n✍️ **Tips Penulisan:**\n• Gunakan font sans-serif (Inter/Montserrat)\n• Visualisasi data > teks panjang\n• Cantumkan QR Code ke repository online\n• Sertakan 5 tag STEAM yang relevan\n\n🏆 *Kunci menang kompetisi: Ceritakan impact riset untuk masyarakat, bukan hanya teknis!*'
  },
  {
    keywords: ['iot', 'sensor', 'arduino', 'esp', 'lora', 'hardware'],
    response: '🔌 **Panduan IoT & Sensor untuk Riset STEAM:**\n\n📡 **Pemilihan Mikrokontroler:**\n• **ESP32** — WiFi + BLE, cocok untuk indoor\n• **Arduino Mega** — Banyak pin I/O, cocok untuk banyak sensor\n• **STM32** — Performa tinggi, RTOS support\n\n🌡️ **Sensor Populer:**\n• DHT22 (Suhu & Kelembaban) — ±0.5°C\n• BME280 (Suhu, Kelembaban, Tekanan) — Lebih presisi\n• MQ-135 (Kualitas Udara / Gas)\n• HC-SR04 (Ultrasonik / Jarak)\n\n📶 **Komunikasi Nirkabel:**\n• LoRa SX1278 — Jarak jauh (1-10 km), hemat daya\n• NRF24L01 — Jarak dekat, throughput tinggi\n• MQTT via WiFi — Real-time dashboard\n\n💡 *Catat semua kalibrasi sensor di Logbook Riset!*'
  },
  {
    keywords: ['reproduktibilitas', 'replikasi', 'reproducible', 'reproduksibilitas'],
    response: '🔬 **Standar Reproduktibilitas Riset (Pilar ke-4 Rubrik STEAM):**\n\n📦 **Minimum Requirements:**\n1. **Kode sumber** tersedia di GitHub publik\n2. **Dataset mentah** dapat diunduh atau ditautkan\n3. **Environment** terdokumentasi (requirements.txt / Docker)\n4. **Instruksi** langkah-demi-langkah untuk replikasi\n5. **Seed random** dicantumkan untuk eksperimen ML\n\n📋 **Checklist Dr. Belgis:**\n- [ ] README.md lengkap dengan instruksi setup\n- [ ] Data preprocessing terdokumentasi\n- [ ] Hyperparameter dan konfigurasi dicatat\n- [ ] Hasil eksperimen dapat direproduksi oleh reviewer\n\n🎯 *Gunakan tab "Repository Data" di STEAM-Craft untuk menyimpan semua artefak!*'
  },
];

const getAIResponse = (userMessage: string): string => {
  const lower = userMessage.toLowerCase();

  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.response;
    }
  }

  if (lower.includes('halo') || lower.includes('hai') || lower.includes('hello') || lower.includes('hi')) {
    return '👋 **Halo! Saya STEAM Co-Pilot.**\n\nSaya asisten metodologi riset STEAM-Craft yang siap membantu Anda:\n\n• 🔬 Merumuskan **hipotesis** riset\n• 📊 Memilih **metode analisis** data\n• 📂 Menemukan **sumber dataset** terbuka\n• 📋 Mengecek **kesiapan evaluasi** dosen\n• 🎨 Membuat **poster/presentasi** ilmiah\n• 🔌 Panduan **IoT & sensor** untuk riset\n\nSilakan ketik pertanyaan Anda!';
  }

  return '🤔 **Pertanyaan menarik!**\n\nSaya belum memiliki jawaban spesifik untuk topik ini, tetapi berikut saran umum:\n\n1. Konsultasikan dengan **Dr. Belgis** melalui menu **Bimbingan**\n2. Cek **STEAM Radar Matrix** untuk memetakan keseimbangan pilar riset\n3. Dokumentasikan temuan di **Logbook Riset**\n4. Simpan dataset di **Repository Data Empiris**\n\n💡 *Coba tanyakan tentang: hipotesis, metodologi, dataset, evaluasi, poster, atau IoT!*';
};

export const SteamCoPilot: React.FC = () => {
  const { currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: `👋 **Halo, ${currentUser?.name?.split(' ')[0] || 'Peneliti'}!**\n\nSaya **STEAM Co-Pilot** — asisten metodologi riset interaktif.\n\nSaya dapat membantu:\n• Merumuskan hipotesis\n• Memilih metode analisis\n• Menemukan dataset\n• Mengecek kesiapan evaluasi\n\nKetik pertanyaan Anda di bawah! 💬`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now(), role: 'user', content: inputValue.trim(), timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    setTimeout(() => {
      const aiResponse = getAIResponse(userMsg.content);
      const aiMsg: ChatMessage = {
        id: Date.now() + 1, role: 'assistant', content: aiResponse, timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    'Bantu rumuskan hipotesis',
    'Metode ML apa yang cocok?',
    'Cari sumber dataset',
    'Cek kesiapan evaluasi',
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="steam-copilot-fab"
        title="Buka STEAM Co-Pilot — Asisten Riset AI"
        aria-label="Buka asisten riset"
      >
        <Sparkles size={22} />
        <span className="copilot-fab-pulse" />
      </button>
    );
  }

  return (
    <div className={`steam-copilot-panel ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="copilot-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="copilot-avatar"><Bot size={16} /></div>
          <div>
            <strong style={{ fontSize: '13px', color: 'white' }}>STEAM Co-Pilot</strong>
            <div style={{ fontSize: '10px', color: '#93c5fd' }}>Asisten Metodologi Riset AI</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setIsMinimized(!isMinimized)} className="copilot-ctrl-btn" title={isMinimized ? 'Expand' : 'Minimize'}>
            {isMinimized ? <ChevronDown size={14} /> : <Minimize2 size={14} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="copilot-ctrl-btn" title="Tutup">
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="copilot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`copilot-msg ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="copilot-msg-avatar"><Bot size={13} /></div>
                )}
                <div className="copilot-msg-bubble">
                  {msg.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.startsWith('**') && line.endsWith('**')
                        ? <strong>{line.replace(/\*\*/g, '')}</strong>
                        : line.startsWith('• ')
                        ? <div style={{ paddingLeft: '8px' }}>{line}</div>
                        : line.startsWith('- [ ]')
                        ? <div style={{ paddingLeft: '8px' }}>{line}</div>
                        : line === '' ? <br /> : <span>{line}</span>
                      }
                      {i < msg.content.split('\n').length - 1 && !line.startsWith('•') && !line.startsWith('- [') && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="copilot-quick-prompts">
              {quickPrompts.map((prompt, i) => (
                <button key={i} onClick={() => { setInputValue(prompt); }} className="copilot-quick-btn">
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="copilot-input-wrap">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan seputar riset STEAM..."
              className="copilot-input"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="copilot-send-btn"
              title="Kirim"
            >
              <Send size={15} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
