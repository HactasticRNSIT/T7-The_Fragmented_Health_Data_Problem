import React from 'react';
import { Moon, Sun, Type, Layout, Shield, Bell, Lock, User as UserIcon, Droplets, Ruler, Weight } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

const SettingsSection: React.FC = () => {
  const { userProfile, setUserProfile, toggleTheme, setFontSize } = useHealth();
  const settings = userProfile.settings || { theme: 'light', fontSize: 'medium' };

  return (
    <div className="settings-container animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your profile and app preferences.</p>
      </div>

      <div className="dash-grid-2">
        <section className="settings-group">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
            <UserIcon size={20} color="var(--accent)" /> Health Profile
          </h3>
          <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div className="form-group">
               <label style={{ fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Blood Group</label>
               <div className="input-wrap">
                 <Droplets size={16} className="input-icon" />
                 <select 
                    style={{ background: 'transparent', border: 'none', width: '100%', outline: 'none' }}
                    value={userProfile.bloodGroup}
                    onChange={(e) => setUserProfile({ bloodGroup: e.target.value })}
                 >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                 </select>
               </div>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Height (cm)</label>
                  <div className="input-wrap">
                    <Ruler size={16} className="input-icon" />
                    <input 
                      type="number" 
                      value={userProfile.height} 
                      onChange={(e) => setUserProfile({ height: e.target.value })}
                      style={{ background: 'transparent', border: 'none', width: '100%', outline: 'none' }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Weight (kg)</label>
                  <div className="input-wrap">
                    <Weight size={16} className="input-icon" />
                    <input 
                      type="number" 
                      value={userProfile.weight} 
                      onChange={(e) => setUserProfile({ weight: e.target.value })}
                      style={{ background: 'transparent', border: 'none', width: '100%', outline: 'none' }}
                    />
                  </div>
                </div>
             </div>
          </div>
        </section>

        <section className="settings-group">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
            <Layout size={20} color="var(--accent)" /> Visual Theme
          </h3>
          <div className="dash-card">
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Switch between light and dark modes for a better viewing experience.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={() => settings.theme === 'dark' && toggleTheme()}
                className={`btn ${settings.theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Sun size={18} /> Light Mode
              </button>
              <button 
                onClick={() => settings.theme === 'light' && toggleTheme()}
                className={`btn ${settings.theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Moon size={18} /> Dark Mode
              </button>
            </div>
          </div>
        </section>

        <section className="settings-group">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
            <Type size={20} color="var(--accent)" /> Text Display
          </h3>
          <div className="dash-card">
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Adjust the overall text size for better readability.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`btn ${settings.fontSize === size ? 'btn-primary' : 'btn-outline'}`}
                  style={{ 
                    padding: '10px', 
                    fontSize: size === 'small' ? '0.8rem' : size === 'medium' ? '1rem' : '1.2rem',
                    textTransform: 'capitalize',
                    justifyContent: 'center'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div style={{ marginTop: '48px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Account & Security</h3>
        <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', gap: '1px', padding: 0, overflow: 'hidden' }}>
          {[
            { icon: Bell, label: 'Notifications', value: 'Enabled' },
            { icon: Shield, label: 'Privacy Policy', value: 'View' },
            { icon: Lock, label: 'Two-Factor Authentication', value: 'Disabled' }
          ].map((item, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '20px 24px', 
              background: 'var(--surface)',
              borderBottom: idx === 2 ? 'none' : '1px solid var(--surface-dim)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ color: 'var(--text-muted)' }}><item.icon size={20} /></div>
                <span style={{ fontWeight: 500 }}>{item.label}</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
