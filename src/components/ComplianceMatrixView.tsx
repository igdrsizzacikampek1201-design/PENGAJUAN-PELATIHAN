import React, { useState } from 'react';
import { NurseProfile } from '../types';

interface ComplianceMatrixViewProps {
  nurses: NurseProfile[];
  onOpenNewSubmission: (nurseId: string) => void;
}

export const ComplianceMatrixView: React.FC<ComplianceMatrixViewProps> = ({
  nurses,
  onOpenNewSubmission
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'URGENT' | 'PK_I_II' | 'PK_III_IV'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Required IGD Certifications to track
  const REQUIRED_CERTS = [
    { code: 'BTCLS', name: 'BTCLS Trauma & Cardiac', isMandatoryAll: true },
    { code: 'ACLS', name: 'ACLS PERKI', isMandatoryAll: false, targetLevel: 'PK III+' },
    { code: 'ESI-ATS', name: 'Triage ESI / ATS', isMandatoryAll: false },
    { code: 'RES-NEO', name: 'Resusitasi Neo/Pediatrik', isMandatoryAll: false },
    { code: 'VENT-BASIC', name: 'Ventilator & Transport', isMandatoryAll: false },
    { code: 'PPI-IGD', name: 'PPI & Safety IGD', isMandatoryAll: false }
  ];

  const getCertStatus = (nurse: NurseProfile, certCode: string) => {
    const cert = nurse.certifications.find((c) => c.code === certCode);
    if (!cert) {
      return { status: 'NONE', label: 'Belum Ada', expiryDate: '-' };
    }
    return {
      status: cert.status,
      label: cert.status,
      expiryDate: cert.expiryDate,
      certNumber: cert.certNumber
    };
  };

  const hasUrgentNeed = (nurse: NurseProfile) => {
    return nurse.certifications.some((c) => c.status === 'Expired' || c.status === 'Mendekati Expired');
  };

  const filteredNurses = nurses.filter((nurse) => {
    const matchSearch =
      nurse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nurse.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nurse.strNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (filterMode === 'URGENT') return hasUrgentNeed(nurse);
    if (filterMode === 'PK_I_II') return nurse.clinicalLevel === 'Pra-PK' || nurse.clinicalLevel === 'PK I' || nurse.clinicalLevel === 'PK II';
    if (filterMode === 'PK_III_IV') return nurse.clinicalLevel === 'PK III' || nurse.clinicalLevel === 'PK IV';

    return true;
  });

  const exportCSV = () => {
    const headers = ['Nama Perawat', 'NIP', 'Jenjang PK', 'STR', 'Masa Berlaku STR', 'BTCLS', 'ACLS', 'Triage ESI', 'Resusitasi Anak', 'Ventilator', 'PPI'];
    const rows = nurses.map((n) => {
      const btcls = getCertStatus(n, 'BTCLS').label;
      const acls = getCertStatus(n, 'ACLS').label;
      const triage = getCertStatus(n, 'ESI-ATS').label;
      const neo = getCertStatus(n, 'RES-NEO').label;
      const vent = getCertStatus(n, 'VENT-BASIC').label;
      const ppi = getCertStatus(n, 'PPI-IGD').label;
      return [
        `"${n.name}"`,
        `"${n.nip}"`,
        `"${n.clinicalLevel}"`,
        `"${n.strNumber}"`,
        `"${n.strExpiryDate}"`,
        `"${btcls}"`,
        `"${acls}"`,
        `"${triage}"`,
        `"${neo}"`,
        `"${vent}"`,
        `"${ppi}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Matriks_Kepatuhan_Pelatihan_IGD_RS_Izza_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Matriks Kepatuhan Sertifikasi & Kompetensi SDM IGD
          </h1>
          <p className="text-xs text-slate-500">
            Pemetaan kesiapan klinis perawat gawat darurat, masa berlaku sertifikat resusitasi, dan jenjang karir klinis (PK) RS Izza Cikampek
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Legend & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterMode === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Perawat ({nurses.length})
            </button>
            <button
              onClick={() => setFilterMode('URGENT')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterMode === 'URGENT' ? 'bg-white text-amber-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Perlu Refreshment Segera
            </button>
            <button
              onClick={() => setFilterMode('PK_I_II')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterMode === 'PK_I_II' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jenjang Pra-PK / PK I / PK II
            </button>
            <button
              onClick={() => setFilterMode('PK_III_IV')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filterMode === 'PK_III_IV' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jenjang PK III & PK IV (PJ Shift)
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
              <span className="text-slate-600">Aktif</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" />
              <span className="text-slate-600">&lt; 90 Hari</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500" />
              <span className="text-slate-600">Expired</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-200" />
              <span className="text-slate-400">Belum Ikut</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-4 min-w-[200px]">Perawat & Jenjang Karir</th>
                <th className="py-3 px-3">Status STR</th>
                {REQUIRED_CERTS.map((c) => (
                  <th key={c.code} className="py-3 px-3 text-center min-w-[120px]">
                    <div>{c.code}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{c.name.split(' ')[0]}</div>
                  </th>
                ))}
                <th className="py-3 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNurses.map((nurse) => {
                const urgent = hasUrgentNeed(nurse);
                return (
                  <tr key={nurse.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Nurse details */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{nurse.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{nurse.nip}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-bold text-teal-800">{nurse.clinicalLevel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{nurse.shiftGroup}</span>
                      </div>
                    </td>

                    {/* STR info */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-mono text-slate-800 text-[11px]">{nurse.strNumber}</div>
                      <div className="text-[10px] text-slate-400">Exp: {nurse.strExpiryDate}</div>
                    </td>

                    {/* Certifications Cells */}
                    {REQUIRED_CERTS.map((certItem) => {
                      const data = getCertStatus(nurse, certItem.code);
                      return (
                        <td key={certItem.code} className="py-3 px-2 text-center whitespace-nowrap">
                          {data.status === 'Aktif' ? (
                            <div className="inline-block p-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded font-medium text-[11px] w-full">
                              <div>Aktif</div>
                              <div className="text-[9px] text-emerald-600 font-mono">exp {data.expiryDate.slice(2, 7)}</div>
                            </div>
                          ) : data.status === 'Mendekati Expired' ? (
                            <div className="inline-block p-1 bg-amber-50 border border-amber-300 text-amber-900 rounded font-semibold text-[11px] w-full ring-1 ring-amber-300">
                              <div>Renewal Segera</div>
                              <div className="text-[9px] text-amber-700 font-mono">exp {data.expiryDate.slice(0, 10)}</div>
                            </div>
                          ) : data.status === 'Expired' ? (
                            <div className="inline-block p-1 bg-rose-50 border border-rose-300 text-rose-900 rounded font-bold text-[11px] w-full ring-1 ring-rose-400">
                              <div>KEDALUWARSA</div>
                              <div className="text-[9px] text-rose-700 font-mono">exp {data.expiryDate.slice(0, 10)}</div>
                            </div>
                          ) : (
                            <div className="inline-block p-1 bg-slate-50 border border-slate-200/80 text-slate-400 rounded text-[11px] w-full">
                              -
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onOpenNewSubmission(nurse.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          urgent
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                            : 'bg-teal-50 hover:bg-teal-100 text-teal-800'
                        }`}
                      >
                        {urgent ? '+ Usulkan Renewal' : '+ Ajukan Diklat'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
