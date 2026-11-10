import React from 'react';
import { NurseProfile, TrainingSubmission, TrainingCatalogItem, UserRole } from '../types';
import { HOSPITAL_METADATA } from '../initialData';

interface DashboardViewProps {
  nurses: NurseProfile[];
  submissions: TrainingSubmission[];
  catalog: TrainingCatalogItem[];
  userRole: UserRole;
  onOpenNewSubmission: (prefillNurseId?: string, prefillTrainingId?: string) => void;
  onViewSubmissionDetail: (submission: TrainingSubmission) => void;
  onNavigateToTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  nurses,
  submissions,
  catalog,
  userRole,
  onOpenNewSubmission,
  onViewSubmissionDetail,
  onNavigateToTab
}) => {
  // Metrics calculation
  const totalNurses = nurses.length;

  // Expired / Expiring certificates count
  const allCerts = nurses.flatMap(n => n.certifications.map(c => ({ ...c, nurseName: n.name, nurseId: n.id, pk: n.clinicalLevel })));
  const expiredCerts = allCerts.filter(c => c.status === 'Expired');
  const expiringSoonCerts = allCerts.filter(c => c.status === 'Mendekati Expired');

  // Overall compliance rate (nurses having active BTCLS)
  const btclsCompliantCount = nurses.filter(n =>
    n.certifications.some(c => c.code === 'BTCLS' && c.status === 'Aktif')
  ).length;
  const compliancePercentage = Math.round((btclsCompliantCount / totalNurses) * 100);

  // Submissions stats
  const pendingApprovals = submissions.filter(
    s => s.status === 'Menunggu Karu' || s.status === 'Review Komite Keperawatan' || s.status === 'Verifikasi Diklat & SDM' || s.status === 'Persetujuan Direksi'
  );

  const approvedSubmissions = submissions.filter(s => s.status === 'Disetujui' || s.status === 'Selesai Pelatihan');
  const totalSpentBudget = approvedSubmissions.reduce((acc, curr) => acc + curr.costBreakdown.total, 0);
  const totalAllocatedBudget = 45000000; // Pagu APBDiklat IGD 2026

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <span className="text-slate-500 font-medium">Draft</span>;
      case 'Menunggu Karu':
        return <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">Menunggu Karu IGD</span>;
      case 'Review Komite Keperawatan':
        return <span className="text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">Komite Keperawatan</span>;
      case 'Verifikasi Diklat & SDM':
        return <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">Verifikasi Diklat</span>;
      case 'Persetujuan Direksi':
        return <span className="text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded">Persetujuan Direksi</span>;
      case 'Disetujui':
        return <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Disetujui</span>;
      case 'Selesai Pelatihan':
        return <span className="text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded">Selesai (Sertifikat Ada)</span>;
      case 'Ditolak':
        return <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">Ditolak / Revisi</span>;
      default:
        return <span className="text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section with authentic IGD photograph */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-sm">
        <div className="relative h-64 md:h-72 w-full overflow-hidden">
          <img
            src="/src/assets/images/igd_banner_hero_1794322966808.jpg"
            alt="Ruang Triage dan Resusitasi IGD RS Izza Cikampek"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs text-teal-300 font-semibold tracking-wider uppercase">
                <span>{HOSPITAL_METADATA.fullName}</span>
                <span aria-hidden="true">·</span>
                <span>{HOSPITAL_METADATA.unit}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white text-balance">
                Portal Pengajuan & Akreditasi Pelatihan SDM Perawat IGD
              </h1>
              <p className="text-sm text-slate-300 line-clamp-2 md:line-clamp-none max-w-xl">
                Standardisasi kompetensi penanganan kegawatdaruratan, resusitasi kardiorespirasi, triage ESI/ATS, dan pemenuhan kredensial Komite Keperawatan secara terukur.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => onOpenNewSubmission()}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Ajukan Pelatihan Baru</span>
              </button>
              <button
                onClick={() => onNavigateToTab('matrix')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Cek Kepatuhan Sertifikasi SDM
              </button>
              <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-slate-400">
                <span>Hotline IGD:</span>
                <span className="font-mono text-white">(0264) 316444</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI & Metrics Bar (Tabular Numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Kekuatan SDM IGD</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">{totalNurses}</span>
            <span className="text-xs text-slate-500">Perawat IGD</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>Jenjang PK I – PK IV</span>
            <span aria-hidden="true">·</span>
            <span className="text-teal-700 font-medium">Siap 3 Shift 24 Jam</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Kepatuhan BTCLS Wajib</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-teal-700 font-mono tabular-nums">{compliancePercentage}%</span>
            <span className="text-xs text-slate-500">{btclsCompliantCount} / {totalNurses} Aktif</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>Standar Kemenkes RI:</span>
            <span className="font-semibold text-slate-700">100% Wajib BTCLS</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Pengajuan Dalam Proses</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-amber-600 font-mono tabular-nums">{pendingApprovals.length}</span>
            <span className="text-xs text-slate-500">Berkas Usulan</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>Perlu verifikasi Karu/Diklat</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Serapan Anggaran Diklat IGD</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {formatRupiah(totalSpentBudget)}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Pagu Tahunan:</span>
            <span className="font-mono tabular-nums">{formatRupiah(totalAllocatedBudget)}</span>
          </div>
        </div>
      </div>

      {/* Critical Expiry Alert Banner (Actionable renewal reminders) */}
      {(expiredCerts.length > 0 || expiringSoonCerts.length > 0) && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Peringatan Kepatuhan Sertifikat Gawat Darurat
                </span>
                <span className="text-xs font-mono font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {expiredCerts.length} Habis · {expiringSoonCerts.length} Mendekati Habis
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1 max-w-3xl">
                Sesuai standar kredensialing Komite Keperawatan RS Izza Cikampek, perawat dengan sertifikat habis masa berlaku dilarang bertindak mandiri sebagai PJ Shift ruang resusitasi sebelum resertifikasi.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('matrix')}
              className="px-3 py-1.5 bg-amber-800 text-white text-xs font-medium rounded-lg hover:bg-amber-900 transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
            >
              Lihat Rincian & Ajukan Perpanjangan
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {expiredCerts.concat(expiringSoonCerts).slice(0, 3).map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-amber-200 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 truncate">{item.nurseName}</span>
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${item.status === 'Expired' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-slate-600 mt-1">{item.name}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Exp: {item.expiryDate}</div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 font-mono text-[11px]">{item.pk}</span>
                  <button
                    onClick={() => onOpenNewSubmission(item.nurseId)}
                    className="text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
                  >
                    + Ajukan Refreshment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Recent Submissions & Competency Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Submissions (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Pengajuan Pelatihan Terkini</h2>
              <p className="text-xs text-slate-500">Daftar usulan diklat SDM IGD dalam proses verifikasi berjenjang</p>
            </div>
            <button
              onClick={() => onNavigateToTab('submissions')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
            >
              Lihat Semua Pengajuan ({submissions.length}) →
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onViewSubmissionDetail(sub)}
                  className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-slate-500">{sub.submissionNumber}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-xs font-semibold text-slate-900">{sub.nurseName}</span>
                      <span className="text-xs text-slate-500 font-mono">({sub.clinicalLevel})</span>
                    </div>
                    <div className="text-sm font-medium text-slate-800">
                      {sub.trainingTitle}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Penyelenggara: {sub.provider}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{sub.durationDays} Hari</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums font-medium text-slate-700">
                        {formatRupiah(sub.costBreakdown.total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:self-center shrink-0">
                    <div className="text-xs">
                      {getStatusBadge(sub.status)}
                    </div>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Emergency Department Guidelines & Priorities */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Standar Kompetensi IGD RS Izza</h3>
            <p className="text-xs text-slate-500">
              Target minimum kepatuhan kompetensi perawat gawat darurat berdasarkan Peraturan Menteri Kesehatan RI:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="flex justify-between font-medium text-slate-800">
                  <span>BTCLS (Trauma & Cardiac)</span>
                  <span className="font-mono font-bold text-teal-700">100% Staf</span>
                </div>
                <p className="text-[11px] text-slate-500">Wajib dimiliki seluruh perawat IGD (Pra-PK s.d PK IV).</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="flex justify-between font-medium text-slate-800">
                  <span>ACLS (PERKI)</span>
                  <span className="font-mono font-bold text-teal-700">Min. PJ Shift (PK III+)</span>
                </div>
                <p className="text-[11px] text-slate-500">Wajib untuk Kepala Jaga, Code Blue Leader IGD.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="flex justify-between font-medium text-slate-800">
                  <span>Triase ESI / ATS & Disaster</span>
                  <span className="font-mono font-bold text-teal-700">75% Staf</span>
                </div>
                <p className="text-[11px] text-slate-500">Menjamin response time triase kasus P1 & P2 &lt; 5 menit.</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500">Katalog Tersedia:</span>
              <button
                onClick={() => onNavigateToTab('catalog')}
                className="font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
              >
                Lihat {catalog.length} Modul Terakreditasi →
              </button>
            </div>
          </div>

          {/* Quick AI Info Card */}
          <div className="bg-teal-900 text-white p-5 rounded-xl border border-teal-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Fitur Asisten Klinis Diklat (TNA AI)</span>
            </div>
            <p className="text-xs text-teal-100">
              Sistem dilengkapi generator justifikasi medis dan Training Needs Analysis (TNA) otomatis untuk mempercepat persetujuan proposal pelatihan ke Direksi RS Izza.
            </p>
            <button
              onClick={() => onOpenNewSubmission()}
              className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
            >
              Coba Buat Pengajuan dengan AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
