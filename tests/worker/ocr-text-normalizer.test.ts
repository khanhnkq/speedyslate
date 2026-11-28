import { describe, expect, it } from 'vitest';
import { normalizeOcrForTranslation } from '../../src/worker/ocr-text-normalizer';

describe('normalizeOcrForTranslation', () => {
  it('trims leading stray punctuation artifacts while preserving leading ellipsis', () => {
    expect(normalizeOcrForTranslation('. EVEN IF THIS..')).toBe('Even if this..');
    expect(normalizeOcrForTranslation(', HELLO')).toBe('Hello');
    expect(normalizeOcrForTranslation('; WAIT FOR ME!')).toBe('Wait for me!');
    expect(normalizeOcrForTranslation(': OKAY THEN.')).toBe('Okay then.');
    expect(normalizeOcrForTranslation('...WAIT A SECOND.')).toBe('...Wait a second.');
  });

  it('inserts missing spaces after punctuation without breaking decimals, abbreviations, or URLs', () => {
    expect(normalizeOcrForTranslation('OKAY,SO THAT IS FINE.')).toBe('Okay, so that is fine.');
    expect(normalizeOcrForTranslation('HELLO.HOW ARE YOU?GOOD!')).toBe('Hello. How are you? Good!');
    expect(normalizeOcrForTranslation('WAIT...WHAT?!NO WAY!')).toBe('Wait... What?! No way!');
    expect(normalizeOcrForTranslation('IT COSTS $1,200.50 OR 3.14 PI.')).toBe('It costs $1,200.50 or 3.14 pi.');
    expect(normalizeOcrForTranslation('WE MET IN THE U.S.A. AT 3.5 PM.')).toBe('We met in the U.S.A. at 3.5 pm.');
    expect(normalizeOcrForTranslation('CHECK https://example.com/a.b OR discord.gg/abc NOW.')).toBe(
      'Check https://example.com/a.b or discord.gg/abc now.'
    );
  });

  it('inserts missing spaces between digits and words while preserving ordinals', () => {
    expect(normalizeOcrForTranslation("I'M 22YEARS Old.")).toBe("I'm 22 years old.");
    expect(normalizeOcrForTranslation('WAIT 5MINUTES ON THE 1st AND 22nd FLOOR.')).toBe(
      'Wait 5 minutes on the 1st and 22nd floor.'
    );
    expect(normalizeOcrForTranslation('CHAPTER12 PART2 PS5 MP3 3D TV')).toBe('Chapter 12 part 2 PS5 MP3 3D TV');
  });

  it('repairs glitched ?!!! / PANICPIII punctuation without corrupting valid words', () => {
    expect(normalizeOcrForTranslation('HOW CAN I NOT PANICPIII')).toBe('How can I not panic?!!!');
    expect(normalizeOcrForTranslation('WHAT?III')).toBe('What?!!!');
    expect(normalizeOcrForTranslation('STOP!II')).toBe('Stop!!!');
    expect(normalizeOcrForTranslation('I AM HAPPY.')).toBe('I am happy.');
    expect(normalizeOcrForTranslation('PART III IS OVER.')).toBe('Part iii is over.');
  });

  it('normalizes ALL-CAPS and erratic mixed-case while preserving I contractions and acronyms', () => {
    expect(normalizeOcrForTranslation('MY ARMS ARE STARTING TO HURT. HOW MANY OF THESE Do I haVe to kIll?!')).toBe(
      'My arms are starting to hurt. How many of these do I have to kill?!'
    );
    expect(normalizeOcrForTranslation('IN THAT MOMENT, I wOndERED...')).toBe(
      'In that moment, I wondered...'
    );
    expect(normalizeOcrForTranslation("I'LL FIND SOMEONE THAt I CAn TaLk To!")).toBe(
      "I'll find someone that I can talk to!"
    );
    expect(normalizeOcrForTranslation("I'M, I'VE, I'LL, I'D BE OK WATCHING TV WITH THE CEO PLAYING AN RPG.")).toBe(
      "I'm, I've, I'll, I'd be OK watching TV with the CEO playing an RPG."
    );
    expect(normalizeOcrForTranslation('Do I haVe to kIll?!')).toBe('Do I have to kill?!');
    // Normal mixed-case proper nouns stay intact
    expect(normalizeOcrForTranslation('John went to New York with Alice.')).toBe(
      'John went to New York with Alice.'
    );
    expect(normalizeOcrForTranslation('She went to Paris and I wOndERED why.')).toBe(
      'She went to Paris and I wondered why.'
    );
  });

  it('keeps non-Latin / CJK and empty/punctuation-only text untouched', () => {
    expect(normalizeOcrForTranslation('')).toBe('');
    expect(normalizeOcrForTranslation('   ')).toBe('');
    expect(normalizeOcrForTranslation('...')).toBe('...');
    expect(normalizeOcrForTranslation('?!')).toBe('?!');
    expect(normalizeOcrForTranslation('こんにちは、世界！')).toBe('こんにちは、世界！');
    expect(normalizeOcrForTranslation('안녕하세요, 저는 학생입니다.')).toBe('안녕하세요, 저는 학생입니다.');
    expect(normalizeOcrForTranslation('你好，世界！RPGテスト')).toBe('你好，世界！RPGテスト');
  });
});
