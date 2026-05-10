// backend/controllers/packingController.js
const db = require('../config/db');
const crypto = require('crypto');

// Get all packing items for a trip
exports.getPackingItems = async (req, res) => {
  const { tripId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM packing_items WHERE trip_id = ?', [tripId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching packing items', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new packing item
exports.addPackingItem = async (req, res) => {
  const { tripId } = req.params;
  const { name, category } = req.body;
  const id = 'p' + crypto.randomBytes(4).toString('hex');
  try {
    await db.query(
      'INSERT INTO packing_items (id, trip_id, name, category, is_packed) VALUES (?, ?, ?, ?, FALSE)',
      [id, tripId, name, category]
    );
    res.status(201).json({ id, name, category, is_packed: false });
  } catch (err) {
    console.error('Error adding packing item', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update an existing packing item (toggle is_packed or edit fields)
exports.updatePackingItem = async (req, res) => {
  const { id } = req.params;
  const { name, category, is_packed } = req.body;
  try {
    const fields = [];
    const values = [];
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (category !== undefined) { fields.push('category = ?'); values.push(category); }
    if (is_packed !== undefined) { fields.push('is_packed = ?'); values.push(is_packed); }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    await db.query(`UPDATE packing_items SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ id, name, category, is_packed });
  } catch (err) {
    console.error('Error updating packing item', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a packing item
exports.deletePackingItem = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM packing_items WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting packing item', err);
    res.status(500).json({ error: 'Server error' });
  }
};
