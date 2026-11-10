import React, { useState } from 'react';
import { TrainingSubmission, UserRole, ApprovalStep } from '../types';

interface SubmissionDetailModalProps {
  submission: TrainingSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  onUpdateStatus: (
    submissionId: string,
    newStatus: TrainingSubmission['status'],
    approvalStep: ApprovalStep
  ) => void;
  onSubmitPostReport: (
    submissionId: string,
    reportData: {
      certificateNumber: string;
      certificateDate: string;
      scoreGrade: string;
      summaryKnowledge: string;
    }
  ) => void;
  onPrintDisposition: (submission: TrainingSubmission) => void;
}

export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  submission,
  isOpen,
  onClose,
  userRole,
  onUpdateStatus,
  onSubmitPostReport,
  onPrintDisposition
}) => {
  const [approvalNote, setApprovalNote] = useState('');
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [certNum, setCertNum] = useState('');
  const [certDate, setCertDate] = useState('2026-11-30');
  const [scoreGrade, setScoreGrade] = useState('Sangat Memuaskan');
  const [summaryKnowledge, setSummaryKnowledge] = useState('Telah melaksanakan diseminasi ilmu (transfer of knowledge) kepada seluruh tim perawat IGD saat morning report.');

  if (!isOpen || !submission) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleApprove = () => {
    let nextStatus: TrainingSubmission['status'] = submission.status;
    let actorRole: ApprovalStep['role'] = 'Kepala Ruangan IGD';
    let actorName = 'Ns. Hendra Setiawan, S.Kep (Karu IGD)';

    if (submission.status === 'Menunggu Karu') {
      nextStatus = 'Review Komite Keperawatan';
      actorRole = 'Kepala Ruangan IGD';
      actorName = 'Ns. Hendra Setiawan, S.Kep (Karu IGD)';
    } else if (submission.status === 'Review Komite Keperawatan') {
      nextStatus = 'Verifikasi Diklat & SDM';
      actorRole = 'Komite Keperawatan';
      actorName = 'Ns. Sri Wahyuni, M.Kep (Ketua Komite Keperawatan)';
    } else if (submission.status === 'Verifikasi Diklat & SDM') {
      nextStatus = 'Persetujuan Direksi';
      actorRole = 'Diklat & SDM';
      actorName = 'Dra. Endang Sulistyowati (Kabag Diklat & SDM)';
    } else if (submission.status === 'Persetujuan Direksi') {
      nextStatus = 'Disetujui';
      actorRole = 'Direksi RS';
      actorName = 'dr. H. Dikrullah, MARS (Direktur Utama RS Izza)';
    }

    const note = approvalNote.trim() || 'Disetujui sesuai dengan kebutuhan klinis IGD dan kelayakan administratif.';

    const step: ApprovalStep = {
      role: actorRole,
      actorName: actorName,
      action: 'Approved',
      timestamp: new Date().toLocaleString('id-ID', { timeZoneName: 'short' }),
      notes: note
    };

    onUpdateStatus(submission.id, nextStatus, step);
    setApprovalNote('');
  };

  const handleReject = () => {
    if (!approvalNote.trim()) {
      alert('Mohon cantumkan alasan revisi/penolakan.');
      return;
    }

    const step: ApprovalStep = {
      role: userRole === 'karu' ? 'Kepala Ruangan IGD' : userRole === 'diklat_sdm' ? 'Diklat & SDM' : 'Direksi RS',
      actorName: 'Pemeriksa Berkas RS Izza',
      action: 'Rejected',
      timestamp: new Date().toLocaleString('id-ID', { timeZoneName: 'short' }),
      notes: approvalNote
    };

    onUpdateStatus(submission.id, 'Ditolak', step);
    setApprovalNote('');
  };

  const handleSavePostReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNum.trim()) {
      alert('Mohon isi nomor sertifikat.');
      return;
    }

    onSubmitPostReport(submission.id, {
      certificateNumber: certNum,
      certificateDate: certDate,
      scoreGrade: scoreGrade,
      summaryKnowledge: summaryKnowledge
    });
    setShowCompletionForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {submission.submissionNumber}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Diajukan {submission.createdAt.slice(0, 10)}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {submission.trainingTitle}
            </h2>
            <p className="text-xs text-slate-500">
              Pemohon: <span className="font-semibold text-slate-800">{submission.nurseName}</span> ({submission.clinicalLevel}) · Penyelenggara: {submission.provider}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintDisposition(submission)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak Lembar Disposisi</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stepper Status Tracking */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Alur Verifikasi & Disposisi Berjenjang RS Izza Cikampek
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              {/* Step 1 */}
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="font-semibold text-emerald-900">1. Usulan Staf</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Lengkap Diajukan</div>
              </div>

              {/* Step 2 */}
              <div className={`p-2.5 rounded-lg border ${
                submission.status === 'Draft'
                  ? 'bg-white border-slate-200 text-slate-400'
                  : submission.status === 'Menunggu Karu'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold ring-2 ring-amber-400/40'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="font-semibold">2. Karu IGD</div>
                <div className="text-[11px] mt-0.5">
                  {submission.status === 'Menunggu Karu' ? 'Dalam Review' : 'Disetujui Karu'}
                </div>
              </div>

              {/* Step 3 */}
              <div className={`p-2.5 rounded-lg border ${
                submission.status === 'Review Komite Keperawatan'
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold ring-2 ring-indigo-400/40'
                  : ['Verifikasi Diklat & SDM', 'Persetujuan Direksi', 'Disetujui', 'Selesai Pelatihan'].includes(submission.status)
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}>
                <div className="font-semibold">3. Komite Ners</div>
                <div className="text-[11px] mt-0.5">Kredensialing Mutu</div>
              </div>

              {/* Step 4 */}
              <div className={`p-2.5 rounded-lg border ${
                submission.status === 'Verifikasi Diklat & SDM'
                  ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold ring-2 ring-blue-400/40'
                  : ['Persetujuan Direksi', 'Disetujui', 'Selesai Pelatihan'].includes(submission.status)
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}>
                <div className="font-semibold">4. Diklat & SDM</div>
                <div className="text-[11px] mt-0.5">Alokasi Anggaran</div>
              </div>

              {/* Step 5 */}
              <div className={`p-2.5 rounded-lg border ${
                submission.status === 'Persetujuan Direksi'
                  ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold ring-2 ring-purple-400/40'
                  : ['Disetujui', 'Selesai Pelatihan'].includes(submission.status)
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}>
                <div className="font-semibold">5. Direksi RS</div>
                <div className="text-[11px] mt-0.5">Surat Tugas Resmi</div>
              </div>
            </div>
          </div>

          {/* Details 2-Column Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left: Event info & Justification */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wide text-[11px] text-teal-800">
                  Jadwal & Penyelenggara
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tanggal:</span>
                    <span className="font-mono text-slate-900 font-medium">{submission.startDate} s.d {submission.endDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Durasi & Metode:</span>
                    <span className="font-medium text-slate-900">{submission.durationDays} Hari ({submission.mode})</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">Lokasi Pelatihan:</span>
                    <span className="text-slate-900">{submission.location}</span>
                  </div>
                </div>
              </div>

              {/* Justification Box */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wide text-[11px] text-teal-800">
                  Justifikasi Klinis IGD Pemohon
                </div>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  {submission.clinicalJustification}
                </p>

                {submission.aiAnalysis && (
                  <div className="mt-3 bg-teal-50/70 p-3 rounded-lg border border-teal-200 text-[11px] space-y-1">
                    <div className="font-semibold text-teal-900">
                      Rekomendasi TNA AI: Urgensi {submission.aiAnalysis.urgencyLevel}
                    </div>
                    <div className="text-slate-600">
                      {submission.aiAnalysis.institutionalBenefit}
                    </div>
                  </div>
                )}
              </div>

              {/* Shift Backup */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wide text-[11px] text-teal-800">
                  Mitigasi Dinas Jaga IGD (Shift Replacement)
                </div>
                <div className="text-slate-700">
                  <div>Perawat Pengganti: <span className="font-semibold text-slate-900">{submission.shiftReplacementPlan.replacementNurseName}</span></div>
                  <div className="text-slate-500 mt-1 italic text-[11px]">{submission.shiftReplacementPlan.notes}</div>
                </div>
              </div>
            </div>

            {/* Right: Cost breakdown & History Log */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-800 uppercase tracking-wide text-[11px] text-teal-800">
                  Rincian Anggaran Disposisi (IDR)
                </div>
                <div className="space-y-1.5">
                  {submission.costBreakdown.items && submission.costBreakdown.items.length > 0 ? (
                    submission.costBreakdown.items.map((item, idx) => (
                      <div key={item.id || idx} className="flex justify-between text-slate-600">
                        <span>{item.name}:</span>
                        <span className="font-mono tabular-nums text-slate-900">{formatRupiah(item.amount)}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>Biaya Registrasi:</span>
                        <span className="font-mono tabular-nums text-slate-900">{formatRupiah(submission.costBreakdown.registrationFee)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Akomodasi / Penginapan:</span>
                        <span className="font-mono tabular-nums text-slate-900">{formatRupiah(submission.costBreakdown.accommodation)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Transportasi PP:</span>
                        <span className="font-mono tabular-nums text-slate-900">{formatRupiah(submission.costBreakdown.transport)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Uang Saku / Per Diem:</span>
                        <span className="font-mono tabular-nums text-slate-900">{formatRupiah(submission.costBreakdown.perDiem)}</span>
                      </div>
                    </>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Total Beban Anggaran:</span>
                    <span className="font-mono tabular-nums text-teal-800">{formatRupiah(submission.costBreakdown.total)}</span>
                  </div>
                </div>
              </div>

              {/* Approval History Log */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wide text-[11px] text-teal-800">
                  Riwayat Disposisi & Catatan Verifikator
                </div>
                <div className="space-y-2">
                  {submission.approvalHistory.map((step, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-lg text-[11px] space-y-1">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{step.actorName}</span>
                        <span className="text-slate-400 font-mono">{step.timestamp}</span>
                      </div>
                      <div className="text-slate-600">{step.notes}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Post-Training Report Summary (If Completed) */}
              {submission.postTrainingReport && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-900 uppercase text-[11px]">
                    Laporan Pasca Pelatihan & Kredensial Baru
                  </div>
                  <div className="text-emerald-950 space-y-1">
                    <div>No. Sertifikat: <span className="font-mono font-semibold">{submission.postTrainingReport.certificateNumber}</span></div>
                    <div>Predikat: <span className="font-semibold">{submission.postTrainingReport.scoreGrade}</span></div>
                    <div className="text-[11px] text-emerald-800 mt-1">{submission.postTrainingReport.summaryKnowledge}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Approval & Action Box */}
          {submission.status !== 'Disetujui' && submission.status !== 'Selesai Pelatihan' && (
            <div className="bg-slate-50 border border-slate-300 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Aksi Disposisi ({userRole === 'karu' ? 'Kepala Ruangan IGD' : userRole === 'diklat_sdm' ? 'Bagian Diklat & SDM' : userRole === 'direksi' ? 'Direksi RS Izza' : 'Perawat / Reviewer'})
                </span>
                <span className="text-[11px] text-slate-500">
                  Status Saat Ini: <strong className="text-slate-800">{submission.status}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Catatan / Instruksi Disposisi
                </label>
                <input
                  type="text"
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Contoh: Disetujui. Sesuai alokasi anggaran APBDiklat IGD Q4 2026."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 focus:border-teal-600 focus:outline-none bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Minta Revisi / Tolak
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Setujui & Teruskan ke Tahap Berikutnya →
                </button>
              </div>
            </div>
          )}

          {/* If Approved, option to input post-training report */}
          {submission.status === 'Disetujui' && !submission.postTrainingReport && (
            <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-teal-900">Pelatihan Telah Disetujui Direksi RS</div>
                  <div className="text-xs text-teal-800">
                    Setelah perawat selesai mengikuti kursus, masukkan nomor sertifikat resmi untuk mengupdate kepatuhan SDM IGD secara otomatis.
                  </div>
                </div>
                {!showCompletionForm && (
                  <button
                    onClick={() => setShowCompletionForm(true)}
                    className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    + Input Laporan & No. Sertifikat
                  </button>
                )}
              </div>

              {showCompletionForm && (
                <form onSubmit={handleSavePostReport} className="mt-3 pt-3 border-t border-teal-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-teal-950 mb-1">
                        Nomor Sertifikat Resmi
                      </label>
                      <input
                        type="text"
                        required
                        value={certNum}
                        onChange={(e) => setCertNum(e.target.value)}
                        placeholder="Contoh: PERKI/ACLS/2026/11-901"
                        className="w-full text-xs rounded-lg border border-teal-300 p-2 bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-teal-950 mb-1">
                        Tanggal Terbit Sertifikat
                      </label>
                      <input
                        type="date"
                        required
                        value={certDate}
                        onChange={(e) => setCertDate(e.target.value)}
                        className="w-full text-xs rounded-lg border border-teal-300 p-2 bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-teal-950 mb-1">
                        Predikat Kelulusan
                      </label>
                      <select
                        value={scoreGrade}
                        onChange={(e) => setScoreGrade(e.target.value)}
                        className="w-full text-xs rounded-lg border border-teal-300 p-2 bg-white focus:outline-none"
                      >
                        <option value="Sangat Memuaskan">Sangat Memuaskan</option>
                        <option value="Memuaskan">Memuaskan</option>
                        <option value="Lulus Kompeten">Lulus Kompeten</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-teal-950 mb-1">
                      Rangkuman Pelaksanaan Transfer of Knowledge ke Rekan IGD
                    </label>
                    <textarea
                      rows={2}
                      value={summaryKnowledge}
                      onChange={(e) => setSummaryKnowledge(e.target.value)}
                      className="w-full text-xs rounded-lg border border-teal-300 p-2 bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCompletionForm(false)}
                      className="px-3 py-1 border border-teal-300 text-teal-900 text-xs rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-lg cursor-pointer"
                    >
                      Simpan & Selesaikan Pelatihan
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
