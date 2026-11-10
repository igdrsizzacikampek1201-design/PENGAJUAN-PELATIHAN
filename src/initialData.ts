import { NurseProfile, TrainingCatalogItem, TrainingSubmission } from './types';

export const INITIAL_NURSES: NurseProfile[] = [
  {
    id: 'n-001',
    nip: 'IZZA-IGD-2019-012',
    name: 'Ns. Rahmat Hidayat, S.Kep',
    gender: 'L',
    clinicalLevel: 'PK III',
    education: 'S1 Keperawatan + Ners',
    niraPpni: '32150892110',
    strNumber: '320152219-3891024',
    strExpiryDate: '2028-09-14',
    sipNumber: '503/412/SIP-PERAWAT/DPMPTSP/2023',
    joinDate: '2019-03-01',
    status: 'Aktif',
    shiftGroup: 'Tim A',
    certifications: [
      {
        id: 'c-101',
        name: 'BTCLS (Basic Trauma Cardiac Life Support)',
        code: 'BTCLS',
        provider: 'HIPGABI Jawa Barat',
        issueDate: '2023-04-10',
        expiryDate: '2027-04-10',
        certNumber: 'HIPGABI-JBR/BTCLS/2023/889',
        status: 'Aktif'
      },
      {
        id: 'c-102',
        name: 'ACLS (Advanced Cardiac Life Support)',
        code: 'ACLS',
        provider: 'PERKI Cabang Jawa Barat',
        issueDate: '2023-11-20',
        expiryDate: '2026-11-20',
        certNumber: 'PERKI-ACLS/2023/11-402',
        status: 'Mendekati Expired'
      },
      {
        id: 'c-103',
        name: 'Australasian Triage Scale (ATS) & ESI Triase IGD',
        code: 'ESI-ATS',
        provider: 'Diklat RSUP Hasan Sadikin',
        issueDate: '2024-02-15',
        expiryDate: '2027-02-15',
        certNumber: 'RSHS-TRG/2024/029',
        status: 'Aktif'
      }
    ]
  },
  {
    id: 'n-002',
    nip: 'IZZA-IGD-2021-045',
    name: 'Siti Nurhaliza, A.Md.Kep',
    gender: 'P',
    clinicalLevel: 'PK II',
    education: 'D3 Keperawatan',
    niraPpni: '32150911045',
    strNumber: '320151121-4992011',
    strExpiryDate: '2027-06-20',
    sipNumber: '503/678/SIP-PERAWAT/DPMPTSP/2022',
    joinDate: '2021-08-15',
    status: 'Aktif',
    shiftGroup: 'Tim B',
    certifications: [
      {
        id: 'c-201',
        name: 'BTCLS (Basic Trauma Cardiac Life Support)',
        code: 'BTCLS',
        provider: 'Pro Emergency Indonesia',
        issueDate: '2022-12-05',
        expiryDate: '2026-12-05',
        certNumber: 'PRO-EMG/BTCLS/2022/411',
        status: 'Mendekati Expired'
      },
      {
        id: 'c-202',
        name: 'Pencegahan & Pengendalian Infeksi (PPI) IGD',
        code: 'PPI-IGD',
        provider: 'Komite PPI RS Izza Cikampek',
        issueDate: '2024-05-18',
        expiryDate: '2027-05-18',
        certNumber: 'PPI-IZZA/2024/110',
        status: 'Aktif'
      }
    ]
  },
  {
    id: 'n-003',
    nip: 'IZZA-IGD-2018-005',
    name: 'Ns. Hendra Setiawan, S.Kep',
    gender: 'L',
    clinicalLevel: 'PK IV',
    education: 'S1 Keperawatan + Ners',
    niraPpni: '32150781290',
    strNumber: '320152118-2094811',
    strExpiryDate: '2029-01-11',
    sipNumber: '503/210/SIP-PERAWAT/DPMPTSP/2021',
    joinDate: '2018-02-01',
    status: 'Aktif',
    shiftGroup: 'Tim Non-Shift',
    certifications: [
      {
        id: 'c-301',
        name: 'BTCLS (Basic Trauma Cardiac Life Support)',
        code: 'BTCLS',
        provider: 'HIPGABI Jawa Barat',
        issueDate: '2024-03-12',
        expiryDate: '2028-03-12',
        certNumber: 'HIPGABI-JBR/BTCLS/2024/104',
        status: 'Aktif'
      },
      {
        id: 'c-302',
        name: 'ACLS (Advanced Cardiac Life Support)',
        code: 'ACLS',
        provider: 'PERKI Cabang Jawa Barat',
        issueDate: '2024-08-20',
        expiryDate: '2027-08-20',
        certNumber: 'PERKI-ACLS/2024/08-319',
        status: 'Aktif'
      },
      {
        id: 'c-303',
        name: 'Disaster Nursing & Evakuasi RS (K3RS)',
        code: 'DISASTER-RS',
        provider: 'Bapelkes Cikarang Kemenkes',
        issueDate: '2023-09-10',
        expiryDate: '2026-09-10',
        certNumber: 'BPK-CKR/DIS/2023/077',
        status: 'Mendekati Expired'
      },
      {
        id: 'c-304',
        name: 'Triage Master Trainer (Australasian / ESI)',
        code: 'ESI-ATS',
        provider: 'PPNI Jawa Barat',
        issueDate: '2025-01-14',
        expiryDate: '2028-01-14',
        certNumber: 'PPNI-TRG/2025/012',
        status: 'Aktif'
      }
    ]
  },
  {
    id: 'n-004',
    nip: 'IZZA-IGD-2023-088',
    name: 'Dewi Lestari, A.Md.Kep',
    gender: 'P',
    clinicalLevel: 'PK I',
    education: 'D3 Keperawatan',
    niraPpni: '32150944122',
    strNumber: '320151123-5591023',
    strExpiryDate: '2028-11-09',
    sipNumber: '503/992/SIP-PERAWAT/DPMPTSP/2024',
    joinDate: '2023-11-01',
    status: 'Aktif',
    shiftGroup: 'Tim C',
    certifications: [
      {
        id: 'c-401',
        name: 'BTCLS (Basic Trauma Cardiac Life Support)',
        code: 'BTCLS',
        provider: 'Ambulans Gawat Darurat 118',
        issueDate: '2023-10-15',
        expiryDate: '2026-10-15',
        certNumber: 'AGD118/BTCLS/2023/1209',
        status: 'Mendekati Expired'
      }
    ]
  },
  {
    id: 'n-005',
    nip: 'IZZA-IGD-2022-061',
    name: 'Ns. Ahmad Fauzi, S.Kep',
    gender: 'L',
    clinicalLevel: 'PK II',
    education: 'S1 Keperawatan + Ners',
    niraPpni: '32150923081',
    strNumber: '320152222-4410928',
    strExpiryDate: '2027-04-19',
    sipNumber: '503/543/SIP-PERAWAT/DPMPTSP/2023',
    joinDate: '2022-05-10',
    status: 'Aktif',
    shiftGroup: 'Tim A',
    certifications: [
      {
        id: 'c-501',
        name: 'BTCLS (Basic Trauma Cardiac Life Support)',
        code: 'BTCLS',
        provider: 'HIPGABI Jawa Barat',
        issueDate: '2022-04-18',
        expiryDate: '2026-04-18',
        certNumber: 'HIPGABI-JBR/BTCLS/2022/334',
        status: 'Expired'
      },
      {
        id: 'c-502',
        name: 'Resusitasi Neonatus & Pediatrik Dasar',
        code: 'RES-NEO',
        provider: 'IDAI Jawa Barat & RS Izza',
        issueDate: '2023-06-25',
        expiryDate: '2026-06-25',
        certNumber: 'IDAI-IZZA/NEO/2023/044',
        status: 'Expired'
      }
    ]
  },
  {
    id: 'n-006',
    nip: 'IZZA-IGD-2020-033',
    name: 'Ns. Maya Anggraeni, S.Kep',
    gender: 'P',
    clinicalLevel: 'PK III',
    education: 'S1 Keperawatan + Ners',
    niraPpni: '32150890117',
    strNumber: '320152220-3108922',
    strExpiryDate: '2028-03-30',
    sipNumber: '503/321/SIP-PERAWAT/DPMPTSP/2021',
    joinDate: '2020-07-01',
    status: 'Aktif',
    shiftGroup: 'Tim B',
    certifications: [
      {
        id: 'c-601',
        name: 'BTCLS (Basic Trauma Cardiac Life Support)',
        code: 'BTCLS',
        provider: 'HIPGABI Jawa Barat',
        issueDate: '2024-05-12',
        expiryDate: '2028-05-12',
        certNumber: 'HIPGABI-JBR/BTCLS/2024/491',
        status: 'Aktif'
      },
      {
        id: 'c-602',
        name: 'Ventilasi Mekanik Dasar & Transport Kritis IGD',
        code: 'VENT-BASIC',
        provider: 'Kemenkes Bapelkes Cikarang',
        issueDate: '2024-10-08',
        expiryDate: '2027-10-08',
        certNumber: 'BPK-CKR/VENT/2024/099',
        status: 'Aktif'
      }
    ]
  },
  {
    id: 'n-007',
    nip: 'IZZA-IGD-2024-102',
    name: 'Dimas Pratama, A.Md.Kep',
    gender: 'L',
    clinicalLevel: 'Pra-PK',
    education: 'D3 Keperawatan',
    niraPpni: '32150989012',
    strNumber: '320151124-6721094',
    strExpiryDate: '2029-08-15',
    sipNumber: '503/108/SIP-PERAWAT/DPMPTSP/2024',
    joinDate: '2024-09-01',
    status: 'Aktif',
    shiftGroup: 'Tim C',
    certifications: [
      {
        id: 'c-701',
        name: 'BTCLS (Basic Trauma Cardiac Life Support)',
        code: 'BTCLS',
        provider: 'HIPGABI Jawa Barat',
        issueDate: '2024-07-20',
        expiryDate: '2028-07-20',
        certNumber: 'HIPGABI-JBR/BTCLS/2024/680',
        status: 'Aktif'
      }
    ]
  }
];

