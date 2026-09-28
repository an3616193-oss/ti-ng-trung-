import React, { useEffect, useRef, useState } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  Languages, 
  Maximize2, 
  Minimize2, 
  Palette, 
  Pause, 
  Play, 
  Settings2, 
  Sliders, 
  Square, 
  Type, 
  Volume2 
} from 'lucide-react';
import { 
  ChineseFontFamily, 
  PinyinDisplayMode, 
  ReadingItem, 
  ReadingSettings, 
  ReadingTheme, 
  SegmentedWord 
} from '../types';
import { speechController } from '../utils/speech';

interface ReaderViewProps {
  reading: ReadingItem;
  onBack: () => void;
  onSelectWord: (word: SegmentedWord) => void;
  savedWordsCount: number;
  onOpenNotebook: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  reading,
  onBack,
  onSelectWord,
  savedWordsCount,
  onOpenNotebook
}) => {
  // Reading settings
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    const saved = localStorage.getItem('zh_reader_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      pinyinMode: 'ruby',
      toneColors: true,
      fontSize: 24,
      fontFamily: 'serif',
      theme: 'paper',
      speechRate: 1.0,
      lineSpacing: 'relaxed',
      showSentenceTranslation: true,
      autoScroll: true,
      focusSentenceMode: false
    };
  });

  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [currentPlayingSentenceIdx, setCurrentPlayingSentenceIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sentenceRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Save settings to LocalStorage
  useEffect(() => {
    localStorage.setItem('zh_reader_settings', JSON.stringify(settings));
  }, [settings]);

  // Clean speech on unmount
  useEffect(() => {
    return () => {
      speechController.stop();
    };
  }, []);

  // Update speech speed
  useEffect(() => {
    speechController.setRate(settings.speechRate);
  }, [settings.speechRate]);

  // Handle Play Full Text
  const handlePlayAll = () => {
    if (isPlaying && isPaused) {
      speechController.resume();
      setIsPaused(false);
      return;
    }

    if (isPlaying) {
      speechController.pause();
      setIsPaused(true);
      return;
    }

    const sentencesToSpeak = reading.sentences.map(s => s.textZh);
    setIsPlaying(true);
    setIsPaused(false);

    speechController.playSentences(
      sentencesToSpeak,
      currentPlayingSentenceIdx || 0,
      (index) => {
        setCurrentPlayingSentenceIdx(index);
        if (settings.autoScroll && sentenceRefs.current[index]) {
          sentenceRefs.current[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      },
      () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentPlayingSentenceIdx(null);
      }
    );
  };

  const handleStopSpeech = () => {
    speechController.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPlayingSentenceIdx(null);
  };

  const handlePlaySingleSentence = (idx: number) => {
    setCurrentPlayingSentenceIdx(idx);
    const sentencesToSpeak = reading.sentences.map(s => s.textZh);
    setIsPlaying(true);
    setIsPaused(false);

    speechController.playSentences(
      sentencesToSpeak,
      idx,
      (index) => {
        setCurrentPlayingSentenceIdx(index);
      },
      () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentPlayingSentenceIdx(null);
      }
    );
  };

  // Tone color styling helper
  const getToneColor = (tone: number): string => {
    if (!settings.toneColors) return '';
    switch (tone) {
      case 1: return 'text-rose-600 dark:text-rose-400';
      case 2: return 'text-emerald-600 dark:text-emerald-400';
      case 3: return 'text-sky-600 dark:text-sky-400';
      case 4: return 'text-amber-600 dark:text-amber-400';
      default: return 'text-stone-500 dark:text-stone-400';
    }
  };

  // Theme styling classes
  const getThemeClasses = (theme: ReadingTheme) => {
    switch (theme) {
      case 'paper':
        return 'bg-[#fcf9f2] text-[#292524] border-[#e7e0d3] dark:bg-[#25221e] dark:text-[#f3ede2]';
      case 'green':
        return 'bg-[#f0f7f2] text-[#1e3427] border-[#d4e7d9] dark:bg-[#1a2920] dark:text-[#e4f3ea]';
      case 'dark':
        return 'bg-[#18181b] text-[#f4f4f5] border-[#27272a]';
      case 'light':
      default:
        return 'bg-white text-stone-900 border-stone-200 dark:bg-stone-900 dark:text-stone-100 dark:border-stone-800';
    }
  };

  // Font family class
  const getFontFamilyClass = (font: ChineseFontFamily) => {
    switch (font) {
      case 'serif': return 'font-serif';
      case 'kaiti': return 'font-serif tracking-wide';
      case 'sans':
      default: return 'font-sans';
    }
  };

  // Line spacing class
  const getLineSpacingClass = (spacing: 'normal' | 'relaxed' | 'loose') => {
    switch (spacing) {
      case 'loose': return 'leading-[2.6]';
      case 'relaxed': return 'leading-[2.2]';
      case 'normal':
      default: return 'leading-[1.8]';
    }
  };

  return (
    <div className={`min-h-screen transition-colors flex flex-col ${getThemeClasses(settings.theme)}`}>
      {/* Top Reading Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-inherit/90 border-b border-inherit px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              handleStopSpeech();
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Thư viện</span>
          </button>

          <div>
            <h1 className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs md:max-w-md font-serif">
              {reading.titleZh}
            </h1>
            <div className="text-2xs opacity-70 truncate">
              {reading.titleVi}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Pinyin Mode Toggle */}
          <div className="hidden sm:flex items-center rounded-xl p-0.5 border border-inherit bg-stone-100/60 dark:bg-stone-800/60 text-xs">
            <button
              onClick={() => setSettings(s => ({ ...s, pinyinMode: 'ruby' }))}
              className={`px-2.5 py-1 rounded-lg font-semibold text-2xs transition cursor-pointer ${
                settings.pinyinMode === 'ruby' ? 'bg-red-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Bính âm (Pinyin)
            </button>
            <button
              onClick={() => setSettings(s => ({ ...s, pinyinMode: 'hanviet' }))}
              className={`px-2.5 py-1 rounded-lg font-semibold text-2xs transition cursor-pointer ${
                settings.pinyinMode === 'hanviet' ? 'bg-red-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Hán Việt
            </button>
            <button
              onClick={() => setSettings(s => ({ ...s, pinyinMode: 'both' }))}
              className={`px-2.5 py-1 rounded-lg font-semibold text-2xs transition cursor-pointer ${
                settings.pinyinMode === 'both' ? 'bg-red-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Cả hai
            </button>
            <button
              onClick={() => setSettings(s => ({ ...s, pinyinMode: 'hidden' }))}
              className={`px-2.5 py-1 rounded-lg font-semibold text-2xs transition cursor-pointer ${
                settings.pinyinMode === 'hidden' ? 'bg-red-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Ẩn âm
            </button>
          </div>

          {/* Quick Voice Play Button */}
          <button
            onClick={handlePlayAll}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            title="Đọc toàn bộ bài viết bằng giọng chuẩn zh-CN (Offline)"
          >
            {isPlaying ? (
              isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isPlaying ? (isPaused ? 'Tiếp tục' : 'Tạm dừng') : 'Đọc bài'}</span>
          </button>

          {/* Settings Drawer Button */}
          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            title="Tùy chỉnh hiển thị đọc bài"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Open Notebook button */}
          <button
            onClick={onOpenNotebook}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer relative"
            title="Mở sổ từ vựng"
          >
            <Bookmark className="w-4 h-4" />
            {savedWordsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-3xs font-bold flex items-center justify-center">
                {savedWordsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Floating Settings Drawer Panel (if opened) */}
      {showSettingsDrawer && (
        <div className="border-b border-inherit bg-inherit p-4 px-6 animate-in slide-in-from-top-4 shadow-md z-30">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Theme selector */}
            <div>
              <label className="font-semibold block mb-2 flex items-center gap-1.5 opacity-80">
                <Palette className="w-3.5 h-3.5 text-red-500" />
                Màu nền đọc sách
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'paper', label: 'Ấm sáp', color: 'bg-[#fcf9f2] text-stone-800 border-[#d4cbba]' },
                  { id: 'green', label: 'Trà xanh', color: 'bg-[#f0f7f2] text-emerald-900 border-[#c2ded0]' },
                  { id: 'light', label: 'Sáng', color: 'bg-white text-stone-800 border-stone-300' },
                  { id: 'dark', label: 'Đêm', color: 'bg-[#18181b] text-stone-100 border-[#27272a]' }
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setSettings(s => ({ ...s, theme: th.id as ReadingTheme }))}
                    className={`py-1.5 rounded-lg border text-center font-medium cursor-pointer transition ${th.color} ${
                      settings.theme === th.id ? 'ring-2 ring-red-500 font-bold' : ''
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold flex items-center gap-1.5 opacity-80">
                  <Type className="w-3.5 h-3.5 text-red-500" />
                  Cỡ chữ Hán
                </label>
                <span className="font-mono font-bold">{settings.fontSize}px</span>
              </div>
              <input
                type="range"
                min="18"
                max="36"
                step="2"
                value={settings.fontSize}
                onChange={(e) => setSettings(s => ({ ...s, fontSize: Number(e.target.value) }))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            {/* Speech Speed */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold flex items-center gap-1.5 opacity-80">
                  <Volume2 className="w-3.5 h-3.5 text-red-500" />
                  Tốc độ phát âm
                </label>
                <span className="font-mono font-bold">{settings.speechRate}x</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[0.6, 0.8, 1.0, 1.25].map(rate => (
                  <button
                    key={rate}
                    onClick={() => setSettings(s => ({ ...s, speechRate: rate }))}
                    className={`py-1 rounded-lg border text-center font-mono cursor-pointer transition ${
                      settings.speechRate === rate
                        ? 'bg-red-600 text-white border-red-600 font-bold'
                        : 'border-inherit hover:bg-stone-500/10'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              <label className="font-semibold block opacity-80 mb-1">
                Tùy chọn khác
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.toneColors}
                  onChange={(e) => setSettings(s => ({ ...s, toneColors: e.target.checked }))}
                  className="rounded accent-red-600"
                />
                <span>Tô màu theo 4 thanh điệu</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.showSentenceTranslation}
                  onChange={(e) => setSettings(s => ({ ...s, showSentenceTranslation: e.target.checked }))}
                  className="rounded accent-red-600"
                />
                <span>Hiện dịch nghĩa tiếng Việt</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Reading Flow Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 sm:px-8 py-8 md:py-12">
        {/* Article Header Card */}
        <div className="mb-10 text-center pb-8 border-b border-inherit">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 mb-3">
            <span>HSK {reading.hskLevel}</span>
            <span>•</span>
            <span className="capitalize">{reading.category}</span>
          </div>

          <h1 
            className={`font-bold font-serif mb-2 tracking-tight ${getFontFamilyClass(settings.fontFamily)}`}
            style={{ fontSize: `${Math.round(settings.fontSize * 1.5)}px` }}
          >
            {reading.titleZh}
          </h1>

          {reading.titlePinyin && (
            <div className="text-sm font-medium text-red-600/90 dark:text-red-400/90 mb-1">
              {reading.titlePinyin}
            </div>
          )}

          <div className="text-base font-medium opacity-80">
            {reading.titleVi}
          </div>

          {reading.summaryVi && (
            <p className="mt-4 text-xs italic opacity-70 max-w-xl mx-auto leading-relaxed">
              💡 {reading.summaryVi}
            </p>
          )}
        </div>

        {/* Sentences & Words */}
        <div className="space-y-6">
          {reading.sentences.map((sentence, sIdx) => {
            const isPlayingThisSentence = currentPlayingSentenceIdx === sIdx;

            return (
              <div
                key={sentence.id}
                ref={el => { sentenceRefs.current[sIdx] = el; }}
                className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 relative group ${
                  isPlayingThisSentence
                    ? 'ring-2 ring-red-500 bg-red-500/10 shadow-md scale-[1.01]'
                    : 'hover:bg-stone-500/5'
                }`}
              >
                {/* Sentence Listen Trigger Icon */}
                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handlePlaySingleSentence(sIdx)}
                    className="p-1.5 rounded-lg bg-inherit border border-inherit hover:text-red-600 transition cursor-pointer shadow-xs"
                    title="Nghe riêng câu này"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sentence Chinese Text with Ruby Annotations */}
                <div 
                  className={`flex flex-wrap items-end gap-x-1 gap-y-3 ${getLineSpacingClass(settings.lineSpacing)} select-text`}
                  style={{ fontSize: `${settings.fontSize}px` }}
                >
                  {sentence.words.map((word, wIdx) => {
                    if (word.isPunctuation) {
                      return (
                        <span key={wIdx} className="opacity-70 px-0.5 select-none font-serif">
                          {word.text}
                        </span>
                      );
                    }

                    // Render interactive word chunk
                    return (
                      <ruby
                        key={wIdx}
                        onClick={() => onSelectWord(word)}
                        className="group/ruby inline-flex flex-col items-center cursor-pointer px-1 py-0.5 rounded-lg transition hover:bg-red-500/20 active:scale-95"
                        title={`Tra từ: ${word.text} - ${word.pinyin} (${word.hanViet})`}
                      >
                        {/* Upper Ruby Annotation: Pinyin or HanViet */}
                        {settings.pinyinMode === 'ruby' && word.pinyin && (
                          <rt className={`text-xs font-semibold leading-tight mb-1 select-none ${getToneColor(word.tone)}`}>
                            {word.pinyin}
                          </rt>
                        )}
                        {settings.pinyinMode === 'hanviet' && word.hanViet && (
                          <rt className="text-3xs font-bold leading-tight mb-1 select-none text-stone-500 dark:text-stone-400">
                            {word.hanViet}
                          </rt>
                        )}
                        {settings.pinyinMode === 'both' && (
                          <rt className="text-3xs font-semibold leading-none mb-1 select-none text-center">
                            <span className={`block text-2xs ${getToneColor(word.tone)}`}>{word.pinyin}</span>
                            <span className="block text-4xs opacity-75">{word.hanViet}</span>
                          </rt>
                        )}

                        {/* Main Character Text */}
                        <span className={`font-serif tracking-normal ${getFontFamilyClass(settings.fontFamily)} ${
                          settings.toneColors ? getToneColor(word.tone) : ''
                        }`}>
                          {word.text}
                        </span>
                      </ruby>
                    );
                  })}
                </div>

                {/* Sentence Vietnamese Translation */}
                {settings.showSentenceTranslation && sentence.translationVi && (
                  <div className="mt-3 pt-2.5 border-t border-inherit/40 text-xs sm:text-sm opacity-85 leading-relaxed flex items-start gap-2">
                    <span className="text-3xs font-bold uppercase tracking-wider text-red-600/80 dark:text-red-400/80 pt-0.5">
                      Dịch:
                    </span>
                    <span>{sentence.translationVi}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* End of article notes */}
        <div className="mt-14 pt-8 border-t border-inherit space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold opacity-90 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-red-600" />
              Từ vựng trọng tâm trong bài
            </h3>
            <span className="text-xs opacity-60">Nhấp vào từ bất kỳ để tra cứu chi tiết</span>
          </div>

          {reading.vocabulary && reading.vocabulary.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reading.vocabulary.map((v, i) => (
                <div
                  key={i}
                  onClick={() => onSelectWord({
                    text: v.word,
                    pinyin: v.pinyin,
                    hanViet: v.hanViet,
                    meaningVi: v.meaningVi,
                    hsk: v.hsk,
                    tone: 0,
                    isPunctuation: false
                  })}
                  className="p-3 rounded-xl border border-inherit bg-inherit/40 hover:bg-inherit hover:border-red-400 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl font-bold font-serif text-stone-900 dark:text-white">
                      {v.word}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-red-600 dark:text-red-400">
                        {v.pinyin} <span className="text-3xs font-normal opacity-75">({v.hanViet})</span>
                      </div>
                      <div className="text-xs opacity-80 line-clamp-1">
                        {v.meaningVi}
                      </div>
                    </div>
                  </div>
                  {v.hsk && (
                    <span className="text-3xs font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                      HSK {v.hsk}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs opacity-70">
              Bạn có thể nhấp trực tiếp vào bất kỳ từ nào trên đoạn văn phía trên để tra cứu từ điển và lưu vào sổ từ vựng.
            </p>
          )}
        </div>
      </main>

      {/* Floating Bottom Audio Player Bar (when playing) */}
      {isPlaying && (
        <div className="sticky bottom-4 mx-auto max-w-lg w-[92%] z-40 rounded-2xl bg-stone-900/95 dark:bg-stone-800/95 text-white backdrop-blur-md p-3.5 shadow-2xl border border-stone-700 flex items-center justify-between animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayAll}
              className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition active:scale-95 cursor-pointer shadow-md"
            >
              {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
            </button>
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate text-stone-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Câu {((currentPlayingSentenceIdx || 0) + 1)} / {reading.sentences.length}
              </div>
              <div className="text-2xs text-stone-400 truncate max-w-[200px]">
                {reading.sentences[currentPlayingSentenceIdx || 0]?.textZh}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const prev = Math.max(0, (currentPlayingSentenceIdx || 0) - 1);
                handlePlaySingleSentence(prev);
              }}
              className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              title="Câu trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const next = Math.min(reading.sentences.length - 1, (currentPlayingSentenceIdx || 0) + 1);
                handlePlaySingleSentence(next);
              }}
              className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              title="Câu kế tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleStopSpeech}
              className="p-2 rounded-lg text-stone-400 hover:text-red-400 transition cursor-pointer"
              title="Dừng phát âm"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
