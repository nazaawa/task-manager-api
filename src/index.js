const express = require("express");
const app = express();

require("./db/mongoose");
const userRouter = require("./router/user");
const taskRouter = require("./router/task");


app.use(express.json());
app.use(userRouter)
app.use(taskRouter)
const port  = process.env.PORT
const multer = require("multer");
const upload = multer({
  dest : 'images'
})

const jwt = require("jsonwebtoken")
const Task = require("./model/tasks")

//myFunction()
app.listen(port, () => {
  console.log("port ouvert",port);
});
