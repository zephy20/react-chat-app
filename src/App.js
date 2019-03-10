import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Card from "@material-ui/core/Card";
import io from "socket.io-client";
import "./App.css";
import Input from "@material-ui/core/Input";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: theme.spacing.unit
  },
  cssLabel: {
    "&$cssFocused": {
      color: purple[500]
    }
  },
  cssFocused: {},
  cssUnderline: {
    marginTop: "20px",
    "&:after": {
      borderBottomColor: purple[500]
    }
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      messages: [],
      isNewUser: true,
      userName: "",
      author: [],
      isMe: false,
      newUser: ""
    };
    this.socket = io("http://localhost:5000");
  }

  componentDidMount() {
    this.socket.on("userValidated", data => {
      this.setState({ newUser: data }, () => {
        this.resetUser();
      });
    });
    this.socket.on("receiveMessage", data => {
      this.appendMessage(data);
    });
  }

  resetUser = () => {
    setTimeout(
      function() {
        this.setState({ newUser: "" });
      }.bind(this),
      3000
    );
  };

  appendMessage = data => {
    console.log(data);
    this.setState({
      messages: [...this.state.messages, data],
      isMe: false
    });
  };

  handleNewUser = e => {
    console.log(e.target.value);

    e.preventDefault();
    this.socket.emit("newUser", this.state.userName);

    this.setState({
      isNewUser: false
    });
  };

  sendMessage = e => {
    e.preventDefault();
    if (this.state.msg)
      this.socket.emit("sendMessage", {
        message: this.state.msg,
        author: this.state.userName
      });
    this.setState({
      msg: ""
    });
  };

  handleChange = (type, e) => {
    if (type === "userName") this.setState({ userName: e.target.value });
    else this.setState({ msg: e.target.value });
  };

  render() {
    const { classes } = this.props;

    console.log(this.state.isMe);
    this.socket.on("newUserJoined", data => {
      console.log(data);
      this.setState({
        userName: data
      });
    });

    return (
      <div className="col-md-12">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.state.isNewUser === true ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "500px"
              }}
            >
              <div>
                <h3>Got a name?</h3>
                <form onSubmit={this.handleNewUser}>
                  <FormControl className={classes.margin}>
                    <InputLabel
                      htmlFor="custom-css-standard-input"
                      classes={{
                        root: classes.cssLabel,
                        focused: classes.cssFocused
                      }}
                    >
                      Username
                    </InputLabel>
                    <Input
                      id="custom-css-standard-input"
                      classes={{
                        underline: classes.cssUnderline
                      }}
                      onChange={this.handleChange.bind(this, "userName")}
                    />
                  </FormControl>
                </form>
              </div>
            </div>
          ) : (
            <Card
              style={{
                width: "720px",
                textAlign: "left",
                padding: "10px",
                maxHeight: "300px",
                minHeight: "300px",
                overflowY: "auto"
              }}
            >
              {this.state.messages &&
                this.state.messages.map((item, key) => (
                  <div
                    id={key}
                    style={{
                      margin: "15px 0 15px 0",
                      paddingLeft: "5px",
                      display: "flex",
                      justifyContent: "flex-start"
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid #e1e1e1",
                        borderRadius: "50px",
                        padding: "0 10px 0 10px",
                        background: "yellow"
                      }}
                    >
                      {this.state.isMe === false && (
                        <span>
                          <span style={{ fontWeight: "bold" }}>
                            {item.author}
                          </span>
                          &nbsp;:&nbsp;
                        </span>
                      )}
                      {item.message}
                    </div>
                  </div>
                ))}
              {this.state.newUser && <h3>{this.state.newUser} has joined!</h3>}
            </Card>
          )}
        </div>
        {this.state.isNewUser === false && (
          <form
            onSubmit={this.sendMessage}
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "10px"
            }}
          >
            <input
              type="text"
              value={this.state.msg}
              onChange={this.handleChange.bind(this, "message")}
            />
          </form>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(App);
