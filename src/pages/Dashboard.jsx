import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import WeeklyCalendar from '../components/dashboard/WeeklyCalendar';
import './Dashboard.css';

function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (!loading && !isAuthenticated) {
      console.log('⚠️ Not authenticated, redirecting to sign in...');
      navigate('/signin');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Here's your schedule for this week</p>
          </div>
        </div>

        <WeeklyCalendar />
      </div>
    </div>
  );
}

export default Dashboard;


