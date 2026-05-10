import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, MapPin, Calendar, Clock, ChevronRight, Search, X } from 'lucide-react';

const ItineraryBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCitySearch, setShowCitySearch] = useState(false);
    const [showActivitySearch, setShowActivitySearch] = useState(null); // stores stop object
    
    const [cities, setCities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [catalogActivities, setCatalogActivities] = useState([]);

    const fetchTrip = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/trips/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrip(res.data);
        } catch (err) {
            console.error('Error fetching trip', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTrip();
    }, [fetchTrip]);

    const handleSearchCities = async (q) => {
        setSearchQuery(q);
        if (!q) { setCities([]); return; }
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/cities?search=${q}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCities(res.data);
        } catch (err) { console.error(err); }
    };

    const addStop = async (city) => {
        try {
            const token = localStorage.getItem('token');
            const defaultDate = new Date().toISOString().split('T')[0];
            await axios.post(`http://localhost:5000/api/stops`, {
                trip_id: id,
                city_name: city.name,
                country: city.country,
                arrival_date: trip.start_date ? new Date(trip.start_date).toISOString().split('T')[0] : defaultDate,
                departure_date: trip.end_date ? new Date(trip.end_date).toISOString().split('T')[0] : defaultDate,
                order_index: trip.stops ? trip.stops.length : 0
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            setShowCitySearch(false);
            setSearchQuery('');
            setCities([]);
            fetchTrip();
        } catch (err) { console.error(err); }
    };

    const deleteStop = async (stopId) => {
        if (!window.confirm('Remove this city from your trip?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/stops/${stopId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrip();
        } catch (err) { console.error(err); }
    };

    const openActivitySearch = async (stop) => {
        setShowActivitySearch(stop);
        try {
            const token = localStorage.getItem('token');
            // We need city_id for catalog search. Let's find it by name or pass it from city search.
            // For now, I'll search by city name in the cities table to get ID if not present.
            const cityRes = await axios.get(`http://localhost:5000/api/cities?search=${stop.city_name}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (cityRes.data.length > 0) {
                const catalogRes = await axios.get(`http://localhost:5000/api/activity-catalog/${cityRes.data[0].id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCatalogActivities(catalogRes.data);
            }
        } catch (err) { console.error(err); }
    };

    const addActivity = async (catAct) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/activities`, {
                stop_id: showActivitySearch.id,
                name: catAct.name,
                type: catAct.type,
                cost: catAct.avg_cost,
                duration_hours: catAct.duration_hours,
                description: catAct.description,
                scheduled_time: '10:00:00' // Default time
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            setShowActivitySearch(null);
            setCatalogActivities([]);
            fetchTrip();
        } catch (err) { console.error(err); }
    };

    const deleteActivity = async (actId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/activities/${actId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrip();
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="container mt-1">Loading builder...</div>;
    if (!trip) return <div className="container mt-1">Trip not found</div>;

    return (
        <div className="container mt-1">
            <header className="flex justify-between align-center mb-1">
                <div>
                    <h1 style={{ marginBottom: '0.2rem' }}>{trip.name}</h1>
                    <p className="text-muted">Itinerary Builder</p>
                </div>
                <div className="flex gap-1">
                    <button onClick={() => navigate(`/trips/view/${id}`)} className="btn">View Itinerary</button>
                    <button onClick={() => setShowCitySearch(true)} className="btn btn-primary">
                        <Plus size={18} /> Add City
                    </button>
                </div>
            </header>

            <div className="builder-layout">
                <div className="stops-timeline">
                    {trip.stops.length > 0 ? (
                        trip.stops.map((stop, index) => (
                            <div key={stop.id} className="stop-node">
                                <div className="stop-header card">
                                    <div className="flex justify-between align-center">
                                        <div className="flex align-center gap-1">
                                            <div className="stop-number">{index + 1}</div>
                                            <div>
                                                <h3>{stop.city_name}, {stop.country}</h3>
                                                <div className="flex gap-1 text-muted" style={{ fontSize: '0.85rem' }}>
                                                    <Calendar size={14} /> {new Date(stop.arrival_date).toLocaleDateString()} - {new Date(stop.departure_date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => openActivitySearch(stop)} className="btn btn-sm" style={{ background: '#f0f7f7', color: 'var(--primary)' }}>
                                                <Plus size={16} /> Add Activity
                                            </button>
                                            <button onClick={() => deleteStop(stop.id)} className="action-btn delete"><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <div className="activities-list mt-1">
                                        {stop.activities?.length > 0 ? (
                                            stop.activities.map(act => (
                                                <div key={act.id} className="activity-item flex justify-between align-center">
                                                    <div className="flex align-center gap-1">
                                                        <Clock size={14} className="text-muted" />
                                                        <span>{act.scheduled_time.substring(0, 5)}</span>
                                                        <span className="act-name">{act.name}</span>
                                                        <span className="act-type">{act.type}</span>
                                                    </div>
                                                    <div className="flex align-center gap-1">
                                                        <span className="act-cost">${act.cost}</span>
                                                        <button onClick={() => deleteActivity(act.id)} className="action-btn delete"><X size={14} /></button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>No activities added yet.</p>
                                        )}
                                    </div>
                                </div>
                                {index < trip.stops.length - 1 && <div className="timeline-line"></div>}
                            </div>
                        ))
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                            <MapPin size={48} className="text-muted mb-1" style={{ opacity: 0.3 }} />
                            <h3>Your itinerary is empty</h3>
                            <p className="text-muted">Start by adding a city you want to visit.</p>
                            <button onClick={() => setShowCitySearch(true)} className="btn btn-primary mt-1">Add First City</button>
                        </div>
                    )}
                </div>
            </div>

            {/* City Search Modal */}
            {showCitySearch && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <div className="flex justify-between align-center mb-1">
                            <h2>Add a City</h2>
                            <button onClick={() => setShowCitySearch(false)} className="action-btn"><X size={24} /></button>
                        </div>
                        <div className="search-box">
                            <Search size={20} className="search-icon" />
                            <input 
                                autoFocus
                                placeholder="Search cities (e.g. Paris, Tokyo...)"
                                value={searchQuery}
                                onChange={(e) => handleSearchCities(e.target.value)}
                            />
                        </div>
                        <div className="search-results">
                            {cities.map(city => (
                                <div key={city.id} className="search-item flex justify-between align-center" onClick={() => addStop(city)}>
                                    <div>
                                        <strong>{city.name}</strong>
                                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>{city.country} • {city.region}</p>
                                    </div>
                                    <button className="btn btn-sm">Select</button>
                                </div>
                            ))}
                            {searchQuery && cities.length === 0 && <p className="text-muted">No cities found.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Search Modal */}
            {showActivitySearch && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <div className="flex justify-between align-center mb-1">
                            <h2>Activities in {showActivitySearch.city_name}</h2>
                            <button onClick={() => {setShowActivitySearch(null); setCatalogActivities([]);}} className="action-btn"><X size={24} /></button>
                        </div>
                        <div className="catalog-list">
                            {catalogActivities.length > 0 ? (
                                catalogActivities.map(act => (
                                    <div key={act.id} className="catalog-item card flex justify-between align-center" onClick={() => addActivity(act)}>
                                        <div>
                                            <strong>{act.name}</strong>
                                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>{act.type} • {act.duration_hours}h • avg ${act.avg_cost}</p>
                                        </div>
                                        <button className="btn btn-sm btn-primary">Add</button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No curated activities found for this city.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx="true">{`
                .builder-layout {
                    max-width: 900px;
                    margin: 2rem auto;
                }
                .stop-node {
                    position: relative;
                    margin-bottom: 2rem;
                }
                .stop-header {
                    padding: 1.5rem;
                    z-index: 2;
                    position: relative;
                }
                .stop-number {
                    width: 32px;
                    height: 32px;
                    background: var(--primary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 0.9rem;
                }
                .timeline-line {
                    position: absolute;
                    left: 31px;
                    top: 100%;
                    height: 2rem;
                    width: 2px;
                    background: var(--border);
                    z-index: 1;
                }
                .activity-item {
                    padding: 0.8rem;
                    border-bottom: 1px solid #f9f9f9;
                    font-size: 0.9rem;
                }
                .act-name { font-weight: 600; }
                .act-type { 
                    font-size: 0.75rem; 
                    background: #eee; 
                    padding: 0.2rem 0.5rem; 
                    border-radius: 4px; 
                    color: var(--text-muted);
                }
                .act-cost { font-weight: 600; color: var(--primary); }
                
                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 2rem;
                }
                .modal-content {
                    width: 100%;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow-y: auto;
                    padding: 2rem;
                }
                .search-box {
                    position: relative;
                    margin-bottom: 1.5rem;
                }
                .search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }
                .search-box input {
                    padding-left: 3rem;
                    margin-bottom: 0;
                }
                .search-item, .catalog-item {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border);
                    cursor: pointer;
                    transition: var(--transition);
                }
                .search-item:hover, .catalog-item:hover {
                    background: #f0f7f7;
                }
                .catalog-item {
                    margin-bottom: 0.8rem;
                }
                .action-btn.delete:hover {
                    color: #d32f2f;
                    background: #ffebee;
                }
                .btn-sm {
                    padding: 0.4rem 0.8rem;
                    font-size: 0.8rem;
                }
            `}</style>
        </div>
    );
};

export default ItineraryBuilder;
