/* const Task = require("../src/model/tasks");
require("../src/db/mongoose");

/* Task.findByIdAndRemove("62875a1defe077eb03415114")
  .then((task) => {
    if (!task) {
      console.log("no found");
    }
    console.log(task);
    return Task.countDocuments({ completed: false });
  })
  .then((result) => {
    console.log(result);
  })
  .catch((e) => console.log(e)); */
/* 
const deleteTaskById = async (id) => {
  const task = await Task.findByIdAndRemove(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskById("6282b909d2189231a3ba6f19")
  .then((result) => {
    console.log(result);
  })
  .catch((e) => console.log(e));
  */

const map = {
    "des":"cool"
}
  
console.log(Object.keys(map))