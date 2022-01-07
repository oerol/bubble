const express = require("express");
const mongoose = require("mongoose");
const Day = require("./models/day");
const Actual = require("./models/actual");
const Task = require("./models/task");
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
  if (req.body.planned) {
    const day = {
      weekday: req.body.weekday,
      bubbles: req.body.bubbles,
    };

    Day.findOneAndUpdate({ weekday: req.body.weekday }, day, { upsert: true }, function (err, doc) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(doc);
      }
    });
  } else {
    const day = {
      weekday: req.body.weekday,
      bubbles: req.body.bubbles,
    };

    Actual.findOneAndUpdate(
      { weekday: req.body.weekday },
      day,
      { upsert: true },
      function (err, doc) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.send(doc);
        }
      }
    );
  }
});
app.post("/task", (req, res) => {
  const tasks = req.body.tasks;
  let weekday = new Date().getDay();

  Task.findOneAndUpdate(
    { _id: "61d8a003403c6f6903c2c81e" },
    tasks,
    { upsert: true },
    function (err, doc) {
      if (err) {
        console.log(doc, req.body);
        console.log(err);
        res.send(err);
      } else {
        res.send(doc);
      }
    }
  );
});

app.get("/all-days", (req, res) => {
  Day.find()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log("error");
    });
});

app.get("/get-day/:id", (req, res) => {
  let passedWeekday = parseInt(req.params.id);
  Day.find({ weekday: passedWeekday }).then((result) => {
    res.send(result);
  });
});
app.get("/get-actual-day/:id", (req, res) => {
  let passedWeekday = parseInt(req.params.id);
  Actual.find({ weekday: passedWeekday }).then((result) => {
    res.send(result);
  });
});
