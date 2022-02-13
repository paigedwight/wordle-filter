/** @format */

import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Guess, GuessLetter, GuessLetterStatus } from './types';
import wordList from '../../wordle/wordList';
import filterWords from './utils/filterWords';
import { maxGuessLength } from './constants';
import GuessRow from './GuessRow';

function nextStatus(status: GuessLetterStatus): GuessLetterStatus {
    switch (status) {
        case 'not-included':
            return 'included';
        case 'included':
            return 'correct';
        case 'correct':
            return 'not-included';
    }
}

function makeGuess(word: string, prevLetters: GuessLetter[]): Guess {
    const letters: GuessLetter[] = word.split('').map((letter, index) => ({
        letter,
        status:
            prevLetters[index] && prevLetters[index].letter === letter
                ? prevLetters[index].status
                : 'not-included',
    }));
    return {
        word,
        letters,
    };
}

export default function WordleFilter() {
    const [guesses, setGuesses] = useState<Guess[]>([]);
    const [currentGuess, setCurrentGuess] = useState<Guess>(makeGuess('', []));

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (currentGuess.word.length === maxGuessLength) {
            const normalizedGuessText = currentGuess.word.toLowerCase();
            const existingWords = guesses.map(guess => guess.word);

            if (!existingWords.includes(normalizedGuessText)) {
                setGuesses([{ ...currentGuess }, ...guesses]);
            }

            setCurrentGuess(makeGuess('', []));
        }
    }

    function onClickLetter(guessIndex: number, letterIndex: number) {
        const guess = guesses[guessIndex];
        const status = guess.letters[letterIndex].status;

        guess.letters[letterIndex].status = nextStatus(status);
        guesses[guessIndex] = guess;

        setGuesses([...guesses]);
    }

    function updateGuess(e: React.ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.value.replace(/ /g, '_').toLowerCase();
        if (newValue.length <= maxGuessLength && /^[a-z_]*$/.test(newValue)) {
            setCurrentGuess(makeGuess(newValue, currentGuess.letters));
        }
    }

    const possibilities = filterWords(wordList, [
        ...guesses,
        currentGuess,
    ]).join(', ');

    return (
        <Col
            style={{
                textAlign: 'center',
            }}
        >
            <Form onSubmit={onSubmit}>
                <Row className={'mb-3 justify-content-center'}>
                    <Form.Control
                        style={{
                            textAlign: 'center',
                            textTransform: 'uppercase',
                        }}
                        onChange={updateGuess}
                        maxLength={maxGuessLength}
                        value={currentGuess.word}
                        autoCorrect="off"
                    />
                </Row>
                <GuessRow
                    guess={currentGuess}
                    onClick={letterIndex => {
                        if (currentGuess.letters[letterIndex] !== undefined) {
                            const status =
                                currentGuess.letters[letterIndex].status;

                            const nextGuess = {
                                word: currentGuess.word,
                                letters: [...currentGuess.letters],
                            };
                            nextGuess.letters[letterIndex].status =
                                nextStatus(status);
                            setCurrentGuess(nextGuess);
                        }
                    }}
                />
                {guesses.map((guess, guessIndex) => (
                    <GuessRow
                        key={guess.word}
                        guess={guess}
                        onClick={letterIndex => {
                            onClickLetter(guessIndex, letterIndex);
                        }}
                    />
                ))}
            </Form>
            <p>{possibilities}</p>
        </Col>
    );
}
