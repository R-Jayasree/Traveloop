// backend/controllers/publicItineraryController.js
const db = require('../config/db');

// GET /api/public/:hash  (no auth)
exports.getPublicItinerary = async (req, res) => {
  try {
    const { hash } = req.params;
    // Find the trip id from public_trips table
    const [publicRows] = await db.execute('SELECT trip_id FROM public_trips WHERE hash = ?', [hash]);
    if (publicRows.length === 0) return res.status(404).json({ message: 'Public itinerary not found' });
    const tripId = publicRows[0].trip_id;

    // Re‑use existing trip controller logic to fetch full trip data (stops & activities)
    const [tripRows] = await db.execute('SELECT * FROM trips WHERE id = ?', [tripId]);
    if (tripRows.length === 0) return res.status(404).json({ message: 'Trip not found' });
    const trip = tripRows[0];

    // Fetch stops and activities
    const [stopRows] = await db.execute('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index', [tripId]);
    for (const stop of stopRows) {
      const [actRows] = await db.execute('SELECT * FROM activities WHERE stop_id = ?', [stop.id]);
      stop.activities = actRows;
    }
    trip.stops = stopRows;
    res.json(trip);
  } catch (err) {
    console.error('Error fetching public itinerary', err);
    res.status(500).json({ message: 'Server error' });
  }
};
