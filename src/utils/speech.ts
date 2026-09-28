// Speech synthesis utility for offline reading (Web Speech API)

class SpeechController {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private isPausedState = false;
  private onEndCallback: (() => void) | null = null;
  private onSentenceChangeCallback: ((index: number) => void) | null = null;
  private playlist: string[] = [];
  private currentIndex = 0;
  private rate = 1.0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return !!this.synth;
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, newRate));
    if (this.isSpeaking() && !this.isPaused()) {
      // Re-trigger current index with new rate if playing
      const cur = this.currentIndex;
      this.stop();
      if (this.playlist.length > 0) {
        this.playSentences(this.playlist, cur, this.onSentenceChangeCallback, this.onEndCallback);
      }
    }
  }

  public getRate(): number {
    return this.rate;
  }

  private getChineseVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    // Prioritize zh-CN simplified voice
    const zhCn = voices.find(v => v.lang === 'zh-CN' || v.lang === 'zh_CN');
    if (zhCn) return zhCn;
    const anyZh = voices.find(v => v.lang.startsWith('zh'));
    if (anyZh) return anyZh;
    return null;
  }

  public speakWord(text: string, customRate?: number) {
    if (!this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = customRate || this.rate;

    const voice = this.getChineseVoice();
    if (voice) {
      utterance.voice = voice;
    }

    this.synth.speak(utterance);
  }

  public playSentences(
    sentences: string[],
    startIndex = 0,
    onSentenceChange?: ((index: number) => void) | null,
    onFinish?: (() => void) | null
  ) {
    if (!this.synth || sentences.length === 0) return;
    this.stop();

    this.playlist = sentences;
    this.currentIndex = Math.max(0, Math.min(startIndex, sentences.length - 1));
    this.onSentenceChangeCallback = onSentenceChange || null;
    this.onEndCallback = onFinish || null;
    this.isSpeakingState = true;
    this.isPausedState = false;

    this.playCurrentSentence();
  }

  private playCurrentSentence() {
    if (!this.synth || this.currentIndex >= this.playlist.length) {
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const textToSpeak = this.playlist[this.currentIndex];
    if (this.onSentenceChangeCallback) {
      this.onSentenceChangeCallback(this.currentIndex);
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'zh-CN';
    utterance.rate = this.rate;

    const voice = this.getChineseVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      if (this.isSpeakingState && !this.isPausedState) {
        this.currentIndex++;
        this.playCurrentSentence();
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error or cancelled:', e);
      this.stop();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      this.isPausedState = true;
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.isPausedState = false;
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeakingState = false;
    this.isPausedState = false;
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public isPaused(): boolean {
    return this.isPausedState;
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }
}

export const speechController = new SpeechController();
