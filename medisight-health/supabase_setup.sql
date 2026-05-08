-- MEDISIGHT HEALTH - REFINED APPOINTMENTS SCHEMA
-- Use this code in the Supabase SQL Editor to create the necessary table and security policies.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create the appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Appointment Details
    hospital TEXT NOT NULL,
    dept TEXT NOT NULL,
    appt_date DATE NOT NULL,
    appt_time TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Declined', 'Completed', 'Confirmed')),
    
    -- Patient Context (Denormalized for quick read in Doctor portal)
    patient_name TEXT,
    patient_age INTEGER,
    patient_blood_group TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appt_date);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Data Protection

-- POLICY: Patients can only view their own appointments
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
CREATE POLICY "Users can view their own appointments" ON public.appointments
FOR SELECT USING (auth.uid() = user_id);

-- POLICY: Patients can insert their own records
DROP POLICY IF EXISTS "Users can insert their own appointments" ON public.appointments;
CREATE POLICY "Users can insert their own appointments" ON public.appointments
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- POLICY: Doctors can view all appointments to provide consultations
DROP POLICY IF EXISTS "Doctors can view all" ON public.appointments;
CREATE POLICY "Doctors can view all" ON public.appointments
FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'doctor')
);

-- POLICY: Doctors can update the status (Approve/Decline)
DROP POLICY IF EXISTS "Doctors can update status" ON public.appointments;
CREATE POLICY "Doctors can update status" ON public.appointments
FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'doctor')
);

-- 5. Profiles table for both patients and doctors
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'doctor')),
    dob DATE,
    blood_group TEXT,
    weight TEXT,
    height TEXT,
    allergies TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- 6. Enable Real-time (Supabase specific)
-- Note: You may also need to enable this in the Supabase Dashboard under Database > Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
