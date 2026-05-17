const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3003;

const user = process.env.USER_NAME;
const password = process.env.USER_PWD;
const dbUrl = process.env.DB_URL || "mongo-service";

const mongoUrl = `mongodb://${user}:${password}@${dbUrl}:27017`;

app.get("/", (req, res) => {
  res.send("Hello from Fares Kubernetes CI/CD app v1");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/db", async (req, res) => {
  let client;

  try {
    client = new MongoClient(mongoUrl);
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    res.status(200).send("MongoDB connection successful");
  } catch (error) {
    res.status(500).send("MongoDB connection failed: " + error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});