import React, { useState, useEffect } from 'react';
import { NurseProfile, TrainingSubmission, TrainingCatalogItem, UserRole, ApprovalStep } from './types';
import { INITIAL_NURSES, INITIAL_SUBMISSIONS, INITIAL_CATALOG, HOSPITAL_METADATA } from './initialData';
import { Header } from './components/Header';
import { SubmissionsListView } from './components/SubmissionsListView';
import { ComplianceMatrixView } from './components/ComplianceMatrixView';
import { SubmissionDetailModal } from './components/SubmissionDetailModal';
import { PrintDispositionSheet } from './components/PrintDispositionSheet';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { SimpleFormView } from './components/SimpleFormView';
import { GoogleSheetsSyncConfig, sendSubmissionToGoogleSheet } from './services/googleSheetsSync';

const STORAGE_KEYS = {
  NURSES: 'rs_izza_igd_nurses_v1',
  SUBMISSIONS: 'rs_izza_igd_submissions_v1',
  CATALOG: 'rs_izza_igd_catalog_v1',
  ROLE: 'rs_izza_igd_user_role_v1'
};

export default function App() {
  // Initialize state from LocalStorage or defaults
  const [nurses, setNurses] = useState<NurseProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NURSES);
      return saved ? JSON.parse(saved) : INITIAL_NURSES;
    } catch {
      return INITIAL_NURSES;
    }
  });

  const [submissions, setSubmissions] = useState<TrainingSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [catalog, setCatalog] = useState<TrainingCatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATALOG);
      return saved ? JSON.parse(saved) : INITIAL_CATALOG;
    } catch {
      return INITIAL_CATALOG;
    }
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved as UserRole) || 'karu';
    } catch {
      return 'karu';
    }
  });

  const [currentTab, setCurrentTab] = useState<string>('form');

  // Modals state
  const [selectedSubmission, setSelectedSubmission] = useState<TrainingSubmission | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [printSubmission, setPrintSubmission] = useState<TrainingSubmission | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Google Sheets Realtime Sync State
  const [googleSheetsConfig, setGoogleSheetsConfig] = useState<GoogleSheetsSyncConfig>(() => {
    try {
      const saved = localStorage.getItem('rs_izza_sheets_config_v1');
      return saved ? JSON.parse(saved) : { webhookUrl: '', autoSync: true };
    } catch {
      return { webhookUrl: '', autoSync: true };
    }
  });
  const [isGoogleSheetsModalOpen, setIsGoogleSheetsModalOpen] = useState(false);
  const [syncToast, setSyncToast] = useState<{ message: string; isError?: boolean } | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NURSES, JSON.stringify(nurses));
  }, [nurses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('rs_izza_sheets_config_v1', JSON.stringify(googleSheetsConfig));
  }, [googleSheetsConfig]);

  // Submissions count needing action
  const pendingCount = submissions.filter(
    (s) =>
      s.status === 'Menunggu Karu' ||
      s.status === 'Review Komite Keperawatan' ||
      s.status === 'Verifikasi Diklat & SDM' ||
      s.status === 'Persetujuan Direksi'
  ).length;

  const handleOpenNewSubmission = () => {
    setCurrentTab('form');
  };

  const handleCreateSubmission = (
    data: Omit<TrainingSubmission, 'id' | 'submissionNumber' | 'createdAt' | 'updatedAt' | 'approvalHistory'>,
    newNurseProfile?: NurseProfile
  ) => {
    if (newNurseProfile) {
      setNurses((prev) => [newNurseProfile, ...prev]);
    }

    const nextNum = (submissions.length + 1).toString().padStart(3, '0');
    const newSubmission: TrainingSubmission = {
      ...data,
      id: `sub-${Date.now()}`,
      submissionNumber: `PL-IGD-2026-${nextNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvalHistory: [
        {
          role: 'Perawat Pengaju',
          actorName: data.nurseName,
          action: 'Submitted',
          timestamp: new Date().toLocaleString('id-ID', { timeZoneName: 'short' }),
          notes: 'Berkas usulan pelatihan SDM IGD resmi diajukan via portal sistem.'
        }
      ]
    };

    setSubmissions([newSubmission, ...submissions]);
    setSelectedSubmission(newSubmission);
    setIsDetailModalOpen(true);

    // Auto-sync realtime to Google Sheets if configured
    if (googleSheetsConfig.webhookUrl && googleSheetsConfig.autoSync) {
      sendSubmissionToGoogleSheet(googleSheetsConfig.webhookUrl, newSubmission, 'NEW_SUBMISSION').then((res) => {
        if (res.success) {
          setSyncToast({ message: `Terkirim ke Google Sheet: ${newSubmission.submissionNumber} (${newSubmission.nurseName})` });
          setTimeout(() => setSyncToast(null), 4000);
        }
      });
    }
  };

  const handleUpdateStatus = (
    submissionId: string,
    newStatus: TrainingSubmission['status'],
    approvalStep: ApprovalStep
  ) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId) {
          const updated = {
            ...sub,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            approvalHistory: [...sub.approvalHistory, approvalStep]
          };
          if (selectedSubmission?.id === submissionId) {
            setSelectedSubmission(updated);
          }

          // Auto-sync status update realtime to Google Sheets if configured
          if (googleSheetsConfig.webhookUrl && googleSheetsConfig.autoSync) {
            sendSubmissionToGoogleSheet(googleSheetsConfig.webhookUrl, updated, 'STATUS_UPDATE').then((res) => {
              if (res.success) {
                setSyncToast({ message: `Update status terkirim ke Google Sheet: ${updated.submissionNumber}` });
                setTimeout(() => setSyncToast(null), 4000);
              }
            });
          }

          return updated;
        }
        return sub;
      })
    );
  };

  // When a training is completed and certificate submitted, update nurse certifications!
  const handleSubmitPostReport = (
    submissionId: string,
    reportData: {
      certificateNumber: string;
      certificateDate: string;
      scoreGrade: string;
      summaryKnowledge: string;
    }
  ) => {
    const targetSub = submissions.find((s) => s.id === submissionId);
    if (!targetSub) return;

    // 1. Update submission
    const updatedSub: TrainingSubmission = {
      ...targetSub,
      status: 'Selesai Pelatihan',
      updatedAt: new Date().toISOString(),
      postTrainingReport: {
        certificateNumber: reportData.certificateNumber,
        certificateDate: reportData.certificateDate,
        scoreGrade: reportData.scoreGrade,
        summaryKnowledge: reportData.summaryKnowledge,
        submittedAt: new Date().toISOString().slice(0, 10)
      },
      approvalHistory: [
        ...targetSub.approvalHistory,
        {
          role: 'Diklat & SDM',
          actorName: 'Bagian Diklat RS Izza Cikampek',
          action: 'Approved',
          timestamp: new Date().toLocaleString('id-ID', { timeZoneName: 'short' }),
          notes: `Sertifikat ${reportData.certificateNumber} telah diverifikasi dan dicatatkan pada Buku Kredensial Keperawatan.`
        }
      ]
    };

    setSubmissions((prev) => prev.map((s) => (s.id === submissionId ? updatedSub : s)));
    setSelectedSubmission(updatedSub);

    // 2. Automatically update or add the certificate for the nurse in the roster
    setNurses((prevNurses) =>
      prevNurses.map((nurse) => {
        if (nurse.id === targetSub.nurseId) {
          const certCode = targetSub.trainingTitle.toUpperCase().includes('ACLS')
            ? 'ACLS'
            : targetSub.trainingTitle.toUpperCase().includes('BTCLS')
            ? 'BTCLS'
            : targetSub.trainingTitle.toUpperCase().includes('TRIA') || targetSub.trainingTitle.toUpperCase().includes('ESI')
            ? 'ESI-ATS'
            : targetSub.trainingTitle.toUpperCase().includes('VENT')
            ? 'VENT-BASIC'
            : targetSub.trainingTitle.toUpperCase().includes('NEO') || targetSub.trainingTitle.toUpperCase().includes('PALS')
            ? 'RES-NEO'
            : 'CERT-OTHER';

          const certExpiryYear = new Date(reportData.certificateDate).getFullYear() + 4;
          const expiryDateStr = `${certExpiryYear}-12-31`;

          const existingIndex = nurse.certifications.findIndex((c) => c.code === certCode);
          let updatedCerts = [...nurse.certifications];

          if (existingIndex >= 0) {
            updatedCerts[existingIndex] = {
              ...updatedCerts[existingIndex],
              status: 'Aktif',
              certNumber: reportData.certificateNumber,
              issueDate: reportData.certificateDate,
              expiryDate: expiryDateStr
            };
          } else {
            updatedCerts.push({
              id: `c-new-${Date.now()}`,
              name: targetSub.trainingTitle,
              code: certCode,
              provider: targetSub.provider,
              issueDate: reportData.certificateDate,
              expiryDate: expiryDateStr,
              certNumber: reportData.certificateNumber,
              status: 'Aktif'
            });
          }

          return {
            ...nurse,
            certifications: updatedCerts
          };
        }
        return nurse;
      })
    );
  };

  const handleResetData = () => {
    if (confirm('Kembalikan data ke kondisi awal simulasi IGD RS Izza Cikampek?')) {
      localStorage.removeItem(STORAGE_KEYS.NURSES);
      localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
      localStorage.removeItem(STORAGE_KEYS.CATALOG);
      setNurses(INITIAL_NURSES);
      setSubmissions(INITIAL_SUBMISSIONS);
      setCatalog(INITIAL_CATALOG);
      setSelectedSubmission(null);
      setIsDetailModalOpen(false);
      setIsPrintModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userRole={userRole}
        onChangeUserRole={setUserRole}
        onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
        pendingCount={pendingCount}
      />

      {/* Realtime Toast notification */}
      {syncToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>{syncToast.message}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentTab === 'form' && (
          <SimpleFormView
            nurses={nurses}
            catalog={catalog}
            onSubmit={(submissionData, newNurseProfile) => {
              handleCreateSubmission(submissionData, newNurseProfile);
            }}
            onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
          />
        )}

        {currentTab === 'submissions' && (
          <SubmissionsListView
            submissions={submissions}
            userRole={userRole}
            onViewDetail={(sub) => {
              setSelectedSubmission(sub);
              setIsDetailModalOpen(true);
            }}
            onOpenNewSubmission={() => setCurrentTab('form')}
            onPrintDisposition={(sub) => {
              setPrintSubmission(sub);
              setIsPrintModalOpen(true);
            }}
          />
        )}

        {currentTab === 'matrix' && (
          <ComplianceMatrixView
            nurses={nurses}
            onOpenNewSubmission={(_nurseId) => setCurrentTab('form')}
          />
        )}
      </main>

      {/* Hospital Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800">{HOSPITAL_METADATA.fullName}</span>
            <span aria-hidden="true">·</span>
            <span>{HOSPITAL_METADATA.unit}</span>
            <span aria-hidden="true">·</span>
            <span className="text-teal-700">{HOSPITAL_METADATA.accreditationLevel}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer text-[11px]"
            >
              Reset Data Demo
            </button>
            <span>Cikampek, Karawang, Jawa Barat</span>
          </div>
        </div>
      </footer>

      {/* Submission Detail & Approval Modal */}
      <SubmissionDetailModal
        submission={selectedSubmission}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        userRole={userRole}
        onUpdateStatus={handleUpdateStatus}
        onSubmitPostReport={handleSubmitPostReport}
        onPrintDisposition={(sub) => {
          setPrintSubmission(sub);
          setIsPrintModalOpen(true);
        }}
      />

      {/* Printable Disposition Sheet Modal */}
      <PrintDispositionSheet
        submission={printSubmission}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      {/* Google Sheets Realtime Sync Modal */}
      <GoogleSheetsModal
        isOpen={isGoogleSheetsModalOpen}
        onClose={() => setIsGoogleSheetsModalOpen(false)}
        config={googleSheetsConfig}
        onSaveConfig={setGoogleSheetsConfig}
        submissions={submissions}
      />
    </div>
  );
}
