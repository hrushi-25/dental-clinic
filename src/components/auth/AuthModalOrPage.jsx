import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck, 
  Stethoscope, 
  UserCheck, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  X,
  AlertCircle,
  Building,
  HeartPulse
} from 'lucide-react';
import { DEFAULT_USERS, CLINIC_INFO } from '../../data/mockDentalData';

export default function AuthModalOrPage({
  isOpen,
  onClose,
  users = [],
  onLoginSuccess,
  onRegisterUser
}) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('patient'); // 'patient' | 'doctor' | 'admin'

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  // Role specific
  const [regDoctorSpecialty, setRegDoctorSpecialty] = useState('Cosmetic & Restorative Dentistry');
  const [regDoctorLicense, setRegDoctorLicense] = useState('');
  const [regPatientDob, setRegPatientDob] = useState('1995-05-12');
  const [regPatientInsurance, setRegPatientInsurance] = useState('Delta Dental Premier');
  const [regAdminTitle, setRegAdminTitle] = useState('Lead Clinic Receptionist');

  // Handle Quick Demo Login
  const handleQuickDemoLogin = (demoUser) => {
    onLoginSuccess(demoUser);
    onClose();
  };

  // Handle Manual Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const matchedUser = users.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (!matchedUser) {
      setLoginError('No account found with this email address.');
      return;
    }

    if (matchedUser.password && matchedUser.password !== loginPassword.trim()) {
      setLoginError('Invalid password. (For demo accounts, use password "password")');
      return;
    }

    onLoginSuccess(matchedUser);
    onClose();
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const emailExists = users.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (emailExists) {
      setLoginError('An account with this email address already exists.');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword.trim() || 'password',
      phone: regPhone.trim() || '+1 (555) 000-0000',
      role: selectedRole,
      avatar: selectedRole === 'doctor' 
        ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80'
        : selectedRole === 'admin'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      title: selectedRole === 'doctor' 
        ? regDoctorSpecialty 
        : selectedRole === 'admin' 
        ? regAdminTitle 
        : 'Registered Patient',
      licenseNumber: selectedRole === 'doctor' ? (regDoctorLicense || 'DDS-LOCAL-01') : undefined,
      insuranceProvider: selectedRole === 'patient' ? regPatientInsurance : undefined,
      dob: selectedRole === 'patient' ? regPatientDob : undefined,
      patientId: selectedRole === 'patient' ? `pat-${Date.now()}` : undefined,
      doctorId: selectedRole === 'doctor' ? `doc-${Date.now()}` : undefined
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop auth-backdrop">
      <div className="modal-card glass-card auth-modal-card">
        
        {/* Modal Close Button */}
        <button type="button" className="auth-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Auth Header Branding */}
        <div className="auth-header-block">
          <div className="brand-icon-mesh">
            <span className="brand-tooth-emoji">🦷</span>
          </div>
          <h2>{authMode === 'login' ? 'Sign In to DentPulse' : 'Create Clinic Account'}</h2>
          <p className="subtitle">
            {authMode === 'login' 
              ? 'Access your appointment schedule, patient records & clinical tools' 
              : 'Register as a Patient, Doctor, or Clinic Receptionist'}
          </p>
        </div>

        {/* Tab Switcher: Login / Register */}
        <div className="auth-tab-pill">
          <button 
            type="button" 
            className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => { setAuthMode('login'); setLoginError(''); }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => { setAuthMode('register'); setLoginError(''); }}
          >
            Register Account
          </button>
        </div>

        {/* Quick Demo One-Click Access Buttons */}
        <div className="quick-demo-accounts-box">
          <span className="demo-accounts-label">⚡ 1-Click Instant Demo Login:</span>
          <div className="demo-buttons-grid">
            <button 
              type="button" 
              className="demo-role-btn admin"
              onClick={() => handleQuickDemoLogin(DEFAULT_USERS[0])}
              title="Full practice access: Calendar, Invoices, CRM, AI Assistant, Analytics"
            >
              <ShieldCheck size={14} />
              <span>Admin / Receptionist</span>
            </button>

            <button 
              type="button" 
              className="demo-role-btn doctor"
              onClick={() => handleQuickDemoLogin(DEFAULT_USERS[1])}
              title="Doctor access: Daily Chair Schedule, Odontogram Charts, Clinical Notes"
            >
              <Stethoscope size={14} />
              <span>Dr. Sarah (Doctor)</span>
            </button>

            <button 
              type="button" 
              className="demo-role-btn patient"
              onClick={() => handleQuickDemoLogin(DEFAULT_USERS[3])}
              title="Patient access: Personal bookings, dental chart, treatment history"
            >
              <User size={14} />
              <span>Sophia (Patient)</span>
            </button>
          </div>
        </div>

        <div className="auth-divider-line">
          <span>OR SIGN IN WITH EMAIL</span>
        </div>

        {/* Error Alert Box */}
        {loginError && (
          <div className="auth-error-box animate-fade-in">
            <AlertCircle size={16} className="text-red" />
            <span>{loginError}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="modal-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input 
                  type="email" 
                  required 
                  placeholder="e.g. admin@dentpulse3d.com" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="text-input with-icon"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-with-link">
                <label>Password</label>
                <span className="text-xs text-muted">Demo: <code>password</code></span>
              </div>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="text-input with-icon"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary glow-cyan w-full mt-2">
              <span>Sign In to Account</span>
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="modal-form">
            
            {/* Select Role for Registration */}
            <div className="form-group">
              <label>I am Registering As:</label>
              <div className="role-selector-cards">
                <button
                  type="button"
                  className={`role-card ${selectedRole === 'patient' ? 'selected' : ''}`}
                  onClick={() => setSelectedRole('patient')}
                >
                  <User size={18} />
                  <strong>Patient</strong>
                  <span className="text-xs text-muted">Book & Track Visits</span>
                </button>

                <button
                  type="button"
                  className={`role-card ${selectedRole === 'doctor' ? 'selected' : ''}`}
                  onClick={() => setSelectedRole('doctor')}
                >
                  <Stethoscope size={18} />
                  <strong>Doctor</strong>
                  <span className="text-xs text-muted">Chairs & Charts</span>
                </button>

                <button
                  type="button"
                  className={`role-card ${selectedRole === 'admin' ? 'selected' : ''}`}
                  onClick={() => setSelectedRole('admin')}
                >
                  <ShieldCheck size={18} />
                  <strong>Receptionist</strong>
                  <span className="text-xs text-muted">Full Practice OS</span>
                </button>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder={selectedRole === 'doctor' ? 'Dr. Alex Rivera, DDS' : 'Alex Rivera'} 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="+1 (555) 000-0000" 
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  required 
                  placeholder="alex@example.com" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input 
                  type="password" 
                  required 
                  placeholder="Create strong password" 
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>

            {/* Role Specific Additional Fields */}
            {selectedRole === 'patient' && (
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input 
                    type="date" 
                    value={regPatientDob}
                    onChange={(e) => setRegPatientDob(e.target.value)}
                    className="text-input"
                  />
                </div>
                <div className="form-group">
                  <label>Insurance Carrier</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Delta Dental PPO, Self-Pay" 
                    value={regPatientInsurance}
                    onChange={(e) => setRegPatientInsurance(e.target.value)}
                    className="text-input"
                  />
                </div>
              </div>
            )}

            {selectedRole === 'doctor' && (
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Specialty Field</label>
                  <select 
                    value={regDoctorSpecialty}
                    onChange={(e) => setRegDoctorSpecialty(e.target.value)}
                    className="select-input"
                  >
                    <option value="Cosmetic & Restorative Dentistry">Cosmetic & Restorative Dentistry</option>
                    <option value="Oral Surgery & Implantology">Oral Surgery & Implantology</option>
                    <option value="Pediatric & Orthodontics">Pediatric & Orthodontics</option>
                    <option value="Endodontics & Periodontics">Endodontics & Periodontics</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Dental License #</label>
                  <input 
                    type="text" 
                    placeholder="e.g. DDS-CA-88902" 
                    value={regDoctorLicense}
                    onChange={(e) => setRegDoctorLicense(e.target.value)}
                    className="text-input"
                  />
                </div>
              </div>
            )}

            {selectedRole === 'admin' && (
              <div className="form-group">
                <label>Staff Position / Role Title</label>
                <input 
                  type="text" 
                  value={regAdminTitle}
                  onChange={(e) => setRegAdminTitle(e.target.value)}
                  className="text-input"
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary glow-cyan w-full mt-2">
              <CheckCircle2 size={16} />
              <span>Complete Registration</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
