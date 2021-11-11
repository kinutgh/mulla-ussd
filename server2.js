const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const UssdMenu = require("ussd-menu-builder");

let menu = new UssdMenu();

const port = process.env.PORT || 3030;
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use("*", cors());

app.get("*", (req, res) => {
  res.send("USSD Mulla");
});

// Define menu states
menu.startState({
  run: () => {
    // use menu.con() to send response without terminating session

    menu.con(`Welcome to Mulla, Kinut. Pick a service :
        \n1. Send funds
        \n2. Pay business
        \n3. Check balance
        \n4. Save funds
        \n5. Pull savings
        \n6. Request statement
    
        \n0. More `);

    // menu.con(`Welcome to Mulla, Kinut. Select an account :
    // \n1. 00000001
    // \n2. 00000002 `);

    // menu.end(
    //   `Hey! Please visit https://google.com to create an account on Mulla. Alternatively, download Mulla app from playstore http://mulla.co.ke`
    // );
  },
  // next object links to next state based on user input
  next: {
    1: "sendFunds",
    2: "payBusiness",
    3: "checkBalance",
    4: "saveFunds",
    5: "pullSavings",
    6: "requestStatement",
  },

  //   next: {
  //     1: "0000001",
  //     2: "0000002",
  //   },
});

menu.state("sendFunds", {
  run: () => {
    let session = getSession(menu.args.sessionId);
    session.set("option", 1);
    menu.con("Enter amount :");
  },
  next: {
    "*\\d+": "sendFunds.amount",
  },
});

menu.state("sendFunds.amount", {
  run: () => {
    let session = getSession(menu.args.sessionId);
    session.set("amount", Number(menu.val));
    menu.con("Enter account number :");
  },
  next: {
    "*\\d+": "sendFunds.accountCode",
  },
});

menu.state("sendFunds.accountCode", {
  run: () => {
    let session = getSession(menu.args.sessionId);
    session.set("recepient_acc_code", String("P" + menu.val));
    menu.con("Enter PIN :");
  },
  next: {
    "*\\d+": "sendFunds.pin",
  },
});

menu.state("sendFunds.pin", {
  run: () => {
    let session = getSession(menu.args.sessionId);
    session.set("pin", String(md5(pin)));
    menu.con(
      `STEVE KINUTHIA will receive Ksh. 5000. Continue with ongoing transaction ?
      \n1. Yes
      \n2. No`
    );
  },
  next: {
    1: "sendFunds.yes",
    2: "sendFunds.no",
  },
});

menu.state("sendFunds.yes", {
  run: () => {
    // carry out transaction
    console.log(session.amount);
    menu.end("Transaction authorised. Await confirmation message");
  },
});

menu.state("sendFunds.no", {
  run: () => {
    menu.end("Transaction cancelled.");
  },
});

app.post("*", (req, res) => {
  menu.run(req.body, (ussdResult) => {
    res.send(ussdResult);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
