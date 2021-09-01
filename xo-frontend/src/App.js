import "./App.css";
import React from "react";

import Row from "react-bootstrap/Row";

import Cell from "./components/cell.js";

import io from "socket.io-client";

const socket = io.connect("http://localhost:4000"); // will need this
let arr = [];
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardState: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ], // from backend

      boardStateOneArr: [0, 0, 0, 0, 0, 0, 0, 0, 0], // change boardState to this in a function
      count: 0,
      gameState: "on",
      finalB: [],

      id: "x",
    };
  }
  componentDidMount() {
    socket.emit("reconnect", {});
    socket.on("prevOrder", (payload) => {
      let { boardState, count, gameState } = payload;

      // x on even and 0
      // o on odd
      let c = 0;
      for (let i = 0; i < 3; i++) {
        for (let z = 0; z < 3; z++) {
          arr[c] = boardState[i][z];
          c++;
        }
      }

      this.setState({
        boardState: boardState,
        count: count,
        gameState: gameState,
        boardStateOneArr: arr,
      });
    });
  }

  userMove = (cellNumber, cellCurrentValue) => {
    if (this.state.count > 8) {
      alert("No moves left");
      socket.emit("getAll", {
        boardState: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        count: 0,
        gameState: "on",
      });
    } else if (cellCurrentValue !== 0) {
      alert("this space is already taken");
    } else {
      let xOrOInCell = 0;
      if (this.state.id === "x") {
        xOrOInCell = 1;
        this.setState({ id: "o" });
      } else {
        xOrOInCell = 2;
        this.setState({ id: "x" });
      }

      let board = this.state.boardStateOneArr;
      board[cellNumber] = xOrOInCell;

      let c = 0;
      for (let i = 0; i < 3; i++) {
        for (let z = 0; z < 3; z++) {
          if (c == cellNumber) {
            this.state.boardState[i][z] = board[cellNumber];
          }
          c++;
        }
      }
      this.setState({
        boardState: this.state.boardState,
        count: this.state.count++,
      });

      this.ioConnect();
    }
  };

  ioConnect() {
    socket.emit("getAll", {
      boardState: this.state.boardState,
      count: this.state.count,
      gameState: this.state.gameState,
    });

    socket.on("order", (payload) => {
      let { boardState, count, gameState } = payload;

      // x on even and 0
      // o on odd
      let c = 0;
      for (let i = 0; i < 3; i++) {
        for (let z = 0; z < 3; z++) {
          arr[c] = boardState[i][z];
          c++;
        }
      }

      this.setState({
        boardState: boardState,
        count: count,
        gameState: gameState,

        boardStateOneArr: arr,
      });

      if (gameState === "x win") {
        if (this.state.id === "x") {
          alert("you win! hahahaaha :))");
        } else {
          alert("you lose! hahahaaha :((");
        }
      }

      if (gameState === "o win") {
        if (this.state.id === "o") {
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
              return (
                <Cell
                  oneCell={oneCell}
                  cellNum={idx}
                  userMove={this.userMove}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
