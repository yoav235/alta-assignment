import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Placeholder routes - to be implemented */}
            <Route path="/book" element={<div style={{padding: '2rem', textAlign: 'center'}}><h2>Booking Page - Coming Soon</h2></div>} />
            <Route path="/signin" element={<div style={{padding: '2rem', textAlign: 'center'}}><h2>Sign In Page - Coming Soon</h2></div>} />
            <Route path="/signup" element={<div style={{padding: '2rem', textAlign: 'center'}}><h2>Sign Up Page - Coming Soon</h2></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
