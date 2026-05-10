const db = require('../config/db');
const crypto = require('crypto');

exports.getActivitiesByStop = async (req, res) => {
    try {
        const [activities] = await db.execute(
            'SELECT * FROM activities WHERE stop_id = ? ORDER BY scheduled_time ASC',
            [req.params.stop_id]
        );
        res.json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching activities' });
    }
};

exports.addActivity = async (req, res) => {
    try {
        const { stop_id, name, type, cost, duration_hours, description, scheduled_time } = req.body;
        const id = 'a' + crypto.randomBytes(4).toString('hex');

        await db.execute(
            'INSERT INTO activities (id, stop_id, name, type, cost, duration_hours, description, scheduled_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, stop_id, name, type, cost || 0, duration_hours || 0, description, scheduled_time]
        );

        res.status(201).json({ id, name, scheduled_time });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding activity' });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        await db.execute('DELETE FROM activities WHERE id = ?', [req.params.id]);
        res.json({ message: 'Activity deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting activity' });
    }
};
