import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, MapPin, Calendar, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/trips/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error('Error fetching dashboard', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="container mt-1">Loading dashboard...</div>;

    return (
        <div className="container mt-1">
            <header className="flex justify-between align-center mb-1">
                <div>
                    <h1>Welcome back, {user.name}!</h1>
                    <p className="text-muted">Where are we going next?</p>
                </div>
                <Link to="/create-trip" className="btn btn-primary">
                    <Plus size={20} /> Plan New Trip
                </Link>
            </header>

            <section className="stats-grid mb-1">
                <div className="card stat-card">
                    <div className="flex align-center gap-1">
                        <div className="stat-icon" style={{ background: '#e0f2f1', color: '#00695c' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="stat-label">Total Trips</p>
                            <h3>{data?.stats?.tripCount || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="flex align-center gap-1">
                        <div className="stat-icon" style={{ background: '#fff3e0', color: '#ef6c00' }}>
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="stat-label">Total Budget</p>
                            <h3>${data?.stats?.totalBudget || 0}</h3>
                        </div>
                    </div>
                </div>
            </section>

            <div className="dashboard-content">
                <div className="main-col">
                    <h2 className="mb-1">Recent Trips</h2>
                    <div className="trips-list">
                        {data?.recentTrips?.length > 0 ? (
                            data.recentTrips.map(trip => (
                                <Link to={`/trips/view/${trip.id}`} key={trip.id} className="card trip-card flex">
                                    <div className="trip-img" style={{ backgroundImage: `url(${trip.cover_photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=300'})` }}></div>
                                    <div className="trip-info">
                                        <h3>{trip.name}</h3>
                                        <div className="flex align-center gap-1 text-muted" style={{ fontSize: '0.9rem' }}>
                                            <Calendar size={14} /> 
                                            {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                                        </div>
                                        <p className="trip-desc">{trip.description}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                                <p className="text-muted">No trips found. Start planning your first adventure!</p>
                                <Link to="/create-trip" className="btn btn-accent mt-1">Create a Trip</Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="side-col">
                    <h2 className="mb-1">Top Destinations</h2>
                    <div className="destinations-grid">
                        {data?.recommendedCities?.map(city => (
                            <div key={city.id} className="card dest-card">
                                <div className="dest-img" style={{ backgroundImage: `url(${city.image_url || 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=200'})` }}></div>
                                <div className="dest-info">
                                    <h4>{city.name}</h4>
                                    <p className="text-muted">{city.country}</p>
                                    <div className="popularity flex align-center gap-1">
                                        <TrendingUp size={12} /> {city.popularity}% Popular
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }
                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .stat-label {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin-bottom: 0.2rem;
                }
                .dashboard-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                }
                .trip-card {
                    margin-bottom: 1rem;
                    padding: 1rem;
                    gap: 1.5rem;
                }
                .trip-img {
                    width: 120px;
                    height: 100px;
                    border-radius: 8px;
                    background-size: cover;
                    background-position: center;
                    flex-shrink: 0;
                }
                .trip-desc {
                    margin-top: 0.5rem;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .dest-card {
                    padding: 0.8rem;
                    margin-bottom: 1rem;
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .dest-img {
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                    background-size: cover;
                    background-position: center;
                }
                .dest-info h4 {
                    margin-bottom: 0;
                    font-size: 1rem;
                }
                .popularity {
                    font-size: 0.75rem;
                    color: var(--primary);
                    margin-top: 0.2rem;
                    font-weight: 600;
                }
                @media (max-width: 768px) {
                    .dashboard-content {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
