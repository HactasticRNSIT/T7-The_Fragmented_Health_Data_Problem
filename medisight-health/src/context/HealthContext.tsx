import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface UserProfile {
  name: string;
  dob: string;
  bloodGroup: string;
  weight: string;
  height: string;
  allergies: string;
  lastLogin: string;
  role: 'patient' | 'doctor';
  settings?: {
    theme: 'light' | 'dark';
    fontSize: 'small' | 'medium' | 'large';
  };
}

export interface Appointment {
  id: string | number;
  hospital: string;
  dept: string;
  date: string;
  time: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined' | 'Completed' | 'Confirmed';
  patientDetails?: Partial<UserProfile>;
}

export interface Report {
  id: string | number;
  name: string;
  date: string;
  size: string;
  dataUrl: string;
}

interface HealthContextType {
  userProfile: UserProfile;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  addAppointment: (appt: Appointment) => void;
  updateAppointmentStatus: (id: string | number, status: Appointment['status']) => void;
  toggleTheme: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('medisight_userProfile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse user profile from localStorage', e);
    }
    return {
      name: 'User',
      dob: '',
      bloodGroup: 'O+',
      weight: '68',
      height: '170',
      allergies: 'None',
      lastLogin: new Date().toISOString(),
      role: 'patient',
      settings: {
        theme: 'light',
        fontSize: 'medium'
      }
    };
  });

  // Apply theme and font size classes to document
  useEffect(() => {
    const theme = userProfile.settings?.theme || 'light';
    const fontSize = userProfile.settings?.fontSize || 'medium';
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    document.documentElement.classList.remove('text-small', 'text-medium', 'text-large');
    document.documentElement.classList.add(`text-${fontSize}`);
  }, [userProfile.settings]);

  const toggleTheme = () => {
    const currentTheme = userProfile.settings?.theme || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setUserProfile({ 
      settings: { 
        ...(userProfile.settings || { fontSize: 'medium' }), 
        theme: newTheme 
      } 
    });
  };

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    setUserProfile({ 
      settings: { 
        ...(userProfile.settings || { theme: 'light' }), 
        fontSize: size 
      } 
    });
  };

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userRole = session.user.user_metadata.role || 'patient';
      
      let query = supabase.from('appointments').select('*');
      
      if (userRole === 'patient') {
        query = query.eq('user_id', session.user.id);
      }
      
      const { data, error } = await query.order('appt_date', { ascending: true });

      if (error) throw error;

      if (data) {
        const formatted: Appointment[] = data.map(item => ({
          id: item.id,
          hospital: item.hospital,
          dept: item.dept,
          date: item.appt_date,
          time: item.appt_time,
          reason: item.reason,
          status: item.status,
          patientDetails: {
            name: item.patient_name,
            age: item.patient_age,
            bloodGroup: item.patient_blood_group
          }
        }));
        setAppointments(formatted);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // Set up real-time subscription
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setUserProfileState(prev => ({
          ...prev,
          name: metadata.full_name || session.user.email?.split('@')[0] || 'User',
          role: metadata.role || 'patient'
        }));
        fetchAppointments();
      } else {
        setAppointments([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem('medisight_reports');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse reports from localStorage', e);
    }
    return [
      {
        id: 'static-1',
        name: 'MRI Scan Result - Lower Back',
        date: 'Nov 02, 2025',
        size: '2.4 MB',
        dataUrl: '#'
      },
      {
        id: 'static-2',
        name: 'Complete Blood Count (CBC)',
        date: 'Oct 24, 2025',
        size: '1.1 MB',
        dataUrl: '#'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('medisight_userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('medisight_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    const syncProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Try to fetch existing profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"

        if (data) {
          // Update local state with DB data
          setUserProfileState({
            name: data.full_name || 'User',
            dob: data.dob || '',
            bloodGroup: data.blood_group || 'O+',
            weight: data.weight || '68',
            height: data.height || '170',
            allergies: data.allergies || 'None',
            lastLogin: new Date().toISOString(),
            role: data.role || 'patient'
          });
        } else {
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: session.user.id,
              full_name: userProfile.name,
              role: userProfile.role,
              dob: null,
              blood_group: userProfile.bloodGroup,
              weight: userProfile.weight,
              height: userProfile.height,
              allergies: userProfile.allergies
            }]);
          
          if (insertError) console.error('Error creating profile:', insertError);
        }
      } catch (err) {
        console.error('Error syncing profile:', err);
      }
    };

    syncProfile();
  }, []);

  const setUserProfile = async (profile: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...profile };
    setUserProfileState(updated);
    
    // Also update in Supabase if logged in
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('profiles')
          .update({
            full_name: updated.name,
            role: updated.role,
            dob: updated.dob || null,
            blood_group: updated.bloodGroup,
            weight: updated.weight,
            height: updated.height,
            allergies: updated.allergies
          })
          .eq('id', session.user.id);
      }
    } catch (err) {
      console.error('Error updating profile in DB:', err);
    }
  };

  const addAppointment = async (appt: Appointment) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.from('appointments').insert([{
        hospital: appt.hospital,
        dept: appt.dept,
        appt_date: appt.date,
        appt_time: appt.time,
        reason: appt.reason,
        status: 'Pending',
        user_id: session.user.id,
        patient_name: userProfile.name,
        patient_age: parseInt(userProfile.dob) ? (new Date().getFullYear() - new Date(userProfile.dob).getFullYear()) : 30, // Fallback age
        patient_blood_group: userProfile.bloodGroup
      }]).select();

      if (error) throw error;
      if (data) fetchAppointments();
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const updateAppointmentStatus = async (id: number | string, status: Appointment['status']) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  return (
    <HealthContext.Provider value={{
      userProfile,
      setUserProfile,
      appointments,
      setAppointments,
      reports,
      setReports,
      addAppointment,
      updateAppointmentStatus,
      toggleTheme,
      setFontSize
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) throw new Error('useHealth must be used within a HealthProvider');
  return context;
};
