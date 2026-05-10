import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import CreateTrip from './screens/CreateTrip';
import MyTrips from './screens/MyTrips';
import ItineraryBuilder from './screens/ItineraryBuilder';
import ItineraryView from './screens/ItineraryView';
import BudgetBreakdown from './screens/BudgetBreakdown';
import PackingChecklist from './screens/PackingChecklist';
import PublicItinerary from './screens/PublicItinerary';
import UserProfile from './screens/UserProfile';
import TripNotes from './screens/TripNotes';
import { useParams } from 'react-router-dom';

const TripRedirect = () => {
    const { id } = useParams();
    return <Navigate to={`/trips/view/${id}`} replace />;
};

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    return children;
};

const AppContent = () => {
    const { user } = useAuth();
    
    return (
        <Router>
            {user && <Navbar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/create-trip" element={
                    <ProtectedRoute>
                        <CreateTrip />
                    </ProtectedRoute>
                } />
                <Route path="/my-trips" element={
                    <ProtectedRoute>
                        <MyTrips />
                    </ProtectedRoute>
                } />
                <Route path="/trips/edit/:id" element={
                    <ProtectedRoute>
                        <ItineraryBuilder />
                    </ProtectedRoute>
                } />
                <Route path="/trips/view/:id" element={
                    <ProtectedRoute>
                        <ItineraryView />
                    </ProtectedRoute>
                } />
                <Route path="/budget/:id" element={
                    <ProtectedRoute>
                        <BudgetBreakdown />
                    </ProtectedRoute>
                } />
                <Route path="/packing/:tripId" element={
                    <ProtectedRoute>
                        <PackingChecklist />
                    </ProtectedRoute>
                } />
                <Route path="/public/:hash" element={<PublicItinerary />} />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                } />
                <Route path="/notes/:tripId" element={
                    <ProtectedRoute>
                        <TripNotes />
                    </ProtectedRoute>
                } />
                <Route path="/trips/:id" element={<TripRedirect />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
