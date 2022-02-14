/** @format */

import { range } from 'lodash';
import { Guess, GuessLetter } from '../types';

function checkCorrect(letters: GuessLetter[], word: string): boolean {
    const pattern = range(5).reduce((acc, cur) => {
        if (letters[cur] === undefined) {
            return acc + '[a-z]';
        } else {
            const { letter, status } = letters[cur];
            return acc + (status === 'correct' ? letter : '[a-z]');
        }
    }, '');
    const regex = new RegExp('^' + pattern + '$');
    return regex.test(word);
}

function countLetters(dict: any, letter: string) {
    return {
        ...dict,
        [letter]: (dict[letter] || 0) + 1,
    };
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
        (acc: string[], key) =>
            candCounts[key] - (guessCounts[key] || 0) > 0 && !acc.includes(key)
                ? [...acc, key]
                : acc,
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
