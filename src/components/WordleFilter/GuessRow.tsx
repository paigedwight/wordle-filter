/** @format */

import { range } from 'lodash';
import { Button, Col, Row } from 'react-bootstrap';
import { colours, maxGuessLength } from './constants';
import { Guess, GuessLetter } from './types';

function bgColour(guessLetter?: GuessLetter) {
    return guessLetter === undefined
        ? colours.grey
        : guessLetter.letter === '_'
        ? colours.lightgrey
        : guessLetter.status === 'correct'
        ? colours.green
        : guessLetter.status === 'included'
        ? colours.yellow
        : colours.grey;
}

type GuessRowOnClick = (letterIndex: number) => void;
export default function GuessRow({
    guess,
    onClick,
}: {
    guess: Guess;
    onClick: GuessRowOnClick;
}) {
    return (
        <Row className="mb-3">
            {range(maxGuessLength).map(letterIndex => {
                return (
                    <Col
                        style={{
                            paddingLeft: '0px',
                            paddingRight: '0px',
                        }}
                        key={letterIndex}
                    >
                        <Button
                            onClick={() => onClick(letterIndex)}
                            style={{
                                backgroundColor: bgColour(
                                    guess.letters[letterIndex],
                                ),
                                border: '1px solid black',
                                height: '50px',
                                textTransform: 'uppercase',
                                width: '50px',
                            }}
                        >
                            {guess.letters[letterIndex] === undefined
                                ? ''
                                : guess.letters[letterIndex].letter}
                        </Button>
                    </Col>
                );
            })}
        </Row>
    );
}
