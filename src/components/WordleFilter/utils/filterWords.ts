/** @format */

import { Guess } from '../types';

function eliminateCorrect(
    words: string[],
    letter: string,
    index: number,
): string[] {
    return words.filter(word => word.charAt(index) === letter);
}

function eliminateIncluded(
    words: string[],
    letter: string,
    index: number,
): string[] {
    return words.filter(
        word => word.charAt(index) !== letter && word.includes(letter),
    );
}

function eliminateNotIncluded(words: string[], letter: string): string[] {
    return words.filter(word => !word.includes(letter));
}

export default function filterWords(
    allWords: string[],
    guesses: Guess[],
): string[] {
    let words = [...allWords];
    const guessLetters = guesses.flatMap(guess =>
        guess.letters.map((guessLetter, index) => ({
            guessLetter,
            index,
        })),
    );

    guessLetters.forEach(({ guessLetter, index }) => {
        if (guessLetter.letter === '_') return;

        if (guessLetter.status === 'correct') {
            words = eliminateCorrect(words, guessLetter.letter, index);
        } else if (guessLetter.status === 'included') {
            words = eliminateIncluded(words, guessLetter.letter, index);
        } else if (guessLetter.status === 'not-included') {
            words = eliminateNotIncluded(words, guessLetter.letter);
        }
    });

    return words;
}
