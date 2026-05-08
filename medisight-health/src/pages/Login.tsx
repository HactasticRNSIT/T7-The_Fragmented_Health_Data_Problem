import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, ShieldCheck, Zap, FileText, Link2, User, FlaskConical, Pill, HeartPulse, Hospital, Mail, Lock, Eye, EyeOff, Radio, Phone, Calendar, Users, Building2, ArrowRight, CheckCircle2, Watch, Smartphone, LayoutDashboard, Loader2 } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { supabase } from '../lib/supabaseClient';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({ score: 0, text: '', color: 'transparent', width: '0%' });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [hospital, setHospital] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserProfile } = useHealth();

  useEffect(() => {
    if (location.hash === '#signup') setActiveTab('signup');
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        if (error.message === 'Failed to fetch') {
          throw new Error('Network Error: Could not connect to Supabase. Check your URL and Internet.');
        }
        throw error;
      }

      const userRole = data.user?.user_metadata?.role || 'patient';
      setUserProfile({ 
        role: userRole,
        name: data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || 'User'
      });

      if (userRole === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: fullName,
            role: role,
            hospital: role === 'doctor' ? hospital : undefined
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        setUserProfile({ 
          role: role,
          name: fullName
        });

        if (role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          setShowOnboarding(true);
        }
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const checkStrength = (val: string) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    
    const levels = [
      { width: '0%', color: 'transparent', text: '' },
      { width: '25%', color: '#FF6B6B', text: 'Weak' },
      { width: '50%', color: '#F59E0B', text: 'Fair' },
      { width: '75%', color: '#2DD4BF', text: 'Good' },
      { width: '100%', color: '#2DD4BF', text: 'Strong' },
    ];
    setStrength({ ...levels[score], score });
  };

  return (
    <div className="login-body">
      <div className="login-layout">
        <div className="brand-panel mesh-bg">
          <a href="/" className="nav-logo brand-logo">
            <div className="logo-icon"><Activity size={22} /></div>
            MediSight Health
          </a>
          <div className="brand-content">
            <h2 style={{ color: 'var(--text-on-dark)', marginBottom: '16px' }}>Your health story,<br/><span style={{ color: 'var(--accent)' }}>finally in one place.</span></h2>
            <p style={{ color: 'var(--text-on-dark-muted)', lineHeight: 1.7, marginBottom: '40px' }}>Connect your labs, pharmacy, wearables, and hospital records. Get AI-powered insights and generate doctor-ready reports in seconds.</p>
            <div className="brand-features">
              <div className="brand-feat"><ShieldCheck size={18} color="var(--accent)" /> HIPAA-compliant &amp; end-to-end encrypted</div>
              <div className="brand-feat"><Zap size={18} color="var(--accent)" /> AI-assisted health trend analysis</div>
              <div className="brand-feat"><FileText size={18} color="var(--accent)" /> Doctor-ready PDF reports instantly</div>
              <div className="brand-feat"><Link2 size={18} color="var(--accent)" /> 50+ hospital &amp; lab partner integrations</div>
            </div>
            <div className="brand-network">
              <div className="network-node node-center"><User size={20} color="var(--primary)" /></div>
              <div className="network-node node-1"><FlaskConical size={14} color="var(--accent)" /></div>
              <div className="network-node node-2"><Pill size={14} color="var(--accent)" /></div>
              <div className="network-node node-3"><HeartPulse size={14} color="var(--accent)" /></div>
              <div className="network-node node-4"><Hospital size={14} color="var(--accent)" /></div>
              <svg className="network-lines" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="100" y1="100" x2="170" y2="40" stroke="rgba(0,212,204,0.3)" strokeWidth="1.5" strokeDasharray="4 4"/>
                <line x1="100" y1="100" x2="30" y2="50" stroke="rgba(0,212,204,0.3)" strokeWidth="1.5" strokeDasharray="4 4"/>
                <line x1="100" y1="100" x2="165" y2="155" stroke="rgba(0,212,204,0.3)" strokeWidth="1.5" strokeDasharray="4 4"/>
                <line x1="100" y1="100" x2="35" y2="155" stroke="rgba(0,212,204,0.3)" strokeWidth="1.5" strokeDasharray="4 4"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-card">
            <div className="auth-tabs">
              <button className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Login</button>
              <button className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>Sign Up</button>
              <div className={`tab-slider ${activeTab === 'signup' ? 'right' : ''}`}></div>
            </div>

            {errorMsg && (
              <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {errorMsg}
              </div>
            )}

            {activeTab === 'login' ? (
              <form id="loginForm" className="auth-form active" onSubmit={handleLogin}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ marginBottom: '8px', display: 'block' }}>Account Type</label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="loginRole" value="patient" checked={role === 'patient'} onChange={() => setRole('patient')} /> Patient
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="loginRole" value="doctor" checked={role === 'doctor'} onChange={() => setRole('doctor')} /> Doctor
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="loginEmail">Email Address</label>
                  <div className="input-wrap">
                    <Mail className="input-icon" size={16} />
                    <input type="email" id="loginEmail" placeholder="priya@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="loginPassword">Password</label>
                  <div className="input-wrap">
                    <Lock className="input-icon" size={16} />
                    <input type={showPassword ? 'text' : 'password'} id="loginPassword" placeholder="Your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                    <button type="button" className="pwd-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '8px' }} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" size={16} /> : 'Login'} <ArrowRight size={16} />
                </button>
                <div className="divider">or continue with</div>
                <div className="social-auth">
                  <button type="button" className="social-btn">Continue with Google</button>
                </div>
              </form>
            ) : (
              <form id="signupForm" className="auth-form active" onSubmit={handleSignup}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ marginBottom: '8px', display: 'block' }}>Account Type</label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="signupRole" value="patient" checked={role === 'patient'} onChange={() => setRole('patient')} /> Patient
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="signupRole" value="doctor" checked={role === 'doctor'} onChange={() => setRole('doctor')} /> Doctor
                    </label>
                  </div>
                </div>
                
                {role === 'doctor' && (
                  <div style={{ marginBottom: '16px' }}>
                    <div className="form-group">
                      <label htmlFor="doctorHospital">Hospital (Bengaluru)</label>
                      <div className="input-wrap">
                        <Building2 className="input-icon" size={16} />
                        <select id="doctorHospital" value={hospital} onChange={(e) => setHospital(e.target.value)}>
                          <option value="">-- Choose Hospital --</option>
                          <option value="Apollo Hospitals, Bannerghatta">Apollo Hospitals, Bannerghatta</option>
                          <option value="Manipal Hospital, Old Airport">Manipal Hospital, Old Airport</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <div className="input-wrap">
                      <User className="input-icon" size={16} />
                      <input type="text" id="fullName" placeholder="Priya Sharma" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="signupEmail">Email Address</label>
                    <div className="input-wrap">
                      <Mail className="input-icon" size={16} />
                      <input type="email" id="signupEmail" placeholder="priya@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="signupPassword">Password</label>
                  <div className="input-wrap">
                    <Lock className="input-icon" size={16} />
                    <input type={showPassword ? 'text' : 'password'} id="signupPassword" placeholder="Create a strong password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required onInput={(e) => checkStrength((e.target as HTMLInputElement).value)} />
                    <button type="button" className="pwd-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="strength-bar"><div className="strength-fill" style={{ width: strength.width, background: strength.color }}></div></div>
                  <div className="strength-label" style={{ color: strength.color }}>{strength.text}</div>
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" size={16} /> : 'Create Account'} <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ONBOARDING MODAL */}
      {showOnboarding && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-progress">
              <div className="progress-steps">
                <div className={`prog-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'done' : ''}`}><span>1</span><label>Health Info</label></div>
                <div className={`prog-line ${currentStep > 1 ? 'done' : ''}`}></div>
                <div className={`prog-step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'done' : ''}`}><span>2</span><label>Connect Sources</label></div>
                <div className={`prog-line ${currentStep > 2 ? 'done' : ''}`}></div>
                <div className={`prog-step ${currentStep === 3 ? 'active' : currentStep > 3 ? 'done' : ''}`}><span>3</span><label>Emergency Contact</label></div>
                <div className={`prog-line ${currentStep > 3 ? 'done' : ''}`}></div>
                <div className={`prog-step ${currentStep === 4 ? 'active' : 'done'}`}><span>4</span><label>Done!</label></div>
              </div>
            </div>

            {currentStep === 1 && (
              <div className="modal-step active">
                <h3>Basic Health Information</h3>
                <p className="modal-sub">Help us personalize your dashboard.</p>
                <div className="form-row-2" style={{ marginTop: '20px' }}>
                  <div className="form-group"><label>Blood Group</label><div className="input-wrap"><select><option>Select</option><option>A+</option><option>O+</option></select></div></div>
                  <div className="form-group"><label>Height (cm)</label><div className="input-wrap"><input type="number" placeholder="170" /></div></div>
                </div>
                <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setCurrentStep(2)}>Continue <ArrowRight size={16} /></button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="modal-step active">
                <h3>Connect Your Data Sources</h3>
                <p className="modal-sub">Select all that apply — you can change this later.</p>
                <div className="source-grid">
                  <label className="source-item"><input type="checkbox" defaultChecked /><div className="source-card"><FlaskConical size={24} color="var(--accent)" /><span>Lab Reports</span></div></label>
                  <label className="source-item"><input type="checkbox" defaultChecked /><div className="source-card"><Pill size={24} color="var(--accent)" /><span>Pharmacy</span></div></label>
                  <label className="source-item"><input type="checkbox" /><div className="source-card"><Hospital size={24} color="var(--accent)" /><span>Hospital EMR</span></div></label>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button className="btn btn-outline" onClick={() => setCurrentStep(1)}>Back</button>
                  <button className="btn btn-primary" onClick={() => setCurrentStep(3)}>Continue <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="modal-step active">
                <h3>Emergency Contact</h3>
                <p className="modal-sub">We'll notify them in case of critical health alerts.</p>
                <div className="form-group" style={{ marginTop: '20px' }}><label>Contact Name</label><div className="input-wrap"><User className="input-icon" size={16} /><input type="text" placeholder="Rajesh Sharma" /></div></div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button className="btn btn-outline" onClick={() => setCurrentStep(2)}>Back</button>
                  <button className="btn btn-primary" onClick={() => setCurrentStep(4)}>Continue <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="modal-step active">
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div className="success-anim"><CheckCircle2 size={64} color="var(--success)" /></div>
                  <h3 style={{ margin: '20px 0 10px' }}>You're all set!</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Your MediSight Health profile is ready.</p>
                  <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-lg">Go to Dashboard <LayoutDashboard size={18} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
