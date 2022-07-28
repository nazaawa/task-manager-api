const User = require("../src/model/users");
require("../src/db/mongoose");
User.findByIdAndUpdate("62839c57482a190d60e59805", { age: 4 })
  .then((user) => {
    console.log(user);
    return User.countDocuments({ age: 1 });
  })
  .then((results) => {
    console.log(results);
  })
  .catch((e) => {
    console.log(e);
  });
