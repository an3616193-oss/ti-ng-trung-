import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  BrainCircuit, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  RotateCw, 
  Search, 
  Trash2, 
  Volume2, 
  X 
} from 'lucide-react';
import { VocabularyWord } from '../types';
import { speechController } from '../utils/speech';

interface VocabularyNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedWords: VocabularyWord[];
  onRemoveWord: (id: string) => void;
  onToggleMastered: (id: string) => void;
  onImportWords: (words: VocabularyWord[]) => void;
}

export const VocabularyNotebookModal: React.FC<VocabularyNotebookModalProps> = ({
  isOpen,
  onClose,
  savedWords,
  onRemoveWord,
  onToggleMastered,
  onImportWords
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'flashcards' | 'quiz'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [hskFilter, setHskFilter] = useState<number | 'all'>('all');

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isOpen) return null;

  // Filtered words
  const filteredWords = savedWords.filter(w => {
    const matchesSearch = 
      w.hanzi.includes(searchQuery) || 
      w.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.meaningVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.hanViet.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesHsk = hskFilter === 'all' || w.hsk === hskFilter;
    return matchesSearch && matchesHsk;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedWords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tu-vung-tieng-trung-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportWords(parsed);
        }
      } catch (err) {
        console.error('Lỗi khi đọc file JSON:', err);
      }
    };
    reader.readAsText(file);
  };

  // Flashcards navigation
  const currentCard = filteredWords[cardIndex] || filteredWords[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex(prev => (prev + 1) % filteredWords.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex(prev => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  // Quiz generation
  const currentQuizWord = filteredWords[quizIndex] || filteredWords[0];
  
  // Generate 4 options for quiz (1 correct, 3 distractors)
  const getQuizOptions = () => {
    if (!currentQuizWord) return [];
    const correct = currentQuizWord.meaningVi;
    const distractors = savedWords
      .filter(w => w.id !== currentQuizWord.id)
      .map(w => w.meaningVi)
      .filter(m => m !== correct);

    // Fill with sample meanings if not enough saved words
    const fallbackDistractors = [
      'Học tập, tiếp thu kiến thức',
      'Bạn bè, bằng hữu thân thiết',
      'Thời tiết hôm nay rất tốt',
      'Đồ đạc, vật dụng cá nhân',
      'Khỏe mạnh, an khang'
    ].filter(m => m !== correct);

    const pool = [...new Set([...distractors, ...fallbackDistractors])].slice(0, 3);
    const options = [correct, ...pool];
    // Deterministic shuffle based on quizIndex
    return options.sort(() => 0.5 - ((quizIndex * 13) % 7) / 7);
  };

  const quizOptions = getQuizOptions();

  const handleAnswerQuiz = (optionIdx: number, optionText: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);

    const isCorrect = optionText === currentQuizWord.meaningVi;
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      if (quizIndex + 1 < Math.min(filteredWords.length, 10)) {
        setQuizIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setQuizFinished(true);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-50/90 dark:bg-stone-800/60 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                Sổ từ vựng & Flashcards Offline
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                  {savedWords.length} từ
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Lưu từ khi đọc, ôn tập thẻ ghi nhớ và làm bài kiểm tra 100% không cần mạng
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

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              Danh sách từ ({filteredWords.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('flashcards');
                setIsFlipped(false);
              }}
              disabled={savedWords.length === 0}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'flashcards'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              Luyện Flashcards
            </button>
            <button
              onClick={() => {
                setActiveTab('quiz');
                resetQuiz();
              }}
              disabled={savedWords.length < 2}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              Kiểm tra Mini-Quiz
            </button>
          </div>

          {/* Backup / Export */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              disabled={savedWords.length === 0}
              className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 disabled:opacity-40 cursor-pointer"
              title="Xuất file JSON sao lưu từ vựng"
            >
              <Download className="w-3 h-3" />
              Xuất
            </button>
            <label className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 cursor-pointer">
              Nhập
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>
        </div>

        {/* Tab 1: Word List */}
        {activeTab === 'list' && (
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo chữ Hán, Pinyin, nghĩa..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                {(['all', 1, 2, 3, 4, 5] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setHskFilter(lvl)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
                      hskFilter === lvl
                        ? 'bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                    }`}
                  >
                    {lvl === 'all' ? 'Tất cả' : `HSK ${lvl}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Word list items */}
            {filteredWords.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <BookmarkCheck className="w-12 h-12 mx-auto stroke-1 mb-2 opacity-50" />
                <p className="text-sm font-medium">Chưa có từ vựng nào được lưu.</p>
                <p className="text-xs mt-1">Khi đọc bài, hãy bấm vào chữ Hán bất kỳ và chọn "Lưu vào Flashcards"!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredWords.map(word => (
                  <div
                    key={word.id}
                    className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
                      word.mastered
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                        : 'bg-white dark:bg-stone-800/70 border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => speechController.speakWord(word.hanzi)}
                        className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center hover:scale-105 transition cursor-pointer"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold font-serif text-stone-900 dark:text-stone-50">
                            {word.hanzi}
                          </span>
                          <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                            {word.pinyin}
                          </span>
                        </div>
                        <div className="text-2xs text-stone-500 dark:text-stone-400 font-medium">
                          Hán Việt: <span className="font-semibold text-stone-700 dark:text-stone-300">{word.hanViet}</span>
                        </div>
                        <div className="text-xs text-stone-700 dark:text-stone-300 line-clamp-1 mt-0.5">
                          {word.meaningVi}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleMastered(word.id)}
                        className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                          word.mastered
                            ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/60'
                            : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                        }`}
                        title={word.mastered ? 'Đã thuộc (Nhấn để hủy)' : 'Đánh dấu đã thuộc'}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveWord(word.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                        title="Xóa từ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Flashcards */}
        {activeTab === 'flashcards' && currentCard && (
          <div className="p-6 flex flex-col items-center justify-center space-y-6 flex-1">
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              Thẻ {cardIndex + 1} / {filteredWords.length}
            </div>

            {/* Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-sm h-64 rounded-3xl p-6 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-850 border-2 border-stone-200 dark:border-stone-700 shadow-xl flex flex-col items-center justify-center text-center cursor-pointer select-none transition-transform hover:scale-[1.02] active:scale-95 relative"
            >
              {!isFlipped ? (
                // Front Side: Hanzi
                <div className="space-y-4">
                  <span className="text-6xl font-bold font-serif text-stone-900 dark:text-stone-50">
                    {currentCard.hanzi}
                  </span>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 dark:text-stone-500">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Chạm để lật xem Pinyin & Nghĩa</span>
                  </div>
                </div>
              ) : (
                // Back Side: Pinyin, HanViet, Meaning
                <div className="space-y-2 animate-in fade-in zoom-in-95">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {currentCard.pinyin}
                  </div>
                  <div className="text-xs font-bold text-stone-500 dark:text-stone-400">
                    Hán Việt: {currentCard.hanViet}
                  </div>
                  <div className="text-base font-semibold text-stone-800 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-700">
                    {currentCard.meaningVi}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speechController.speakWord(currentCard.hanzi);
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-200 transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Nghe phát âm
                  </button>
                </div>
              )}
            </div>

            {/* Navigation and status buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevCard}
                className="p-3 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => onToggleMastered(currentCard.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  currentCard.mastered
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
                }`}
              >
                <Check className="w-4 h-4" />
                {currentCard.mastered ? 'Đã thuộc từ này' : 'Đánh dấu đã thuộc'}
              </button>
              <button
                onClick={handleNextCard}
                className="p-3 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Mini-Quiz */}
        {activeTab === 'quiz' && (
          <div className="p-6 flex flex-col items-center justify-center space-y-6 flex-1">
            {!quizFinished && currentQuizWord ? (
              <div className="w-full max-w-md space-y-6">
                <div className="flex justify-between items-center text-xs font-semibold text-stone-500">
                  <span>Câu hỏi {quizIndex + 1} / {Math.min(filteredWords.length, 10)}</span>
                  <span>Điểm: {score}</span>
                </div>

                <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-center space-y-2">
                  <div className="text-4xl font-bold font-serif text-stone-900 dark:text-stone-50">
                    {currentQuizWord.hanzi}
                  </div>
                  <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {currentQuizWord.pinyin} ({currentQuizWord.hanViet})
                  </div>
                  <button
                    onClick={() => speechController.speakWord(currentQuizWord.hanzi)}
                    className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-red-600 mt-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Phát âm
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                    Chọn nghĩa tiếng Việt chính xác:
                  </div>
                  {quizOptions.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = opt === currentQuizWord.meaningVi;
                    let btnColor = 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-red-400 text-stone-800 dark:text-stone-200';

                    if (selectedOption !== null) {
                      if (isCorrect) {
                        btnColor = 'bg-emerald-600 text-white border-emerald-600';
                      } else if (isSelected) {
                        btnColor = 'bg-rose-600 text-white border-rose-600';
                      } else {
                        btnColor = 'opacity-40 border-stone-200 dark:border-stone-800';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedOption !== null}
                        onClick={() => handleAnswerQuiz(idx, opt)}
                        className={`w-full p-3.5 rounded-2xl border text-sm font-medium text-left transition cursor-pointer flex items-center justify-between shadow-xs ${btnColor}`}
                      >
                        <span>{opt}</span>
                        {selectedOption !== null && isCorrect && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto text-2xl font-bold">
                  🎉
                </div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-50">
                  Hoàn thành bài kiểm tra!
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  Bạn trả lời đúng <strong className="text-red-600 font-bold">{score}</strong> / {Math.min(filteredWords.length, 10)} câu hỏi.
                </p>
                <button
                  onClick={resetQuiz}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition cursor-pointer"
                >
                  Làm lại lượt mới
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
