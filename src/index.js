/**
 * Created by yhc on 5/30/17.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  if (isInArray(props.location, props.winSquares)) {  // highlight the squares that cause to win
    return (
      <button className="square" onClick={props.onClick}>
        <mark>{props.value}</mark>
      </button>
    );
  } else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        location={i}
        winSquares={this.props.winSquares}
      />
    );
  }

  render() {  // rewrite Board to use two loops to make the squares instead of hardcoding them
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(i * 3 + j))
      }
      board.push(
        <div className="board-row" key={i}>
          {row}
        </div>
      );
    }

    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: new Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  /*
   * Whenever this.setState() is called, an update to the component is scheduled,
   * causing React to merge in the passed state update and rerender the component
   * along with its descendants.
   */
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();  // we call .slice() to copy the squares array instead of mutating the existing array
    if (calculateWinner(squares) || squares[i]) {  // early return
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: !(step % 2),
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winSquares = calculateWinner(current.squares);
    let winner = null;
    if (winSquares) {
      winner = current.squares[winSquares[0]];
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        "Move #" + move :
        'Game start';
      if (move === this.state.stepNumber) {  // bold the currently-selected item in the move list
        return (
          <li key={move}>
            <strong><a href="#" onClick={() => this.jumpTo(move)}>{desc}</a></strong>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
          </li>
        );
      }
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winSquares={winSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return [a, b, c];  // get the squares which should be highlighted
    }
  }

  return null;
}

function isInArray(value, array) {  // helper function
  if (array === null) {
    return false;
  }

  return array.indexOf(value) > -1;
}
