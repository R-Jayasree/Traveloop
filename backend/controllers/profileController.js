// backend/controllers/profileController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

// GET /api/profiles/me - return current user profile
exports.getMe = async (req, res) => {
  const userId = req.user.id; // set by authMiddleware
  try {
    const [rows] = await db.execute('SELECT id, name, email, avatar_url, language, created_at FROM profiles WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching profile', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/profiles/me - update profile fields (name, avatar_url, language, password)
exports.updateMe = async (req, res) => {
  const userId = req.user.id;
  const { name, avatar_url, language, password } = req.body;
  try {
    const fields = [];
    const params = [];
    if (name) { fields.push('name = ?'); params.push(name); }
    if (avatar_url) { fields.push('avatar_url = ?'); params.push(avatar_url); }
    if (language) { fields.push('language = ?'); params.push(language); }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      fields.push('password_hash = ?');
      params.push(hash);
    }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    params.push(userId);
    await db.execute(`UPDATE profiles SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error('Error updating profile', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/profiles/me - delete user account
exports.deleteMe = async (req, res) => {
  const userId = req.user.id;
  try {
    await db.execute('DELETE FROM profiles WHERE id = ?', [userId]);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    console.error('Error deleting account', err);
    res.status(500).json({ error: 'Server error' });
  }
};
