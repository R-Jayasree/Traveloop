const db = require('../config/db');

exports.getCities = async (req, res) => {
    try {
        const { search, region } = req.query;
        let query = 'SELECT * FROM cities';
        let params = [];

        if (search || region) {
            query += ' WHERE';
            if (search) {
                query += ' (name LIKE ? OR country LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }
            if (region) {
                if (search) query += ' AND';
                query += ' region = ?';
                params.push(region);
            }
        }

        query += ' ORDER BY popularity DESC';
        const [cities] = await db.execute(query, params);
        res.json(cities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cities' });
    }
};

exports.getCityById = async (req, res) => {
    try {
        const [cities] = await db.execute('SELECT * FROM cities WHERE id = ?', [req.params.id]);
        if (cities.length === 0) return res.status(404).json({ message: 'City not found' });
        res.json(cities[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching city details' });
    }
};
