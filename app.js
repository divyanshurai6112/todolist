const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemSchema = mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);
const Task = mongoose.model("Task", itemSchema);


//let newItems=[];
//let newWorks=[];

app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.static("public"));


app.get("/to-buy", function (req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    month: "long",
    //year:"numeric",
    day: "numeric"
  };
  let day = today.toLocaleDateString("en-US", options);
  Item.find({}, function (err, itemsFound) {
    if (itemsFound.length > 0) {
      res.render("list", { listType: "To-Buy List", properDate: day, newEntries: itemsFound });

    }
    else {
      let newItems2 = [];
      res.render("list", { listType: "To-Buy List", properDate: day, newEntries: newItems2 });
    }
  });

});

app.post("/to-buy", function (req, res) {
  //var item = req.body.newItem;
  //newItems.push(item);
  let latestDocument = Item.create({ name: req.body.newItem });
  res.redirect("/to-buy");
});


app.get("/task-list", function (req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    month: "long",
    //year:"numeric",
    day: "numeric"
  };
  let day = today.toLocaleDateString("en-US", options);
  Task.find({}, function (err, tasksFound) {
    if (tasksFound.length > 0) {
      res.render("list", { listType: "Work To Do", properDate: day, newEntries: tasksFound });

    }
    else {
      let newItems2 = [];
      res.render("list", { listType: "Work To Do", properDate: day, newEntries: newItems2 });
    }
  });
});

app.post("/task-list", function (req, res) {
  //let task = req.body.newTask;
  //newWorks.push(task);
  let latestDocument = Task.create({ name: req.body.newTask });
  res.redirect("/task-list")
})


app.post("/delete-item", function (req, res) {
  let query = req.body.checkBox;
  Item.findByIdAndRemove(query, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully deleted");
      res.redirect("/to-buy");
    }
  });
});

app.post("/delete-task", function (req, res) {
  let query = req.body.checkBox;
  Task.findByIdAndRemove(query, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully deleted");
      res.redirect("/task-list");
    }
  });
});

app.listen(3000, function () {
  console.log("server is running on port 3000");
});
