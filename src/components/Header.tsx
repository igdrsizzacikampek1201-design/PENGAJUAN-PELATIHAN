import React from 'react';
import { UserRole } from '../types';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  onOpenGoogleSheetsModal: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onChangeUserRole,
  onOpenGoogleSheetsModal,
  pendingCount
}) => {
  return (
    <header className="bg-teal-800 text-white shadow-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 sm:h-18">
          {/* Brand Zone (Matches SIP-IGD banner in screenshot) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-white flex items-center justify-center font-extrabold text-sm shadow-inner shrink-0">
              <svg className="w-6 h-6 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wider text-white">
                  SIP-IGD
                </span>
                <span className="text-[10px] uppercase font-semibold text-teal-200 bg-white/10 px-1.5 py-0.5 rounded">
                  RS Izza Cikampek
                </span>
              </div>
              <p className="text-xs text-teal-100/90 font-medium leading-tight">
                Sistem Pengajuan Pelatihan SDM Perawat Unit IGD
              </p>
            </div>
          </div>

          {/* Right Action Zone (Matches "Buka Google Sheets" button from screenshot) */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            {/* Navigation Switcher */}
            <div className="flex items-center p-0.5 bg-teal-900/60 rounded-lg text-xs">
              <button
                onClick={() => onSelectTab('form')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  currentTab === 'form' ? 'bg-white text-teal-900 shadow-xs' : 'text-teal-100 hover:text-white'
                }`}
              >
                Formulir Pengajuan
              </button>
              <button
                onClick={() => onSelectTab('submissions')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'submissions' ? 'bg-white text-teal-900 shadow-xs' : 'text-teal-100 hover:text-white'
                }`}
              >
                <span>Daftar Berkas</span>
                {pendingCount > 0 && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => onSelectTab('matrix')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  currentTab === 'matrix' ? 'bg-white text-teal-900 shadow-xs' : 'text-teal-100 hover:text-white'
                }`}
              >
                Matriks SDM
              </button>
            </div>

            {/* Buka Google Sheets Button */}
            <button
              onClick={onOpenGoogleSheetsModal}
              title="Koneksi & Sinkronisasi Realtime Google Sheets"
              className="px-3.5 py-1.5 text-xs font-bold text-teal-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4 text-teal-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
              </svg>
              <span>Buka Google Sheets</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Indicator Sub-strip */}
      <div className="bg-teal-900/90 border-t border-teal-700/50 px-4 sm:px-6 py-1.5 text-[11px] text-teal-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-teal-300">Hak Akses Aktif:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onChangeUserRole('perawat')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  userRole === 'perawat' ? 'bg-teal-700 text-white font-bold' : 'text-teal-200 hover:text-white'
                }`}
              >
                Perawat Staf
              </button>
              <button
                onClick={() => onChangeUserRole('karu')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  userRole === 'karu' ? 'bg-teal-700 text-white font-bold' : 'text-teal-200 hover:text-white'
                }`}
              >
                Karu IGD
              </button>
              <button
                onClick={() => onChangeUserRole('diklat_sdm')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  userRole === 'diklat_sdm' ? 'bg-teal-700 text-white font-bold' : 'text-teal-200 hover:text-white'
                }`}
              >
                Diklat & SDM
              </button>
              <button
                onClick={() => onChangeUserRole('direksi')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  userRole === 'direksi' ? 'bg-teal-700 text-white font-bold' : 'text-teal-200 hover:text-white'
                }`}
              >
                Direksi
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-teal-200 text-[11px]">
            <span>Unit:</span>
            <strong className="text-white">Instalasi Gawat Darurat (IGD)</strong>
            <span>·</span>
            <span>24 Jam</span>
          </div>
        </div>
      </div>
    </header>
  );
};
