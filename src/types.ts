export type ClinicalLevel = 'Pra-PK' | 'PK I' | 'PK II' | 'PK III' | 'PK IV';

export interface NurseCertification {
  id: string;
  name: string;
  code: string;
  provider: string;
  issueDate: string;
  expiryDate: string;
  certNumber: string;
  status: 'Aktif' | 'Mendekati Expired' | 'Expired';
}

export interface NurseProfile {
  id: string;
  nip: string;
  name: string;
  gender: 'L' | 'P';
  clinicalLevel: ClinicalLevel;
  education: 'D3 Keperawatan' | 'S1 Keperawatan + Ners' | 'S2 Keperawatan';
  niraPpni: string;
  strNumber: string;
  strExpiryDate: string;
  sipNumber: string;
  joinDate: string;
  status: 'Aktif' | 'Cuti' | 'Dinas Khusus';
  shiftGroup: 'Tim A' | 'Tim B' | 'Tim C' | 'Tim Non-Shift';
  certifications: NurseCertification[];
}

export interface TrainingCatalogItem {
  id: string;
  code: string;
  title: string;
  category: 'Life Support / Resusitasi' | 'Trauma & Disaster' | 'Pediatric / Neonatal' | 'Triase & Manajerial' | 'Patient Safety & PPI' | 'Spesialisasi IGD';
  skpPpni: number;
  durationDays: number;
  estimatedCost: number;
  provider: string;
  mode: 'Luring (Tatap Muka)' | 'Daring (Online)' | 'Hybrid';
  description: string;
  targetLevel: ClinicalLevel[];
  prerequisites: string;
  accreditation: string;
}

export type SubmissionStatus =
  | 'Draft'
  | 'Menunggu Karu'
  | 'Review Komite Keperawatan'
  | 'Verifikasi Diklat & SDM'
  | 'Persetujuan Direksi'
  | 'Disetujui'
  | 'Ditolak'
  | 'Selesai Pelatihan';

export interface ApprovalStep {
  role: 'Perawat Pengaju' | 'Kepala Ruangan IGD' | 'Komite Keperawatan' | 'Diklat & SDM' | 'Direksi RS';
  actorName: string;
  action: 'Submitted' | 'Approved' | 'Revision' | 'Rejected';
  timestamp: string;
  notes: string;
}

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
}

export interface CostBreakdown {
  items?: BudgetItem[];
  registrationFee: number;
  accommodation: number;
  transport: number;
  perDiem: number;
  total: number;
}

export interface AiTrainingAnalysis {
  urgencyLevel: string;
  justification: string;
  clinicalCompetenciesGained: string[];
  institutionalBenefit: string;
  suggestedShiftPreparation: string;
  isFallback?: boolean;
}

export interface TrainingSubmission {
  id: string;
  submissionNumber: string;
  nurseId: string;
  nurseName: string;
  clinicalLevel: ClinicalLevel;
  trainingId: string;
  trainingTitle: string;
  category: string;
  provider: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  mode: 'Luring (Tatap Muka)' | 'Daring (Online)' | 'Hybrid';
  location: string;
  costBreakdown: CostBreakdown;
  clinicalJustification: string;
  aiAnalysis?: AiTrainingAnalysis;
  shiftReplacementPlan: {
    replacementNurseId: string;
    replacementNurseName: string;
    notes: string;
  };
  status: SubmissionStatus;
  approvalHistory: ApprovalStep[];
  postTrainingReport?: {
    certificateNumber?: string;
    certificateDate?: string;
    scoreGrade?: string;
    summaryKnowledge?: string;
    submittedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'perawat' | 'karu' | 'diklat_sdm' | 'direksi';
