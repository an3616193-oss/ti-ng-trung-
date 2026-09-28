import React, { useState } from 'react';
import { Layers, PenTool, Search, Volume2, X } from 'lucide-react';
import { COMMON_RADICALS, STROKE_TYPES } from '../data/radicals';
import { speechController } from '../utils/speech';

interface RadicalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChar?: (char: string) => void;
}

export const RadicalsModal: React.FC<RadicalsModalProps> = ({
  isOpen,
  onClose,
  onSelectChar
}) => {
  const [activeTab, setActiveTab] = useState<'radicals' | 'strokes'>('radicals');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredRadicals = COMMON_RADICALS.filter(r => 
    r.radical.includes(search) || 
    r.hanViet.toLowerCase().includes(search.toLowerCase()) ||
    r.pinyin.toLowerCase().includes(search.toLowerCase()) ||
    r.meaningVi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-50/90 dark:bg-stone-800/60 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                Sổ tay Bộ thủ & Nét chữ tiếng Trung (Offline)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Nắm vững các bộ thủ thông dụng và các nét viết cơ bản cấu thành chữ Hán
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('radicals')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'radicals'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Bộ thủ thông dụng ({COMMON_RADICALS.length})
            </button>
            <button
              onClick={() => setActiveTab('strokes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'strokes'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              8 Nét viết cơ bản (Vĩnh tự bát pháp)
            </button>
          </div>

          {activeTab === 'radicals' && (
            <div className="relative w-44 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm bộ thủ..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-red-500"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Radicals */}
        {activeTab === 'radicals' && (
          <div className="p-6 space-y-3 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredRadicals.map((rad, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 shadow-xs hover:border-red-300 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold font-serif text-red-600 dark:text-red-400">
                        {rad.radical}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          Bộ {rad.hanViet}
                        </div>
                        <div className="text-2xs text-stone-500 dark:text-stone-400">
                          Pinyin: <span className="font-semibold text-stone-700 dark:text-stone-300">{rad.pinyin}</span> • {rad.strokes} nét
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => speechController.speakWord(rad.radical)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                      title="Nghe phát âm bộ thủ"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {rad.meaningVi}
                  </p>

                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 flex-wrap">
                    <span className="text-3xs font-semibold text-stone-400 uppercase">Ví dụ chữ:</span>
                    {rad.exampleChars.map((ch, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => {
                          speechController.speakWord(ch);
                          if (onSelectChar) onSelectChar(ch);
                        }}
                        className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-serif font-bold hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950 transition cursor-pointer"
                        title="Nghe phát âm"
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Strokes */}
        {activeTab === 'strokes' && (
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              Theo quy tắc <strong>"Vĩnh tự bát pháp" (永字八法)</strong>, chữ "Vĩnh" (永) chứa trọn vẹn 8 nét viết cơ bản trong thư pháp và văn tự Hán. Nắm vững tên gọi và cách đưa bút giúp bạn nhớ chữ Hán giản thể nhanh hơn gấp nhiều lần.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {STROKE_TYPES.map((stroke, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 shadow-xs space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-3xl font-bold font-serif text-red-600 dark:text-red-400">
                      {stroke.symbol}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-900 dark:text-stone-50">
                        Nét {stroke.nameVi} ({stroke.nameZh})
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-400 font-semibold">
                        {stroke.pinyin}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {stroke.description}
                  </p>
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5">
                    <span className="text-3xs font-semibold text-stone-400">Chữ tiêu biểu:</span>
                    {stroke.examples.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => speechController.speakWord(ex)}
                        className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-serif font-bold hover:bg-red-100 hover:text-red-600 transition cursor-pointer"
                        title="Nghe phát âm"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
