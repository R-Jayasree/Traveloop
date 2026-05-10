import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Image as ImageIcon, MapPin, DollarSign } from 'lucide-react';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        total_budget: '',
        cover_photo: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/trips', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/my-trips');
        } catch (err) {
            console.error('Error creating trip', err);
            alert('Failed to create trip');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-1">
            <div className="card create-card">
                <h1>Start a New Adventure</h1>
                <p className="text-muted mb-1">Fill in the details to begin planning your trip.</p>
                
                <form onSubmit={handleSubmit} className="create-form">
                    <div className="form-group">
                        <label>Trip Name</label>
                        <input 
                            name="name"
                            placeholder="e.g. Summer in Tokyo" 
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input 
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input 
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            name="description"
                            rows="3"
                            placeholder="What's this trip about?"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Estimated Budget ($)</label>
                            <input 
                                type="number"
                                name="total_budget"
                                placeholder="0.00"
                                value={formData.total_budget}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Cover Photo URL (optional)</label>
                            <input 
                                name="cover_photo"
                                placeholder="https://..."
                                value={formData.cover_photo}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between mt-1">
                        <button type="button" onClick={() => navigate(-1)} className="btn">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Trip'}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx="true">{`
                .create-card {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .create-form {
                    margin-top: 2rem;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .form-group label {
                    display: block;
                    font-size: 0.9rem;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                    color: var(--text-muted);
                }
                @media (max-width: 600px) {
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default CreateTrip;
