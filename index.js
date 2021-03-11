//Sample for Assignment 3
const express = require("express");

//Import a body parser module to be able to access the request body as json
const bodyParser = require("body-parser");

//Use cors to avoid issues with testing on localhost
const cors = require("cors");
const e = require("express");

const app = express();

//Port environment variable already set up to run on Heroku
var port = process.env.PORT || 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());

//The following is an example of an array of three boards.
nextId = 4;
nextTaskId = 4;
var boards = [
  {
    id: "0",
    name: "Planned",
    description: "Everything that's on the todo list.",
    tasks: ["0", "1", "2"],
  },
  {
    id: "1",
    name: "Ongoing",
    description: "Currently in progress.",
    tasks: [],
  },
  { id: "3", name: "Done", description: "Completed tasks.", tasks: ["3"] },
];

var tasks = [
  {
    id: "0",
    boardId: "0",
    taskName: "Another task",
    dateCreated: new Date(Date.UTC(2021, 00, 21, 15, 48)),
    archived: false,
  },
  {
    id: "1",
    boardId: "0",
    taskName: "Prepare exam draft",
    dateCreated: new Date(Date.UTC(2021, 00, 21, 16, 48)),
    archived: false,
  },
  {
    id: "2",
    boardId: "0",
    taskName: "Discuss exam organisation",
    dateCreated: new Date(Date.UTC(2021, 00, 21, 14, 48)),
    archived: false,
  },
  {
    id: "3",
    boardId: "3",
    taskName: "Prepare assignment 2",
    dateCreated: new Date(Date.UTC(2021, 00, 10, 16, 00)),
    archived: true,
  },
];

//Your endpoints go here

//GET all boards
app.get("/boards", (req, res) => {
  const boardsWithoutTasks = boards.map((board) => {
    const { tasks, ...boardWithoutTask } = board;
    return boardWithoutTask;
  });
  res.status(200).json(boardsWithoutTasks);
});

//GET all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

//GET specific board
app.get("/boards/:id", (req, res) => {
  const board = boards.find((board) => board.id == req.params.id);
  if (board) {
    res.status(200).json(board);
  } else {
    res.status(404).json({ message: "Board with id " + req.params.id + " does not exist." });
  }
});

//GET tasks for specific board
app.get("/boards/:boardId/tasks", (req, res) => {
  const taskArray = tasks.map((task) => task.boardId == req.params.boardId);
  if (!taskArray) {
    res.status(404).json({
      message: "Board with id " + req.params.boardId + " does not exist."
    });
    return;
  }
  res.status(200).json(taskArray);
  return;
});

//GET specific task
app.get("/boards/:boardId/tasks/:taskId", (req, res) => {
  const board = boards.find((board) => board.id == req.params.boardId);
  const task = tasks.find((task) => task.id == req.params.taskId);
  if (!board) {
    res.status(404).json({
      message: "Board with id " + req.params.boardId + " does not exist."
    });
    return;
  }
  if (!task) {
    res.status(404).json({
      message: "Task with id " + req.params.taskId + " does not exist."
    });
    return;
  }
  res.status(200).json(task);
  return;
});

//CREATE new board
app.post("/boards", (req, res) => {
  if ( req.body === undefined || req.body.name === undefined || req.body.description === undefined ) {
    res.status(400).json({ message: "Name and description are required" });
  } else {
    let newBoard = {
      name: req.body.name,
      description: req.body.description,
      tasks: [],
      id: nextId.toString(),
    };
    boards.push(newBoard);

    nextId++;
    res.status(201).json(newBoard);
  }
});

//CREATE new task
app.post("/boards/:boardId/taskName", (req, res) => {
  if ( req.body === undefined || req.body.taskName === undefined ) {
    res.status(400).json({ message: "Name and description are required" });
  } else {
    let newTask = {
      id: nextTaskId.toString(),
      boardId: req.params.boardId,
      taskName: req.params.taskName,
      dateCreated: new Date(milliseconds)
    };
    tasks.push(newTask);

    nextTaskId++;
    res.status(201).json(newTask);
  }
});

//UPDATE board
app.put("/boards/:id", (req, res) => {
  if (req.body === undefined || req.body.name === undefined || req.body.description === undefined) {
    res.status(400).json({ message: "Name and description are required" });
  } else {
    const board = boards.find((board) => board.id == req.params.id);
    if (board) {
      board.name = req.body.name;
      board.description = req.body.description;
      res.status(200).json(board);
    } else {
      res.status(404).json({
        message: "Board with id " + req.params.boardId + " does not exist."
      });
    }
  }
});

//DELETE all boards
app.delete("/boards", (req, res) => {
  var returnArray = boards.slice();
  boards = [];
  res.status(200).json(returnArray);
});

//DELETE specific board
app.delete("/boards/:boardId", (req, res) => {
  const board = boards.find((board) => board.id == req.params.boardId);
  if (!board) {
    res.status(404).json({
      message: "Board with id " + req.params.boardId + " does not exist."
    });
    return;
  }
  boards = boards.filter((board) => board.id != req.params.boardId);
  res.status(200).json(board);
  return;
});

//DELETE a task
app.delete("/boards/:boardId/tasks/:taskId", (req, res) => {
  const board = boards.find((board) => board.id == req.params.boardId);
  const task = tasks.find((task) => task.id == req.params.taskId);
  if (!board) {
    res.status(404).json({
      message: "Board with id " + req.params.boardId + " does not exist."
    });
    return;
  }
  if (!task) {
    res.status(404).json({
      message: "Task with id " + req.params.taskId + " does not exist."
    });
    return;
  }

  const newTaskList = board.tasks.filter((task) => task != req.params.taskId);

  board.tasks = newTaskList;
  tasks = tasks.filter((task) => task.id != req.params.taskId);
  res.status(200).json(task);
  return;
});

//Start the server
app.listen(port, () => {
  console.log("Event app listening...");
});
