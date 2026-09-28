import React, { useEffect, useState } from 'react';
import { CustomTextModal } from './components/CustomTextModal';
import { LibraryView } from './components/LibraryView';
import { RadicalsModal } from './components/RadicalsModal';
import { ReaderView } from './components/ReaderView';
import { VocabularyNotebookModal } from './components/VocabularyNotebookModal';
import { WordLookupModal } from './components/WordLookupModal';
import { DICTIONARY } from './data/chineseDictionary';
import { getSampleReadings } from './data/sampleReadings';
import { DictionaryEntry, ReadingItem, SegmentedWord, VocabularyWord } from './types';

// Default initial saved vocabulary
const INITIAL_SAVED_WORDS: VocabularyWord[] = [
  { id: 'init-1', hanzi: '你好', pinyin: 'nǐ hǎo', hanViet: 'NHỈ HẢO', meaningVi: 'Xin chào', hsk: 1, addedAt: Date.now() - 300000, reviewCount: 2, mastered: true },
  { id: 'init-2', hanzi: '学习', pinyin: 'xuéxí', hanViet: 'HỌC TẬP', meaningVi: 'Học tập, học hỏi', hsk: 1, addedAt: Date.now() - 250000, reviewCount: 1, mastered: false },
  { id: 'init-3', hanzi: '朋友', pinyin: 'péngyou', hanViet: 'BẰNG HỮU', meaningVi: 'Bạn bè', hsk: 1, addedAt: Date.now() - 200000, reviewCount: 3, mastered: true },
  { id: 'init-4', hanzi: '盲人摸象', pinyin: 'mángrén mō xiàng', hanViet: 'MANH NHÂN MẠC TƯỢNG', meaningVi: 'Thầy bói xem voi (nhìn nhận phiến diện)', hsk: 5, addedAt: Date.now() - 150000, reviewCount: 0, mastered: false },
  { id: 'init-5', hanzi: '方便', pinyin: 'fāngbiàn', hanViet: 'PHƯƠNG TIỆN', meaningVi: 'Thuận tiện, tiện lợi', hsk: 3, addedAt: Date.now() - 100000, reviewCount: 1, mastered: false },
];

export default function App() {
  // Built-in readings & Custom readings
  const [readings, setReadings] = useState<ReadingItem[]>(() => {
    const samples = getSampleReadings();
    const customSaved = localStorage.getItem('zh_custom_readings');
    if (customSaved) {
      try {
        const parsed = JSON.parse(customSaved);
        if (Array.isArray(parsed)) {
          return [...parsed, ...samples];
        }
      } catch (e) {
        console.error('Error loading custom readings:', e);
      }
    }
    return samples;
  });

  // Current view reading item
  const [activeReading, setActiveReading] = useState<ReadingItem | null>(null);

  // Vocabulary Notebook
  const [savedWords, setSavedWords] = useState<VocabularyWord[]>(() => {
    const saved = localStorage.getItem('zh_saved_words');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Error loading saved words:', e);
      }
    }
    return INITIAL_SAVED_WORDS;
  });

  // Modals state
  const [inspectedWord, setInspectedWord] = useState<SegmentedWord | DictionaryEntry | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isRadicalsOpen, setIsRadicalsOpen] = useState(false);

  // Persist saved words
  useEffect(() => {
    localStorage.setItem('zh_saved_words', JSON.stringify(savedWords));
  }, [savedWords]);

  // Persist custom readings
  const saveCustomReadingsToStorage = (allReadings: ReadingItem[]) => {
    const customOnly = allReadings.filter(r => r.isCustom);
    localStorage.setItem('zh_custom_readings', JSON.stringify(customOnly));
  };

  // Toggle save word into Flashcards
  const handleToggleSaveWord = (word: SegmentedWord | DictionaryEntry) => {
    const hanzi = 'text' in word ? word.text : word.hanzi;
    const existingIndex = savedWords.findIndex(w => w.hanzi === hanzi);

    if (existingIndex >= 0) {
      // Remove
      setSavedWords(prev => prev.filter(w => w.hanzi !== hanzi));
    } else {
      // Add
      const pinyin = word.pinyin || '';
      const hanViet = word.hanViet || '';
      const meaningVi = word.meaningVi || 'Từ vựng tiếng Trung giản thể';
      const hsk = word.hsk || ('text' in word && DICTIONARY[word.text]?.hsk) || 1;

      const newWord: VocabularyWord = {
        id: `word-${Date.now()}`,
        hanzi,
        pinyin,
        hanViet,
        meaningVi,
        hsk,
        addedAt: Date.now(),
        reviewCount: 0,
        mastered: false,
        sourceTextTitle: activeReading?.titleZh
      };

      setSavedWords(prev => [newWord, ...prev]);
    }
  };

  // Add custom reading
  const handleSaveCustomReading = (newReading: ReadingItem) => {
    const updated = [newReading, ...readings];
    setReadings(updated);
    saveCustomReadingsToStorage(updated);
    setActiveReading(newReading); // Open immediately
  };

  // Delete custom reading
  const handleDeleteCustomReading = (id: string) => {
    const updated = readings.filter(r => r.id !== id);
    setReadings(updated);
    saveCustomReadingsToStorage(updated);
    if (activeReading?.id === id) {
      setActiveReading(null);
    }
  };

  // Notebook word actions
  const handleRemoveWord = (id: string) => {
    setSavedWords(prev => prev.filter(w => w.id !== id));
  };

  const handleToggleMastered = (id: string) => {
    setSavedWords(prev => prev.map(w => 
      w.id === id ? { ...w, mastered: !w.mastered } : w
    ));
  };

  const handleImportWords = (newWords: VocabularyWord[]) => {
    setSavedWords(prev => {
      const existingHanzis = new Set(prev.map(w => w.hanzi));
      const filtered = newWords.filter(w => !existingHanzis.has(w.hanzi));
      return [...filtered, ...prev];
    });
  };

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 dark:bg-stone-950 dark:text-stone-100 min-h-screen">
      {/* Active Reading Screen or Library View */}
      {activeReading ? (
        <ReaderView
          reading={activeReading}
          onBack={() => setActiveReading(null)}
          onSelectWord={(word) => setInspectedWord(word)}
          savedWordsCount={savedWords.length}
          onOpenNotebook={() => setIsNotebookOpen(true)}
        />
      ) : (
        <LibraryView
          readings={readings}
          onSelectReading={(item) => setActiveReading(item)}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
          onOpenNotebook={() => setIsNotebookOpen(true)}
          onOpenRadicals={() => setIsRadicalsOpen(true)}
          onDeleteCustomReading={handleDeleteCustomReading}
          savedWordsCount={savedWords.length}
        />
      )}

      {/* Word Inspector Modal */}
      <WordLookupModal
        word={inspectedWord}
        onClose={() => setInspectedWord(null)}
        savedWords={savedWords}
        onToggleSaveWord={handleToggleSaveWord}
      />

      {/* Custom Text Importer Modal */}
      <CustomTextModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSaveReading={handleSaveCustomReading}
      />

      {/* Vocabulary Notebook & Flashcards Modal */}
      <VocabularyNotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        savedWords={savedWords}
        onRemoveWord={handleRemoveWord}
        onToggleMastered={handleToggleMastered}
        onImportWords={handleImportWords}
      />

      {/* Radicals & Basic Strokes Modal */}
      <RadicalsModal
        isOpen={isRadicalsOpen}
        onClose={() => setIsRadicalsOpen(false)}
      />
    </div>
  );
}
