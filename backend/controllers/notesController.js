// backend/controllers/notesController.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all notes for a trip (optionally filter by stop)
exports.getNotes = async (req, res) => {
  const { tripId } = req.params;
  const { stopId } = req.query; // optional
  try {
    let query = 'SELECT * FROM notes WHERE trip_id = ?';
    const params = [tripId];
    if (stopId) {
      query += ' AND stop_id = ?';
      params.push(stopId);
    }
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching notes', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new note
exports.addNote = async (req, res) => {
  const { tripId } = req.params;
  const { stopId, content } = req.body;
  const id = uuidv4().slice(0, 8);
  try {
    await db.execute(
      'INSERT INTO notes (id, trip_id, stop_id, content) VALUES (?, ?, ?, ?)',
      [id, tripId, stopId || null, content]
    );
    res.status(201).json({ id, tripId, stopId, content });
  } catch (err) {
    console.error('Error adding note', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    await db.execute('UPDATE notes SET content = ? WHERE id = ?', [content, id]);
    res.json({ id, content });
  } catch (err) {
    console.error('Error updating note', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM notes WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting note', err);
    res.status(500).json({ error: 'Server error' });
  }
};
