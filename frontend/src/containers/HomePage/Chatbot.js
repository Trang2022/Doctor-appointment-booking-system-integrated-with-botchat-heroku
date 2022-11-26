import React, { Component } from "react";
import PropTypes from "prop-types";
import ChatBot from "react-simple-chatbot";

import { ThemeProvider } from "styled-components";

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      gender: "",
      age: "",
    };
  }

  componentWillMount() {
    const { steps } = this.props;
    const { name, gender, age } = steps;

    this.setState({ name, gender, age });
  }

  render() {
    const { name, gender, age } = this.state;
    return (
      <div style={{ width: "100%" }}>
        <h3>Summary</h3>
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{name.value}</td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>{gender.value}</td>
            </tr>
            <tr>
              <td>Age</td>
              <td>{age.value}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

Review.propTypes = {
  steps: PropTypes.object,
};

Review.defaultProps = {
  steps: undefined,
};

const steps = [
  {
    id: "0",
    message: "HI!",

    // This calls the next id
    // i.e. id 1 in this case
    trigger: "1",
  },
  {
    id: "1",

    // Here we want the user
    // to enter input
    user: true,
    trigger: "2",
  },
  {
    id: "2",
    message: " hi {previousValue}, how can I help you?",
    trigger: "3",
  },
  {
    id: "3",
    options: [
      // When we need to show a number of
      // options to choose we create alist
      // like this
      { value: 1, label: "Medical examination", trigger: "4" },
      { value: 2, label: "Find Doctor Information", trigger: "4" },
      {
        value: 3,
        label: "Learn about medical examination rates",
        trigger: "4",
      },
    ],
  },
  {
    id: "4",

    // This message appears in
    // the bot chat bubble
    message: "Please write your username",
    trigger: "name",
  },
  {
    id: "name",
    user: true,
    trigger: "5",
  },
  {
    id: "5",
    message: "Hi {previousValue}! What is your gender?",
    trigger: "gender",
  },
  {
    id: "gender",
    options: [
      { value: "male", label: "Male", trigger: "6" },
      { value: "female", label: "Female", trigger: "6" },
    ],
  },
  {
    id: "6",
    message: "How old are you?",
    trigger: "age",
  },
  {
    id: "age",
    user: true,
    trigger: "7",
    validator: (value) => {
      if (isNaN(value)) {
        return "value must be a number";
      } else if (value < 0) {
        return "value must be positive";
      } else if (value > 120) {
        return `${value}? Come on!`;
      }

      return true;
    },
  },
  {
    id: "7",
    message: "Great! Check out your summary",
    trigger: "review",
  },
  {
    id: "review",
    component: <Review />,
    asMessage: true,
    trigger: "update",
  },
  {
    id: "update",
    message: "Do you want to update some information?",
    trigger: "update-question",
  },
  {
    id: "update-question",
    options: [
      { value: "yes", label: "Yes", trigger: "update-yes" },
      { value: "no", label: "No", trigger: "end-message" },
    ],
  },
  {
    id: "update-yes",
    message: "What field would you like to update?",
    trigger: "update-fields",
  },
  {
    id: "update-fields",
    options: [
      { value: "name", label: "Name", trigger: "update-name" },
      { value: "gender", label: "Gender", trigger: "update-gender" },
      { value: "age", label: "Age", trigger: "update-age" },
    ],
  },
  {
    id: "update-name",
    update: "name",
    trigger: "7",
  },
  {
    id: "update-gender",
    update: "gender",
    trigger: "7",
  },
  {
    id: "update-age",
    update: "age",
    trigger: "7",
  },
  {
    id: "end-message",
    message: "Thanks! Your data was submitted successfully!",
    end: true,
  },
];

// Creating our own theme
const theme = {
  background: "#CC99FF",
  headerBgColor: "#9900CC",
  headerFontSize: "20px",
  botBubbleColor: "#9966FF",
  headerFontColor: "white",
  botFontColor: "#000000",
  userBubbleColor: "#FFFF99",
  userFontColor: "#000000",
};

// Set some properties of the bot
const config = {
  floating: true,
};

function Chatbot() {
  return (
    <div className="Chatbot">
      <ThemeProvider theme={theme}>
        <ChatBot
          // This appears as the header
          // text for the chat bot
          headerTitle="Chatbot"
          steps={steps}
          {...config}
        />
      </ThemeProvider>
    </div>
  );
}

export default Chatbot;
