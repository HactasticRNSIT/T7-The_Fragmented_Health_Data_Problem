import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { userProfile } = useHealth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthPage = location.pathname === '/login';
  const isDashboard = location.pathname.includes('dashboard');

  if (isAuthPage || isDashboard) {
    return null;
  }

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="container">
          <Link to="/" className="nav-logo">
            <div className="logo-icon"><Activity size={20} /></div>
            MediSight Health
          </Link>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#about-section" className="nav-link">About</a>
            <a href="#contact-section" className="nav-link">Contact</a>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/login#signup" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
          <button 
            className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`} id="mobileDrawer">
        <a href="#features" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
        <a href="#how-it-works" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
        <a href="#about-section" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</a>
        <a href="#contact-section" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
        <div className="mobile-actions">
          <Link to="/login" className="btn btn-outline btn-full" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
          <Link to="/login" className="btn btn-primary btn-full" onClick={() => setIsMobileMenuOpen(false)}>Get Started Free</Link>
        </div>
      </div>
      <div 
        className={`drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
    </>
  );
};

export default Navbar;
