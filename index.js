// simple web server
const express = require("express");
const app = express();
// const cors = require("cors");
// app.use(cors);

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path", req.path);
  console.log("Body", req.body);
  console.log("---");
  next();
};

app.use(express.json());
app.use(requestLogger);
const cors = require("cors");

app.use(cors());
app.use(express.static("dist"));

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

/*
 */

app.get("/", (request, response) => {
  response.send("<h1>Hello world!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

// fetch individual note
app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes((note) => note.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (req, res) => {
  const body = req.body;
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };

  notes = notes.concat(note);
  response.json(note);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3100;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
