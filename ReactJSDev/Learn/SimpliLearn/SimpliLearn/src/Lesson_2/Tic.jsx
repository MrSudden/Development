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

    return (
        <>
            <div className="text-center text-2xl">{status}</div>
            <div className="flex flex-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
                <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
                <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
            </div>
            <div className="flex flex-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
                <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
                <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
            </div>
            <div className="flex flex-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
                <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
                <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
            </div>
        </>
    );
}

Board.propTypes = {
    xIsNext: PropTypes.bool.isRequired,
    squares: PropTypes.array.isRequired,
    onPlay: PropTypes.func.isRequired
}

function Game() {
    const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const currentSquares = history[history.length - 1];

    function handlePlay(nextSquares) {
        setHistory([...history, nextSquares]);
        setXIsNext(!xIsNext);
    }

    function jumpTo() {
        //TODO
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button className="text-sm w-5/6" onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="flex flex-row w-auto h-auto p-0">
            <div className="w-48">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="w-48">
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
            return squares[a];
        }
    }
    return null;
}