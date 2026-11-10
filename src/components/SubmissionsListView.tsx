import React, { useState } from 'react';
import { TrainingSubmission, UserRole } from '../types';

interface SubmissionsListViewProps {
  submissions: TrainingSubmission[];
  userRole: UserRole;
  onViewDetail: (submission: TrainingSubmission) => void;
  onOpenNewSubmission: () => void;
  onPrintDisposition: (submission: TrainingSubmission) => void;
}

export const SubmissionsListView: React.FC<SubmissionsListViewProps> = ({
  submissions,
  userRole,
  onViewDetail,
  onOpenNewSubmission,
  onPrintDisposition
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredSubmissions = submissions.filter((sub) => {
    const matchSearch =
      sub.nurseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.trainingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.submissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.provider.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' &&
        (sub.status === 'Menunggu Karu' ||
          sub.status === 'Review Komite Keperawatan' ||
          sub.status === 'Verifikasi Diklat & SDM' ||
          sub.status === 'Persetujuan Direksi')) ||
      (statusFilter === 'APPROVED' &&
        (sub.status === 'Disetujui' || sub.status === 'Selesai Pelatihan')) ||
      (statusFilter === 'REJECTED' && sub.status === 'Ditolak');

    const matchCategory = categoryFilter === 'ALL' || sub.category === categoryFilter;

    return matchSearch && matchStatus && matchCategory;
  });

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
        return <span className="text-slate-600 font-medium">Draft</span>;
      case 'Menunggu Karu':
        return <span className="text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded text-xs">Menunggu Karu IGD</span>;
      case 'Review Komite Keperawatan':
        return <span className="text-indigo-800 font-semibold bg-indigo-50 px-2.5 py-1 rounded text-xs">Komite Keperawatan</span>;
      case 'Verifikasi Diklat & SDM':
        return <span className="text-blue-800 font-semibold bg-blue-50 px-2.5 py-1 rounded text-xs">Verifikasi Diklat</span>;
      case 'Persetujuan Direksi':
        return <span className="text-purple-800 font-semibold bg-purple-50 px-2.5 py-1 rounded text-xs">Persetujuan Direksi</span>;
      case 'Disetujui':
        return <span className="text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded text-xs">Disetujui Direksi</span>;
      case 'Selesai Pelatihan':
        return <span className="text-teal-900 font-semibold bg-teal-50 px-2.5 py-1 rounded text-xs">Selesai (Ada Sertifikat)</span>;
      case 'Ditolak':
        return <span className="text-rose-800 font-semibold bg-rose-50 px-2.5 py-1 rounded text-xs">Perlu Revisi / Ditolak</span>;
      default:
        return <span className="text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Daftar Berkas Pengajuan Pelatihan SDM IGD
          </h1>
          <p className="text-xs text-slate-500">
            Monitoring alur persetujuan Kepala Ruangan, Komite Keperawatan, Diklat & SDM, hingga Surat Tugas Direksi
          </p>
        </div>
        <button
          onClick={onOpenNewSubmission}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer self-start sm:self-auto shadow-sm flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>+ Buat Usulan Pelatihan</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Filter buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({submissions.length})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'PENDING' ? 'bg-white text-amber-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dalam Proses Verifikasi
            </button>
            <button
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'APPROVED' ? 'bg-white text-emerald-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Disetujui / Selesai
            </button>
            <button
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === 'REJECTED' ? 'bg-white text-rose-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ditolak / Revisi
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari perawat, pelatihan, no surat..."
              className="w-full text-xs rounded-lg border border-slate-300 pl-8 pr-3 py-2 focus:border-teal-600 focus:outline-none"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">No. Berkas & Tanggal</th>
                <th className="py-3 px-4">Perawat Pemohon</th>
                <th className="py-3 px-4">Program Pelatihan & Provider</th>
                <th className="py-3 px-4">Pelaksanaan</th>
                <th className="py-3 px-4 text-right">Total Anggaran</th>
                <th className="py-3 px-4">Status Alur</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    Tidak ditemukan berkas pengajuan yang sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* No. Berkas */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      <div>{sub.submissionNumber}</div>
                      <div className="text-[11px] text-slate-400 font-sans">
                        {sub.createdAt.slice(0, 10)}
                      </div>
                    </td>

                    {/* Perawat */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{sub.nurseName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {sub.clinicalLevel} · Shift Pengganti: {sub.shiftReplacementPlan.replacementNurseName.split(',')[0]}
                      </div>
                    </td>

                    {/* Pelatihan */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 line-clamp-1">{sub.trainingTitle}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {sub.provider} · {sub.mode}
                      </div>
                    </td>

                    {/* Pelaksanaan */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono text-slate-800">{sub.startDate}</div>
                      <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                        {sub.durationDays} Hari ({sub.location.split('(')[0]})
                      </div>
                    </td>

                    {/* Biaya */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {formatRupiah(sub.costBreakdown.total)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(sub.status)}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onViewDetail(sub)}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold rounded text-xs transition-colors cursor-pointer"
                        >
                          Review & Alur
                        </button>
                        <button
                          onClick={() => onPrintDisposition(sub)}
                          title="Cetak Formulir Disposisi Resmi RS Izza"
                          className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
