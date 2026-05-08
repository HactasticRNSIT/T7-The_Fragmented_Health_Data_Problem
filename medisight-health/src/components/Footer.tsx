import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="nav-logo">
              <div className="logo-icon"><Activity size={18} /></div>
              MediSight Health
            </Link>
            <p>A unified patient health dashboard that brings together labs, pharmacy, wearables, and hospital records — intelligently.</p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Twitter">𝕏</a>
              <a href="#" className="social-link" aria-label="LinkedIn">in</a>
              <a href="#" className="social-link" aria-label="Instagram">ig</a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Product</h5>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/login">Get Started</Link>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <a href="#about-section">About Us</a>
            <a href="#contact-section">Contact</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">HIPAA Compliance</a>
            <a href="#">Security</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 MediSight Health. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#contact-section">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