export const INITIAL_CATALOG: TrainingCatalogItem[] = [
  {
    id: 'trn-001',
    code: 'TRN-ACLS-01',
    title: 'ACLS (Advanced Cardiac Life Support) Terstandar PERKI',
    category: 'Life Support / Resusitasi',
    skpPpni: 4,
    durationDays: 3,
    estimatedCost: 3500000,
    provider: 'PERKI (Perhimpunan Dokter Spesialis Kardiovaskular Indonesia)',
    mode: 'Luring (Tatap Muka)',
    description: 'Pelatihan lanjutan tata laksana henti jantung, sindrom koroner akut, dan aritmia letal dengan megacode simulation.',
    targetLevel: ['PK II', 'PK III', 'PK IV'],
    prerequisites: 'Telah memiliki sertifikat BTCLS aktif',
    accreditation: 'Kemenkes RI Plataran Sehat & PPNI'
  },
  {
    id: 'trn-002',
    code: 'TRN-BTCLS-02',
    title: 'BTCLS (Basic Trauma Cardiac Life Support) Refreshment & Sertifikasi',
    category: 'Life Support / Resusitasi',
    skpPpni: 4,
    durationDays: 4,
    estimatedCost: 2400000,
    provider: 'HIPGABI Jawa Barat',
    mode: 'Hybrid',
    description: 'Pelatihan dasar wajib penanganan trauma multipel dan kegawatdaruratan sirkulasi pernapasan di unit IGD.',
    targetLevel: ['Pra-PK', 'PK I', 'PK II', 'PK III'],
    prerequisites: 'Ijazah D3/S1 Keperawatan & STR aktif',
    accreditation: 'Kemenkes RI Plataran Sehat & PPNI'
  },
  {
    id: 'trn-003',
    code: 'TRN-PALS-03',
    title: 'PALS (Pediatric Advanced Life Support) & Resusitasi Anak Kritis',
    category: 'Pediatric / Neonatal',
    skpPpni: 3,
    durationDays: 2,
    estimatedCost: 3000000,
    provider: 'Ikatan Dokter Anak Indonesia (IDAI) & PPNI',
    mode: 'Luring (Tatap Muka)',
    description: 'Penatalaksanaan kegawatdaruratan syok septik, gagal napas akut, status konvulsivus, dan henti jantung pada anak di IGD.',
    targetLevel: ['PK II', 'PK III', 'PK IV'],
    prerequisites: 'Sertifikat BTCLS aktif',
    accreditation: 'Kemenkes RI & IDAI'
  },
  {
    id: 'trn-004',
    code: 'TRN-TRG-04',
    title: 'Emergency Triage & Australasian Triage Scale (ATS / ESI) Modern',
    category: 'Triase & Manajerial',
    skpPpni: 2,
    durationDays: 2,
    estimatedCost: 1500000,
    provider: 'PPNI DPW Jawa Barat & RSUP Hasan Sadikin',
    mode: 'Hybrid',
    description: 'Pengambilan keputusan klinis triase 5 level cepat, akurat, dan de-eskalasi penumpukan pasien (overcrowding) di IGD.',
    targetLevel: ['PK I', 'PK II', 'PK III', 'PK IV'],
    prerequisites: 'Pengalaman IGD minimal 6 bulan',
    accreditation: 'PPNI SKP Resmi'
  },
  {
    id: 'trn-005',
    code: 'TRN-VENT-05',
    title: 'Manajemen Jalan Napas Lanjutan & Ventilasi Mekanik Dasar di IGD',
    category: 'Spesialisasi IGD',
    skpPpni: 3,
    durationDays: 3,
    estimatedCost: 2800000,
    provider: 'Bapelkes Kemenkes RI Cikarang',
    mode: 'Luring (Tatap Muka)',
    description: 'Setting awal ventilator mekanik, monitoring peak pressure, dan stabilisasi pasien selama transfer dari IGD ke ICU/Kamar Operasi.',
    targetLevel: ['PK II', 'PK III', 'PK IV'],
    prerequisites: 'Sertifikat BTCLS/ACLS aktif',
    accreditation: 'Kemenkes RI Plataran Sehat'
  },
  {
    id: 'trn-006',
    code: 'TRN-DIS-06',
    title: 'Hospital Disaster Plan & Manajemen Korban Masal (Mass Casualty Incident)',
    category: 'Trauma & Disaster',
    skpPpni: 2,
    durationDays: 2,
    estimatedCost: 1800000,
    provider: 'HIPGABI & Badan Penanggulangan Bencana Daerah (BPBD)',
    mode: 'Luring (Tatap Muka)',
    description: 'Protokol triase START, decontaminasi bahan berbahaya, komando bencana RS, dan simulasi ledakan tabrakan karambol Pantura.',
    targetLevel: ['PK II', 'PK III', 'PK IV'],
    prerequisites: 'Perawat staf IGD aktif',
    accreditation: 'Kemenkes RI & HIPGABI'
  },
  {
    id: 'trn-007',
    code: 'TRN-PPI-07',
    title: 'Infection Prevention & Control (PPI) Khusus Ruang Isolasi & Triage IGD',
    category: 'Patient Safety & PPI',
    skpPpni: 2,
    durationDays: 2,
    estimatedCost: 1200000,
    provider: 'PERDALIN (Perhimpunan Pengendalian Infeksi Indonesia)',
    mode: 'Daring (Online)',
    description: 'Prosedur isolasi transmisi airborne, droplet, contact, serta keselamatan kerja nakes terhadap pajanan jarum suntik di IGD.',
    targetLevel: ['Pra-PK', 'PK I', 'PK II', 'PK III', 'PK IV'],
    prerequisites: 'Staf perawat aktif',
    accreditation: 'PPNI & PERDALIN'
  }
];

