/** @format */

export type GuessLetterStatus = 'correct' | 'included' | 'not-included';

export type GuessLetter = {
    letter: string;
    status: GuessLetterStatus;
};

export type Guess = {
    word: string;
    letters: GuessLetter[];
};
