/** @format */

import range from 'lodash/range';
import { useState } from 'react';
import { Col, Form, Row, Button } from 'react-bootstrap';
import { Guess, GuessLetter, GuessLetterStatus } from './types';
import wordList from './wordle/wordList';

const maxGuessLength = 5;

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

function bgColour(guessLetter?: GuessLetter) {
    return guessLetter === undefined
        ? '#86888a'
        : guessLetter.letter === '_'
        ? '#ddd'
        : guessLetter.status === 'correct'
        ? '#6aaa64'
        : guessLetter.status === 'included'
        ? '#c9b458'
        : '#86888a';
}

function makeGuess(word: string, prevLetters: GuessLetter[]): Guess {
    const letters: GuessLetter[] = word.split('').map((letter, index) => ({
        letter,
        status: prevLetters[index] && prevLetters[index].letter === letter ? prevLetters[index].status : 'not-included',
    }));
    return {
        word,
        letters,
    };
}

type GuessRowOnClick = (letterIndex: number) => void;
function GuessRow({ guess, onClick }: { guess: Guess; onClick: GuessRowOnClick }) {
    return (
        <Row className="mb-3">
            {range(maxGuessLength).map(letterIndex => {
                return (
                    <Col
                        style={{
                            paddingLeft: '2px',
                            paddingRight: '2px',
                        }}
                        key={letterIndex}
                    >
                        <Button
                            onClick={() => onClick(letterIndex)}
                            style={{
                                backgroundColor: bgColour(guess.letters[letterIndex]),
                                border: '1px solid black',
                                height: '50px',
                                textTransform: 'uppercase',
                                width: '50px',
                            }}
                        >
                            {guess.letters[letterIndex] === undefined ? '' : guess.letters[letterIndex].letter}
                        </Button>
                    </Col>
                );
            })}
        </Row>
    );
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

    function eliminate(guesses: Guess[]): string[] {
        let remainingWords = [...wordList];
        [...guesses].forEach(guess => {
            guess.letters.forEach((guessLetter, index) => {
                if (guessLetter.letter === '_') return;

                if (guessLetter.status === 'correct') {
                    remainingWords = remainingWords.filter(word => word.charAt(index) === guessLetter.letter);
                } else if (guessLetter.status === 'included') {
                    remainingWords = remainingWords.filter(
                        word => word.charAt(index) !== guessLetter.letter && word.includes(guessLetter.letter),
                    );
                } else if (guessLetter.status === 'not-included') {
                    remainingWords = remainingWords.filter(word => !word.includes(guessLetter.letter));
                }
            });
        });

        return remainingWords;
    }

    const possibilities = eliminate(guesses);

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
                        onChange={e => {
                            const newValue = e.target.value.replace(/ /g, '_').toLowerCase();
                            if (newValue.length <= maxGuessLength && /^[a-z_]*$/.test(newValue)) {
                                setCurrentGuess(makeGuess(newValue, currentGuess.letters));
                            }
                        }}
                        maxLength={maxGuessLength}
                        value={currentGuess.word}
                        autoCorrect="off"
                    />
                </Row>
                <GuessRow
                    guess={currentGuess}
                    onClick={letterIndex => {
                        if (currentGuess.letters[letterIndex] !== undefined) {
                            const status = currentGuess.letters[letterIndex].status;

                            const nextGuess = {
                                word: currentGuess.word,
                                letters: [...currentGuess.letters],
                            };
                            nextGuess.letters[letterIndex].status = nextStatus(status);
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
            <p>{possibilities.join(', ')}</p>
        </Col>
    );
}
