import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, Activity, Pill, Calendar, Bot, ShieldCheck, Settings, LogOut, Shield, HeartPulse, Droplets, TrendingUp, FlaskConical, AlertTriangle, Plus, Trash2, Send, Landmark, Briefcase, Users, Heart, Camera, Search, Bell, ShieldAlert, ShieldCheck as ShieldCheckIcon, Flame, ChevronDown, Loader2 } from 'lucide-react';
import { useHealth, Report, Appointment } from '../context/HealthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import SettingsSection from '../components/SettingsSection';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeInsuranceTab, setActiveInsuranceTab] = useState('government-plan');
  const [chatMessages, setChatMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Greetings. I am your Medical AI Consultant. I have reviewed your health profile and I am ready to assist you. How can I support your well-being today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const newMsgs = [...chatMessages, { role: 'user', text: chatInput } as const];
    setChatMessages(newMsgs);
    setChatInput('');
    
    // Simulate AI response
    setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'ai', text: 'I am analyzing your query based on your profile. Given your recent vitals, I recommend monitoring your symptoms closely and staying hydrated. If you have specific report questions, please upload them for analysis.' }]);
    }, 1000);
  };

  const { userProfile, reports, setReports, appointments, addAppointment } = useHealth();

  // Appt Form State
  const [apptData, setApptData] = useState({ hospital: '', dept: '', date: '', time: '', reason: '' });

  // Insurance State
  const [insEligibility, setInsEligibility] = useState<{msg: string, color: string, textColor: string} | null>(null);
  const [insInputs, setInsInputs] = useState<any>({});

  const checkEligibility = (planId: string) => {
    let message = "";
    let color = "";
    let textColor = "";

    const { age, income, status, tobacco, cover, zone, deps, emp, size, hosp } = insInputs;

    if (planId === 'government-plan') {
      if (!age) {
        message = "Please enter a valid age."; color = "var(--warning-light)"; textColor = "var(--warning)";
      } else if (parseInt(age) < 18 || status === 'Severe' || income === 'High') {
        message = "Not Eligible – Exceeds income limits or requires specialized care."; color = "var(--danger-light)"; textColor = "var(--danger)";
      } else {
        message = "🎉 HIGHLY ELIGIBLE! Coverage details available."; color = "var(--success-light)"; textColor = "var(--success)";
      }
    } else if (planId === 'private-plan-a') {
      if (!age) {
        message = "Please enter a valid age."; color = "var(--warning-light)"; textColor = "var(--warning)";
      } else if (tobacco === 'Yes') {
        message = "Eligible with higher premiums due to tobacco use."; color = "var(--warning-light)"; textColor = "var(--warning)";
      } else if (parseInt(age) > 65 && income === 'High') {
        message = "🎉 HIGHLY ELIGIBLE! Premium senior coverage available."; color = "var(--success-light)"; textColor = "var(--success)";
      } else {
        message = "Eligible for standard private plans. See details."; color = "var(--success-light)"; textColor = "var(--success)";
      }
    } else {
        message = "🎉 ELIGIBLE! Standard rules apply. See details below."; color = "var(--success-light)"; textColor = "var(--success)";
    }

    setInsEligibility({ msg: message, color, textColor });
  };

  const handleApptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppt: Appointment = {
      id: Date.now(),
      ...apptData,
      status: 'Pending',
      patientDetails: userProfile
    };
    addAppointment(newAppt);
    setApptData({ hospital: '', dept: '', date: '', time: '', reason: '' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newReport: Report = {
        id: Date.now(),
        name: file.name,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        dataUrl: URL.createObjectURL(file)
      };
      setReports(prev => [newReport, ...prev]);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="dash-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon" style={{ background: 'var(--accent)', padding: 10, borderRadius: 10, color: 'var(--primary)' }}>
            <Activity size={20} />
          </div>
          <span className="brand-text">MediSight</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={20} /> Overview
          </button>
          <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <FileText size={20} /> My Reports
          </button>
          <button className={`nav-item ${activeTab === 'insurance' ? 'active' : ''}`} onClick={() => setActiveTab('insurance')}>
            <Shield size={20} /> Insurance
          </button>
          <button className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
            <Calendar size={20} /> Appointments
          </button>
          <button className={`nav-item ${activeTab === 'expert-ai' ? 'active' : ''}`} onClick={() => setActiveTab('expert-ai')}>
            <Bot size={20} /> Expert AI
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
          <button onClick={handleSignOut} className="nav-item" style={{ color: '#ff4d4d' }}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 className="animate-spin" size={48} color="var(--accent)" />
        </div>
      ) : (
        <main className="dash-main">
        {/* NAVBAR */}
        <header className="dash-nav">
          <div className="nav-search">
            <Search size={18} color="var(--text-muted)" />
            <input type="text" placeholder="Search records, appointments..." />
          </div>
          <div className="nav-actions">
            <button className="btn btn-outline btn-sm" style={{ padding: '8px 16px' }}>Store Image</button>
            <div className="nav-notif">
              <Bell size={20} />
              <span className="notif-badge"></span>
            </div>
            <div className="user-profile">
              <div className="user-avatar">{userProfile?.name?.substring(0, 2).toUpperCase() || 'P'}</div>
              <div className="user-info">
                <span className="user-name">{userProfile?.name || 'Patient'}</span>
                <span className="user-role">Premium Member</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dash-content">
          {activeTab === 'overview' && (
            <div className="dash-tab active">
              <div className="welcome-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Health Dashboard</h1>
                  <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {userProfile?.name?.split(' ')[0] || 'User'}. Your health score is <span style={{ color: 'var(--accent)', fontWeight: 700 }}>84%</span></p>
                </div>
                <button onClick={() => setActiveTab('appointments')} className="btn btn-primary">Book Consultation</button>
              </div>

              <div className="dash-grid-3">
                <div className="dash-card stat-card" style={{ background: 'linear-gradient(135deg, #132040 0%, #0A1628 100%)', color: 'white' }}>
                  <div className="stat-icon" style={{ background: 'rgba(0,212,204,0.15)', color: 'var(--accent)' }}>
                    <HeartPulse size={24} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-val" style={{ color: 'white' }}>118/78</div>
                    <div className="stat-label">Blood Pressure</div>
                  </div>
                </div>

                <div className="dash-card stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(255, 107, 107, 0.1)', color: 'var(--danger)' }}>
                    <Droplets size={24} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-val">94 mg/dL</div>
                    <div className="stat-label">Blood Glucose</div>
                  </div>
                </div>

                <div className="dash-card stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--success)' }}>
                    <Flame size={24} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-val">2,450</div>
                    <div className="stat-label">Calories Burnt</div>
                  </div>
                </div>
              </div>

              <div className="dash-grid-2" style={{ marginTop: '32px' }}>
                <section className="recent-reports">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Recent Lab Reports</h3>
                    <button onClick={() => setActiveTab('reports')} className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>View All</button>
                  </div>
                  <div className="dash-card">
                    {reports.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No reports uploaded yet.</p>
                    ) : reports.map(report => (
                      <div key={report.id} className="report-card">
                        <div className="report-info">
                          <div className="file-icon">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700 }}>{report.name}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{report.date} • {report.provider || 'Lab'}</p>
                          </div>
                        </div>
                        <button className="btn btn-sm btn-outline">Review AI</button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="action-items">
                  <h3 style={{ marginBottom: '20px' }}>Action Items</h3>
                  <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
                        <AlertTriangle size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Vaccination Reminder</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Flu shot is due next week.</p>
                      </div>
                      <button className="btn btn-sm btn-primary">Schedule</button>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--surface-dim)' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                        <ShieldAlert size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Sync Health Data</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Connect your wearable device.</p>
                      </div>
                      <button className="btn btn-sm btn-outline">Sync Now</button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

        {activeTab === 'reports' && (
          <div className="dash-tab active">
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '8px' }}>My Reports</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>View and manage your medical documents and lab results.</p>
            
            <div className="dash-card">
              <div className="card-header">
                <div className="card-title">All Documents</div>
                <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                  <Plus size={14} /> Upload
                  <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reports.map((report, idx) => (
                    <div key={idx} style={{ padding: '16px', border: '1px solid var(--surface-dim)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <FileText size={24} color="var(--accent)" />
                        <div>
                          <div style={{ fontWeight: 600 }}>{report.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Added on {report.date} • {report.size}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a href={report.dataUrl} download className="btn btn-outline btn-sm">Download</a>
                        <button onClick={() => setReports(prev => prev.filter(r => r.id !== report.id))} className="btn btn-outline btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="dash-tab active">
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '8px' }}>Appointments</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Manage your upcoming visits.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              <div className="dash-card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Upcoming</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {appointments.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No appointments found.</p> : appointments.map(appt => (
                    <div key={appt.id} style={{ padding: 16, border: '1px solid var(--surface-dim)', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{appt.hospital}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{appt.dept} • {appt.reason}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{appt.date} at {appt.time}</div>
                      </div>
                      <span className="badge badge-info">{appt.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="dash-card" style={{ background: 'var(--surface)' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Book Appointment</h3>
                <form onSubmit={handleApptSubmit}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem' }}>Hospital</label>
                    <select className="input-wrap w-full" value={apptData.hospital} onChange={e => setApptData({ ...apptData, hospital: e.target.value })} required>
                      <option value="">Select Hospital</option>
                      <option value="Apollo Hospitals">Apollo Hospitals</option>
                      <option value="Manipal Hospital">Manipal Hospital</option>
                    </select>
                  </div>
                   <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem' }}>Dept</label>
                    <select className="input-wrap w-full" value={apptData.dept} onChange={e => setApptData({ ...apptData, dept: e.target.value })} required>
                      <option value="">Select Dept</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <input type="date" className="input-wrap w-full" value={apptData.date} onChange={e => setApptData({ ...apptData, date: e.target.value })} required />
                    <input type="time" className="input-wrap w-full" value={apptData.time} onChange={e => setApptData({ ...apptData, time: e.target.value })} required />
                  </div>
                  <textarea rows={2} className="input-wrap w-full" placeholder="Reason" value={apptData.reason} onChange={e => setApptData({ ...apptData, reason: e.target.value })} required></textarea>
                  <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 12 }}>Confirm Booking</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expert-ai' && (
          <div id="tab-expert-ai" className="dash-tab active">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '8px' }}>Expert AI Consultation</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Your personal health assistant. Healing begins with understanding.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <input type="password" placeholder="Enter Gemini API Key..." style={{ padding: '10px 16px', border: '1px solid var(--surface-dim)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', width: '280px', outline: 'none' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required for real-time AI responses.</span>
              </div>
            </div>
            
            <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', height: '60vh', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div className="chat-container" style={{ borderRadius: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="chat-window" style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, background: '#fafafa' }}>
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-msg msg-${msg.role}`} style={{ 
                        maxWidth: '70%', 
                        padding: '12px 16px',
                        borderRadius: '12px',
                        borderBottomLeftRadius: msg.role === 'ai' ? 4 : 12,
                        borderBottomRightRadius: msg.role === 'user' ? 4 : 12,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        background: msg.role === 'ai' ? 'white' : 'var(--accent)',
                        color: msg.role === 'ai' ? 'var(--text-primary)' : 'var(--primary)',
                        alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end'
                    }}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <div className="chat-input-area" style={{ padding: '16px 24px', background: 'white', borderTop: '1px solid var(--surface-dim)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    className="chat-input" 
                    placeholder="Describe your symptoms..." 
                    style={{ padding: '14px 20px', fontSize: '1rem', borderRadius: 30, flex: 1, border: '1px solid var(--surface-dim)', outline: 'none' }} 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  />
                  <button onClick={sendChatMessage} className="btn-send" style={{ width: 50, height: 50, background: 'var(--accent)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}><Send size={22} /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insurance' && (
          <div id="tab-insurance" className="dash-tab active">
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '8px' }}>Health Insurance Coverage</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Guided Navigation for your health insurance options.</p>
            </div>

            <div className="dash-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="insurance-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--surface-dim)', background: '#fafafa', overflowX: 'auto' }}>
                {['Government Plan', 'Private Plan A', 'Private Plan B', 'Private Plan C', 'Catastrophic', 'Family Floater', 'Corporate Group'].map((plan, i) => {
                  const planId = plan.toLowerCase().replace(/ /g, '-');
                  const currentPlanId = activeInsuranceTab || 'government-plan';
                  return (
                    <button 
                      key={plan} 
                      onClick={() => setActiveInsuranceTab(planId)}
                      className={`ins-tab-btn ${currentPlanId === planId ? 'active' : ''}`}
                      style={{ 
                        flex: 1, 
                        minWidth: 150, 
                        padding: 16, 
                        fontWeight: 600, 
                        color: currentPlanId === planId ? 'var(--primary)' : 'var(--text-muted)', 
                        borderBottom: currentPlanId === planId ? '2px solid var(--accent)' : '2px solid transparent',
                        transition: 'all 0.3s'
                      }}
                    >
                      {plan}
                    </button>
                  );
                })}
              </div>

              <div style={{ padding: '24px', minHeight: '350px' }}>
                {/* Government Plan Content */}
                {(activeInsuranceTab === 'government-plan' || !activeInsuranceTab) && (
                  <div id="gov-plan" className="ins-content active" style={{ animation: 'fadeIn 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: 50, height: 50, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          <Landmark size={24} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>National Health Scheme</h3>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Standard Government Coverage</p>
                        </div>
                      </div>
                      <button className="btn btn-outline">Check Coverage</button>
                    </div>
                    
                    <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--surface-dim)' }}>
                      <h4 style={{ marginBottom: '16px', fontSize: '1rem', color: 'var(--text-secondary)' }}>Eligibility Checker</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Age</label>
                          <input type="number" placeholder="e.g., 30" style={{ width: '100%', padding: 10, border: '1px solid var(--surface-dim)', borderRadius: 8 }} onChange={(e) => setInsInputs({...insInputs, age: e.target.value})} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Annual Income</label>
                          <select style={{ width: '100%', padding: 10, border: '1px solid var(--surface-dim)', borderRadius: 8, background: 'white' }} onChange={(e) => setInsInputs({...insInputs, income: e.target.value})}>
                            <option value="Low">Below $10k</option>
                            <option value="Mid">$10k - $30k</option>
                            <option value="High">Above $30k</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Diagnosed Status</label>
                          <select style={{ width: '100%', padding: 10, border: '1px solid var(--surface-dim)', borderRadius: 8, background: 'white' }} onChange={(e) => setInsInputs({...insInputs, status: e.target.value})}>
                            <option value="Healthy">Healthy / No Major Conditions</option>
                            <option value="Mild">Mild / Chronic Conditions</option>
                            <option value="Severe">Severe / Critical Conditions</option>
                          </select>
                        </div>
                      </div>
                      <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => checkEligibility('government-plan')}>Check Eligibility</button>
                      {insEligibility && activeInsuranceTab === 'government-plan' && (
                        <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: insEligibility.color, color: insEligibility.textColor, fontWeight: 700, textAlign: 'center' }}>
                            {insEligibility.msg}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Private Plan A Content */}
                {activeInsuranceTab === 'private-plan-a' && (
                  <div id="private-a" className="ins-content active" style={{ animation: 'fadeIn 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: 50, height: 50, borderRadius: 12, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          <Shield size={24} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>Premium Care Plan</h3>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Private Insurer A</p>
                        </div>
                      </div>
                      <button className="btn btn-outline">Apply Now</button>
                    </div>

                    <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--surface-dim)' }}>
                      <h4 style={{ marginBottom: '16px', fontSize: '1rem', color: 'var(--text-secondary)' }}>Eligibility Checker</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Age</label>
                          <input type="number" placeholder="e.g., 30" style={{ width: '100%', padding: 10, border: '1px solid var(--surface-dim)', borderRadius: 8 }} onChange={(e) => setInsInputs({...insInputs, age: e.target.value})} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Income Bracket</label>
                          <select style={{ width: '100%', padding: 10, border: '1px solid var(--surface-dim)', borderRadius: 8, background: 'white' }} onChange={(e) => setInsInputs({...insInputs, income: e.target.value})}>
                            <option value="Low">Below $30k</option>
                            <option value="Mid">$30k - $80k</option>
                            <option value="High">Above $80k</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Pre-existing</label>
                          <select style={{ width: '100%', padding: 10, border: '1px solid var(--surface-dim)', borderRadius: 8, background: 'white' }} onChange={(e) => setInsInputs({...insInputs, status: e.target.value})}>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Tobacco User</label>
                          <select style={{ width: '100%', padding: 10, border: '1px solid var(--surface-dim)', borderRadius: 8, background: 'white' }} onChange={(e) => setInsInputs({...insInputs, tobacco: e.target.value})}>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                      </div>
                      <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => checkEligibility('private-plan-a')}>Check Eligibility</button>
                      {insEligibility && activeInsuranceTab === 'private-plan-a' && (
                        <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: insEligibility.color, color: insEligibility.textColor, fontWeight: 700, textAlign: 'center' }}>
                            {insEligibility.msg}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Other plans as placeholders for brevity, matching original aesthetic */}
                {['private-plan-b', 'private-plan-c', 'catastrophic', 'family-floater', 'corporate-group'].includes(activeInsuranceTab || '') && (
                  <div className="ins-content active" style={{ textAlign: 'center', paddingTop: 60 }}>
                    <ShieldCheck size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                    <h3>{activeInsuranceTab?.replace(/-/g, ' ').toUpperCase()}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Standard eligibility rules apply to this plan. Consult an agent for details.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsSection />
        )}
        </div>

        {/* AI FAB */}
        <button onClick={() => setActiveTab('expert-ai')} className="ai-chat-btn">
          <Bot size={32} />
          <div className="expert-ai-badge" style={{ position: 'absolute', top: -12, right: -4, background: 'var(--accent)', color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 900, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>EXPERT AI</div>
        </button>
      </main>
      )}
    </div>
  );
};

export default Dashboard;
