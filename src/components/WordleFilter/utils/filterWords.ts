/** @format */

import { Guess, GuessLetter } from '../types';

function checkCorrect(letters: GuessLetter[], word: string): boolean {
    return letters.reduce(
        (acc: boolean, { letter, status }, index) =>
            acc && (status !== 'correct' || word[index] === letter),
        true,
    );
}

function countLetters(dict: any, letter: string) {
    if (dict[letter] === undefined) {
        dict[letter] = 0;
    }
    dict[letter]++;
    return dict;
}

function checkIncluded(letters: GuessLetter[], candidate: string): boolean {
    const guessCounts = letters
        .filter(({ status }) => status !== 'not-included')
        .reduce((acc: any, { letter }) => countLetters(acc, letter), {});
    const candCounts = candidate.split('').reduce(countLetters, {});

    return Object.keys(guessCounts).reduce(
        (acc: boolean, cur) =>
            acc && guessCounts[cur] <= (candCounts[cur] || 0),
        true,
    );
}

function checkNotIncluded(letters: GuessLetter[], candidate: string): boolean {
    const guessCounts = letters
        .filter(letter => letter.status !== 'not-included')
        .reduce((acc: any, { letter }) => countLetters(acc, letter), {});

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
        .reduce(
            (a: string[], { letter: l }) => (a.includes(l) ? a : [...a, l]),
            [],
        )
        .filter((letter: string) => remainingLetters.includes(letter));

    return intersection.length === 0;
}

export default function filterWords(
    allWords: string[],
    guesses: Guess[],
): string[] {
    let words = [...allWords];

    guesses.forEach(({ letters }) => {
        words = words.filter(
            candidate =>
                checkCorrect(letters, candidate) &&
                checkIncluded(letters, candidate) &&
                checkNotIncluded(letters, candidate),
        );
    });

    return words;
}
