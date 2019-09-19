import React, { Component } from "react";
import io from "socket.io-client";

class App extends Component {
  state = {
    isConnected: false,
    id: null,
    peeps: null,
    peepsLength: null,
    newId: null,
    value: {}
  };
  socket = null;

  componentWillMount() {
    this.socket = io("https://codi-server.herokuapp.com");

    this.socket.on("connect", () => {
      this.setState({ isConnected: true });
    });
    this.socket.on("pong!", additionalStuff => {
      console.log("server answered!", additionalStuff);
    });
    this.socket.on("youare", answer => {
      this.setState({ id: answer.id });
    });
    this.socket.on("peeps", answer => {
      this.setState({ peeps: answer, peepsLength: answer.length });
    });

    this.socket.on("new connection", answer => {
      console.log("new connected id", answer);
      var peeps = [this.state.peeps, answer];

      this.setState({
        peeps: peeps
      });
    });

    // this.socket.on("new disconnection", answer => {
    //   console.log("disconnected id", answer);
    //   var peeps = [...this.state.peeps];
    //   var index = peeps.indexOf(answer);

    //   peeps.splice(index, 1);

    //   this.setState({
    //     peeps: peeps
    //   });

    //   // console.log("from disconect", peeps);
    // });

    // this.socket.on("next", message_from_server =>
    //   console.log(message_from_server)
    // );

    // this.socket.on("addition", message_from_server =>
    //   console.log("addition", message_from_server)
    // );

    // this.socket.emit("answer", "52");

    this.socket.on("disconnect", () => {
      this.setState({ isConnected: false });
    });

    /** this will be useful way, way later **/
    this.socket.on("room_message", old_messages => console.log(old_messages));
  }
  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  componentWillUnmount() {
    this.socket.close();
    this.socket = null;
  }

  render() {
    return (
      <div className="App">
        <div>
          <div> {this.state.peeps}</div>
          status: {this.state.isConnected ? "connected" : "disconnected"}
          <div>id: {this.state.id}</div>
          <button onClick={() => this.socket.emit("whoami")}>Who am I?</button>
          <input value={this.state.value} onChange={this.handleChange}></input>
          <button
            onClick={() =>
              this.socket.emit("message", {
                text: this.state.value,
                name: "SHIRAKO",
                id: this.state.id
              })
            }
          >
            send message
          </button>
        </div>
      </div>
    );
  }
}

export default App;