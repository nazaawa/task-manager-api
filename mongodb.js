const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;

const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

mongoClient.connect(
  connectionUrl,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to the database");
    }
    const db = client.db(databaseName);

    db.collection("tasks")
      .deleteOne({ description: " finish" })
      .then((result) => {
        console.log("Task finished");
      })
      .catch((e) => {
        console.log(e);
      });
  }
);
