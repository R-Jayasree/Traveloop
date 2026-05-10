import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Trash2, Edit3, MoreVertical, Plus } from 'lucide-react';

const MyTrips = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/trips', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrips(res.data);
        } catch (err) {
            console.error('Error fetching trips', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this trip?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/trips/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrips(trips.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting trip', err);
        }
    };

    if (loading) return <div className="container mt-1">Loading trips...</div>;

    return (
        <div className="container mt-1">
            <header className="flex justify-between align-center mb-1">
                <h1>My Trips</h1>
                <Link to="/create-trip" className="btn btn-primary">
                    <Plus size={20} /> New Trip
                </Link>
            </header>

            {trips.length > 0 ? (
                <div className="trips-grid">
                    {trips.map(trip => (
                        <div key={trip.id} className="card trip-card">
                            <div className="trip-card-img" style={{ backgroundImage: `url(${trip.cover_photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400'})` }}>
                                <div className="trip-badge">${trip.total_budget || 0}</div>
                            </div>
                            <div className="trip-card-content">
                                <div className="flex justify-between align-center mb-1">
                                    <h3>{trip.name}</h3>
                                    <div className="actions flex gap-1">
                                        <button onClick={() => { console.log('Navigating to trip:', trip.id); navigate(`/trips/edit/${trip.id}`); }} className="action-btn"><Edit3 size={16} /></button>
                                        <button onClick={() => handleDelete(trip.id)} className="action-btn delete"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="flex align-center gap-1 text-muted mb-1" style={{ fontSize: '0.9rem' }}>
                                    <Calendar size={14} /> 
                                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                                </div>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>{trip.description}</p>
                                <div className="flex gap-1 mt-1">
                                    <Link to={`/trips/view/${trip.id}`} className="btn btn-accent" style={{ flex: 1, justifyContent: 'center' }}>
                                        View Itinerary
                                    </Link>
                                    <Link to={`/trips/edit/${trip.id}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                        Plan Trip
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '5rem' }}>
                    <p className="text-muted">You haven't planned any trips yet.</p>
                    <Link to="/create-trip" className="btn btn-primary mt-1">Start Planning</Link>
                </div>
            )}

            <style jsx="true">{`
                .trips-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2rem;
                }
                .trip-card {
                    padding: 0;
                    overflow: hidden;
                }
                .trip-card-img {
                    height: 180px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }
                .trip-badge {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: var(--primary);
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .trip-card-content {
                    padding: 1.5rem;
                }
                .action-btn {
                    background: none;
                    color: var(--text-muted);
                    padding: 0.5rem;
                    border-radius: 50%;
                }
                .action-btn:hover {
                    background: #f0f0f0;
                }
                .action-btn.delete:hover {
                    color: #d32f2f;
                    background: #ffebee;
                }
            `}</style>
        </div>
    );
};

export default MyTrips;
