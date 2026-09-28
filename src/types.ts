export interface SegmentedWord {
  text: string;
  pinyin: string;
  hanViet: string;
  tone: number; // 0 (neutral), 1, 2, 3, 4
  hsk?: number;
  meaningVi?: string;
  meaningEn?: string;
  isPunctuation: boolean;
  radical?: string;
  strokes?: number;
}

export interface SegmentedSentence {
  id: string;
  textZh: string;
  pinyin: string;
  hanViet: string;
  translationVi: string;
  words: SegmentedWord[];
}

export interface ReadingItem {
  id: string;
  titleZh: string;
  titlePinyin: string;
  titleVi: string;
  category: 'hsk1' | 'hsk2' | 'hsk3' | 'hsk4' | 'hsk5' | 'chengyu' | 'dialogue' | 'poem' | 'custom';
  hskLevel: number; // 1 - 6
  summaryVi: string;
  contentZh: string;
  sentences: SegmentedSentence[];
  vocabulary?: {
    word: string;
    pinyin: string;
    hanViet: string;
    meaningVi: string;
    hsk?: number;
  }[];
  isCustom?: boolean;
  isFavorite?: boolean;
  createdAt?: string;
}

export interface DictionaryEntry {
  hanzi: string;
  pinyin: string;
  tones?: number[];
  hanViet: string;
  meaningVi: string;
  meaningEn?: string;
  hsk?: number;
  radical?: string;
  strokes?: number;
  components?: string[];
  examples?: {
    zh: string;
    pinyin: string;
    vi: string;
  }[];
}

export interface VocabularyWord {
  id: string;
  hanzi: string;
  pinyin: string;
  hanViet: string;
  meaningVi: string;
  hsk?: number;
  addedAt: number;
  reviewCount: number;
  mastered: boolean;
  sourceTextTitle?: string;
}

export type PinyinDisplayMode = 'ruby' | 'hanviet' | 'both' | 'hidden';
export type ReadingTheme = 'paper' | 'light' | 'dark' | 'green';
export type ChineseFontFamily = 'sans' | 'serif' | 'kaiti';

export interface ReadingSettings {
  pinyinMode: PinyinDisplayMode;
  toneColors: boolean;
  fontSize: number; // 18 - 36
  fontFamily: ChineseFontFamily;
  theme: ReadingTheme;
  speechRate: number; // 0.6 - 1.25
  lineSpacing: 'normal' | 'relaxed' | 'loose';
  showSentenceTranslation: boolean;
  autoScroll: boolean;
  focusSentenceMode: boolean;
}
