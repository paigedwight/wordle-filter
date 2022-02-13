/** @format */

import { Guess } from '../types';

// function eliminateCorrect(
//     words: string[],
//     letter: string,
//     index: number,
// ): string[] {
//     return words.filter(word => word.charAt(index) === letter);
// }

// function eliminateIncluded(
//     words: string[],
//     letter: string,
//     index: number,
// ): string[] {
//     return words.filter(
//         word => word.charAt(index) !== letter && word.includes(letter),
//     );
// }

// function eliminateNotIncluded(words: string[], letter: string): string[] {
//     return words.filter(word => !word.includes(letter));
// }

export default function filterWords(
    allWords: string[],
    guesses: Guess[],
): string[] {
    let words = [...allWords];

    guesses.forEach(guess => {
        words = words.filter(word => {
            let filterResult = true;

            let unprocessedLetters = word.split('').map((letter, index) => ({
                letter,
                index,
            }));

            guess.letters.forEach((guessLetter, guessLetterIndex) => {
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

            guess.letters.forEach((guessLetter, guessLetterIndex) => {
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

            guess.letters.forEach((guessLetter, guessLetterIndex) => {
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
