import React, { useState } from 'react';
import {
  NurseProfile,
  TrainingCatalogItem,
  TrainingSubmission,
  ClinicalLevel,
  BudgetItem
} from '../types';

interface SimpleFormViewProps {
  nurses: NurseProfile[];
  catalog: TrainingCatalogItem[];
  onSubmit: (
    submission: Omit<TrainingSubmission, 'id' | 'submissionNumber' | 'createdAt' | 'updatedAt' | 'approvalHistory'>,
    newNurseProfile?: NurseProfile
  ) => void;
  onOpenGoogleSheetsModal: () => void;
}

export const SimpleFormView: React.FC<SimpleFormViewProps> = ({
  nurses,
  catalog,
  onSubmit,
  onOpenGoogleSheetsModal
}) => {
  // 1. Identitas Tenaga Keperawatan
  const [nurseName, setNurseName] = useState('Ns. Ahmad Fauzi, S.Kep');
  const [nip, setNip] = useState('199208152019031002');
  const [education, setEducation] = useState<'D3 Keperawatan' | 'S1 Keperawatan + Ners' | 'S2 Keperawatan'>('S1 Keperawatan + Ners');
  const [clinicalLevel, setClinicalLevel] = useState<ClinicalLevel>('PK II');

  // 2. Masa Berlaku STR & SIPP Aktif
  const [strExpiry, setStrExpiry] = useState('2028-11-20');
  const [sippExpiry, setSippExpiry] = useState('2027-08-15');

  // 3. Rencana Pelatihan & Justifikasi
  const [selectedCatalogId, setSelectedCatalogId] = useState('trn-002');
  const [isCustomTraining, setIsCustomTraining] = useState(false);
  const [customTrainingTitle, setCustomTrainingTitle] = useState('');
  const [mainReason, setMainReason] = useState('Pembaruan Sertifikat Wajib (BTCLS/ACLS Kedaluwarsa)');
  const [providerSchedule, setProviderSchedule] = useState('HIPGABI Jawa Barat - Pelaksanaan 24-27 November 2026');
  const [clinicalJustification, setClinicalJustification] = useState(
    'Pembaruan berkala sertifikat wajib gawat darurat guna menjamin legalitas kredensial klinis dan respon cepat resusitasi henti jantung di IGD RS Izza Cikampek.'
  );

  // 4. Estimasi Rincian Anggaran (Custom Dinamis)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: 'b-1', name: 'Biaya Pendaftaran / Sertifikasi Pelatihan', amount: 2400000 },
    { id: 'b-2', name: 'Akomodasi / Penginapan Peserta', amount: 600000 },
    { id: 'b-3', name: 'Transportasi PP (Cikampek - Lokasi)', amount: 350000 },
    { id: 'b-4', name: 'Uang Harian / Uang Saku Peserta Diklat', amount: 400000 }
  ]);

  // 5. Rencana Pengganti Jaga Shift (Backup)
  const [replacementNurse, setReplacementNurse] = useState('Dimas Pratama, A.Md.Kep');
  const [replacementNotes, setReplacementNotes] = useState('Tukar jadwal jaga shift Tim A disetujui Kepala Ruangan.');

  // AI Helper state
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showAiBox, setShowAiBox] = useState(false);

  // Quick autofill when choosing an existing nurse from roster
  const handleSelectExistingNurse = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = nurses.find((n) => n.id === e.target.value);
    if (found) {
      setNurseName(found.name);
      setNip(found.nip);
      setEducation(found.education);
      setClinicalLevel(found.clinicalLevel);
      setStrExpiry(found.strExpiryDate);
      if (found.sipNumber) {
        setSippExpiry('2028-06-30');
      }
    }
  };

  // Sync training title when catalog changes
  const handleCatalogChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCatalogId(val);
    if (val === 'CUSTOM') {
      setIsCustomTraining(true);
    } else {
      setIsCustomTraining(false);
      const item = catalog.find((c) => c.id === val);
      if (item) {
        setProviderSchedule(`${item.provider} - Pelaksanaan Durasi ${item.durationDays} Hari (${item.mode})`);
        setBudgetItems([
          { id: 'b-1', name: `Biaya Pendaftaran ${item.title.split('(')[0]}`, amount: item.estimatedCost },
          { id: 'b-2', name: 'Akomodasi / Penginapan Peserta', amount: item.mode === 'Daring (Online)' ? 0 : 600000 },
          { id: 'b-3', name: 'Transportasi PP (Cikampek - Lokasi)', amount: item.mode === 'Daring (Online)' ? 0 : 350000 },
          { id: 'b-4', name: 'Uang Harian / Uang Saku Peserta Diklat', amount: 400000 }
        ]);
      }
    }
  };

  // Budget Items Management
  const handleAddBudgetItem = () => {
    setBudgetItems([
      ...budgetItems,
      {
        id: `b-${Date.now()}`,
        name: 'Komponen Biaya Tambahan',
        amount: 0
      }
    ]);
  };

  const handleUpdateBudgetItem = (id: string, field: 'name' | 'amount', value: string | number) => {
    setBudgetItems(
      budgetItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field === 'amount' ? Number(value) || 0 : value
          };
        }
        return item;
      })
    );
  };

  const handleRemoveBudgetItem = (id: string) => {
    if (budgetItems.length <= 1) {
      alert('Minimal 1 komponen anggaran harus terisi.');
      return;
    }
    setBudgetItems(budgetItems.filter((item) => item.id !== id));
  };

  const totalCost = budgetItems.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // AI Generator
  const handleGenerateAiJustification = async () => {
    setIsGeneratingAi(true);
    const chosenTitle = isCustomTraining ? (customTrainingTitle || 'Pelatihan Kegawatdaruratan') : (catalog.find(c => c.id === selectedCatalogId)?.title || 'Pelatihan IGD');

    try {
      const res = await fetch('/api/ai/analyze-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nurseName: nurseName,
          clinicalLevel: clinicalLevel,
          trainingTitle: chosenTitle,
          provider: providerSchedule,
          currentCertifications: 'BTCLS / ACLS',
          customNotes: `Perawat pelaksana IGD RS Izza Cikampek. Alasan: ${mainReason}`,
          urgentCase: mainReason
        })
      });

      const data = await res.json();
      if (data && data.justification) {
        setClinicalJustification(data.justification);
        setShowAiBox(true);
      }
    } catch {
      setClinicalJustification(
        `Pelatihan ${chosenTitle} sangat esensial bagi ${nurseName} (${clinicalLevel}) untuk mempertahankan baku mutu penanganan gawat darurat dan keselamatan pasien di IGD RS Izza Cikampek.`
      );
      setShowAiBox(true);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleResetForm = () => {
    if (confirm('Bersihkan seluruh isian formulir?')) {
      setNurseName('');
      setNip('');
      setEducation('S1 Keperawatan + Ners');
      setClinicalLevel('PK II');
      setStrExpiry('');
      setSippExpiry('');
      setCustomTrainingTitle('');
      setClinicalJustification('');
      setBudgetItems([
        { id: 'b-1', name: 'Biaya Pendaftaran / Sertifikasi Pelatihan', amount: 0 },
        { id: 'b-2', name: 'Akomodasi / Penginapan', amount: 0 }
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nurseName.trim()) {
      alert('Nama perawat wajib diisi.');
      return;
    }

    const finalTrainingTitle = isCustomTraining
      ? customTrainingTitle.trim() || 'Pelatihan Kegawatdaruratan'
      : catalog.find((c) => c.id === selectedCatalogId)?.title || 'Pelatihan Standar IGD';

    const finalCategory =
      catalog.find((c) => c.id === selectedCatalogId)?.category || 'Life Support / Resusitasi';

    const regFee = budgetItems[0]?.amount || 0;
    const accomFee = budgetItems[1]?.amount || 0;
    const transFee = budgetItems[2]?.amount || 0;
    const perDiemFee = budgetItems[3]?.amount || 0;

    onSubmit({
      nurseId: `n-${Date.now()}`,
      nurseName: nurseName.trim(),
      clinicalLevel: clinicalLevel,
      trainingId: selectedCatalogId === 'CUSTOM' ? `custom-${Date.now()}` : selectedCatalogId,
      trainingTitle: finalTrainingTitle,
      category: finalCategory,
      provider: providerSchedule.split('-')[0]?.trim() || 'Lembaga Pelatihan Terakreditasi',
      startDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
      durationDays: 4,
      mode: 'Luring (Tatap Muka)',
      location: 'Pusat Pelatihan Terakreditasi',
      costBreakdown: {
        items: budgetItems,
        registrationFee: regFee,
        accommodation: accomFee,
        transport: transFee,
        perDiem: perDiemFee,
        total: totalCost
      },
      clinicalJustification: clinicalJustification || `${mainReason} untuk pelayanan IGD RS Izza.`,
      shiftReplacementPlan: {
        replacementNurseId: 'n-rep',
        replacementNurseName: replacementNurse.trim() || 'Perawat Jaga Pengganti',
        notes: replacementNotes.trim()
      },
      status: 'Menunggu Karu'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-16">
      {/* Info Callout Box (Matches reference image) */}
      <div className="bg-white border-2 border-teal-600 rounded-xl p-4 sm:p-5 shadow-xs flex items-start gap-3.5">
        <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
          i
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-bold text-slate-900 text-sm">
            Pengajuan Pelatihan Tenaga Keperawatan IGD RS Izza Cikampek
          </div>
          <p className="text-slate-600 leading-relaxed">
            Formulir ini digunakan untuk merekomendasikan dan mengajukan pelatihan peningkatan kompetensi keperawatan gawat darurat (BTCLS, ACLS, Triase, dll.) sesuai Indikator Nasional Mutu &amp; Standar Akreditasi KARS/STARKES. Data terkirim secara real-time ke database spreadsheet rumah sakit.
          </p>
        </div>
      </div>

      {/* Main Electronic Form Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-bold text-xs sm:text-sm tracking-wide uppercase">
              FORMULIR ELEKTRONIK PENGAJUAN PELATIHAN
            </span>
          </div>
          <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded border border-teal-800">
            IGD Standar INM
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 text-xs">
          {/* SECTION 1: IDENTITAS TENAGA KEPERAWATAN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[11px] flex items-center justify-center">
                  1
                </span>
                <span className="font-bold text-slate-800 uppercase tracking-wide">
                  IDENTITAS TENAGA KEPERAWATAN
                </span>
              </div>

              {/* Roster Auto-fill shortcut */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] hidden sm:inline">Pilih Cepat Roster:</span>
                <select
                  onChange={handleSelectExistingNurse}
                  defaultValue=""
                  className="text-[11px] border border-slate-300 rounded px-2 py-1 text-slate-700 bg-slate-50 focus:outline-none"
                >
                  <option value="" disabled>-- Isi Otomatis dari Roster --</option>
                  {nurses.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.clinicalLevel})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Nama Lengkap &amp; Gelar <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    required
                    value={nurseName}
                    onChange={(e) => setNurseName(e.target.value)}
                    placeholder="Contoh: Ns. Ahmad Fauzi, S.Kep"
                    className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-slate-900 focus:border-teal-600 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  NIP / NIK Karyawan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    required
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Contoh: 199208152019031002"
                    className="w-full font-mono rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-slate-900 focus:border-teal-600 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Pendidikan Terakhir <span className="text-rose-500">*</span>
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-teal-600 focus:outline-none bg-slate-50/50"
                >
                  <option value="D3 Keperawatan">D3 Keperawatan</option>
                  <option value="S1 Keperawatan + Ners">S1 Keperawatan + Ners</option>
                  <option value="S2 Keperawatan">S2 Keperawatan / Spesialis KMB</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Jenjang Perawat Klinik (PK) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={clinicalLevel}
                  onChange={(e) => setClinicalLevel(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-teal-600 focus:outline-none bg-slate-50/50"
                >
                  <option value="Pra-PK">Pra-PK (Orientasi / Staf Baru)</option>
                  <option value="PK I">PK I (Perawat Pelaksana Pemula)</option>
                  <option value="PK II">PK II (Perawat Pelaksana Terampil)</option>
                  <option value="PK III">PK III (Perawat Klinis Mahir / PJ Shift)</option>
                  <option value="PK IV">PK IV (Perawat Spesialis / Pakar IGD)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: MASA BERLAKU STR & SIPP AKTIF */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[11px] flex items-center justify-center">
                2
              </span>
              <span className="font-bold text-slate-800 uppercase tracking-wide">
                MASA BERLAKU STR &amp; SIPP AKTIF
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Masa Berlaku STR Berakhir Sampai <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={strExpiry}
                  onChange={(e) => setStrExpiry(e.target.value)}
                  className="w-full font-mono rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-teal-600 focus:outline-none bg-slate-50/50"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Pastikan STR masih aktif sesuai Permenkes
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Masa Berlaku SIPP Berakhir Sampai <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={sippExpiry}
                  onChange={(e) => setSippExpiry(e.target.value)}
                  className="w-full font-mono rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-teal-600 focus:outline-none bg-slate-50/50"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Surat Izin Praktik Perawat di RS Izza Cikampek
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: RENCANA PELATIHAN & JUSTIFIKASI */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[11px] flex items-center justify-center">
                  3
                </span>
                <span className="font-bold text-slate-800 uppercase tracking-wide">
                  RENCANA PELATIHAN &amp; JUSTIFIKASI
                </span>
              </div>

              <button
                type="button"
                onClick={handleGenerateAiJustification}
                disabled={isGeneratingAi}
                className="text-[11px] font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer bg-teal-50 px-2 py-1 rounded border border-teal-200"
              >
                {isGeneratingAi ? (
                  <span>Menyusun AI...</span>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Bantu Susun Justifikasi Klinis</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Program Pelatihan yang Diajukan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedCatalogId}
                  onChange={handleCatalogChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-teal-600 focus:outline-none bg-slate-50/50"
                >
                  {catalog.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} ({item.skpPpni} SKP PPNI)
                    </option>
                  ))}
                  <option value="CUSTOM">-- Ketik Judul Pelatihan Lainnya (Custom) --</option>
                </select>

                {isCustomTraining && (
                  <input
                    type="text"
                    required
                    value={customTrainingTitle}
                    onChange={(e) => setCustomTrainingTitle(e.target.value)}
                    placeholder="Ketik nama judul pelatihan gawat darurat baru..."
                    className="mt-2 w-full rounded-lg border border-teal-400 px-3 py-2 text-slate-900 focus:outline-none bg-teal-50/30 font-medium"
                  />
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Justifikasi / Alasan Pengajuan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={mainReason}
                  onChange={(e) => setMainReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-teal-600 focus:outline-none bg-slate-50/50"
                >
                  <option value="Pembaruan Sertifikat Wajib (BTCLS/ACLS Kedaluwarsa)">
                    Pembaruan Sertifikat Wajib (BTCLS/ACLS Kedaluwarsa)
                  </option>
                  <option value="Peningkatan Mutu Pelayanan Trauma & Kasus Jantung IGD">
                    Peningkatan Mutu Pelayanan Trauma & Kasus Jantung IGD
                  </option>
                  <option value="Pemenuhan Standar Akreditasi KARS / STARKES">
                    Pemenuhan Standar Akreditasi KARS / STARKES
                  </option>
                  <option value="Kenaikan Jenjang Karir Perawat Klinik (Promosi PK)">
                    Kenaikan Jenjang Karir Perawat Klinik (Promosi PK)
                  </option>
                  <option value="Kebutuhan Penugasan Khusus Ruang Resusitasi / Triase">
                    Kebutuhan Penugasan Khusus Ruang Resusitasi / Triase
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-800 mb-1">
                  Target Penyelenggara &amp; Estimasi Jadwal Pelaksanaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={providerSchedule}
                  onChange={(e) => setProviderSchedule(e.target.value)}
                  placeholder="Contoh: HIPGABI Jaya / PERKI - Pelaksanaan 15-18 April 2026"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-teal-600 focus:outline-none bg-slate-50/50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-800 mb-1">
                  Uraian Detail Justifikasi Klinis IGD <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={clinicalJustification}
                  onChange={(e) => setClinicalJustification(e.target.value)}
                  placeholder="Uraikan urgensi klinis bagi pelayanan emergensi RS Izza Cikampek..."
                  className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 focus:border-teal-600 focus:outline-none bg-slate-50/50 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: ESTIMASI RINCIAN ANGGARAN (CUSTOM DINAMIS) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[11px] flex items-center justify-center">
                  4
                </span>
                <span className="font-bold text-slate-800 uppercase tracking-wide">
                  ESTIMASI RINCIAN ANGGARAN PELATIHAN (CUSTOM)
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddBudgetItem}
                className="text-[11px] font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer bg-teal-50 px-2 py-1 rounded border border-teal-200"
              >
                + Tambah Komponen
              </button>
            </div>

            <div className="space-y-2">
              {budgetItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <span className="text-slate-400 font-mono text-[11px] w-5 text-center hidden sm:inline">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    required
                    value={item.name}
                    onChange={(e) => handleUpdateBudgetItem(item.id, 'name', e.target.value)}
                    placeholder="Nama pengeluaran (misal: Biaya Pendaftaran)"
                    className="flex-1 rounded border border-slate-300 p-2 text-slate-900 bg-white focus:outline-none text-xs"
                  />
                  <div className="relative w-full sm:w-44">
                    <span className="absolute left-2.5 top-2 text-[11px] font-mono text-slate-400">Rp</span>
                    <input
                      type="number"
                      min="0"
                      step="10000"
                      required
                      value={item.amount}
                      onChange={(e) => handleUpdateBudgetItem(item.id, 'amount', e.target.value)}
                      className="w-full font-mono font-bold text-slate-900 rounded border border-slate-300 pl-8 pr-2 py-2 text-right bg-white focus:outline-none text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBudgetItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer self-end sm:self-center"
                    title="Hapus baris"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between font-medium">
              <span className="text-slate-700">Total Estimasi Usulan:</span>
              <span className="font-mono font-extrabold text-base text-teal-800 tabular-nums">
                {formatRupiah(totalCost)}
              </span>
            </div>
          </div>

          {/* SECTION 5: KONTINJENSI DINAS JAGA */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[11px] flex items-center justify-center">
                5
              </span>
              <span className="font-bold text-slate-800 uppercase tracking-wide">
                KONTINJENSI DINAS JAGA (SHIFT REPLACEMENT)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Perawat Pengganti Shift (Backup) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={replacementNurse}
                  onChange={(e) => setReplacementNurse(e.target.value)}
                  placeholder="Nama perawat pengganti jadwal jaga IGD"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-teal-600 focus:outline-none bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Catatan Kesepakatan Tukar Jaga
                </label>
                <input
                  type="text"
                  value={replacementNotes}
                  onChange={(e) => setReplacementNotes(e.target.value)}
                  placeholder="Catatan jadwal tukar dinas"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-teal-600 focus:outline-none bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS (Matches screenshot) */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset Isian</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>Kirim Pengajuan Pelatihan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
