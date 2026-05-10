import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, MapPin, ChevronLeft, Download, Share2 } from 'lucide-react';

const ItineraryView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="container mt-1">Loading itinerary...</div>;
    if (!trip) return <div className="container mt-1">Trip not found</div>;

    return (
        <div className="container mt-1">
            <header className="flex justify-between align-center mb-1">
                <button onClick={() => navigate(-1)} className="flex align-center gap-1 text-muted" style={{ background: 'none' }}>
                    <ChevronLeft size={20} /> Back
                </button>
                <div className="flex gap-1">
                    <button className="btn"><Share2 size={18} /> Share</button>
                    <button onClick={() => navigate(`/trips/edit/${id}`)} className="btn btn-primary">Edit Plan</button>
                </div>
            </header>

            <div className="itinerary-header mb-1">
                <h1 style={{ fontSize: '3rem' }}>{trip.name}</h1>
                <div className="flex gap-1 text-muted mt-1">
                    <div className="flex align-center gap-1"><Calendar size={18} /> {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</div>
                    <div className="flex align-center gap-1"><MapPin size={18} /> {trip.stops.length} Cities</div>
                </div>
                <p className="mt-1 mb-2" style={{ maxWidth: '600px' }}>{trip.description}</p>
                
                <div className="flex gap-1 flex-wrap">
                    <button onClick={() => navigate(`/budget/${id}`)} className="btn flex gap-1 align-center" style={{ backgroundColor: '#e6f7eb', color: '#0F7173', border: 'none' }}>
                        Budget Breakdown
                    </button>
                    <button onClick={() => navigate(`/packing/${id}`)} className="btn flex gap-1 align-center" style={{ backgroundColor: '#fff4e6', color: '#F4A261', border: 'none' }}>
                        Packing Checklist
                    </button>
                    <button onClick={() => navigate(`/notes/${id}`)} className="btn flex gap-1 align-center" style={{ backgroundColor: '#f0f0f0', color: '#555', border: 'none' }}>
                        Trip Notes
                    </button>
                </div>
            </div>

            <div className="itinerary-content">
                {trip.stops.map((stop, index) => (
                    <section key={stop.id} className="itinerary-stop">
                        <div className="stop-banner card flex align-center">
                            <div className="stop-index">{index + 1}</div>
                            <div>
                                <h2 style={{ marginBottom: '0.2rem' }}>{stop.city_name}</h2>
                                <p className="text-muted">{stop.country} • {new Date(stop.arrival_date).toLocaleDateString()} to {new Date(stop.departure_date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="activities-timeline mt-1">
                            {stop.activities?.length > 0 ? (
                                stop.activities.map(act => (
                                    <div key={act.id} className="view-activity-card flex">
                                        <div className="act-time-col">
                                            <div className="act-time">{act.scheduled_time.substring(0, 5)}</div>
                                            <div className="act-dot"></div>
                                        </div>
                                        <div className="act-details-col card">
                                            <div className="flex justify-between align-center mb-1">
                                                <div className="flex align-center gap-1">
                                                    <span className="badge">{act.type}</span>
                                                    <h3 style={{ margin: 0 }}>{act.name}</h3>
                                                </div>
                                                <div className="flex align-center gap-1 text-muted">
                                                    <Clock size={14} /> {act.duration_hours}h
                                                    <span style={{ marginLeft: '1rem', fontWeight: 600, color: 'var(--primary)' }}>${act.cost}</span>
                                                </div>
                                            </div>
                                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>{act.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-activities text-muted">No activities scheduled for this stop.</div>
                            )}
                        </div>
                    </section>
                ))}
            </div>

            <style jsx="true">{`
                .itinerary-stop {
                    margin-bottom: 3rem;
                }
                .stop-banner {
                    padding: 2rem;
                    gap: 1.5rem;
                    background: linear-gradient(to right, #f0f7f7, #ffffff);
                    border-left: 6px solid var(--primary);
                }
                .stop-index {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: var(--primary);
                    opacity: 0.3;
                    font-family: 'Playfair Display', serif;
                }
                .activities-timeline {
                    padding-left: 1rem;
                }
                .view-activity-card {
                    margin-bottom: 1rem;
                    gap: 2rem;
                }
                .act-time-col {
                    width: 60px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 1.5rem;
                }
                .act-time {
                    font-weight: 700;
                    font-size: 0.9rem;
                    color: var(--primary);
                }
                .act-dot {
                    width: 10px;
                    height: 10px;
                    background: var(--primary);
                    border-radius: 50%;
                    margin-top: 0.5rem;
                }
                .act-details-col {
                    flex: 1;
                    padding: 1.5rem;
                }
                .badge {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    background: #eee;
                    padding: 0.2rem 0.6rem;
                    border-radius: 4px;
                    font-weight: 700;
                    letter-spacing: 1px;
                }
                .no-activities {
                    padding: 2rem;
                    text-align: center;
                    border: 1px dashed var(--border);
                    border-radius: var(--radius);
                }
            `}</style>
        </div>
    );
};

export default ItineraryView;
