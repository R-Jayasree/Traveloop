import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Globe, Trash2, Save } from 'lucide-react';

const UserProfile = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [profile, setProfile] = useState({ name: '', email: '', language: 'en' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/profiles/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(res.data);
            } catch (err) {
                console.error('Error fetching profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleThemeChange = (e) => {
        const newTheme = e.target.value;
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/profiles/me', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile', err);
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone and will delete all your trips and data.'
        );
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete('http://localhost:5000/api/profiles/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            logout(); // clear state and redirect to login
        } catch (err) {
            console.error('Error deleting account', err);
            alert('Failed to delete account.');
        }
    };

    if (loading) return <div className="container mt-1">Loading profile...</div>;

    return (
        <div className="container mt-1" style={{ maxWidth: '600px' }}>
            <header className="mb-2">
                <h1 className="text-2xl font-bold">Account Settings</h1>
                <p className="text-muted">Manage your personal settings and app preferences.</p>
            </header>

            <div className="card p-4">
                {message && <div className="mb-2 p-2" style={{ backgroundColor: '#e6f7eb', color: '#27ae60', borderRadius: '4px' }}>{message}</div>}
                
                <form onSubmit={handleSave} className="flex flex-col gap-2">
                    <div className="form-group">
                        <label className="flex align-center gap-1 mb-1"><User size={16} /> Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name || ''}
                            onChange={handleChange}
                            className="input w-full"
                            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                            required
                        />
                    </div>
                    
                    <div className="form-group mt-1">
                        <label className="flex align-center gap-1 mb-1"><Mail size={16} /> Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email || ''}
                            onChange={handleChange}
                            className="input w-full"
                            disabled
                            style={{ padding: '0.8rem', borderRadius: '8px', backgroundColor: 'var(--bg-color)', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'not-allowed' }}
                        />
                        <small className="text-muted" style={{ display: 'block', marginTop: '0.2rem' }}>Email address cannot be changed.</small>
                    </div>

                    <div className="form-group mt-1">
                        <label className="flex align-center gap-1 mb-1"><Globe size={16} /> App Theme</label>
                        <select
                            name="theme"
                            value={theme}
                            onChange={handleThemeChange}
                            className="input w-full"
                            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card-bg)' }}
                        >
                            <option value="light">Light Theme</option>
                            <option value="dark">Dark Theme</option>
                        </select>
                    </div>

                    <div className="mt-2 flex justify-end">
                        <button type="submit" className="btn btn-primary flex align-center gap-1" disabled={saving}>
                            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="card p-4 mt-2" style={{ border: '1px solid #ffcccb', backgroundColor: '#fff5f5' }}>
                <h3 style={{ color: '#e74c3c', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trash2 size={20} /> Danger Zone
                </h3>
                <p className="mb-2" style={{ color: '#c0392b' }}>Once you delete your account, there is no going back. Please be certain.</p>
                <button onClick={handleDeleteAccount} className="btn" style={{ backgroundColor: 'white', color: '#e74c3c', border: '1px solid #e74c3c', fontWeight: 'bold' }}>
                    Delete Account Permanently
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
