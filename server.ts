import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Sistem Pengajuan Pelatihan SDM Perawat IGD - RS Izza Cikampek',
    timestamp: new Date().toISOString()
  });
});

// AI Training Needs Analysis (TNA) & Clinical Justification Generator
app.post('/api/ai/analyze-training', async (req: Request, res: Response) => {
  try {
    const { nurseName, clinicalLevel, trainingTitle, provider, currentCertifications, customNotes, urgentCase } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // High quality rule-based emergency clinical justification fallback
      return res.json({
        success: true,
        isFallback: true,
        justification: `Pelatihan ${trainingTitle || 'Gawat Darurat Terstandar'} sangat esensial bagi ${nurseName || 'Perawat IGD'} (${clinicalLevel || 'PK II'}) untuk mempertahankan baku mutu asuhan gawat darurat (Emergency Care Standards) di Instalasi Gawat Darurat RS Izza Cikampek. Mengingat lokasi RS Izza yang strategis di koridor industri dan lintas Tol/Pantura Karawang-Cikampek, kesiapan tim IGD dalam resusitasi kardiorespirasi dan stabilisasi trauma kritis merupakan prioritas keselamatan pasien (Patient Safety).`,
        urgencyLevel: 'Tinggi (Prioritas Akreditasi & Mutu Pelayanan)',
        clinicalCompetenciesGained: [
          'Pengenalan aritmia letal dan protokol defibrilasi/kardioversi dini',
          'Manajemen airway definitif dan ventilasi bag-valve-mask pada henti napas',
          'Triase cepat berbasis ESI (Emergency Severity Index) < 5 menit',
          'Stabilisasi hemodinamik dan penanganan syok hemoragik / anafilaksis'
        ],
        institutionalBenefit: 'Memenuhi indikator mutu Kemenkes RI, kepatuhan kredensial Komite Keperawatan RS Izza Cikampek, dan standarisasi respon tim code blue IGD.',
        suggestedShiftPreparation: 'Rotasi perawat pengganti di shift jaga (Pagi/Sore/Malam) minimal 7 hari sebelum tanggal keberangkatan agar kapasitas triase tetap 100% optimal.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `Anda adalah Konsultan Ahli Diklat Keperawatan & Komite Keperawatan IGD (Instalasi Gawat Darurat) Rumah Sakit Izza Cikampek, Karawang, Jawa Barat.
Buat analisis kebutuhan pelatihan (Training Needs Analysis - TNA) dan draft surat justifikasi klinis resmi untuk pengajuan pelatihan SDM perawat IGD berikut:
- Nama Perawat: ${nurseName || 'Perawat IGD'}
- Jenjang Karir Klinis: ${clinicalLevel || 'Perawat Klinis (PK)'}
- Pelatihan yang Diajukan: ${trainingTitle || 'Pelatihan Kegawatdaruratan'}
- Penyelenggara: ${provider || 'Lembaga Pelatihan Terakreditasi Kemenkes / PPNI'}
- Sertifikat Saat Ini: ${currentCertifications || 'BTCLS'}
- Kasus Spesifik / Catatan Lapangan IGD: ${customNotes || 'Penanganan lonjakan kasus trauma dan kegawatdaruratan kardiovaskular di IGD RS Izza Cikampek'}
- Kasus Urgen yang melatarbelakangi: ${urgentCase || 'Update berkala sertifikasi wajib 3 tahunan dan peningkatan rasio perawat tersertifikasi advance'}

Berikan respon JSON valid dengan struktur:
{
  "justification": "Paragraf narasi justifikasi urgensi klinis formal dan persuasif untuk diajukan ke Direksi dan Kepala Diklat RS Izza Cikampek (3-5 kalimat berbobot medis & regulasi Kemenkes/PPNI)",
  "urgencyLevel": "Sangat Tinggi / Tinggi / Sedang",
  "clinicalCompetenciesGained": ["4 poin kompetensi klinis spesifik IGD yang diperoleh"],
  "institutionalBenefit": "Manfaat langsung bagi mutu layanan, akreditasi RS, & respon time IGD RS Izza Cikampek",
  "suggestedShiftPreparation": "Rekomendasi mitigasi dinas jaga perawat selama perawat bersangkutan mengikuti pelatihan"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    return res.json({
      success: true,
      isFallback: false,
      ...parsed
    });
  } catch (error: any) {
    console.error('Error generating AI training analysis:', error);
    return res.status(200).json({
      success: true,
      isFallback: true,
      justification: `Pelatihan ini sangat dianjurkan untuk pemenuhan standar kompetensi kegawatdaruratan di IGD RS Izza Cikampek dan memastikan perpanjangan sertifikat kompetensi sebelum masa berlaku habis.`,
      urgencyLevel: 'Tinggi',
      clinicalCompetenciesGained: [
        'Peningkatan respon cepat tim triase gawat darurat',
        'Penatalaksanaan jalan napas dan resusitasi jantung paru berkualitas tinggi',
        'Kolaborasi interprofesional dalam tata laksana pasien kritis di ruang resusitasi'
      ],
      institutionalBenefit: 'Meningkatkan kepatuhan standar mutu pelayanan emergensi dan kredensialing Komite Keperawatan RS Izza.',
      suggestedShiftPreparation: 'Penugasan perawat pengganti dari shift reguler dan penyesuaian jadwal jaga IGD.'
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
