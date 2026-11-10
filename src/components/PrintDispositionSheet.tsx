import React from 'react';
import { TrainingSubmission } from '../types';
import { HOSPITAL_METADATA } from '../initialData';

interface PrintDispositionSheetProps {
  submission: TrainingSubmission | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintDispositionSheet: React.FC<PrintDispositionSheetProps> = ({
  submission,
  isOpen,
  onClose
}) => {
  if (!isOpen || !submission) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-slate-300">
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              Pratinjau Cetak Lembar Disposisi Resmi RS Izza
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 border border-slate-300 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Printable Official Sheet (A4 ratio styled) */}
        <div className="p-8 md:p-12 text-slate-900 bg-white font-sans text-xs leading-relaxed space-y-6">
          {/* Hospital Letterhead (KOP SURAT) */}
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-teal-800 text-white flex items-center justify-center font-extrabold text-lg">
                IZZA
              </div>
              <div className="text-left">
                <div className="text-base font-extrabold tracking-tight uppercase">
                  {HOSPITAL_METADATA.fullName}
                </div>
                <div className="text-xs font-semibold text-teal-800 tracking-wide uppercase">
                  {HOSPITAL_METADATA.unit} · BAGIAN PENDIDIKAN & PELATIHAN (DIKLAT)
                </div>
                <div className="text-[10px] text-slate-600">
                  {HOSPITAL_METADATA.address} · Telp: {HOSPITAL_METADATA.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Title & Document Number */}
          <div className="text-center space-y-1">
            <h2 className="text-sm font-bold uppercase underline tracking-wide">
              LEMBAR PENGAJUAN PELATIHAN SDM & DISPOSISI DIREKSI
            </h2>
            <div className="font-mono text-[11px] text-slate-600">
              Nomor Berkas: {submission.submissionNumber}
            </div>
          </div>

