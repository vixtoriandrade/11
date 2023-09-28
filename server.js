const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS and JS)
app.use(express.static('public'));

// HTML Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  newNote.id = notes.length + 1;
  notes.push(newNote);
  fs.writeFileSync('./db.json', JSON.stringify(notes));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);
  let notes = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  notes = notes.filter((note) => note.id !== idToDelete);
  fs.writeFileSync('./db.json', JSON.stringify(notes));
  res.json({ message: 'Note deleted' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
