const db = require('../config/db');
const crypto = require('crypto');

exports.getTrips = async (req, res) => {
    try {
        const [trips] = await db.execute(
            'SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching trips' });
    }
};

exports.getRecentTrips = async (req, res) => {
    try {
        const [trips] = await db.execute(
            'SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC LIMIT 3',
            [req.user.id]
        );
        res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching recent trips' });
    }
};

exports.createTrip = async (req, res) => {
    try {
        const { name, description, start_date, end_date, cover_photo, total_budget } = req.body;
        const id = 't' + crypto.randomBytes(4).toString('hex');
        
        await db.execute(
            'INSERT INTO trips (id, user_id, name, description, start_date, end_date, cover_photo, total_budget) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, req.user.id, name, description, start_date, end_date, cover_photo || null, total_budget || 0]
        );

        res.status(201).json({ id, name, description, start_date, end_date });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating trip' });
    }
};

exports.getTripById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching trip details for ID:', id, 'User:', req.user.id);
        const [trips] = await db.execute('SELECT * FROM trips WHERE id = ?', [id]);
        
        console.log('Trips found:', trips.length);
        if (trips.length === 0) return res.status(404).json({ message: 'Trip not found' });
        const trip = trips[0];

        // Fetch stops
        const [stops] = await db.execute('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC', [id]);
        
        // Fetch activities for each stop
        const stopsWithActivities = await Promise.all(stops.map(async (stop) => {
            const [activities] = await db.execute('SELECT * FROM activities WHERE stop_id = ? ORDER BY scheduled_time ASC', [stop.id]);
            return { ...stop, activities };
        }));

        res.json({ ...trip, stops: stopsWithActivities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching trip details' });
    }
};

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        // Recent trips
        const [recentTrips] = await db.execute(
            'SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC LIMIT 3',
            [userId]
        );
        console.log('Recent trips IDs:', recentTrips.map(t => t.id));

        // Recommended cities
        const [recommendedCities] = await db.execute(
            'SELECT * FROM cities ORDER BY popularity DESC LIMIT 4'
        );

        // Stats
        const [stats] = await db.execute(
            'SELECT COUNT(*) as tripCount, SUM(total_budget) as totalBudget FROM trips WHERE user_id = ?',
            [userId]
        );

        res.json({
            recentTrips,
            recommendedCities,
            stats: stats[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM trips WHERE id = ? AND user_id = ?', [id, req.user.id]);
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting trip' });
    }
};
