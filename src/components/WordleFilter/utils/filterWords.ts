/** @format */

import { Guess } from '../types';

export default function filterWords(
    allWords: string[],
    guesses: Guess[],
): string[] {
    let words = [...allWords];

    guesses.forEach(({ letters }) => {
        words = words.filter(word => {
            let filterResult = true;

            let unprocessedLetters = word.split('').map((letter, index) => ({
                letter,
                index,
            }));

            letters.forEach((guessLetter, guessLetterIndex) => {
                if (filterResult && guessLetter.status === 'correct') {
                    if (word.charAt(guessLetterIndex) !== guessLetter.letter) {
                        filterResult = false;
                        return;
                    } else {
                        unprocessedLetters = unprocessedLetters.filter(
                            letter => letter.index !== guessLetterIndex,
                        );
                    }
                }
            });

            letters.forEach((guessLetter, guessLetterIndex) => {
                if (filterResult && guessLetter.status === 'included') {
                    if (word.charAt(guessLetterIndex) === guessLetter.letter) {
                        filterResult = false;
                        return;
                    }

                    const found = unprocessedLetters.find(
                        letter => letter.letter === guessLetter.letter,
                    );

                    if (found === undefined) {
                        filterResult = false;
                        return;
                    } else {
                        unprocessedLetters = unprocessedLetters.filter(
                            letter => letter.index !== found.index,
                        );
                    }
                }
            });

            letters.forEach((guessLetter, guessLetterIndex) => {
                if (filterResult && guessLetter.status === 'not-included') {
                    if (word.charAt(guessLetterIndex) === guessLetter.letter) {
                        filterResult = false;
                        return;
                    }

                    const found = unprocessedLetters.some(
                        letter => letter.letter === guessLetter.letter,
                    );

                    if (found) {
                        filterResult = false;
                        return;
                    }
                }
            });

            return filterResult;
        });
    });

    return words;
}
