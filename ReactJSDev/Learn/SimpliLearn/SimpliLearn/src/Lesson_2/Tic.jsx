import { PropTypes } from 'prop-types';
import { useState } from 'react';

function Square({ value, onSquareClick }) {
    return <button className='text-2xl text-center w-16 h-16 p-0' onClick={onSquareClick}>{value}</button>
}

Square.propTypes = {
    value: PropTypes.string,
    onSquareClick: PropTypes.func.isRequired
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares) || (squares[i] !== null)) {
            return;
        }
        const newSquares = squares.slice();
        (xIsNext) ? newSquares[i] = 'X' : newSquares[i] = 'O';
        onPlay(newSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    const rows = [];
    for (let i = 0; i < 3; i++) {
        const rowSquares = [];
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            rowSquares.push(<Square value={squares[index]} onSquareClick={() => handleClick(index)}/>);
        }
        rows.push(<div className="flex flex-row">{rowSquares}</div>);
    }

    return (
        <>
            <div className="text-center text-2xl">{status}</div>
            {rows}
        </>
    );
}

Board.propTypes = {
    xIsNext: PropTypes.bool.isRequired,
    squares: PropTypes.array.isRequired,
    onPlay: PropTypes.func.isRequired
}

function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [curentMove, setCurrentMove] = useState(0);
    const xIsNext = curentMove % 2 === 0;
    const currentSquares = history[curentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, curentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    return (
        <div className="flex flex-row w-auto h-auto p-0">
            <div className="w-48">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="w-48">
                <p>You are at move #{curentMove}</p>
            </div>
        </div>
    );
}

export default Game;

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}