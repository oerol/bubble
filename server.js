const express = require("express");
const mongoose = require("mongoose");
const Day = require("./models/day");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbURI =
  "mongodb+srv://oerol:bubble@bubble-server.fd9w7.mongodb.net/bubble?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3001))
  .catch((error) => console.log(error));

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/day", (req, res) => {
  console.log(req);
  const day = new Day({
    weekday: req.body.weekday,
    bubbles: req.body.bubbles,
  });

  day
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/all-days", (req, res) => {
  Day.find()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
});
app.get("/get-day", (req, res) => {
  Day.find({ weekday: 3 }).then((result) => {
    res.send(result);
  });
});
