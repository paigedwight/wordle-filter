import range from "lodash/range";
import { useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import wordList from "./wordle/wordList";

type GuessLetterStatus = "correct" | "included" | "not-included";

type GuessLetter = {
    letter: string;
    status: GuessLetterStatus;
};

type Guess = {
    word: string;
    letters: GuessLetter[];
};

function nextStatus(status: GuessLetterStatus): GuessLetterStatus {
    switch (status) {
        case "not-included":
            return "included";
        case "included":
            return "correct";
        case "correct":
            return "not-included";
    }
}

function makeGuess(text: string): Guess {
    return {
        word: text,
        letters: text
            .split("")
            .map((letter: string) => ({ letter, status: "not-included" })),
    };
}

export default function WordleFilter() {
    const [guesses, setGuesses] = useState<Guess[]>([]);
    const [guessText, setGuessText] = useState("");

    const maxGuessLength = 5;

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (guessText.length === maxGuessLength) {
            const normalizedGuessText = guessText.toLowerCase();
            const existingWords = guesses.map((guess) => guess.word);

            if (!existingWords.includes(normalizedGuessText)) {
                setGuesses([...guesses, makeGuess(normalizedGuessText)]);
            }

            setGuessText("");
        }
    }

    function onClickLetter(guessIndex: number, letterIndex: number) {
        const guess = guesses[guessIndex];
        const status = guess.letters[letterIndex].status;

        guess.letters[letterIndex].status = nextStatus(status);
        guesses[guessIndex] = guess;

        setGuesses([...guesses]);
    }

    function speculate(guesses: Guess[]): string[] {
        let remainingWords = [...wordList];
        guesses.forEach((guess) => {
            guess.letters.forEach((guessLetter, index) => {
                if (guessLetter.status === "correct") {
                    remainingWords = remainingWords.filter(
                        (word) => word.charAt(index) === guessLetter.letter
                    );
                } else if (guessLetter.status === "included") {
                    remainingWords = remainingWords.filter(
                        (word) =>
                            word.charAt(index) !== guessLetter.letter &&
                            word.includes(guessLetter.letter)
                    );
                } else if (guessLetter.status === "not-included") {
                    remainingWords = remainingWords.filter(
                        (word) => !word.includes(guessLetter.letter)
                    );
                }
            });
        });

        return remainingWords;
    }

    const possibilities = speculate(guesses);

    return (
        <Col
            style={{
                // display: "flex",
                paddingTop: "200px",
                textAlign: "center",
                // justifyContent: "center",
            }}
        >
            <Form onSubmit={onSubmit}>
                <Row className={"mb-3 justify-content-center"}>
                    <Form.Control
                        style={{
                            width: "300px",
                            textAlign: "center",
                        }}
                        onChange={(e) => setGuessText(e.target.value)}
                        maxLength={maxGuessLength}
                        value={guessText}
                    />
                </Row>
                {guesses.map((guess, guessIndex) => (
                    <Row className="mb-3" key={guess.word}>
                        {range(maxGuessLength).map((letterIndex) => (
                            <Col key={letterIndex}>
                                <Button
                                    onClick={() => {
                                        onClickLetter(guessIndex, letterIndex);
                                    }}
                                    style={{
                                        backgroundColor:
                                            guess.letters[letterIndex]
                                                .status === "correct"
                                                ? "#6aaa64"
                                                : guess.letters[letterIndex]
                                                      .status === "included"
                                                ? "#c9b458"
                                                : "#86888a",
                                        border: "1px solid black",
                                        height: "50px",
                                        textTransform: "uppercase",
                                        width: "50px",
                                    }}
                                >
                                    {guess.letters[letterIndex].letter}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                ))}
            </Form>
            <p>{possibilities.join(", ")}</p>
        </Col>
    );
}
