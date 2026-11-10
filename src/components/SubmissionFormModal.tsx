import React, { useState, useEffect } from 'react';
import {
  NurseProfile,
  TrainingCatalogItem,
  TrainingSubmission,
  AiTrainingAnalysis,
  ClinicalLevel,
  BudgetItem
} from '../types';

interface SubmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  nurses: NurseProfile[];
  catalog: TrainingCatalogItem[];
  onSubmit: (
    submission: Omit<TrainingSubmission, 'id' | 'submissionNumber' | 'createdAt' | 'updatedAt' | 'approvalHistory'>,
    newNurseProfile?: NurseProfile
  ) => void;
  prefillNurseId?: string;
  prefillTrainingId?: string;
}

export const SubmissionFormModal: React.FC<SubmissionFormModalProps> = ({
  isOpen,
  onClose,
  nurses,
  catalog,
  onSubmit,
  prefillNurseId,
  prefillTrainingId
}) => {
  // Mode selection for Nurse (Roster vs Custom)
  const [isCustomNurse, setIsCustomNurse] = useState<boolean>(false);
  const [selectedNurseId, setSelectedNurseId] = useState<string>(prefillNurseId || (nurses[0]?.id ?? ''));

  // Custom Nurse fields
  const [customNurseName, setCustomNurseName] = useState<string>('');
  const [customNurseNip, setCustomNurseNip] = useState<string>('');
  const [customNurseClinicalLevel, setCustomNurseClinicalLevel] = useState<ClinicalLevel>('PK II');
  const [customNurseEducation, setCustomNurseEducation] = useState<'D3 Keperawatan' | 'S1 Keperawatan + Ners' | 'S2 Keperawatan'>('S1 Keperawatan + Ners');
  const [customNurseStr, setCustomNurseStr] = useState<string>('');
  const [customNurseShiftGroup, setCustomNurseShiftGroup] = useState<'Tim A' | 'Tim B' | 'Tim C' | 'Tim Non-Shift'>('Tim A');

  // Training fields
  const [selectedTrainingId, setSelectedTrainingId] = useState<string>(prefillTrainingId || 'trn-001');
  const [isCustomTraining, setIsCustomTraining] = useState<boolean>(false);
  const [trainingTitle, setTrainingTitle] = useState<string>('');
  const [provider, setProvider] = useState<string>('');
  const [category, setCategory] = useState<string>('Life Support / Resusitasi');
  const [mode, setMode] = useState<'Luring (Tatap Muka)' | 'Daring (Online)' | 'Hybrid'>('Luring (Tatap Muka)');
  const [location, setLocation] = useState<string>('Bandung / Jakarta');
  const [startDate, setStartDate] = useState<string>('2026-11-25');
  const [endDate, setEndDate] = useState<string>('2026-11-28');
  const [durationDays, setDurationDays] = useState<number>(4);

  // Dynamic Custom Budget Items
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: 'b-1', name: 'Biaya Pendaftaran / Sertifikasi Pelatihan', amount: 3500000 },
    { id: 'b-2', name: 'Akomodasi / Penginapan Peserta', amount: 600000 },
    { id: 'b-3', name: 'Transportasi PP (Cikampek - Lokasi)', amount: 350000 },
    { id: 'b-4', name: 'Uang Harian / Uang Saku Peserta Diklat', amount: 400000 }
  ]);

  // Justification & Shift
  const [clinicalJustification, setClinicalJustification] = useState<string>('');
  const [replacementNurseId, setReplacementNurseId] = useState<string>('');
  const [replacementNotes, setReplacementNotes] = useState<string>('Jadwal jaga shift IGD ditukar resmi.');

  // AI Assistant state
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiTrainingAnalysis | null>(null);

  // Update fields when prefill changes or modal opens
  useEffect(() => {
    if (prefillNurseId) {
      setSelectedNurseId(prefillNurseId);
      setIsCustomNurse(false);
    }
  }, [prefillNurseId]);

  useEffect(() => {
    if (prefillTrainingId && prefillTrainingId !== 'custom') {
      setSelectedTrainingId(prefillTrainingId);
      setIsCustomTraining(false);
    }
  }, [prefillTrainingId]);

  // Sync selected catalog item
  useEffect(() => {
    if (!isCustomTraining && selectedTrainingId) {
      const item = catalog.find((c) => c.id === selectedTrainingId);
      if (item) {
        setTrainingTitle(item.title);
        setProvider(item.provider);
        setCategory(item.category);
        setMode(item.mode);
        setDurationDays(item.durationDays);

        // Update default budget items based on training
        setBudgetItems([
          { id: 'b-1', name: `Biaya Pendaftaran ${item.title.split('(')[0]}`, amount: item.estimatedCost },
          { id: 'b-2', name: 'Akomodasi / Penginapan Peserta', amount: item.mode === 'Daring (Online)' ? 0 : 600000 },
          { id: 'b-3', name: 'Transportasi PP (Cikampek - Lokasi)', amount: item.mode === 'Daring (Online)' ? 0 : 350000 },
          { id: 'b-4', name: 'Uang Harian / Uang Saku Peserta Diklat', amount: 400000 }
        ]);

        if (item.mode === 'Daring (Online)') {
          setLocation('Online via Zoom / Plataran Sehat Kemenkes');
        } else {
          setLocation('Pusat Pelatihan Terakreditasi (Bandung / Jakarta)');
        }
      }
    }
  }, [selectedTrainingId, isCustomTraining, catalog]);

  // Sync replacement nurse candidate
  useEffect(() => {
    const candidate = nurses.find((n) => n.id !== selectedNurseId);
    if (candidate) {
      setReplacementNurseId(candidate.id);
    }
  }, [selectedNurseId, nurses]);

  if (!isOpen) return null;

  const currentNurse = nurses.find((n) => n.id === selectedNurseId) || nurses[0];

  // Calculate dynamic total cost
  const totalCost = budgetItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Budget Items Management
  const handleAddBudgetItem = (name: string = '', amount: number = 0) => {
    setBudgetItems([
      ...budgetItems,
      {
        id: `b-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: name || 'Komponen Biaya Tambahan',
        amount: amount
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
      alert('Minimal harus ada 1 komponen biaya anggaran.');
      return;
    }
    setBudgetItems(budgetItems.filter((item) => item.id !== id));
  };

  // AI Justification Generator
  const handleGenerateAiJustification = async () => {
    setIsGeneratingAi(true);

    const nurseName = isCustomNurse ? (customNurseName || 'Perawat Baru IGD') : currentNurse.name;
    const clinicalLevel = isCustomNurse ? customNurseClinicalLevel : currentNurse.clinicalLevel;
    const nurseCerts = isCustomNurse
      ? 'BTCLS'
      : currentNurse.certifications.map((c) => `${c.code} (${c.status})`).join(', ');

    try {
      const res = await fetch('/api/ai/analyze-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nurseName: nurseName,
          clinicalLevel: clinicalLevel,
          trainingTitle: trainingTitle,
          provider: provider,
          currentCertifications: nurseCerts,
          customNotes: `Perawat pelaksana IGD RS Izza Cikampek. STR: ${isCustomNurse ? (customNurseStr || 'Aktif') : currentNurse.strNumber}. Kebutuhan pelayanan trauma & kardiovaskular Pantura/Tol Cikampek.`,
          urgentCase: 'Peningkatan kompetensi kegawatdaruratan dan pemenuhan kredensialing Komite Keperawatan RS Izza.'
        })
      });

      const data = await res.json();
      if (data && data.success) {
        setAiAnalysis(data);
        if (data.justification) {
          setClinicalJustification(data.justification);
        }
        if (data.suggestedShiftPreparation) {
          setReplacementNotes(data.suggestedShiftPreparation);
        }
      } else {
        throw new Error('Fallback');
      }
    } catch (err: any) {
      console.warn('AI analysis fallback triggered:', err);
      const fallbackText = `Pelatihan ${trainingTitle} sangat penting bagi ${nurseName} (${clinicalLevel}) untuk pemenuhan baku mutu pelayanan kegawatdaruratan di IGD RS Izza Cikampek serta menjaga kelaikan kredensial klinis perawat.`;
      setClinicalJustification(fallbackText);
      setAiAnalysis({
        urgencyLevel: 'Tinggi (Rekomendasi Mutu IGD)',
        justification: fallbackText,
        clinicalCompetenciesGained: [
          'Penguasaan tatalaksana kegawatdaruratan mutakhir',
          'Respon cepat triase & resusitasi kardiorespirasi',
          'Kepatuhan SOP keselamatan pasien IGD'
        ],
        institutionalBenefit: 'Mempertahankan standar akreditasi dan response time pelayanan darurat RS Izza Cikampek.',
        suggestedShiftPreparation: 'Penyesuaian jadwal dinas jaga shift oleh Karu IGD.',
        isFallback: true
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isCustomNurse && !customNurseName.trim()) {
      alert('Mohon isi nama lengkap perawat pemohon.');
      return;
    }

    if (!clinicalJustification.trim()) {
      alert('Mohon isi justifikasi klinis pengajuan pelatihan.');
      return;
    }

    const effectiveNurseId = isCustomNurse ? `n-cust-${Date.now()}` : currentNurse.id;
    const effectiveNurseName = isCustomNurse ? customNurseName.trim() : currentNurse.name;
    const effectiveClinicalLevel = isCustomNurse ? customNurseClinicalLevel : currentNurse.clinicalLevel;

    // Build new nurse profile if custom
    let newNurse: NurseProfile | undefined = undefined;
    if (isCustomNurse) {
      newNurse = {
        id: effectiveNurseId,
        nip: customNurseNip.trim() || `IZZA-IGD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        name: effectiveNurseName,
        gender: 'L',
        clinicalLevel: customNurseClinicalLevel,
        education: customNurseEducation,
        niraPpni: '3215' + Math.floor(1000000 + Math.random() * 9000000),
        strNumber: customNurseStr.trim() || `320151124-${Math.floor(1000000 + Math.random() * 9000000)}`,
        strExpiryDate: '2029-12-31',
        sipNumber: '503/SIP-PERAWAT/IZZA/' + new Date().getFullYear(),
        joinDate: new Date().toISOString().slice(0, 10),
        status: 'Aktif',
        shiftGroup: customNurseShiftGroup,
        certifications: [
          {
            id: `c-init-${Date.now()}`,
            name: 'BTCLS (Basic Trauma Cardiac Life Support)',
            code: 'BTCLS',
            provider: 'HIPGABI Jawa Barat',
            issueDate: '2024-01-01',
            expiryDate: '2028-01-01',
            certNumber: 'HIPGABI-JBR/2024/' + Math.floor(100 + Math.random() * 900),
            status: 'Aktif'
          }
        ]
      };
    }

    const replacementNurse = nurses.find((n) => n.id === replacementNurseId);

    // Extract approximate categories for legacy compatibility
    const regFee = budgetItems.find((b) => b.name.toLowerCase().includes('daftar') || b.name.toLowerCase().includes('registrasi'))?.amount || budgetItems[0]?.amount || 0;
    const accomFee = budgetItems.find((b) => b.name.toLowerCase().includes('akomodasi') || b.name.toLowerCase().includes('penginapan') || b.name.toLowerCase().includes('hotel'))?.amount || 0;
    const transFee = budgetItems.find((b) => b.name.toLowerCase().includes('transport') || b.name.toLowerCase().includes('tiket') || b.name.toLowerCase().includes('bbm') || b.name.toLowerCase().includes('tol'))?.amount || 0;
    const perDiemFee = budgetItems.find((b) => b.name.toLowerCase().includes('uang saku') || b.name.toLowerCase().includes('harian') || b.name.toLowerCase().includes('per diem'))?.amount || 0;

    onSubmit(
      {
        nurseId: effectiveNurseId,
        nurseName: effectiveNurseName,
        clinicalLevel: effectiveClinicalLevel,
        trainingId: isCustomTraining ? `custom-${Date.now()}` : selectedTrainingId,
        trainingTitle: trainingTitle || 'Pelatihan Kegawatdaruratan',
        category: category,
        provider: provider || 'Lembaga Pelatihan Terakreditasi',
        startDate: startDate,
        endDate: endDate,
        durationDays: Number(durationDays),
        mode: mode,
        location: location,
        costBreakdown: {
          items: budgetItems,
          registrationFee: Number(regFee),
          accommodation: Number(accomFee),
          transport: Number(transFee),
          perDiem: Number(perDiemFee),
          total: totalCost
        },
        clinicalJustification: clinicalJustification,
        aiAnalysis: aiAnalysis || undefined,
        shiftReplacementPlan: {
          replacementNurseId: replacementNurseId,
          replacementNurseName: replacementNurse ? replacementNurse.name : 'Perawat Pengganti IGD',
          notes: replacementNotes
        },
        status: 'Menunggu Karu'
      },
      newNurse
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Formulir Pengajuan Pelatihan SDM Perawat IGD
            </h2>
            <p className="text-xs text-slate-500">
              Pengusulan program peningkatan kompetensi klinis Instalasi Gawat Darurat RS Izza Cikampek
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Profil Perawat Pemohon (Custom vs Roster) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                01. Data Perawat Pemohon
              </h3>
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setIsCustomNurse(false)}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    !isCustomNurse ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pilih dari Roster IGD
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomNurse(true)}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    isCustomNurse ? 'bg-white text-teal-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  + Ketik Nama Bebas (Custom)
                </button>
              </div>
            </div>

            {!isCustomNurse ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Pilih Nama Perawat dari Roster IGD <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedNurseId}
                    onChange={(e) => setSelectedNurseId(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-teal-600 focus:outline-none"
                  >
                    {nurses.map((nurse) => (
                      <option key={nurse.id} value={nurse.id}>
                        {nurse.name} — {nurse.clinicalLevel} ({nurse.shiftGroup})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nurse Summary Pill-free card */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>NIP / ID:</span>
                    <span className="font-mono text-slate-900 font-medium">{currentNurse.nip}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>STR Keperawatan:</span>
                    <span className="font-mono text-slate-900">{currentNurse.strNumber}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Jenjang PK & Pendidikan:</span>
                    <span className="font-medium text-slate-900">
                      {currentNurse.clinicalLevel} · {currentNurse.education}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-500 text-[11px]">Sertifikat IGD:</span>
                    {currentNurse.certifications.map((c, i) => (
                      <span
                        key={i}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          c.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : c.status === 'Mendekati Expired'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {c.code}: {c.status}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Custom Nurse Input Fields */
              <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-200 space-y-4">
                <div className="text-xs text-teal-900 font-semibold flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Input Data Perawat Baru / Kustom</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Nama Lengkap & Gelar Perawat <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customNurseName}
                      onChange={(e) => setCustomNurseName(e.target.value)}
                      placeholder="Contoh: Ns. Tri Utami, S.Kep / Ahmad Fauzi, A.Md.Kep"
                      className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      NIP / NIK Pegawai (Opsional)
                    </label>
                    <input
                      type="text"
                      value={customNurseNip}
                      onChange={(e) => setCustomNurseNip(e.target.value)}
                      placeholder="Contoh: IZZA-IGD-2024-118"
                      className="w-full text-xs font-mono rounded-lg border border-slate-300 p-2.5 bg-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Jenjang Karir Klinis (PK) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={customNurseClinicalLevel}
                      onChange={(e) => setCustomNurseClinicalLevel(e.target.value as ClinicalLevel)}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:border-teal-600 focus:outline-none"
                    >
                      <option value="Pra-PK">Pra-PK (Orientasi / Staf Baru)</option>
                      <option value="PK I">PK I (Perawat Pelaksana Pemula)</option>
                      <option value="PK II">PK II (Perawat Pelaksana Terampil)</option>
                      <option value="PK III">PK III (Perawat Klinis Mahir / PJ Shift)</option>
                      <option value="PK IV">PK IV (Perawat Spesialis / Pakar IGD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Pendidikan Keperawatan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={customNurseEducation}
                      onChange={(e) => setCustomNurseEducation(e.target.value as any)}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:border-teal-600 focus:outline-none"
                    >
                      <option value="D3 Keperawatan">D3 Keperawatan</option>
                      <option value="S1 Keperawatan + Ners">S1 Keperawatan + Profesi Ners</option>
                      <option value="S2 Keperawatan">S2 Keperawatan / Spesialis KMB</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nomor STR Keperawatan
                    </label>
                    <input
                      type="text"
                      value={customNurseStr}
                      onChange={(e) => setCustomNurseStr(e.target.value)}
                      placeholder="Contoh: 320152224-9988112"
                      className="w-full text-xs font-mono rounded-lg border border-slate-300 p-2.5 bg-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Tim Shift Dinas Jaga IGD
                    </label>
                    <select
                      value={customNurseShiftGroup}
                      onChange={(e) => setCustomNurseShiftGroup(e.target.value as any)}
                      className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:border-teal-600 focus:outline-none"
                    >
                      <option value="Tim A">Tim A</option>
                      <option value="Tim B">Tim B</option>
                      <option value="Tim C">Tim C</option>
                      <option value="Tim Non-Shift">Tim Non-Shift / Karu</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Pemilihan Pelatihan */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                02. Rencana & Spesifikasi Pelatihan
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomTraining(!isCustomTraining)}
                  className="text-xs text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
                >
                  {isCustomTraining ? '← Pilih dari Katalog Standar' : '+ Input Pelatihan Kustom'}
                </button>
              </div>
            </div>

            {!isCustomTraining ? (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pilih Modul Pelatihan dari Katalog Terakreditasi
                </label>
                <select
                  value={selectedTrainingId}
                  onChange={(e) => setSelectedTrainingId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-teal-600 focus:outline-none"
                >
                  {catalog.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} ({item.provider} · {item.skpPpni} SKP PPNI)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nama / Judul Pelatihan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={trainingTitle}
                    onChange={(e) => setTrainingTitle(e.target.value)}
                    placeholder="Contoh: Pediatric Critical Care Nursing"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-teal-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Penyelenggara Pelatihan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    placeholder="Contoh: HIPGABI / Kemenkes / PERKI"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Metode Pelatihan
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-teal-600 focus:outline-none"
                >
                  <option value="Luring (Tatap Muka)">Luring (Tatap Muka)</option>
                  <option value="Hybrid">Hybrid (Daring + Praktik)</option>
                  <option value="Daring (Online)">Daring (Online Penuh)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-teal-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Lokasi / Tempat Pelaksanaan
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Bandung / Kampus Poltekkes / Ruang Diklat"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Justifikasi Klinis & AI TNA Generator */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                03. Analisis Kebutuhan & Justifikasi Klinis IGD
              </h3>
              <button
                type="button"
                onClick={handleGenerateAiJustification}
                disabled={isGeneratingAi}
                className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Menganalisis Klinis via AI...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Bantu Susun Justifikasi Medis Cerdas</span>
                  </>
                )}
              </button>
            </div>

            {aiAnalysis && (
              <div className="bg-teal-50/70 border border-teal-200 p-3 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-900">Rekomendasi Analisis AI Diklat IGD:</span>
                  <span className="font-mono font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                    Tingkat Urgensi: {aiAnalysis.urgencyLevel}
                  </span>
                </div>
                <div className="text-slate-700">
                  <span className="font-semibold text-slate-800">Kompetensi Klinis Diperoleh:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                    {aiAnalysis.clinicalCompetenciesGained.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-slate-700 text-[11px]">
                  <span className="font-semibold text-slate-800">Dampak Institusional RS Izza:</span>{' '}
                  {aiAnalysis.institutionalBenefit}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Uraian Alasan / Justifikasi Klinis Pengajuan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={clinicalJustification}
                onChange={(e) => setClinicalJustification(e.target.value)}
                placeholder="Jelaskan urgensi klinis bagi IGD RS Izza Cikampek (misal: perpanjangan sertifikat wajib BTCLS, peningkatan kasus trauma Pantura/tol, atau promosi jenjang karir PK)..."
                className="w-full text-xs rounded-lg border border-slate-300 p-3 focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 4: Rencana Pengganti Jaga Shift (Shift Replacement) */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800">
              04. Rencana Kontinjensi Dinas Jaga IGD (Shift Coverage)
            </h3>
            <p className="text-xs text-slate-500">
              Memastikan kapasitas pelayanan triase dan resusitasi IGD tetap 100% prima selama perawat mengikuti kegiatan.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Perawat Pengganti Jaga Shift (Backup) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={replacementNurseId}
                  onChange={(e) => setReplacementNurseId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-teal-600 focus:outline-none"
                >
                  {nurses
                    .filter((n) => isCustomNurse || n.id !== currentNurse.id)
                    .map((nurse) => (
                      <option key={nurse.id} value={nurse.id}>
                        {nurse.name} — {nurse.clinicalLevel} ({nurse.shiftGroup})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Catatan Kesepakatan Tukar Jaga
                </label>
                <input
                  type="text"
                  value={replacementNotes}
                  onChange={(e) => setReplacementNotes(e.target.value)}
                  placeholder="Contoh: Mengganti dinas jaga malam Tim A tanggal 25-27 Nov"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-teal-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Rincian Anggaran Kustom Dinamis (Custom Dynamic Budget Breakdown) */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  05. Estimasi Rincian Anggaran Pelatihan (Dapat Disesuaikan / Custom)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Ubah nama komponen, nominal, atau tambah komponen biaya baru sesuai kebutuhan riil pengajuan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleAddBudgetItem()}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto border border-teal-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>+ Tambah Komponen Biaya</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
              <span className="text-[11px]">Tambah Cepat:</span>
              <button
                type="button"
                onClick={() => handleAddBudgetItem('Biaya Akomodasi & Hotel', 600000)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 cursor-pointer"
              >
                + Akomodasi
              </button>
              <button
                type="button"
                onClick={() => handleAddBudgetItem('Transportasi / Tiket / BBM & Tol PP', 350000)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 cursor-pointer"
              >
                + Transport PP
              </button>
              <button
                type="button"
                onClick={() => handleAddBudgetItem('Uang Harian / Uang Saku Peserta', 400000)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 cursor-pointer"
              >
                + Uang Saku
              </button>
              <button
                type="button"
                onClick={() => handleAddBudgetItem('Biaya Modul & Bahan Praktikum Kit', 250000)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 cursor-pointer"
              >
                + Modul/Kit
              </button>
              <button
                type="button"
                onClick={() => handleAddBudgetItem('Biaya Uji Sertifikasi / Ukom PPNI', 500000)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700 cursor-pointer"
              >
                + Sertifikasi Ukom
              </button>
            </div>

            {/* Custom Budget Items Table / Rows */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2.5">
              {budgetItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-2"
                >
                  <div className="w-6 text-center font-mono text-xs font-bold text-slate-400">
                    {index + 1}.
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      value={item.name}
                      onChange={(e) => handleUpdateBudgetItem(item.id, 'name', e.target.value)}
                      placeholder="Nama komponen pengeluaran (misal: Biaya Pendaftaran)"
                      className="w-full text-xs font-medium rounded-md border border-slate-300 p-2 focus:border-teal-600 focus:outline-none"
                    />
                  </div>

                  <div className="w-full sm:w-44">
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-[11px] font-mono text-slate-400">Rp</span>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        required
                        value={item.amount}
                        onChange={(e) => handleUpdateBudgetItem(item.id, 'amount', e.target.value)}
                        placeholder="0"
                        className="w-full text-xs font-mono font-bold text-slate-900 rounded-md border border-slate-300 pl-8 pr-2 py-2 focus:border-teal-600 focus:outline-none text-right"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveBudgetItem(item.id)}
                    title="Hapus komponen ini"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors self-end sm:self-center cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Total Display */}
            <div className="bg-slate-100 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Total Estimasi Usulan Anggaran:</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {budgetItems.length} Komponen Rincian Anggaran Kustom
                </span>
              </div>
              <span className="text-lg font-extrabold text-teal-800 font-mono tabular-nums">
                {formatRupiah(totalCost)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Kirim Pengajuan ke Kepala Ruangan IGD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
