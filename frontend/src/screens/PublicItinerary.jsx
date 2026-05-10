import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Clock, Share2, Copy } from 'lucide-react';

const PublicItinerary = () => {
    const { hash } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPublicTrip = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/public/${hash}`);
                setTrip(res.data);
            } catch (err) {
                console.error(err);
                setError('Itinerary not found or is no longer public.');
            } finally {
                setLoading(false);
            }
        };
        fetchPublicTrip();
    }, [hash]);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    };

    if (loading) return <div className="container mt-1">Loading itinerary...</div>;
    if (error) return <div className="container mt-1">{error}</div>;
    if (!trip) return <div className="container mt-1">No data available.</div>;

    return (
        <div className="container mt-1">
            <header className="flex justify-between align-center mb-2">
                <div>
                    <h1 style={{ marginBottom: '0.2rem' }}>{trip.name}</h1>
                    <p className="text-muted flex gap-1 align-center">
                        <Calendar size={16} /> 
                        {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-1">
                    <button onClick={copyLink} className="btn btn-primary flex gap-1 align-center">
                        <Copy size={18} /> Copy Link
                    </button>
                    <Link to="/" className="btn flex gap-1 align-center">
                        Build your own trip
                    </Link>
                </div>
            </header>

            <div className="builder-layout">
                <div className="stops-timeline">
                    {trip.stops?.length > 0 ? (
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
                                    </div>
                                    <div className="activities-list mt-1">
                                        {stop.activities?.length > 0 ? (
                                            stop.activities.map(act => (
                                                <div key={act.id} className="activity-item flex justify-between align-center">
                                                    <div className="flex align-center gap-1">
                                                        <Clock size={14} className="text-muted" />
                                                        <span>{act.scheduled_time?.substring(0, 5)}</span>
                                                        <span className="act-name">{act.name}</span>
                                                        <span className="act-type text-muted">({act.type})</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>No activities planned.</p>
                                        )}
                                    </div>
                                </div>
                                {index < trip.stops.length - 1 && <div className="timeline-line"></div>}
                            </div>
                        ))
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                            <MapPin size={48} className="text-muted mb-1" style={{ opacity: 0.3 }} />
                            <h3>No stops available in this itinerary.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicItinerary;
