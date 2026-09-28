import React, { useState } from 'react';
import { BookOpen, Sparkles, X } from 'lucide-react';
import { ReadingItem } from '../types';
import { parseFullTextToSentences } from '../utils/segmenter';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveReading: (reading: ReadingItem) => void;
}

const SAMPLE_TEXTS = [
  {
    title: '学无止境 (Học vô chỉ cảnh)',
    text: `学习就像逆水行舟，不进则退。
每个人都应该保持终身学习的态度。
不管我们年龄多大，只要心中有梦想，每天都可以掌握新的知识。
知识会照亮我们前行的道路。`
  },
  {
    title: '喝一杯清茶 (Thưởng một chén trà thanh)',
    text: `忙碌了一整天，坐下来喝一杯热茶。
茶香袅袅，让人忘却身边的烦恼。
生活就像一杯茶，刚入口也许微苦，但细细品味后，总会留下悠长的甘甜。`
  },
  {
    title: '早晨的阳光 (Ánh nắng ban mai)',
    text: `早晨打开窗户，温暖的阳光洒在书桌上。
小鸟在树枝上欢快地歌唱，微风送来花草的清香。
新的一天开始了，愿你今天心情愉快，充满力量！`
  }
];

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  onSaveReading
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [hskLevel, setHskLevel] = useState<number>(2);

  if (!isOpen) return null;

  const handleInsertSample = (sample: { title: string; text: string }) => {
    setTitle(sample.title);
    setContent(sample.text);
    setSummary('Văn bản tiếng Trung tự nhập');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const finalTitle = title.trim() || 'Bài đọc tự nhập';
    const sentences = parseFullTextToSentences(content.trim());

    const newReading: ReadingItem = {
      id: `custom-${Date.now()}`,
      titleZh: finalTitle,
      titlePinyin: '',
      titleVi: 'Bài đọc cá nhân tự nhập',
      category: 'custom',
      hskLevel: hskLevel,
      summaryVi: summary.trim() || 'Văn bản tiếng Trung giản thể do bạn dán hoặc tự nhập vào ứng dụng.',
      contentZh: content.trim(),
      sentences,
      isCustom: true,
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    onSaveReading(newReading);
    setTitle('');
    setContent('');
    setSummary('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-50/80 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                Thêm bài đọc tiếng Trung mới (Offline)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Dán bất kỳ đoạn văn nào — Hệ thống tự tạo Pinyin và phân tách từ vựng
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Quick Sample Inserts */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Dán nhanh đoạn văn mẫu thử nghiệm:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TEXTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsertSample(sample)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition cursor-pointer"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Tiêu đề bài viết (Chữ Hán hoặc Tiếng Việt)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: 我的日记 (Nhật ký của tôi)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/30 focus:border-red-500 text-sm"
            />
          </div>

          {/* HSK Level estimated */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Cấp độ ước lượng
              </label>
              <select
                value={hskLevel}
                onChange={(e) => setHskLevel(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500/30"
              >
                <option value={1}>HSK 1 (Cơ bản)</option>
                <option value={2}>HSK 2 (Sơ cấp)</option>
                <option value={3}>HSK 3 (Trung cấp sơ)</option>
                <option value={4}>HSK 4 (Trung cấp)</option>
                <option value={5}>HSK 5 (Cao cấp)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Ghi chú / Tóm tắt ngắn (Tùy chọn)
              </label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Ghi chú về bài đọc..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 text-sm"
              />
            </div>
          </div>

          {/* Chinese Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Nội dung tiếng Trung giản thể <span className="text-red-500">*</span>
              </label>
              <span className="text-3xs text-stone-400">
                Hỗ trợ dấu câu tiếng Trung (，。！？)
              </span>
            </div>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dán bài đọc tiếng Trung vào đây... Ví dụ: 今天是个晴朗的日子，我来到图书馆看书。"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/30 focus:border-red-500 text-base font-serif leading-relaxed"
            />
          </div>

          {/* Offline info notice */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            💡 <strong>Hoạt động 100% Offline:</strong> Bài đọc được phân tích và lưu trực tiếp trong bộ nhớ thiết bị của bạn. Khi không có mạng, bạn vẫn có thể đọc, tra từ và nghe phát âm bình thường.
          </div>

          {/* Footer Submit */}
          <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition cursor-pointer shadow-sm active:scale-95"
            >
              Lưu & Bắt đầu đọc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
