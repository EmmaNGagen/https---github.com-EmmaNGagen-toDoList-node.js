const express = require("express");
const exphbs = require("express-handlebars");
const todos = require("./data/todos.js");
const res = require("express/lib/response");
const req = require("express/lib/request");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); //Vad var detta?

function getNewId(list) {
  let maxId = 0;

  for (const item of list) {
    if (item.id > maxId) {
      maxId = item.id;
    }
  }
  return maxId + 1;
}

app.get("/", (req, res) => {
  res.render("home", { todos });
});

app.get("/home/ny", (req, res) => {
  res.render("home");
});

app.post("/home/ny", (req, res) => {
  const id = getNewId(todos);
  const newTask = {
    id: id,
    created: req.body.created,
    task: req.body.task,
    done: req.body.done,
  };
  console.log(req.body.task);
  console.log(req.body.done);
  todos.push(newTask);

  res.redirect("/uppgift/" + id);
});

app.get("/home/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  res.render("single-task", todo);
});

app.get("/uppgift/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  res.render("single-task", todo);
});

app.get("/uppgift/:id/redigera", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  res.render("edit-task", todo);
});

app.post("/uppgift/:id/redigera", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  todos[index].created = req.body.created;
  todos[index].task = req.body.task;
  todos[index].done = req.body.done;

  res.redirect("/uppgift/" + id);
});

app.get("/uppgift/:id/ta-bort", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  res.render("delete-task", todo);
});
//Id i url måste vi alltid hämta med parseInt(req.params.id)
app.post("/uppgift/:id/ta-bort", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  todos.splice(index, 1);

  res.redirect("/");
});

app.listen(8080, () => {
  console.log("http://localhost:8080/");
});
