const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Read levels data from JSON file
const levels = JSON.parse(fs.readFileSync('levels.json'));

// Route for the game page
app.get('/', (req, res) => {
  res.render('index', { levels });
});

// Socket.io connection handling
io.on('connection', socket => {
  // ... (your existing socket.io code)
});

// Start the server
const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
