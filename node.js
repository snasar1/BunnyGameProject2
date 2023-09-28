const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Read levels data from JSON file (level.json)
const levels = require('./level.json');

// Initialize high scores array
let highScores = [];

// Route for the game page
app.get('/', (req, res) => {
  res.render('index', { levels, highScores });
});

// Socket.io connection handling
io.on('connection', socket => {
  // Handle new high score submission
  socket.on('submitHighScore', ({ name, score }) => {
    // Add the new score to the highScores array
    highScores.push({ name, score });

    // Sort high scores in descending order
    highScores.sort((a, b) => b.score - a.score);

    // Keep only the top N scores (e.g., top 10)
    const maxScores = 10;
    highScores = highScores.slice(0, maxScores);

    // Broadcast updated high scores to all clients
    io.emit('updateHighScores', highScores);
  });
});

// Start the server
const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
