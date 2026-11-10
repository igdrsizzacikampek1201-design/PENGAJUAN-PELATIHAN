import React, { useState } from 'react';
import { TrainingSubmission } from '../types';
import {
  GoogleSheetsSyncConfig,
  APPS_SCRIPT_TEMPLATE,
  bulkSendSubmissionsToGoogleSheet,
  sendSubmissionToGoogleSheet
} from '../services/googleSheetsSync';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSheetsSyncConfig;
  onSaveConfig: (newConfig: GoogleSheetsSyncConfig) => void;
  submissions: TrainingSubmission[];
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  submissions
}) => {
  const [webhookUrl, setWebhookUrl] = useState(config.webhookUrl || '');
  const [autoSync, setAutoSync] = useState(config.autoSync ?? true);
  const [isTesting, setIsTesting] = useState(false);
  const [isBulkSyncing, setIsBulkSyncing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'TUTORIAL'>('SETTINGS');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      webhookUrl: webhookUrl.trim(),
      autoSync: autoSync,
      lastSyncAt: config.lastSyncAt
    });
    setFeedbackMessage({ text: 'Pengaturan Google Sheets berhasil disimpan!', isError: false });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleTestConnection = async () => {
    if (!webhookUrl.trim()) {
      setFeedbackMessage({ text: 'Masukkan Webhook URL terlebih dahulu.', isError: true });
      return;
    }

    setIsTesting(true);
    setFeedbackMessage(null);

    const testSub: TrainingSubmission = {
      id: 'test-sync',
      submissionNumber: 'TEST-KONEKSI-IGD',
      nurseId: 'n-test',
      nurseName: 'Perawat Uji Coba (Tes Realtime)',
      clinicalLevel: 'PK II',
      trainingId: 'trn-test',
      trainingTitle: 'Uji Integrasi Realtime Google Sheets RS Izza',
      category: 'Life Support / Resusitasi',
      provider: 'Sistem Diklat IGD',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      durationDays: 1,
      mode: 'Luring (Tatap Muka)',
      location: 'IGD RS Izza Cikampek',
      costBreakdown: {
        registrationFee: 0,
        accommodation: 0,
        transport: 0,
        perDiem: 0,
        total: 0
      },
      clinicalJustification: 'Pengujian koneksi transmisi data realtime dari Web Portal ke Spreadsheet Google.',
      shiftReplacementPlan: {
        replacementNurseId: 'n-001',
        replacementNurseName: 'Perawat Shift Standby',
        notes: 'Uji sistem'
      },
      status: 'Disetujui',
      approvalHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await sendSubmissionToGoogleSheet(webhookUrl.trim(), testSub, 'TEST_CONNECTION');
    setIsTesting(false);

    if (result.success) {
      setFeedbackMessage({
        text: 'Berhasil! Data baris uji coba telah dikirim. Silakan periksa Google Sheet Anda!',
        isError: false
      });
      onSaveConfig({
        webhookUrl: webhookUrl.trim(),
        autoSync: autoSync,
        lastSyncAt: new Date().toLocaleString('id-ID')
      });
    } else {
      setFeedbackMessage({ text: result.message, isError: true });
    }
  };

  const handleBulkSync = async () => {
    if (!webhookUrl.trim()) {
      setFeedbackMessage({ text: 'Masukkan Webhook URL terlebih dahulu.', isError: true });
      return;
    }

    setIsBulkSyncing(true);
    setFeedbackMessage(null);

    const result = await bulkSendSubmissionsToGoogleSheet(webhookUrl.trim(), submissions);
    setIsBulkSyncing(false);

    if (result.success) {
      setFeedbackMessage({
        text: `Sukses! ${submissions.length} berkas pengajuan saat ini telah disinkronkan ke Google Sheet.`,
        isError: false
      });
      onSaveConfig({
        webhookUrl: webhookUrl.trim(),
        autoSync: autoSync,
        lastSyncAt: new Date().toLocaleString('id-ID')
      });
    } else {
      setFeedbackMessage({ text: result.message, isError: true });
    }
  };

  const copyScriptCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Integrasi Realtime Google Sheets
              </h2>
              <p className="text-xs text-slate-500">
                Kirim data pengajuan pelatihan secara otomatis ke spreadsheet Google Drive RS Izza
              </p>
            </div>
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

        {/* Tab switch */}
        <div className="px-6 pt-4 border-b border-slate-100 flex gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'SETTINGS' ? 'border-teal-700 text-teal-800 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Pengaturan & Sinkronisasi
          </button>
          <button
            onClick={() => setActiveTab('TUTORIAL')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'TUTORIAL' ? 'border-teal-700 text-teal-800 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Panduan & Salin Skrip Apps Script (1 Menit)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {feedbackMessage && (
            <div
              className={`p-3 rounded-lg text-xs font-medium border ${
                feedbackMessage.isError
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              {feedbackMessage.text}
            </div>
          )}

          {activeTab === 'SETTINGS' ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-800">
                  Google Apps Script Webhook URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  className="w-full text-xs font-mono rounded-lg border border-slate-300 p-2.5 focus:border-teal-600 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  Dapatkan URL ini dari menu <strong>Deploy &gt; New deployment &gt; Web app</strong> di Google Sheets Anda. Lihat tab &quot;Panduan&quot; jika belum membuatnya.
                </p>
              </div>

              {/* Toggles */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 block">Kirim Otomatis Realtime (Auto-Sync)</span>
                    <span className="text-slate-500 text-[11px]">
                      Setiap kali pengajuan baru dibuat atau disetujui, langsung dikirim sebagai baris baru di Google Sheet.
                    </span>
                  </div>
                </label>
              </div>

              {config.lastSyncAt && (
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Sinkronisasi Terakhir:</span>
                  <span className="font-mono text-slate-800">{config.lastSyncAt}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isTesting ? 'Mengirim Tes...' : 'Tes Koneksi (Kirim 1 Baris Sampel)'}
                  </button>

                  <button
                    type="button"
                    onClick={handleBulkSync}
                    disabled={isBulkSyncing}
                    className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isBulkSyncing ? 'Menyinkronkan...' : `Kirim Semua Berkas (${submissions.length})`}
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs ml-auto"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-950 space-y-1">
                <div className="font-bold">Langkah Cepat Integrasi Google Sheets (1 Menit):</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  <li>Buka <strong>Google Sheets</strong> di akun Google IGD RS Izza (misal: <code>igdrsizzacikampek1201@gmail.com</code>).</li>
                  <li>Buat spreadsheet baru, beri nama misalnya: <code>Database Pelatihan SDM Perawat IGD RS Izza</code>.</li>
                  <li>Klik menu atas: <strong>Ekstensi (Extensions) &gt; Apps Script</strong>.</li>
                  <li>Hapus kode bawaan, lalu salin dan tempel kode skrip di bawah ini.</li>
                  <li>Klik tombol biru <strong>Deploy (Terapkan) &gt; New deployment (Deployment baru)</strong>.</li>
                  <li>Pilih jenis <strong>Web app (Aplikasi Web)</strong>. Di bagian <em>Who has access (Siapa yang memiliki akses)</em>, pilih <strong>Anyone (Siapa saja)</strong>.</li>
                  <li>Salin <strong>Web App URL</strong> yang dihasilkan, lalu tempel di tab Pengaturan di aplikasi ini!</li>
                </ol>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Kode Google Apps Script:</span>
                  <button
                    type="button"
                    onClick={copyScriptCode}
                    className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-[11px] rounded transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedCode ? '✓ Berhasil Disalin!' : 'Salin Kode Skrip'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 font-mono text-[11px] rounded-lg overflow-x-auto max-h-48 leading-relaxed">
                  {APPS_SCRIPT_TEMPLATE}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
