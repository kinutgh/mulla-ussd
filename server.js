const express = require("express");
const logger = require("morgan");

const port = process.env.PORT || 3030;
const app = express();

app.use(logger("dev"));
app.use(express.json());

app.get("*", (req, res) => {
  res.send(
    "This is tutorial App on creating your first USSD app in 5 minutes or less by Ajala Abdulsamii <kgasta@gmail.com>"
  );
});

app.post("*", (req, res) => {
  let { sessionId, serviceCode, phoneNumber, text } = req.body;

  let response = "";
  console.log(text);

  if (text === "") {
    console.log(text);
    // This is the first request. Note how we start the response with CON
    response = `CON What would you like to check
        1. My account
        2. My phone number`;
  } else if (text === "1") {
    // Business logic for first level response
    response = `CON Choose account information you want to view
        1. Account number
        2. Account balance`;
  } else if (text === "2") {
    // Business logic for first level response
    // This is a terminal request. Note how we start the response with END
    response = `END Your phone number is ${phoneNumber}`;
  } else if (text === "1*1") {
    // This is a second level response where the user selected 1 in the first instance
    const accountNumber = "ACC100101";
    // This is a terminal request. Note how we start the response with END
    response = `END Your account number is ${accountNumber}`;
  } else if (text === "1*2") {
    // This is a second level response where the user selected 1 in the first instance
    const balance = "KES 10,000";
    // This is a terminal request. Note how we start the response with END
    response = `END Your balance is ${balance}`;
  }

  // switch (text) {
  //   case undefined:
  //     response = `CON Welcome to Mulla Kinut. Pick a service :
  //     1. Send funds
  //     2. Pay business
  //     3. Check balance
  //     4. Save funds
  //     5. Pull savings
  //     6. Request statement

  //     0. More`;
  //     break;

  //   case "1":
  //     response = `END Selected Send funds`;
  //     break;

  //   default:
  //     response = `END Done!`;
  //     break;
  // }

  res.set("Content-Type: text/plain");
  res.send(response);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
