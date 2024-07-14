import { PropTypes } from 'prop-types';
import { Fragment, useState } from 'react';

function Square({ value, className, onSquareClick }) {
    return <button className={`${className} text-2xl text-center w-16 h-16 p-0`} onClick={onSquareClick}>{value}</button>
}

Square.propTypes = {
    value: PropTypes.string,
    className: PropTypes.string,
    onSquareClick: PropTypes.func.isRequired
}

function Board({ xIsNext, squares, onPlay }) {
    const { winner, line } = calculateWinner(squares);
    function handleClick(i) {
        if (winner || squares[i] !== null) {
            return;
        }
        const newSquares = squares.slice();
        newSquares[i] = xIsNext ? 'X' : 'O';
        onPlay(newSquares);
    }

    let status;
    if (winner) {
        status = winner === 'Draw' ? 'Draw' : 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    const rows = [];
    for (let i = 0; i < 3; i++) {
        const rowSquares = [];
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            if (line.includes(index)) {
                rowSquares.push(<Square value={squares[index]} className="bg-lime-300" onSquareClick={() => handleClick(index)}/>);
            } else {
                rowSquares.push(<Square value={squares[index]} onSquareClick={() => handleClick(index)}/>);
            }
        }
        rows.push(
            <div className="flex flex-row">
                {rowSquares.map((square, index) => (<Fragment key={index}>{square}</Fragment>))}
            </div>
        );
    }

    return (
        <>
            <div className="text-center text-2xl">{status}</div>
            {rows.map((row, index) => (<Fragment key={index}>{row}</Fragment>))}
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
    const [currentMove, setCurrentMove] = useState(0);
    const [ascending, setAscending] = useState(false);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function handleSort() {
        setAscending(!ascending);
    }

    function getRowCol(index) {
        const row = Math.floor(index / 3);
        const col = index % 3;
        return `(${row}, ${col})`;
    }


    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            const lastMove = history[move - 1];
            const currentMove = squares;
            const diffIndex = currentMove.findIndex((value, index) => value !== lastMove[index]);
            description = `Go to move #${move} ${getRowCol(diffIndex)}`;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => setCurrentMove(move)}>{description}</button>
            </li>
        );
    });

    if (ascending) {
        moves.reverse();
    }

    return (
        <div className="flex flex-row w-auto h-auto p-0">
            <div className="w-48">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="text-sm w-48">
                <p className="font-medium">You are at move #{currentMove}</p>
                <button onClick={handleSort}>Sort</button>
                <ol>{moves}</ol>
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
            return { winner: squares[a], line: lines[i] };
        }
    }
    if (squares.every(square => square !== null)) {
        return { winner: 'Draw', line: [] };
    }
    return { winner: null, line: [] };
}