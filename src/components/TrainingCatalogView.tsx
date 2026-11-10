import React, { useState } from 'react';
import { TrainingCatalogItem } from '../types';

interface TrainingCatalogViewProps {
  catalog: TrainingCatalogItem[];
  onSelectTrainingToSubmit: (trainingId: string) => void;
}

export const TrainingCatalogView: React.FC<TrainingCatalogViewProps> = ({
  catalog,
  onSelectTrainingToSubmit
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'ALL',
    'Life Support / Resusitasi',
    'Pediatric / Neonatal',
    'Triase & Manajerial',
    'Spesialisasi IGD',
    'Trauma & Disaster',
    'Patient Safety & PPI'
  ];

  const filteredCatalog = catalog.filter((item) => {
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            Katalog Pelatihan Kegawatdaruratan Terakreditasi
          </h1>
          <p className="text-xs text-slate-500">
            Daftar program sertifikasi & refreshment kompetensi perawat gawat darurat dengan SKP PPNI & Kemenkes RI
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kurikulum, provider..."
              className="w-full text-xs rounded-lg border border-slate-300 pl-8 pr-3 py-2 focus:border-teal-600 focus:outline-none"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Grid of Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCatalog.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[11px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {item.code}
                </span>
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {item.skpPpni} SKP PPNI
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <div className="text-[11px] text-slate-500 mt-1">
                  Penyelenggara: <strong className="text-slate-700">{item.provider}</strong>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1 text-slate-500">
                <div className="flex justify-between">
                  <span>Sasaran Jenjang:</span>
                  <span className="font-semibold text-slate-800">{item.targetLevel.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Metode & Durasi:</span>
                  <span className="text-slate-800 font-medium">{item.mode} · {item.durationDays} Hari</span>
                </div>
                <div className="flex justify-between">
                  <span>Akreditasi:</span>
                  <span className="text-slate-800 truncate max-w-[170px] text-right">{item.accreditation}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Estimasi Investasi:</span>
                <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {formatRupiah(item.estimatedCost)}
                </span>
              </div>
              <button
                onClick={() => onSelectTrainingToSubmit(item.id)}
                className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Pilih Modul Ini →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
