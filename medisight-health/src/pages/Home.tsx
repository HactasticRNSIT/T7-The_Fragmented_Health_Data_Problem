import React from 'react';
import { Activity, ArrowRight, HeartPulse, Droplets, Scale, AlertTriangle, FileText, Pill, FlaskConical, History, BrainCircuit, ShieldCheck, Smartphone, UserPlus, Database, LayoutDashboard, Share2, Star } from 'lucide-react';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero mesh-bg">
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-tag">
              <span className="pulse-dot"></span>
              Live Health Monitoring
            </div>
            <h1 className="hero-title">Your Health.<br/><span className="gradient-text">One Place.</span><br/>Complete Picture.</h1>
            <p className="hero-subtitle">MediSight aggregates your lab reports, prescriptions, vitals, and medical history into a single intelligent dashboard — built for patients, trusted by doctors.</p>
            <div className="hero-ctas">
              <a href="/login" className="btn btn-primary btn-lg">Get Started Free <ArrowRight size={18} /></a>
              <a href="#how-it-works" className="btn btn-ghost btn-lg">See How It Works</a>
            </div>
            <div className="hero-stats">
              <div className="stat-badge">
                <span className="stat-num" data-target="10" data-suffix="K+">10K+</span>
                <span className="stat-label">Reports Generated</span>
              </div>
              <div className="stat-badge">
                <span className="stat-num" data-target="50" data-suffix="+">50+</span>
                <span className="stat-label">Hospital Partners</span>
              </div>
              <div className="stat-badge">
                <span className="stat-num" data-target="99.9" data-suffix="%">99.9%</span>
                <span className="stat-label">Data Accuracy</span>
              </div>
            </div>
          </div>

          <div className="hero-mockup animate-float">
            <div className="mockup-card main-card glass-card">
              <div className="mockup-header">
                <span className="mockup-avatar"></span>
                <div>
                  <div className="mockup-name">Good Morning, Priya 👋</div>
                  <div className="mockup-sub">Health Score: <strong style={{ color: 'var(--accent)' }}>82/100</strong></div>
                </div>
                <span className="badge badge-success">All Good</span>
              </div>
              <div className="mockup-vitals">
                <div className="vital-item"><span className="vital-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}><HeartPulse size={16} /></span><div><div className="vital-val">120/80</div><div className="vital-lbl">Blood Pressure</div></div></div>
                <div className="vital-item"><span className="vital-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}><Droplets size={16} /></span><div><div className="vital-val">98 mg/dL</div><div className="vital-lbl">Glucose</div></div></div>
                <div className="vital-item"><span className="vital-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}><Scale size={16} /></span><div><div className="vital-val">22.4</div><div className="vital-lbl">BMI</div></div></div>
              </div>
              <div className="mockup-chart">
                <div className="chart-label">Blood Pressure — Last 6 Months</div>
                <div className="mini-chart">
                  <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="0,40 33,35 66,38 100,28 133,32 166,25 200,22" stroke="#00D4CC" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="0,52 33,48 66,50 100,44 133,46 166,42 200,40" stroke="rgba(0,212,204,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="float-card float-card-1 glass-card">
              <AlertTriangle size={16} color="var(--warning)" />
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-on-dark)' }}>Low Hemoglobin</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-on-dark-muted)' }}>11.2 g/dL — Check needed</div>
              </div>
            </div>
            <div className="float-card float-card-2 glass-card">
              <FileText size={16} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-on-dark)' }}>Report Ready</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-on-dark-muted)' }}>Dr. Anand — Share now</div>
              </div>
            </div>
            <div className="float-card float-card-3 glass-card">
              <Pill size={16} color="var(--success)" />
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-on-dark)' }}>Metformin 500mg</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-on-dark-muted)' }}>Taken today ✓</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header reveal visible">
            <div className="section-tag">Features</div>
            <h2 className="section-title">Everything you need, <span style={{ color: 'var(--accent)' }}>unified</span></h2>
            <p className="section-subtitle">MediSight brings together all your health data sources into one intelligent, secure platform.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card reveal visible stagger-1">
              <div className="feature-icon"><FlaskConical /></div>
              <h3>Multi-Source Data Collection</h3>
              <p>Connect labs, pharmacies, wearables, and hospital EMRs automatically. No more manual uploads.</p>
            </div>
            <div className="feature-card reveal visible stagger-2">
              <div className="feature-icon"><History /></div>
              <h3>Smart Health Timeline</h3>
              <p>Visual timeline of your complete health history — conditions, medications, tests, and visits.</p>
            </div>
            <div className="feature-card reveal visible stagger-3">
              <div className="feature-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}><BrainCircuit /></div>
              <h3>AI-Assisted Issue Detection</h3>
              <p>Pattern recognition flags anomalies in your health trends before they become serious.</p>
            </div>
            <div className="feature-card reveal visible stagger-4">
              <div className="feature-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}><Scale /></div>
              <h3>Doctor-Ready Reports</h3>
              <p>One-click PDF reports formatted for clinical review — share with any doctor instantly.</p>
            </div>
            <div className="feature-card reveal visible stagger-5">
              <div className="feature-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}><ShieldCheck /></div>
              <h3>End-to-End Encryption</h3>
              <p>Your data is yours. HIPAA-compliant, zero third-party data selling, full audit logs.</p>
            </div>
            <div className="feature-card reveal visible stagger-6">
              <div className="feature-icon" style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}><Smartphone /></div>
              <h3>Cross-Device Access</h3>
              <p>Web and mobile — your records whenever and wherever you need them, always in sync.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-dark mesh-bg" id="how-it-works">
        <div className="container">
          <div className="section-header reveal visible">
            <div className="section-tag">Process</div>
            <h2 className="section-title" style={{ color: 'var(--text-on-dark)' }}>Set up in <span style={{ color: 'var(--accent)' }}>4 simple steps</span></h2>
            <p className="section-subtitle">From sign-up to your first doctor report in minutes, not hours.</p>
          </div>
          <div className="steps-container">
            <div className="steps-line"></div>
            <div className="step reveal visible stagger-1">
              <div className="step-num">01</div>
              <div className="step-content glass-card">
                <div className="step-icon"><UserPlus /></div>
                <h3>Sign Up &amp; Connect Sources</h3>
                <p>Create your account and link your labs, pharmacy, hospital EMR, and wearables in one onboarding flow.</p>
              </div>
            </div>
            <div className="step reveal visible stagger-2">
              <div className="step-num">02</div>
              <div className="step-content glass-card">
                <div className="step-icon"><Database /></div>
                <h3>MediSight Pulls &amp; Organises</h3>
                <p>Our engine aggregates and normalises data from all sources — structured, clean, and ready to view.</p>
              </div>
            </div>
            <div className="step reveal visible stagger-3">
              <div className="step-num">03</div>
              <div className="step-content glass-card">
                <div className="step-icon"><LayoutDashboard /></div>
                <h3>Review Your Unified Dashboard</h3>
                <p>See vitals trends, lab results, prescriptions, and AI-flagged concerns in one beautiful interface.</p>
              </div>
            </div>
            <div className="step reveal visible stagger-4">
              <div className="step-num">04</div>
              <div className="step-content glass-card">
                <div className="step-icon"><Share2 /></div>
                <h3>Share Reports Instantly</h3>
                <p>Generate a clinically formatted PDF report and share it with your doctor via link or download.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" id="testimonials">
        <div className="container">
          <div className="section-header reveal visible">
            <div className="section-tag">Testimonials</div>
            <h2 className="section-title">Loved by <span style={{ color: 'var(--accent)' }}>patients &amp; doctors</span></h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card reveal visible stagger-1">
              <div className="stars">★★★★★</div>
              <p>"MediSight saved me from carrying stacks of reports to every appointment. My cardiologist loves the format — clean, complete, and always up to date."</p>
              <div className="testimonial-author">
                <div className="t-avatar" style={{ background: 'linear-gradient(135deg,#00D4CC,#0099aa)' }}>PS</div>
                <div><strong>Priya S.</strong><span>Patient, Bangalore</span></div>
              </div>
            </div>
            <div className="testimonial-card reveal visible stagger-2">
              <div className="stars">★★★★★</div>
              <p>"The report format is exactly what I need in a consult. Clean and complete — I can see the full picture in 30 seconds. I recommend it to all my patients."</p>
              <div className="testimonial-author">
                <div className="t-avatar" style={{ background: 'linear-gradient(135deg,#2DD4BF,#0a9b8f)' }}>RM</div>
                <div><strong>Dr. Rahul M.</strong><span>Cardiologist, Apollo Hospital</span></div>
              </div>
            </div>
            <div className="testimonial-card reveal visible stagger-3">
              <div className="stars">★★★★★</div>
              <p>"The AI flagged my father's rising glucose before his routine checkup. Without MediSight's alert, we wouldn't have caught it so early. Genuinely life-saving."</p>
              <div className="testimonial-author">
                <div className="t-avatar" style={{ background: 'linear-gradient(135deg,#8B5CF6,#5b21b6)' }}>AK</div>
                <div><strong>Arjun K.</strong><span>Patient, Mumbai</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="section" id="about-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header reveal visible">
            <div className="section-tag">About</div>
            <h2 className="section-title">Our <span style={{ color: 'var(--accent)' }}>Story</span></h2>
            <p className="section-subtitle">We are on a mission to bring clarity and control back to patients.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card reveal visible stagger-1">
              <h3>Our Mission</h3>
              <p>To eliminate health data fragmentation by providing a unified, patient-centric dashboard that easily integrates with all your healthcare providers.</p>
            </div>
            <div className="feature-card reveal visible stagger-2">
              <h3>Team Values</h3>
              <p>We prioritize transparency, security, and user empowerment. Your data is yours, and we ensure it remains safe and accessible only to you.</p>
            </div>
            <div className="feature-card reveal visible stagger-3">
              <h3>Our History</h3>
              <p>Founded by doctors and technologists who experienced the broken healthcare data system firsthand. We built MediSight to fix it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="section section-dark mesh-bg" id="contact-section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header reveal visible">
            <div className="section-tag">Contact</div>
            <h2 className="section-title" style={{ color: 'var(--text-on-dark)' }}>Get in <span style={{ color: 'var(--accent)' }}>Touch</span></h2>
            <p className="section-subtitle">Have questions or need support? Send us a message.</p>
          </div>
          
          <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--bg-surface)', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-primary)' }}>Name</label>
                <input type="text" placeholder="Your Name" style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'transparent', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-primary)' }}>Email</label>
                <input type="email" placeholder="Your Email" style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'transparent', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-primary)' }}>Message</label>
                <textarea rows={4} placeholder="How can we help you?" style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'transparent', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
              </div>
              <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-section mesh-bg">
        <div className="container cta-inner reveal visible">
          <h2 style={{ color: 'var(--text-on-dark)' }}>Ready to take control of <span style={{ color: 'var(--accent)' }}>your health?</span></h2>
          <p style={{ color: 'var(--text-on-dark-muted)', maxWidth: '500px', margin: '0 auto 32px' }}>Join thousands of patients and doctors using MediSight for smarter healthcare decisions.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/login" className="btn btn-primary btn-lg">Get Started Free</a>
            <a href="#about-section" className="btn btn-ghost btn-lg">Learn More</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
