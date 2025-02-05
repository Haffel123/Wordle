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

const players  = {};

let word_array = [];
let word_set = new Set();
let highscore = 0;

async function loadWords() {
    try {
        const data = await fs.readFile(__dirname + "/public/wordle-words.txt", "utf-8");
        word_array = data.split(/\s+/);
        word_set = new Set(word_array);
    } catch (err) {
        console.error("Word file not found");
    };
};

function generateGuessWord() {
    const randomIndex = Math.floor(Math.random() * word_array.length);
    return guess_word = word_array[randomIndex].toUpperCase();
};

function calcHighscore() {
    if (players && Object.keys(players).length > 0) {
        highscore = Math.max(...Object.values(players).map(player => player.score));
    } else {
        highscore = 0;
    };
}

io.on("connection", (socket) => {
    console.log("a user connected");
    
    players[socket.id] = {
        score: 0,
        guess_word: "",
    };
    
    // socket.emit if only needed for the player that requested
    // io.emit for all

    socket.on("updateScore", () => {
        players[socket.id].score++;
        socket.emit("updateScoreText", players[socket.id].score);
        calcHighscore();
        io.emit("updateHighscoreText", highscore);
        console.log(players)
    });

    socket.on("getHighscore", () => {
        calcHighscore();
        io.emit("updateHighscoreText", highscore);
    });

    socket.on("getGuessWord", () => {
        socket.emit("guessWord", players[socket.id].guess_word);
    });

    socket.on("generateGuessWord", () => {
        players[socket.id].guess_word = generateGuessWord();
        console.log(players[socket.id]["guess_word"])
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        delete players[socket.id];
    });

    console.log(players);
  });

  server.listen(port, async () => {
    await loadWords();
    console.log(`Server running on port ${port}`);
});