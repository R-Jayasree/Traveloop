const db = require('../config/db');

exports.getActivitiesByCity = async (req, res) => {
    try {
        const { city_id } = req.params;
        const { type } = req.query;
        let query = 'SELECT * FROM activity_catalog WHERE city_id = ?';
        let params = [city_id];

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        const [activities] = await db.execute(query, params);
        res.json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching activity catalog' });
    }
};
