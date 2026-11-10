import { TrainingSubmission } from '../types';

export interface GoogleSheetsSyncConfig {
  webhookUrl: string;
  autoSync: boolean;
  sheetName?: string;
  lastSyncAt?: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  type: 'TEST' | 'NEW_SUBMISSION' | 'STATUS_UPDATE' | 'BULK_SYNC';
  status: 'SUCCESS' | 'ERROR';
  message: string;
}

export const APPS_SCRIPT_TEMPLATE = `// Buka Google Sheet baru di akun igdrsizzacikampek1201@gmail.com
// Klik menu: Ekstensi > Apps Script
// Ganti seluruh isi kode dengan kode di bawah ini, lalu klik "Terapkan (Deploy) > Deployment baru"
// Pilih jenis: "Aplikasi Web", Akses: "Siapa saja (Anyone)", lalu klik "Terapkan" dan salin URL-nya ke aplikasi ini!

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Buat Header jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Waktu Input",
        "No. Pengajuan",
        "Nama Perawat",
        "Jenjang PK",
        "Program Pelatihan",
        "Penyelenggara",
        "Tanggal Pelaksanaan",
        "Durasi (Hari)",
        "Total Biaya (IDR)",
        "Perawat Pengganti Shift",
        "Status Alur",
        "Justifikasi Klinis IGD"
      ]);
      // Format baris header
      sheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#0f766e").setFontColor("#ffffff");
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Jika data berupa array (Bulk Sync)
    if (Array.isArray(data)) {
      data.forEach(function(item) {
        sheet.appendRow([
          item.timestamp || new Date().toLocaleString("id-ID"),
          item.submissionNumber,
          item.nurseName,
          item.clinicalLevel,
          item.trainingTitle,
          item.provider,
          item.startDate + " s.d " + item.endDate,
          item.durationDays,
          item.totalCost,
          item.replacementNurse,
          item.status,
          item.justification
        ]);
      });
    } else {
      // Data tunggal (Realtime)
      sheet.appendRow([
        data.timestamp || new Date().toLocaleString("id-ID"),
        data.submissionNumber,
        data.nurseName,
        data.clinicalLevel,
        data.trainingTitle,
        data.provider,
        data.startDate + " s.d " + data.endDate,
        data.durationDays,
        data.totalCost,
        data.replacementNurse,
        data.status,
        data.justification
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

export async function sendSubmissionToGoogleSheet(
  webhookUrl: string,
  sub: TrainingSubmission,
  actionType: string = 'REALTIME_UPDATE'
): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, message: 'URL Webhook Google Sheets belum diatur.' };
  }

  const payload = {
    action: actionType,
    timestamp: new Date().toLocaleString('id-ID'),
    submissionNumber: sub.submissionNumber,
    nurseName: sub.nurseName,
    clinicalLevel: sub.clinicalLevel,
    trainingTitle: sub.trainingTitle,
    provider: sub.provider,
    startDate: sub.startDate,
    endDate: sub.endDate,
    durationDays: sub.durationDays,
    totalCost: sub.costBreakdown.total,
    replacementNurse: sub.shiftReplacementPlan.replacementNurseName,
    status: sub.status,
    justification: sub.clinicalJustification
  };

  try {
    // Mode 'no-cors' allows sending data to Google Apps Script web apps without CORS restrictions
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return {
      success: true,
      message: `Data pengajuan ${sub.submissionNumber} (${sub.nurseName}) berhasil dikirim ke Google Sheet.`
    };
  } catch (error: any) {
    console.error('Google Sheets sync error:', error);
    return {
      success: false,
      message: `Gagal mengirim ke Google Sheets: ${error.message || 'Network error'}`
    };
  }
}

export async function bulkSendSubmissionsToGoogleSheet(
  webhookUrl: string,
  submissions: TrainingSubmission[]
): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, message: 'URL Webhook Google Sheets belum diatur.' };
  }

  const payload = submissions.map((sub) => ({
    timestamp: new Date().toLocaleString('id-ID'),
    submissionNumber: sub.submissionNumber,
    nurseName: sub.nurseName,
    clinicalLevel: sub.clinicalLevel,
    trainingTitle: sub.trainingTitle,
    provider: sub.provider,
    startDate: sub.startDate,
    endDate: sub.endDate,
    durationDays: sub.durationDays,
    totalCost: sub.costBreakdown.total,
    replacementNurse: sub.shiftReplacementPlan.replacementNurseName,
    status: sub.status,
    justification: sub.clinicalJustification
  }));

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return {
      success: true,
      message: `Berhasil menyinkronkan ${submissions.length} berkas pengajuan ke Google Sheets.`
    };
  } catch (error: any) {
    console.error('Bulk Google Sheets sync error:', error);
    return {
      success: false,
      message: `Gagal sinkronisasi bulk ke Google Sheets: ${error.message || 'Network error'}`
    };
  }
}
