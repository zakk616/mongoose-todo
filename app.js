//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var items = [];

app.get("/", (req, res) => {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  var day = today.toLocaleDateString("en-US", options);
  res.render("list", {
    day: day,
    items: items,
  });
});

app.post("/", (req, res) => {
  items.push(req.body.todo);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
