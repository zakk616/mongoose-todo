//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoListDB", {
  useNewUrlParser: true,
});

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

app.get("/", (req, res) => {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  var day = today.toLocaleDateString("en-US", options);

  Item.find({}, function (err, foundItems) {
    res.render("list", {
      day: day,
      items: foundItems,
    });
    console.log("Found items in DB.");
  });
});

app.post("/", (req, res) => {
  Item.create({ name: req.body.todo }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully added new item to DB.");
    }
  });

  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const item_id = req.body.checkbox;
  Item.deleteOne({ _id: item_id }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully deleted item from DB.");
    }
  }
  );
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
