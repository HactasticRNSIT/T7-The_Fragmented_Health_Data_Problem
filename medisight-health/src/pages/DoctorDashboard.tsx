import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Calendar, 
  History, 
  Settings, 
  LogOut, 
  Activity, 
  Users, 
  MessageSquare, 
  Search, 
  Bell, 
  Clock, 
  Stethoscope, 
  Zap, 
  ChevronDown, 
  User, 
  FileText,
  Loader2
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import SettingsSection from '../components/SettingsSection';

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const { appointments, updateAppointmentStatus, userProfile } = useHealth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Fetch unique patients who have appointments
        const { data, error } = await supabase
          .from('appointments')
          .select('user_id, patient_name, patient_age, patient_blood_group, reason, appt_date, status');
        
        if (error) throw error;
        
        if (data) {
          // Group by user_id and take latest
          const uniquePatientsMap = new Map();
          data.forEach(item => {
            if (!uniquePatientsMap.has(item.user_id)) {
              uniquePatientsMap.set(item.user_id, {
                id: item.user_id,
                name: item.patient_name,
                age: item.patient_age,
                bloodGroup: item.patient_blood_group,
                lastVisit: item.appt_date,
                lastReason: item.reason,
                status: item.status
              });
            } else {
              // Update if newer date
              const existing = uniquePatientsMap.get(item.user_id);
              if (new Date(item.appt_date) > new Date(existing.lastVisit)) {
                uniquePatientsMap.set(item.user_id, {
                  ...existing,
                  lastVisit: item.appt_date,
                  lastReason: item.reason,
                  status: item.status
                });
              }
            }
          });
          setPatients(Array.from(uniquePatientsMap.values()));
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    };

    if (!loading) {
      fetchPatients();
    }
  }, [loading]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else if (session.user.user_metadata.role !== 'doctor' && userProfile.role !== 'doctor') {
        navigate('/dashboard'); // Not a doctor, go to patient dashboard
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate, userProfile.role]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
  const [expandedPatientId, setExpandedPatientId] = useState<number | null>(null);

  const togglePatient = (id: number) => {
    setExpandedPatientId(expandedPatientId === id ? null : id);
  };

  const pendingAppts = appointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed');

  return (
    <div className="dash-container doctor-portal-body">
      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon" style={{ background: 'var(--accent)', padding: 10, borderRadius: 10, color: 'var(--primary)' }}>
            <Activity size={20} />
          </div>
          <span className="brand-text">MediSight <span style={{ color: 'var(--accent)' }}>Doc</span></span>
        </div>
        
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
            <Users size={20} /> My Patients
          </button>
          <button className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
            <Calendar size={20} /> Schedule
          </button>
          <button className="nav-item">
            <MessageSquare size={20} /> Consultations
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

      {/* MAIN CONTENT */}
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
            <input type="text" placeholder="Search patients, records..." />
          </div>
          <div className="nav-actions">
            <div className="nav-notif">
              <Bell size={20} />
              <span className="notif-badge"></span>
            </div>
            <div className="user-profile">
              <div className="user-avatar">{userProfile.name.substring(0, 2).toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">{userProfile.name.startsWith('Dr.') ? userProfile.name : `Dr. ${userProfile.name}`}</span>
                <span className="user-role">Medical Professional</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dash-content">
          {activeTab === 'dashboard' && (
            <>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Doctor's Portal</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {userProfile.name.startsWith('Dr.') ? userProfile.name : `Dr. ${userProfile.name}`}. You have 3 urgent alerts.</p>
              </div>

              <div className="emergency-alerts">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Zap className="pulse" color="#ff4d4d" size={24} />
                  <h2 style={{ fontSize: '1.2rem', color: '#b30000', margin: 0 }}>Critical Emergency Alerts</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {[
                    { id: '1', name: 'John Doe', vitals: 'BP: 180/110', time: '2 mins ago', status: 'Critical' },
                    { id: '2', name: 'Jane Smith', vitals: 'Heart Rate: 115', time: '5 mins ago', status: 'Warning' },
                    { id: '3', name: 'Alice Brown', vitals: 'SpO2: 88%', time: '8 mins ago', status: 'Critical' }
                  ].map(alert => (
                    <div key={alert.id} className="alert-card-minimal">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="alert-badge">{alert.status}</span>
                        <span style={{ fontSize: '0.75rem', color: '#b30000' }}>{alert.time}</span>
                      </div>
                      <h4 style={{ margin: '12px 0 4px', color: '#330000' }}>{alert.name}</h4>
                      <p style={{ margin: 0, fontWeight: 600, color: '#b30000' }}>{alert.vitals}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dash-grid-2">
                <section className="pending-requests">
                  <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={20} color="var(--primary)" /> Patient Review Requests
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {pendingAppts.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No pending requests.</p>
                    ) : pendingAppts.map(patient => (
                      <div key={patient.id} className={`patient-details-box ${expandedPatientId === patient.id ? 'open' : ''}`} style={{ marginBottom: '12px' }}>
                        <div 
                          className="patient-summary" 
                          onClick={() => togglePatient(patient.id)}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <User size={20} />
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: 600 }}>{patient.patientDetails?.name || 'Robert Johnson'}</p>
                              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {patient.id} • Age: {patient.patientDetails?.age || 54}</p>
                            </div>
                          </div>
                          <ChevronDown size={20} color="var(--text-muted)" style={{ transform: expandedPatientId === patient.id ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                        </div>
                        
                        {expandedPatientId === patient.id && (
                          <div className="patient-expanded-info" style={{ padding: '0 16px 16px', borderTop: '1px solid var(--surface-dim)', marginTop: '8px', paddingTop: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>REASON</p>
                                <p style={{ margin: 0, fontWeight: 500 }}>{patient.reason}</p>
                              </div>
                              <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>HOSPITAL</p>
                                <span style={{ 
                                  padding: '2px 8px', 
                                  borderRadius: '4px', 
                                  fontSize: '0.75rem', 
                                  background: '#f0faff',
                                  color: '#00a3ff'
                                }}>
                                  {patient.hospital}
                                </span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                              <button onClick={() => updateAppointmentStatus(patient.id, 'Approved')} className="btn btn-primary" style={{ flex: 1, padding: '8px' }}>Approve</button>
                              <button onClick={() => updateAppointmentStatus(patient.id, 'Declined')} className="btn btn-outline" style={{ flex: 1, padding: '8px', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Decline</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="ongoing-clinical">
                  <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Stethoscope size={20} color="var(--primary)" /> Clinical Summary
                  </h3>
                  <div className="dash-card">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <div className="stat-pill">Total Patients: 142</div>
                        <div className="stat-pill">Surgery Pending: 4</div>
                        <div className="stat-pill">Discharge Ready: 12</div>
                    </div>
                    <div style={{ marginTop: '24px' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>Recent Activity</h4>
                        <div style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--surface-dim)' }}>
                          <FileText size={16} color="var(--text-muted)" />
                          <p style={{ fontSize: '0.85rem', margin: 0 }}>Updated medical records for John Doe</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', padding: '12px 0' }}>
                          <Activity size={16} color="var(--text-muted)" />
                          <p style={{ fontSize: '0.85rem', margin: 0 }}>Completed virtual consultation with Jane Smith</p>
                        </div>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}          {activeTab === 'patients' && (
            <div className="patients-view animate-fade-in" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                  <Users color="var(--accent)" /> My Patients
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="nav-search" style={{ margin: 0, background: 'var(--surface-dim)' }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input type="text" placeholder="Search by name..." style={{ background: 'transparent' }} />
                  </div>
                  <button className="btn btn-primary">Add New Patient</button>
                </div>
              </div>

              <div className="dash-card" style={{ padding: 0, overflowX: 'auto', border: '1px solid var(--surface-dim)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-dim)', borderBottom: '1px solid var(--surface-dim)' }}>
                      <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>PATIENT NAME</th>
                      <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>AGE</th>
                      <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>BLOOD GROUP</th>
                      <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>LAST VISIT</th>
                      <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>LAST REASON</th>
                      <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>STATUS</th>
                      <th style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No patients found in your records yet.
                        </td>
                      </tr>
                    ) : patients.map((patient) => (
                      <tr key={patient.id} style={{ borderBottom: '1px solid #f0f0f0' }} className="table-row-hover">
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.8rem', background: 'var(--primary)', color: 'white' }}>
                              {(patient.name || 'P').substring(0, 2).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 600 }}>{patient.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>{patient.age}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ 
                            padding: '2px 6px', 
                            background: '#ffebeb', 
                            color: '#b30000', 
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}>
                            {patient.bloodGroup}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>{new Date(patient.lastVisit).toLocaleDateString()}</td>
                        <td style={{ padding: '16px' }}>{patient.lastReason}</td>
                        <td style={{ padding: '16px' }}>
                          <span className={`status-badge status-${(patient.status || 'pending').toLowerCase()}`} style={{ fontSize: '0.75rem' }}>
                            {patient.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <button style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>View Profile</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="schedule-view animate-fade-in" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                    <Calendar color="var(--accent)" /> Monthly Schedule
                  </h2>
                  <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Viewing confirmed appointments for May 2026</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} /> Previous
                  </button>
                  <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Next <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                  </button>
                </div>
              </div>

              <div className="dash-grid-2" style={{ gridTemplateColumns: 'minmax(250px, 350px) 1fr', gap: '24px' }}>
                {/* Date Picker Sidebar */}
                <div className="dash-card" style={{ padding: '20px' }}>
                  <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>SELECT DATE</h4>
                  <div className="mini-calendar" style={{ textAlign: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>{day}</div>
                      ))}
                      {Array.from({ length: 31 }).map((_, i) => (
                        <div 
                          key={i} 
                          style={{ 
                            padding: '8px 0', 
                            fontSize: '0.85rem', 
                            borderRadius: '4px',
                            cursor: 'pointer',
                            background: i + 1 === 8 ? 'var(--primary)' : 'transparent',
                            color: i + 1 === 8 ? 'white' : 'inherit'
                          }}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '32px' }}>
                    <h4 style={{ marginBottom: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>LEGEND</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div> Approved
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}></div> Rescheduled
                      </div>
                    </div>
                  </div>
                </div>

                {/* Daily Appointments List */}
                <div className="dash-card" style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '24px' }}>Today's Agenda</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {appointments.filter(a => a.status === 'Approved' || a.status === 'Confirmed').length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                        <Calendar size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                        <p>No confirmed appointments for today.</p>
                      </div>
                    ) : (
                      appointments
                        .filter(a => a.status === 'Approved' || a.status === 'Confirmed')
                        .sort((a, b) => a.appt_time.localeCompare(b.appt_time))
                        .map((appt, idx) => (
                          <div key={appt.id} style={{ 
                            display: 'flex', 
                            gap: '24px', 
                            padding: '20px 0', 
                            borderBottom: idx === appointments.length - 1 ? 'none' : '1px solid var(--surface-dim)' 
                          }}>
                            <div style={{ minWidth: '80px' }}>
                              <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>{appt.appt_time}</p>
                              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>45 mins</p>
                            </div>
                            <div style={{ 
                              flex: 1, 
                              padding: '16px', 
                              background: 'var(--surface-dim)', 
                              borderRadius: '12px',
                              borderLeft: '4px solid var(--primary)',
                              position: 'relative'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <h4 style={{ margin: '0 0 4px 0' }}>{appt.patientDetails?.name || appt.patient_name}</h4>
                                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{appt.reason}</p>
                                </div>
                                <span className={`status-badge status-approved`} style={{ fontSize: '0.7rem' }}>
                                  {appt.status}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  <User size={14} /> {appt.patientDetails?.age || appt.patient_age} yrs
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  <Activity size={14} /> {appt.patientDetails?.bloodGroup || appt.patient_blood_group}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsSection />
          )}
        </div>
      </main>
      )}
    </div>
  );
};

export default DoctorDashboard;