          {/* Table 1: Identitas Pemohon */}
          <div className="space-y-1">
            <div className="font-bold uppercase text-[11px] text-slate-800">
              I. IDENTITAS PERAWAT PEMOHON
            </div>
            <table className="w-full border border-slate-300 text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-medium bg-slate-50 w-1/3">Nama Lengkap & Gelar</td>
                  <td className="p-2 font-semibold text-slate-900">{submission.nurseName}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-medium bg-slate-50">Jenjang Karir Klinis (PK)</td>
                  <td className="p-2 font-mono">{submission.clinicalLevel} (Perawat Instalasi Gawat Darurat)</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-medium bg-slate-50">Unit Kerja Penempatan</td>
                  <td className="p-2">{HOSPITAL_METADATA.unit} - RS Izza Cikampek</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium bg-slate-50">Perawat Pengganti Jaga (Shift Backup)</td>
                  <td className="p-2 font-medium">{submission.shiftReplacementPlan.replacementNurseName}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 2: Rencana Pelatihan */}
          <div className="space-y-1">
            <div className="font-bold uppercase text-[11px] text-slate-800">
              II. PROGRAM PELATIHAN YANG DIAJUKAN
            </div>
            <table className="w-full border border-slate-300 text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-medium bg-slate-50 w-1/3">Nama Program Pelatihan</td>
                  <td className="p-2 font-bold text-slate-900">{submission.trainingTitle}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-medium bg-slate-50">Lembaga Penyelenggara</td>
                  <td className="p-2">{submission.provider}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-medium bg-slate-50">Waktu & Durasi</td>
                  <td className="p-2 font-mono">
                    {submission.startDate} s.d {submission.endDate} ({submission.durationDays} Hari)
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-medium bg-slate-50">Metode & Tempat</td>
                  <td className="p-2">{submission.mode} — {submission.location}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium bg-slate-50">Justifikasi Urgensi Klinis</td>
                  <td className="p-2 leading-relaxed text-slate-800">{submission.clinicalJustification}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 3: Rincian Anggaran */}
          <div className="space-y-1">
            <div className="font-bold uppercase text-[11px] text-slate-800">
              III. RINCIAN ESTIMASI BIAYA (USULAN ANGGARAN DIKLAT)
            </div>
            <table className="w-full border border-slate-300 text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-semibold">
                  <th className="p-2">No</th>
                  <th className="p-2">Komponen Biaya</th>
                  <th className="p-2 text-right">Nominal (IDR)</th>
                </tr>
              </thead>
              <tbody>
                {submission.costBreakdown.items && submission.costBreakdown.items.length > 0 ? (
                  submission.costBreakdown.items.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-slate-200">
                      <td className="p-2 font-mono">{idx + 1}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-right font-mono tabular-nums">{formatRupiah(item.amount)}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-mono">1</td>
                      <td className="p-2">Biaya Pendaftaran / Sertifikasi Pelatihan</td>
                      <td className="p-2 text-right font-mono tabular-nums">{formatRupiah(submission.costBreakdown.registrationFee)}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-mono">2</td>
                      <td className="p-2">Akomodasi / Penginapan Peserta</td>
                      <td className="p-2 text-right font-mono tabular-nums">{formatRupiah(submission.costBreakdown.accommodation)}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-mono">3</td>
                      <td className="p-2">Transportasi Dinas PP (Cikampek - Lokasi)</td>
                      <td className="p-2 text-right font-mono tabular-nums">{formatRupiah(submission.costBreakdown.transport)}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-mono">4</td>
                      <td className="p-2">Uang Harian / Uang Saku Peserta Diklat</td>
                      <td className="p-2 text-right font-mono tabular-nums">{formatRupiah(submission.costBreakdown.perDiem)}</td>
                    </tr>
                  </>
                )}
                <tr className="bg-slate-50 font-bold border-t border-slate-300">
                  <td colSpan={2} className="p-2 text-right">TOTAL USULAN ANGGARAN:</td>
                  <td className="p-2 text-right font-mono tabular-nums text-teal-900">{formatRupiah(submission.costBreakdown.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 4: Tanda Tangan & Persetujuan Berjenjang */}
          <div className="pt-4 space-y-2 print-break-inside-avoid">
            <div className="font-bold uppercase text-[11px] text-slate-800">
              IV. PENGESAHAN & DISPOSISI RESMI
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] border border-slate-300 p-3 rounded">
              <div className="flex flex-col justify-between h-28">
                <div>Pemohon,</div>
                <div>
                  <div className="font-bold underline text-slate-900">{submission.nurseName.split(',')[0]}</div>
                  <div className="text-slate-500">Perawat IGD</div>
                </div>
              </div>

              <div className="flex flex-col justify-between h-28 border-l border-slate-200 pl-2">
                <div>Mengetahui,</div>
                <div>
                  <div className="font-bold underline text-slate-900">Ns. Hendra Setiawan, S.Kep</div>
                  <div className="text-slate-500">Karu IGD RS Izza</div>
                </div>
              </div>

              <div className="flex flex-col justify-between h-28 border-l border-slate-200 pl-2">
                <div>Verifikasi Anggaran,</div>
                <div>
                  <div className="font-bold underline text-slate-900">Dra. Endang Sulistyowati</div>
                  <div className="text-slate-500">Kabag Diklat & SDM</div>
                </div>
              </div>

              <div className="flex flex-col justify-between h-28 border-l border-slate-200 pl-2">
                <div>Menyetujui,</div>
                <div>
                  <div className="font-bold underline text-slate-900">dr. H. Dikrullah, MARS</div>
                  <div className="text-slate-500">Direktur Utama</div>
                </div>
              </div>
            </div>
          </div>

          {/* Note Footer */}
          <div className="pt-2 text-[9px] text-slate-400 text-center border-t border-slate-200">
            Dokumen resmi Sistem Informasi Diklat SDM Perawat IGD Rumah Sakit Izza Cikampek · Dicetak secara otomatis pada {new Date().toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  );
};
