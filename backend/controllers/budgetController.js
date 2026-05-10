// backend/controllers/budgetController.js
const db = require('../config/db');

// GET /api/budgets/:id - returns total budget and detailed breakdown
exports.getTripBudget = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch trip total_budget and budgets breakdown (transport, stay, meals, activities, misc)
    const [tripRows] = await db.query('SELECT total_budget FROM trips WHERE id = ?', [id]);
    if (tripRows.length === 0) return res.status(404).json({ message: 'Trip not found' });
    const totalBudget = parseFloat(tripRows[0].total_budget);

    const [budgetRows] = await db.query('SELECT transport, stay, meals, activities, misc FROM budgets WHERE trip_id = ?', [id]);
    const breakdown = budgetRows.length ? budgetRows[0] : {};
    // Ensure numeric values
    Object.keys(breakdown).forEach(k => breakdown[k] = parseFloat(breakdown[k] ?? 0));

    return res.json({ totalBudget, breakdown });
  } catch (err) {
    console.error('Budget fetch error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/budgets/:id
exports.updateTripBudget = async (req, res) => {
  const { id } = req.params;
  const { totalBudget, transport, stay, meals, activities, misc } = req.body;
  try {
    // Update trips table total_budget if provided
    if (totalBudget !== undefined) {
      await db.query('UPDATE trips SET total_budget = ? WHERE id = ?', [totalBudget, id]);
    }

    // Upsert budget breakdown
    const [existing] = await db.query('SELECT id FROM budgets WHERE trip_id = ?', [id]);
    if (existing.length > 0) {
      await db.query(
        'UPDATE budgets SET transport=?, stay=?, meals=?, activities=?, misc=? WHERE trip_id=?',
        [transport || 0, stay || 0, meals || 0, activities || 0, misc || 0, id]
      );
    } else {
      const crypto = require('crypto');
      const b_id = 'b' + crypto.randomBytes(4).toString('hex');
      await db.query(
        'INSERT INTO budgets (id, trip_id, transport, stay, meals, activities, misc) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [b_id, id, transport || 0, stay || 0, meals || 0, activities || 0, misc || 0]
      );
    }
    return res.json({ message: 'Budget updated successfully' });
  } catch (err) {
    console.error('Budget update error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
