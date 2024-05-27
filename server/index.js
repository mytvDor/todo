const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const port = 2000;

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

mongoose
  .connect(
    "mongodb+srv://sumit:sumit@cluster0.zbvhxl2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("mongo connected successfully |");
  })
  .catch((error) => {
    console.log("error for mongodb connection", error);
  });

const todo = new mongoose.Schema({
  id: { type: String, requires: true, unique: true },
  name: { type: String, required: true },
  txt: { type: String, requires: true },
});

const mytodo = mongoose.model("mytodo", todo);
app.post("/todo", async (req, res) => {
  try {
    const { id, name, txt } = req.body;

    if (id) {
      const exist = await mytodo.findOne({ id });
      if (exist) {
        return res.status(404).send("it exist");
      }
    }

    await mytodo.create({
      id,
      name,
      txt,
    });

    res.status(200).send("done");
  } catch (error) {
    console.log("error while posting \n\n\n\n", error);
  }
});

app.get("/todo", async (req, res) => {
  try {
    const todos = await mytodo.find({});
    res.status(200).send(todos);
  } catch (err) {
    console.log("error at getting data \n\n\n\n\n", err);
  }
});

app.delete("/todos", async (req, res) => {
  try {
    const { id } = req.body;
    console.log("Received delete request for id:", id);
    if (!id) {
      return res.status(400).send("ID is required to delete a todo");
    }

    const result = await mytodo.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).send("Todo not found");
    }

    res.status(200).send("Todo deleted successfully");
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).send("Error deleting todo");
  }
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
