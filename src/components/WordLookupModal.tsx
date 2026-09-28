import React from 'react';
import { Bookmark, BookmarkCheck, Volume2, X } from 'lucide-react';
import { CHAR_DB } from '../data/chineseDictionary';
import { DictionaryEntry, SegmentedWord, VocabularyWord } from '../types';
import { speechController } from '../utils/speech';

interface WordLookupModalProps {
  word: SegmentedWord | DictionaryEntry | null;
  onClose: () => void;
  savedWords: VocabularyWord[];
  onToggleSaveWord: (word: SegmentedWord | DictionaryEntry) => void;
}

export const WordLookupModal: React.FC<WordLookupModalProps> = ({
  word,
  onClose,
  savedWords,
  onToggleSaveWord
}) => {
  if (!word) return null;

  const hanzi = 'text' in word ? word.text : word.hanzi;
  const isSaved = savedWords.some(w => w.hanzi === hanzi);

  const handlePlayAudio = () => {
    speechController.speakWord(hanzi);
  };

  // Tone color style
  const getToneBadgeClass = (tone: number) => {
    switch (tone) {
      case 1: return 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      case 2: return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 3: return 'bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-900';
      case 4: return 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      default: return 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700';
    }
  };

  const getToneName = (tone: number) => {
    switch (tone) {
      case 1: return 'Thanh 1 (Ngang)';
      case 2: return 'Thanh 2 (Sắc)';
      case 3: return 'Thanh 3 (Hỏi)';
      case 4: return 'Thanh 4 (Huyền)';
      default: return 'Thanh nhẹ';
    }
  };

  const chars = Array.from(hanzi);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="w-full max-w-md rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-stone-50/80 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Tra từ điển tức thì (Offline)
            </span>
            {word.hsk && (
              <span className="rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2 py-0.5 text-2xs font-bold border border-red-200 dark:border-red-900">
                HSK {word.hsk}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main Hanzi & Audio */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 font-serif">
                {hanzi}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xl font-semibold text-red-600 dark:text-red-400">
                  {word.pinyin}
                </span>
                {word.hanViet && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                    Hán Việt: {word.hanViet}
                  </span>
                )}
                {'tone' in word && (
                  <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${getToneBadgeClass(word.tone)}`}>
                    {getToneName(word.tone)}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayAudio}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition active:scale-95 cursor-pointer shadow-xs"
                title="Phát âm giọng đọc chuẩn zh-CN (Offline)"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onToggleSaveWord(word)}
                className={`flex items-center justify-center w-11 h-11 rounded-full transition active:scale-95 cursor-pointer shadow-xs ${
                  isSaved
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
                title={isSaved ? 'Đã lưu trong sổ từ vựng (Nhấn để bỏ lưu)' : 'Lưu vào sổ từ vựng (Flashcards)'}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5 text-amber-600" /> : <Bookmark className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Meaning box */}
          <div className="rounded-xl bg-stone-50 dark:bg-stone-800/40 p-4 border border-stone-100 dark:border-stone-800/80">
            <span className="text-2xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-1">
              Giải nghĩa tiếng Việt
            </span>
            <p className="text-base font-medium text-stone-800 dark:text-stone-200">
              {word.meaningVi || 'Từ vựng tiếng Trung giản thể'}
            </p>
            {word.meaningEn && (
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 italic">
                English: {word.meaningEn}
              </p>
            )}
          </div>

          {/* Radical & Strokes */}
          {(word.radical || word.strokes) && (
            <div className="flex gap-4 text-xs text-stone-600 dark:text-stone-400">
              {word.radical && (
                <div className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800">
                  Bộ thủ: <span className="font-semibold text-stone-900 dark:text-white">{word.radical}</span>
                </div>
              )}
              {word.strokes && (
                <div className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800">
                  Số nét: <span className="font-semibold text-stone-900 dark:text-white">{word.strokes}</span>
                </div>
              )}
            </div>
          )}

          {/* Character Breakdown if multi-character */}
          {chars.length > 1 && (
            <div className="space-y-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                Phân tích từng chữ đơn cấu thành
              </span>
              <div className="grid grid-cols-2 gap-2">
                {chars.map((ch, idx) => {
                  const chInfo = CHAR_DB[ch];
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 flex items-center gap-3"
                    >
                      <button
                        onClick={() => speechController.speakWord(ch)}
                        className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                        title="Nghe phát âm chữ này"
                      >
                        {ch}
                      </button>
                      <div className="text-xs">
                        <div className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                          {chInfo?.pinyin || ''}
                          {chInfo?.hanViet && (
                            <span className="text-3xs text-stone-500 font-normal">({chInfo.hanViet})</span>
                          )}
                        </div>
                        <div className="text-stone-600 dark:text-stone-400 text-3xs line-clamp-1">
                          {chInfo?.meaningVi || 'Hán tự'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Examples */}
          {'examples' in word && word.examples && word.examples.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <span className="text-2xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block">
                Câu ví dụ mẫu
              </span>
              <div className="space-y-2">
                {word.examples.map((ex, i) => (
                  <div key={i} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 dark:text-stone-100 font-serif text-sm">
                        {ex.zh}
                      </span>
                      <button
                        onClick={() => speechController.speakWord(ex.zh)}
                        className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-red-600 dark:text-red-400 text-2xs mt-0.5">
                      {ex.pinyin}
                    </div>
                    <div className="text-stone-600 dark:text-stone-400 mt-1">
                      {ex.vi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
          <button
            onClick={() => onToggleSaveWord(word)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              isSaved
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-600'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-600" />
                <span>Đã lưu vào sổ từ vựng</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Lưu vào Flashcards</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
