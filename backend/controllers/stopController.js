const db = require('../config/db');
const crypto = require('crypto');

exports.getStopsByTrip = async (req, res) => {
    try {
        const [stops] = await db.execute(
            'SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC',
            [req.params.trip_id]
        );
        res.json(stops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stops' });
    }
};

exports.addStop = async (req, res) => {
    try {
        const { trip_id, city_name, country, arrival_date, departure_date, order_index } = req.body;
        const id = 's' + crypto.randomBytes(4).toString('hex');

        await db.execute(
            'INSERT INTO stops (id, trip_id, city_name, country, arrival_date, departure_date, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, trip_id, city_name, country, arrival_date, departure_date, order_index || 0]
        );

        res.status(201).json({ id, city_name, country, arrival_date, departure_date });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding stop' });
    }
};

exports.deleteStop = async (req, res) => {
    try {
        await db.execute('DELETE FROM stops WHERE id = ?', [req.params.id]);
        res.json({ message: 'Stop deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting stop' });
    }
};
