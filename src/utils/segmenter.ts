import { CHAR_DB, DICTIONARY, extractTone } from '../data/chineseDictionary';
import { SegmentedSentence, SegmentedWord } from '../types';

const PUNCTUATION_REGEX = /[，。！？、；：“”‘’（）《》【】…—\s,.!?;:'"()\[\]]/;

// Check if a character is Chinese (CJK Unified Ideographs)
export function isChineseChar(char: string): boolean {
  return /[\u4e00-\u9fa5]/.test(char);
}

// Get fallback pinyin and HanViet for a single Chinese character
export function getCharInfo(char: string): { pinyin: string; hanViet: string; meaningVi: string; radical?: string; strokes?: number; hsk?: number } {
  if (CHAR_DB[char]) {
    return CHAR_DB[char];
  }
  // If not in DB, provide clean placeholder
  return {
    pinyin: '',
    hanViet: '',
    meaningVi: 'Hán tự giản thể',
    hsk: 3
  };
}

// Tokenize a sentence into SegmentedWords using Forward Maximum Matching (FMM)
export function segmentText(sentenceText: string): SegmentedWord[] {
  const words: SegmentedWord[] = [];
  let i = 0;
  const maxWordLen = 6; // Chinese words rarely exceed 6 characters

  while (i < sentenceText.length) {
    const char = sentenceText[i];

    // Handle punctuation and whitespace
    if (PUNCTUATION_REGEX.test(char)) {
      words.push({
        text: char,
        pinyin: '',
        hanViet: '',
        tone: 0,
        isPunctuation: true
      });
      i++;
      continue;
    }

    // Try longest matching compound word
    let matched = false;
    for (let len = Math.min(maxWordLen, sentenceText.length - i); len >= 2; len--) {
      const candidate = sentenceText.substring(i, i + len);
      if (DICTIONARY[candidate]) {
        const entry = DICTIONARY[candidate];
        words.push({
          text: candidate,
          pinyin: entry.pinyin,
          hanViet: entry.hanViet,
          tone: extractTone(entry.pinyin),
          hsk: entry.hsk,
          meaningVi: entry.meaningVi,
          meaningEn: entry.meaningEn,
          isPunctuation: false,
          radical: entry.radical,
          strokes: entry.strokes
        });
        i += len;
        matched = true;
        break;
      }
    }

    if (matched) continue;

    // Single character lookup
    const singleChar = sentenceText[i];
    const info = getCharInfo(singleChar);
    words.push({
      text: singleChar,
      pinyin: info.pinyin,
      hanViet: info.hanViet,
      tone: extractTone(info.pinyin),
      hsk: info.hsk,
      meaningVi: info.meaningVi,
      isPunctuation: !isChineseChar(singleChar),
      radical: info.radical,
      strokes: info.strokes
    });
    i++;
  }

  return words;
}

// Split full text into sentences
export function parseFullTextToSentences(rawText: string, translationParagraphs?: string[]): SegmentedSentence[] {
  // Split raw text into natural sentences
  const sentenceRegex = /([^。！？\n]+[。！？]?|\n+)/g;
  const rawMatches = rawText.match(sentenceRegex) || [rawText];
  const sentences: SegmentedSentence[] = [];

  let sentenceIdx = 0;
  for (const part of rawMatches) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const words = segmentText(trimmed);
    const fullPinyin = words.map(w => w.pinyin).filter(Boolean).join(' ');
    const fullHanViet = words.map(w => w.hanViet).filter(Boolean).join(' ');
    
    // Matched translation if available
    const translation = translationParagraphs && translationParagraphs[sentenceIdx]
      ? translationParagraphs[sentenceIdx]
      : '';

    sentences.push({
      id: `s-${sentenceIdx + 1}`,
      textZh: trimmed,
      pinyin: fullPinyin,
      hanViet: fullHanViet,
      translationVi: translation,
      words
    });
    sentenceIdx++;
  }

  return sentences;
}
