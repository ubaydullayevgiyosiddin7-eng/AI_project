// Tasdiqlangan imoralar ro'yxatidan o'zbekcha gap tuzish
import { detectGrammar } from './faceFeatures';

// Imoralar buferi — Translator rejimida ishlatamiz
export class SentenceBuilder {
  constructor() {
    this.tokens = []; // [{ type: 'letter'|'word', value, t, grammar }]
    this.currentWord = '';
    this.lastTokenTime = 0;
    this.wordPauseMs = 1200;
    this.sentencePauseMs = 3000;
  }

  // Tasdiqlangan imora qo'shish
  addSign(value, type = 'letter', grammar = 'statement') {
    const now = Date.now();
    const sincePrev = now - this.lastTokenTime;

    // Avvalgi so'z tugashi
    if (type === 'letter' && sincePrev > this.wordPauseMs && this.currentWord.length > 0) {
      this.flushWord();
    }

    if (type === 'letter') {
      this.currentWord += value;
    } else {
      this.flushWord();
      this.tokens.push({ type: 'word', value, t: now, grammar });
    }

    this.lastTokenTime = now;
  }

  // Joriy so'zni tokenga aylantirish
  flushWord() {
    if (this.currentWord.length > 0) {
      this.tokens.push({
        type: 'word',
        value: this.currentWord,
        t: this.lastTokenTime,
        grammar: 'statement',
      });
      this.currentWord = '';
    }
  }

  // Hozirgi matn — interaktiv ko'rsatish uchun
  preview() {
    const words = this.tokens.map(t => t.value);
    if (this.currentWord) words.push(this.currentWord);
    return words.join(' ');
  }

  // Yakuniy gap — modifikator qo'shilgan
  finalize(currentGrammar = 'statement') {
    this.flushWord();
    if (this.tokens.length === 0) return '';

    let text = this.tokens.map(t => t.value).join(' ');

    // Modifikator
    if (currentGrammar === 'question') {
      text += '?';
    } else if (currentGrammar === 'negation') {
      text = text + ' EMAS';
    } else if (currentGrammar === 'intensity_high') {
      text = 'JUDA ' + text;
    } else {
      text += '.';
    }

    return text;
  }

  // Oxirgi tokenni o'chirish (orqaga tugmasi)
  undo() {
    if (this.currentWord.length > 0) {
      this.currentWord = this.currentWord.slice(0, -1);
      return;
    }
    if (this.tokens.length > 0) this.tokens.pop();
  }

  clear() {
    this.tokens = [];
    this.currentWord = '';
    this.lastTokenTime = 0;
  }

  // Bir so'z yakunlanganmi (oxirgi token bu hozirgi imorani emas, oldingi so'zni)
  isWordComplete() {
    return Date.now() - this.lastTokenTime > this.wordPauseMs && this.currentWord.length > 0;
  }
}
