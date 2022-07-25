//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://zakk616:test_123@cluster0.9h4s5uq.mongodb.net/todoListDB",
  { useNewUrlParser: true }
);

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

// const item1 = new Item({
//   name: "Welcome to your todolist!",
// });

// Item.insertMany([item1], function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully saved to database");
//   }
// });

function today() {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return today.toLocaleDateString("en-US", options);
}

app.get("/", (req, res) => {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      console.log("No items found");
      res.render("list", {
        items: [],
        day: today(),
      });
    } else {
      console.log("Items Found");
      res.render("list", {
        items: foundItems,
        day: today(),
      });
    }
  });
});

app.post("/", (req, res) => {
  Item.create({ name: req.body.todo }, function (err) {
    if (err) {
      console.log(err);
      res.render("list", {
        items: [],
        day: today(),
      });
    } else {
      console.log("Successfully added new item to DB.");
      res.redirect("/");
    }
  });
});

app.post("/delete", (req, res) => {
  const item_id = req.body.checkbox;
  Item.deleteOne({ _id: item_id }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully deleted item from DB.");
    }
  });
  res.redirect("/");
});

// app.listen(3000, () => {
//   console.log("server is running at Local port: 3000!");
// });

// this code lest app run on heroku
function run(port) {
  console.log("server is running at port: " + port);
}
app.listen(process.env.PORT, run(process.env.PORT));