export const INITIAL_SUBMISSIONS: TrainingSubmission[] = [
  {
    id: 'sub-001',
    submissionNumber: 'PL-IGD-2026-001',
    nurseId: 'n-005',
    nurseName: 'Ns. Ahmad Fauzi, S.Kep',
    clinicalLevel: 'PK II',
    trainingId: 'trn-002',
    trainingTitle: 'BTCLS (Basic Trauma Cardiac Life Support) Refreshment & Sertifikasi',
    category: 'Life Support / Resusitasi',
    provider: 'HIPGABI Jawa Barat',
    startDate: '2026-11-24',
    endDate: '2026-11-27',
    durationDays: 4,
    mode: 'Hybrid',
    location: 'Bandung (Sesi Praktik di Kampus Poltekkes Bandung)',
    costBreakdown: {
      registrationFee: 2400000,
      accommodation: 600000,
      transport: 350000,
      perDiem: 400000,
      total: 3750000
    },
    clinicalJustification: 'Sertifikat BTCLS perawat bersangkutan telah kedaluwarsa pada 18 April 2026. Sebagai perawat pelaksana utama di ruang resusitasi IGD RS Izza Cikampek, pembaruan sertifikat BTCLS ini mendesak guna menjaga legalitas kredensial klinis dan kompetensi penanganan henti jantung dan multiple trauma.',
    aiAnalysis: {
      urgencyLevel: 'Sangat Tinggi (Kredensial Habis)',
      justification: 'Urgensi kritis karena masa berlaku BTCLS perawat sudah expired. Sesuai PMK No. 47/2018 tentang Pelayanan Kegawatdaruratan, seluruh perawat IGD wajib memiliki sertifikasi trauma/cardiac aktif untuk mempertahankan akreditasi RS Paripurna dan keselamatan pasien resusitasi.',
      clinicalCompetenciesGained: [
        'Resertifikasi algoritma BLS & defibrilasi cepat',
        'Penanganan cedera servikal, spinal, dan toraks trauma tajam/tumpul',
        'Stabilisasi airway dan sirkulasi syok hemoragik di IGD',
        'Evakuasi dan imobilisasi fraktur kompleks'
      ],
      institutionalBenefit: 'Mencegah temuan ketidaksesuaian kredensialing Komite Keperawatan dan risiko malpraktik di IGD RS Izza Cikampek.',
      suggestedShiftPreparation: 'Shift dinas Ns. Ahmad Fauzi di Tim A selama 4 hari digantikan oleh Ns. Dimas Pratama (shift tukar jaga resmi disahkan Karu).'
    },
    shiftReplacementPlan: {
      replacementNurseId: 'n-007',
      replacementNurseName: 'Dimas Pratama, A.Md.Kep',
      notes: 'Telah sepakat tukar dinas jadwal jaga Tim A selama tanggal 24-27 November 2026 tanpa lembur berlebih.'
    },
    status: 'Menunggu Karu',
    approvalHistory: [
      {
        role: 'Perawat Pengaju',
        actorName: 'Ns. Ahmad Fauzi, S.Kep',
        action: 'Submitted',
        timestamp: '2026-11-08 08:30 WIB',
        notes: 'Mengajukan pelatihan perpanjangan sertifikat BTCLS yang telah habis masa berlakunya.'
      }
    ],
    createdAt: '2026-11-08T08:30:00Z',
    updatedAt: '2026-11-08T08:30:00Z'
  },
  {
    id: 'sub-002',
    submissionNumber: 'PL-IGD-2026-002',
    nurseId: 'n-001',
    nurseName: 'Ns. Rahmat Hidayat, S.Kep',
    clinicalLevel: 'PK III',
    trainingId: 'trn-001',
    trainingTitle: 'ACLS (Advanced Cardiac Life Support) Terstandar PERKI',
    category: 'Life Support / Resusitasi',
    provider: 'PERKI (Perhimpunan Dokter Spesialis Kardiovaskular Indonesia)',
    startDate: '2026-12-04',
    endDate: '2026-12-06',
    durationDays: 3,
    mode: 'Luring (Tatap Muka)',
    location: 'Sekretariat PERKI Jakarta / Pusat Jantung Nasional Harapan Kita',
    costBreakdown: {
      registrationFee: 3500000,
      accommodation: 750000,
      transport: 400000,
      perDiem: 450000,
      total: 5100000
    },
    clinicalJustification: 'Sertifikat ACLS akan berakhir pada 20 November 2026. Ns. Rahmat adalah Penanggung Jawab Shift (PJ Shift) IGD yang memimpin Code Blue dan resusitasi kardiorespirasi. Diperlukan renewal ACLS untuk menjamin kepemimpinan resusitasi tingkat lanjut.',
    aiAnalysis: {
      urgencyLevel: 'Tinggi (Renewal Terencana)',
      justification: 'Pengajuan proaktif sebelum masa sertifikat habis sangat baik untuk kontinuitas kepemimpinan tim henti jantung di IGD RS Izza Cikampek.',
      clinicalCompetenciesGained: [
        'Interpretasi EKG 12 lead aritmia kompleks & sindrom koroner akut',
        'Pemberian obat vasoaktif dan antiaritmia emergensi secara tepat dosis',
        'Post-cardiac arrest care (Targeted Temperature Management dasar)',
        'Komunikasi dinamis closed-loop pada tim code blue'
      ],
      institutionalBenefit: 'Memenuhi kuota PJ Shift IGD bersertifikat ACLS aktif sesuai standar Akreditasi KARS.',
      suggestedShiftPreparation: 'PJ Shift Tim A dialihkan sementara kepada Ns. Hendra Setiawan (PK IV).'
    },
    shiftReplacementPlan: {
      replacementNurseId: 'n-003',
      replacementNurseName: 'Ns. Hendra Setiawan, S.Kep',
      notes: 'Karu IGD merangkap supervisi PJ Shift selama Ns. Rahmat dinas luar pelatihan.'
    },
    status: 'Verifikasi Diklat & SDM',
    approvalHistory: [
      {
        role: 'Perawat Pengaju',
        actorName: 'Ns. Rahmat Hidayat, S.Kep',
        action: 'Submitted',
        timestamp: '2026-11-05 09:15 WIB',
        notes: 'Pengajuan perpanjangan ACLS sebelum expired 20 Nov.'
      },
      {
        role: 'Kepala Ruangan IGD',
        actorName: 'Ns. Hendra Setiawan, S.Kep',
        action: 'Approved',
        timestamp: '2026-11-06 11:20 WIB',
        notes: 'Disetujui. Ns. Rahmat merupakan PJ Shift vital, jadwal pengganti aman dan tidak ada kekurangan personel.'
      },
      {
        role: 'Komite Keperawatan',
        actorName: 'Ns. Sri Wahyuni, M.Kep (Ketua Komite)',
        action: 'Approved',
        timestamp: '2026-11-07 14:00 WIB',
        notes: 'Rekomendasi kredensial disetujui. Sesuai target peningkatan kompetensi PK III IGD.'
      }
    ],
    createdAt: '2026-11-05T09:15:00Z',
    updatedAt: '2026-11-07T14:00:00Z'
  },
  {
    id: 'sub-003',
    submissionNumber: 'PL-IGD-2026-003',
    nurseId: 'n-002',
    nurseName: 'Siti Nurhaliza, A.Md.Kep',
    clinicalLevel: 'PK II',
    trainingId: 'trn-004',
    trainingTitle: 'Emergency Triage & Australasian Triage Scale (ATS / ESI) Modern',
    category: 'Triase & Manajerial',
    provider: 'PPNI DPW Jawa Barat & RSUP Hasan Sadikin',
    startDate: '2026-10-15',
    endDate: '2026-10-16',
    durationDays: 2,
    mode: 'Hybrid',
    location: 'Aula PPNI Bandung & Zoom Daring',
    costBreakdown: {
      registrationFee: 1500000,
      accommodation: 0,
      transport: 250000,
      perDiem: 200000,
      total: 1950000
    },
    clinicalJustification: 'Peningkatan akurasi waktu tanggap (response time) triase IGD < 5 menit untuk pasien kategori ESI 1 dan 2 di gerbang triase RS Izza Cikampek.',
    shiftReplacementPlan: {
      replacementNurseId: 'n-006',
      replacementNurseName: 'Ns. Maya Anggraeni, S.Kep',
      notes: 'Cover jadwal dinas siang di Tim B.'
    },
    status: 'Selesai Pelatihan',
    approvalHistory: [
      {
        role: 'Perawat Pengaju',
        actorName: 'Siti Nurhaliza, A.Md.Kep',
        action: 'Submitted',
        timestamp: '2026-10-01 10:00 WIB',
        notes: 'Pengajuan pelatihan triase modern.'
      },
      {
        role: 'Kepala Ruangan IGD',
        actorName: 'Ns. Hendra Setiawan, S.Kep',
        action: 'Approved',
        timestamp: '2026-10-02 08:30 WIB',
        notes: 'Disetujui untuk perkuatan pos triase depan.'
      },
      {
        role: 'Diklat & SDM',
        actorName: 'Dra. Endang Sulistyowati (Kabag Diklat)',
        action: 'Approved',
        timestamp: '2026-10-04 13:10 WIB',
        notes: 'Anggaran disetujui dalam pos APBDiklat Q4 2026.'
      },
      {
        role: 'Direksi RS',
        actorName: 'dr. H. Dikrullah, MARS (Direktur Utama)',
        action: 'Approved',
        timestamp: '2026-10-05 16:45 WIB',
        notes: 'Disetujui. Berangkatkan dan wajib transfer of knowledge ke perawat lain.'
      }
    ],
    postTrainingReport: {
      certificateNumber: 'PPNI-JBR/TRG/2026/8911',
      certificateDate: '2026-10-17',
      scoreGrade: 'Sangat Memuaskan (Nilai 94.5)',
      summaryKnowledge: 'Telah menguasai algoritma triase ESI v5 dan protokol triase massal bencana. Telah melakukan sharing session di morning briefing IGD RS Izza Cikampek pada 21 Oktober 2026.',
      submittedAt: '2026-10-22'
    },
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-22T11:00:00Z'
  }
];

export const HOSPITAL_METADATA = {
  name: 'RS IZZA CIKAMPEK',
  fullName: 'RUMAH SAKIT IZZA CIKAMPEK',
  unit: 'INSTALASI GAWAT DARURAT (IGD)',
  address: 'Jl. Raya Ciselang, Desa Cikampek Utara, Kec. Kotabaru, Kab. Karawang, Jawa Barat 41374',
  phone: '(0264) 316333 / Hotline IGD: (0264) 316444',
  email: 'igdrsizzacikampek1201@gmail.com',
  diklatContact: 'diklat.rsizza@gmail.com',
  accreditationLevel: 'Akreditasi Paripurna KARS Bintang Lima'
};
