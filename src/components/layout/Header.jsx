import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h2>AI Meeting Scheduler</h2>
        </Link>
        <nav className="header-nav">
          <Link to="/signin" className="nav-link">Sign In</Link>
          <Link to="/signup" className="nav-button">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

