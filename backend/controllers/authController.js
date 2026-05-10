const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        const [existing] = await db.execute('SELECT * FROM profiles WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const id = 'u' + crypto.randomBytes(4).toString('hex');
        const password_hash = await bcrypt.hash(password, 10);
        const avatar_url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

        await db.execute(
            'INSERT INTO profiles (id, name, email, password_hash, avatar_url) VALUES (?, ?, ?, ?, ?)',
            [id, name, email, password_hash, avatar_url]
        );

        const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            token,
            user: { id, name, email, avatar_url }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.execute('SELECT * FROM profiles WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar_url: user.avatar_url,
                language: user.language
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, avatar_url, language FROM profiles WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};
