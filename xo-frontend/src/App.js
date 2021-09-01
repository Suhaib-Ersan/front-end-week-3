import "./App.css";
import React from 'react';

import Row from "react-bootstrap/Row";

import Cell from "./components/cell.js";

import io from "socket.io-client";

// const socket = io.connect('/backend.heroku.com'); // will need this

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardState: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ], // from backend

      boardStateOneArr: [1, 2, 0, 0, 0, 0, 0, 0, 0], // change boardState to this in a function
      count: 0,
      gameState: "",

      id: "not set",
    };
  }

  userMove = (cellNumber, cellCurrentValue) => {
    console.log();
    if (this.state.count >= 8) {
      alert("No moves left, please refresh page");
    } else if (cellCurrentValue !== 0) {
      alert("this space is already taken");
    } else {
      let xOrOInCell = 0;
      if (this.state.id === "x") {
        xOrOInCell = 1;
      } else {
        xOrOInCell = 2;
      }

      let board = this.state.boardStateOneArr;
      board[cellNumber] = xOrOInCell;

      let boardMatrix = [
        [board[0], board[1], board[2]],
        [board[3], board[4], board[5]],
        [board[6], board[7], board[8]],
      ];

      this.state.count++;

      let socketObj = {
        boardState: boardMatrix,
        gameState: this.state.gameState,
        count: this.state.count,
        id: this.state.id,
      };

      console.log(socketObj);
    }
  }

  ioConnect() {
    io.on("order", (payload) => {
      let { boardState, count, gameState, id } = payload;

      // x on even and 0
      // o on odd

      let arr = [];
      for (let i = 0; i < 3; i++) {
        for (let z = 0; z < 3; z++) {
          arr.push(boardState[i][z]);
        }
      }

      this.setState = {
        boardState: boardState,
        count: count,
        gameState: gameState,
        id: id,

        boardStateOneArr: arr,
      };

      if (gameState === "x win") {
        if (id === "x") {
          alert("you win! hahahaaha :))");
        } else {
          alert("you lose! hahahaaha :((");
        }
      }

      if (gameState === "o win") {
        if (id === "o") {
          alert("you win! hahahaaha :))");
        } else {
          alert("you lose! hahahaaha :((");
        }
      }
    });
  }
  render() {
    return (
      <div className="App">
        <div className="boardContainer">
          <div className="board">
            {this.state.boardStateOneArr.map((oneCell, idx) => {
              return <Cell oneCell={oneCell} cellNum={idx} userMove={this.userMove} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
