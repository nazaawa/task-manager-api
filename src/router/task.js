const express = require('express')
const router = express.Router();
const auth = require("../middleware/auth")
const Task = require('../model/tasks')

router.post("/tasks", auth, async (req, res) => {
  const task = Task({
    ...req.body, owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {

  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip : parseInt(req.query.skip)
      }
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, "owner": req.user._id });
    if (!task) {
      res.status(404).send({ "error": "Task not found" });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["description", "completed"];
  const isAllowed = updates.every((value) => allowedUpdate.includes(value));

  if (!isAllowed) {
    res.status(400).send({ error: "Invalid fields" });
  }
  const _id = req.params.id;
  try {
    const tasks = await Task.findOne({ _id, "owner": req.user._id })
    // const tasks = await Task.findById(req.params.id);
    if (!tasks) {
      res.status(404).send({ "error": "Task not found" });
    }
    updates.forEach((update) => tasks[update] = req.body[update]);

    await tasks.save()

    res.send(tasks);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
},);

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const tasks = await Task.findOneAndDelete({ _id: req.params.id, "owner": req.user._id });
    res.send(tasks);
  } catch (error) {

    res.status(500).send(error)
  }
});


module.exports = router;