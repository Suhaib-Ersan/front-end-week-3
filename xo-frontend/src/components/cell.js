import React from "react";

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  xOrO(num) {
    if (parseInt(num) === 0) {
      return "";
    } else if (parseInt(num) === 1) {
      return "❌";
    } else if (parseInt(num) === 2) {
      return "🟢";
    }
  }

  render() {
    return (
      <>
        <div
          className="cellDiv"
          onClick={() => {
            this.props.userMove(this.props.idx, this.props.oneCell);
          }}
        >
          <span>{this.xOrO(this.props.oneCell)}</span>
          
        </div>
      </>
    );
  }
}

export default Cell;
