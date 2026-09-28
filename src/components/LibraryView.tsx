import React, { useState } from 'react';
import { 
  Bookmark, 
  BookOpen, 
  CheckCircle2, 
  Compass, 
  Flame, 
  Layers, 
  Plus, 
  Search, 
  Sparkles, 
  Trash2, 
  Volume2, 
  WifiOff 
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { ReadingItem } from '../types';
import { speechController } from '../utils/speech';

interface LibraryViewProps {
  readings: ReadingItem[];
  onSelectReading: (reading: ReadingItem) => void;
  onOpenCustomModal: () => void;
  onOpenNotebook: () => void;
  onOpenRadicals: () => void;
  onDeleteCustomReading: (id: string) => void;
  savedWordsCount: number;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  readings,
  onSelectReading,
  onOpenCustomModal,
  onOpenNotebook,
  onOpenRadicals,
  onDeleteCustomReading,
  savedWordsCount
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Tất cả bài đọc' },
    { id: 'hsk1', label: 'HSK 1' },
    { id: 'hsk2', label: 'HSK 2' },
    { id: 'hsk3', label: 'HSK 3' },
    { id: 'hsk4', label: 'HSK 4' },
    { id: 'chengyu', label: 'Thành ngữ ngụ ngôn' },
    { id: 'poem', label: 'Thơ Đường' },
    { id: 'dialogue', label: 'Hội thoại đời sống' },
    { id: 'custom', label: 'Bài đọc của tôi' },
  ];

  const filteredReadings = readings.filter(item => {
    const matchesCategory = 
      activeCategory === 'all' 
        ? true 
        : activeCategory === 'custom' 
          ? item.isCustom 
          : item.category === activeCategory;

    const matchesSearch = 
      item.titleZh.includes(searchQuery) ||
      item.titlePinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summaryVi.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col">
      {/* Top Banner / Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-700 to-red-500 text-white flex items-center justify-center text-xl font-bold font-serif shadow-sm shadow-red-500/20">
              读
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-50">
                  Đọc Tiếng Trung
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-3xs font-bold border border-emerald-200 dark:border-emerald-800">
                  <WifiOff className="w-3 h-3" />
                  100% Offline
                </span>
              </div>
              <p className="text-2xs text-stone-500 dark:text-stone-400">
                Luyện đọc chữ Hán giản thể, Pinyin & âm Hán Việt
              </p>
            </div>
          </div>

          {/* Quick Nav Tools */}
          <div className="flex items-center gap-2">
            <PWAInstallButton />

            <button
              onClick={onOpenRadicals}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold transition cursor-pointer text-stone-700 dark:text-stone-300"
            >
              <Layers className="w-3.5 h-3.5 text-red-600" />
              <span>Bộ thủ & Nét chữ</span>
            </button>

            <button
              onClick={onOpenNotebook}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300/40 text-xs font-semibold transition cursor-pointer"
              title="Sổ từ vựng và Flashcards ôn tập"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Sổ từ</span>
              {savedWordsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-3xs font-bold">
                  {savedWordsCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenCustomModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dán bài mới</span>
              <span className="sm:hidden">Thêm</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-red-950 text-white p-6 sm:p-8 shadow-xl">
          <div className="absolute right-6 -bottom-6 text-9xl font-serif text-white/5 select-none pointer-events-none font-bold">
            读书
          </div>

          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-red-200 text-xs font-medium backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ứng dụng đọc tiếng Trung giản thể độc lập</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
              Đọc sách mọi lúc, mọi nơi — <br className="hidden sm:inline" />
              <span className="text-red-400">Không cần kết nối mạng</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Trang bị sẵn từ điển Hán-Việt 100% offline, phiên âm Pinyin kèm thanh điệu màu sắc, giọng đọc phát âm chuẩn tiếng phổ thông, tra cứu tức thì khi nhấp vào chữ và sổ thẻ ghi nhớ Flashcards ôn tập.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenCustomModal}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Dán văn bản tiếng Trung của bạn
              </button>
              <button
                onClick={onOpenRadicals}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition flex items-center gap-2 border border-white/15 cursor-pointer md:hidden"
              >
                <Layers className="w-4 h-4" />
                Tra cứu bộ thủ & nét viết
              </button>
            </div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài đọc theo tiêu đề, pinyin, nội dung..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Total count badge */}
            <div className="text-xs text-stone-500 font-medium">
              Hiển thị <span className="font-bold text-stone-900 dark:text-stone-100">{filteredReadings.length}</span> bài đọc
            </div>
          </div>

          {/* Categories Pill List */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Readings Card Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReadings.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectReading(item)}
              className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md hover:border-red-400/60 dark:hover:border-red-500/50 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                {/* Header Tag & Delete custom */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                    HSK {item.hskLevel}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speechController.speakWord(item.titleZh);
                      }}
                      className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
                      title="Nghe phát âm tiêu đề"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    {item.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Bạn có chắc muốn xóa bài đọc này?')) {
                            onDeleteCustomReading(item.id);
                          }
                        }}
                        className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                        title="Xóa bài đọc này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title Zh */}
                <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-50 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                  {item.titleZh}
                </h3>

                {/* Pinyin */}
                {item.titlePinyin && (
                  <div className="text-xs font-semibold text-red-600/90 dark:text-red-400/90 mt-0.5 line-clamp-1">
                    {item.titlePinyin}
                  </div>
                )}

                {/* Title Vi */}
                <div className="text-xs font-medium text-stone-700 dark:text-stone-300 mt-1 line-clamp-1">
                  {item.titleVi}
                </div>

                {/* Summary */}
                <p className="mt-2.5 text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {item.summaryVi}
                </p>
              </div>

              {/* Card Footer info */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-2xs text-stone-400">
                <span>{item.sentences.length} câu • {item.contentZh.length} chữ</span>
                <span className="font-semibold text-red-600 dark:text-red-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Bắt đầu đọc →
                </span>
              </div>
            </article>
          ))}
        </section>

        {filteredReadings.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <BookOpen className="w-12 h-12 mx-auto stroke-1 text-stone-400 mb-3" />
            <h4 className="text-base font-bold text-stone-800 dark:text-stone-200">
              Không tìm thấy bài đọc phù hợp
            </h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Hãy thử tìm với từ khóa khác hoặc bấm nút "Dán bài mới" để tự tạo bài đọc của riêng bạn.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-red-600">读</span>
            <span>Ứng dụng đọc tiếng Trung giản thể offline • Không cần internet</span>
          </div>
          <div className="flex items-center gap-4 text-2xs">
            <span>Tra cứu Hán Việt</span>
            <span>•</span>
            <span>Bính âm Pinyin</span>
            <span>•</span>
            <span>Phát âm zh-CN Offline</span>
            <span>•</span>
            <span>Sổ thẻ Flashcards</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
