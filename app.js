const { Socket } = require("engine.io");
const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs").promises;

const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const players  = {}

let word_set = new Set();

async function loadWords() {
    try {
        const data = await fs.readFile(__dirname + "/public/wordle-words.txt", "utf-8");
        word_array = data.split(/\s+/);
        word_set = new Set(word_array);
    } catch (err) {
        console.error("Word file not found");
    }
};

function getGuessWord() {
    const randomIndex = Math.floor(Math.random() * word_array.length);
    return guess_word = word_array[randomIndex].toUpperCase();
}

io.on("connection", (socket) => {
    console.log("a user connected");
    players[socket.id] = {
        score: 0,
        guess_word: getGuessWord(),
    };
    
    // socket.emit if only needed for the player that joined
    io.emit("updateScore", players);
    socket.emit("updateGuessWord", players);

    console.log(players)
  });

  server.listen(port, async () => {
    await loadWords();
    console.log(`Server running on port ${port}`);
});