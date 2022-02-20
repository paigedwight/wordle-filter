/** @format */

import { Guess, GuessLetter } from '../types';

function checkCorrect(letters: GuessLetter[], word: string): boolean {
    return letters.reduce(
        (acc: boolean, { letter, status }, index) =>
            acc && (status !== 'correct' || word.charAt(index) === letter),
        true,
    );
}

function countLetters(dict: any, letter: string) {
    dict[letter] = dict[letter] !== undefined ? dict[letter] + 1 : 1;
    return dict;
}

function letterIsCharAt(word: string, status: string) {
    return (letter: GuessLetter, at: number) =>
        word.charAt(at) === letter.letter && letter.status === status;
}

function checkIncluded(letters: GuessLetter[], candidate: string): boolean {
    if (letters.some(letterIsCharAt(candidate, 'included'))) return false;

    const guessCounts = letters
        .filter(({ status }) => status !== 'not-included')
        .map(({ letter }) => letter)
        .reduce(countLetters, {});

    const candCounts = candidate.split('').reduce(countLetters, {});

    return Object.keys(guessCounts).reduce(
        (acc: boolean, cur) =>
            acc && guessCounts[cur] <= (candCounts[cur] || 0),
        true,
    );
}

function checkNotIncluded(letters: GuessLetter[], candidate: string): boolean {
    if (letters.some(letterIsCharAt(candidate, 'not-included'))) return false;

    const guessCounts = letters
        .filter(letter => letter.status !== 'not-included')
        .map(({ letter }) => letter)
        .reduce(countLetters, {});

    const candCounts = candidate.split('').reduce(countLetters, {});

    const remainingLetters = Object.keys(candCounts).reduce(
        (acc: string[], l) => {
            if (candCounts[l] - (guessCounts[l] || 0) > 0 && !acc.includes(l)) {
                acc.push(l);
            }
            return acc;
        },
        [],
    );

    const intersection = letters
        .filter(letter => letter.status === 'not-included')
        .map(({ letter }) => letter)
        .reduce((a: string[], l: string) => (a.includes(l) ? a : [...a, l]), [])
        .filter((letter: string) => remainingLetters.includes(letter));

    return intersection.length === 0;
}

export default function filterWords(
    allWords: string[],
    guesses: Guess[],
): string[] {
    return guesses.reduce(
        (acc: string[], { letters }) =>
            letters.length > 0
                ? acc.filter(
                      candidate =>
                          checkCorrect(letters, candidate) &&
                          checkIncluded(letters, candidate) &&
                          checkNotIncluded(letters, candidate),
                  )
                : acc,
        allWords,
    );
}
