import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, LogOut, Briefcase, PlusCircle, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="container flex justify-between align-center">
                <Link to="/" className="nav-logo">Traveloop</Link>
                <div className="nav-links flex align-center gap-1">
                    <Link to="/" className="nav-link flex align-center">
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/my-trips" className="nav-link flex align-center">
                        <Briefcase size={18} /> My Trips
                    </Link>
                    <Link to="/create-trip" className="nav-link btn btn-primary flex align-center">
                        <PlusCircle size={18} /> Plan New Trip
                    </Link>
                    <div className="user-profile flex align-center gap-1">
                        <Link to="/profile" className="flex align-center gap-1" style={{ color: 'inherit', textDecoration: 'none' }}>
                            <img src={user.avatar_url} alt={user.name} className="avatar" />
                            <span className="user-name">{user.name}</span>
                        </Link>
                        <button onClick={handleLogout} className="logout-btn">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
            <style jsx="true">{`
                .navbar {
                    padding: 1rem 0;
                    border-bottom: 1px solid var(--border);
                    background: var(--card-bg);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                .nav-logo {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: var(--primary);
                }
                .nav-link {
                    font-weight: 500;
                    color: var(--text-muted);
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius);
                    gap: 0.5rem;
                }
                .nav-link:hover {
                    color: var(--primary);
                    background: #f0f7f7;
                }
                .nav-link.btn-primary {
                    color: white;
                }
                .nav-link.btn-primary:hover {
                    color: white;
                    background: var(--primary-light);
                }
                .avatar {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    background: #eee;
                }
                .user-name {
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                .logout-btn {
                    background: none;
                    color: var(--text-muted);
                }
                .logout-btn:hover {
                    color: #ff4d4d;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
