import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/layout/Navbar';
import ToastNotification from './components/layout/ToastNotification';
import DentalCanvas3D from './components/3d/DentalCanvas3D';
import AppointmentCalendar from './components/calendar/AppointmentCalendar';
import DentalChart from './components/odontogram/DentalChart';
import PatientCRM from './components/patients/PatientCRM';
import BillingInvoices from './components/billing/BillingInvoices';
import ReminderCenter from './components/reminders/ReminderCenter';
import DentalAIAssistant from './components/ai/DentalAIAssistant';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import PatientBookingPortal from './components/portal/PatientBookingPortal';
import AppointmentModal from './components/appointments/AppointmentModal';
import AuthModalOrPage from './components/auth/AuthModalOrPage';

import {
  initializeStorage,
  getStoredData,
  saveStoredData,
  resetAllDemoData,
  STORAGE_KEYS,
  DEFAULT_USERS,
  DEFAULT_APPOINTMENTS,
  DEFAULT_PATIENTS,
  DEFAULT_DOCTORS,
  DEFAULT_CHAIRS,
  DEFAULT_PROCEDURES,
  DEFAULT_INVOICES,
  DEFAULT_REMINDERS,
  CLINIC_INFO
} from './data/mockDentalData';

// Synthesized Modern Web Audio API Chimes
const playClinicSound = (type = 'click') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'pop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.09);
    }
  } catch (err) {
    // Audio contexts may be blocked before interaction
  }
};

export default function App() {
  // Initialize storage once
  useEffect(() => {
    initializeStorage();
  }, []);

  // Authentication State
  const [users, setUsers] = useState(() => getStoredData(STORAGE_KEYS.USERS, DEFAULT_USERS));
  const [currentUser, setCurrentUser] = useState(() => getStoredData(STORAGE_KEYS.CURRENT_USER, DEFAULT_USERS[0]));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('calendar');
  const [theme, setTheme] = useState('dark');
  const [threeDMode, setThreeDMode] = useState('cinematic');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Core Practice Data State
  const [appointments, setAppointments] = useState(() => getStoredData(STORAGE_KEYS.APPOINTMENTS, DEFAULT_APPOINTMENTS));
  const [patients, setPatients] = useState(() => getStoredData(STORAGE_KEYS.PATIENTS, DEFAULT_PATIENTS));
  const [doctors, setDoctors] = useState(() => getStoredData(STORAGE_KEYS.DOCTORS, DEFAULT_DOCTORS));
  const [chairs, setChairs] = useState(() => getStoredData(STORAGE_KEYS.CHAIRS, DEFAULT_CHAIRS));
  const [procedures, setProcedures] = useState(() => getStoredData(STORAGE_KEYS.PROCEDURES, DEFAULT_PROCEDURES));
  const [invoices, setInvoices] = useState(() => getStoredData(STORAGE_KEYS.INVOICES, DEFAULT_INVOICES));
  const [reminders, setReminders] = useState(() => getStoredData(STORAGE_KEYS.REMINDERS, DEFAULT_REMINDERS));

  // Selected State for cross-tab workflows
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || 'pat-1');

  // Appointment Modal State
  const [isAptModalOpen, setIsAptModalOpen] = useState(false);
  const [aptModalInitialData, setAptModalInitialData] = useState({});

  // Toast Notification State
  const [toastNotification, setToastNotification] = useState(null);

  const showToast = (title, message, type = 'success') => {
    setToastNotification({ title, message, type });
    if (soundEnabled) playClinicSound(type === 'success' ? 'success' : 'pop');
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  // Adjust default active tab when user role changes
  useEffect(() => {
    if (currentUser?.role === 'patient') {
      setActiveTab('patient-book');
    } else {
      setActiveTab('calendar');
    }
  }, [currentUser?.role]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    saveStoredData(STORAGE_KEYS.CURRENT_USER, user);
    showToast('Signed In', `Welcome back, ${user.name} (${user.role.toUpperCase()})!`);
  };

  const handleRegisterUser = (newUser) => {
    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    saveStoredData(STORAGE_KEYS.USERS, updatedUsers);

    // If registered as patient, also register patient record
    if (newUser.role === 'patient') {
      const newPatientRecord = {
        id: newUser.patientId || `pat-${Date.now()}`,
        name: newUser.name,
        dob: newUser.dob || '1995-01-01',
        gender: 'Not Specified',
        phone: newUser.phone,
        email: newUser.email,
        address: 'Local Clinic Area',
        bloodGroup: 'O+',
        allergies: ['None known'],
        medicalConditions: [],
        emergencyContact: 'Not listed',
        insuranceProvider: newUser.insuranceProvider || 'Self-Pay',
        totalVisits: 0,
        lastVisit: 'None',
        balanceDue: 0,
        notes: 'Registered online patient.',
        odontogram: {}
      };
      handleSavePatient(newPatientRecord);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    showToast('Logged Out', 'You have been signed out successfully.', 'info');
    setIsAuthModalOpen(true);
  };

  const handleQuickSwitchUser = (user) => {
    setCurrentUser(user);
    saveStoredData(STORAGE_KEYS.CURRENT_USER, user);
    showToast('Switched Profile', `Now active as ${user.name} (${user.role.toUpperCase()}).`);
  };

  // Sync Data changes to LocalStorage
  const handleSaveAppointment = (apt) => {
    const existingIdx = appointments.findIndex(a => a.id === apt.id);
    let updated;
    if (existingIdx >= 0) {
      updated = [...appointments];
      updated[existingIdx] = apt;
      showToast('Appointment Updated', `Successfully updated booking #${apt.bookingCode} for ${apt.patientName}.`);
    } else {
      updated = [apt, ...appointments];
      showToast('Appointment Confirmed', `New booking #${apt.bookingCode} created for ${apt.patientName}!`);
    }
    setAppointments(updated);
    saveStoredData(STORAGE_KEYS.APPOINTMENTS, updated);
  };

  const handleUpdateStatus = (aptId, newStatus) => {
    const updated = appointments.map(a => a.id === aptId ? { ...a, status: newStatus } : a);
    setAppointments(updated);
    saveStoredData(STORAGE_KEYS.APPOINTMENTS, updated);
    const apt = appointments.find(a => a.id === aptId);
    showToast('Status Changed', `Appointment for ${apt?.patientName} is now "${newStatus.toUpperCase()}".`);
  };

  const handleSavePatient = (patient) => {
    const existingIdx = patients.findIndex(p => p.id === patient.id);
    let updated;
    if (existingIdx >= 0) {
      updated = [...patients];
      updated[existingIdx] = patient;
      showToast('Patient Record Updated', `EHR details for ${patient.name} updated.`);
    } else {
      updated = [patient, ...patients];
      showToast('New Patient Registered', `Created electronic health record for ${patient.name}.`);
    }
    setPatients(updated);
    saveStoredData(STORAGE_KEYS.PATIENTS, updated);
  };

  const handleSaveChart = (patientId, chartData) => {
    const updated = patients.map(p => {
      if (p.id === patientId) {
        return { ...p, odontogram: chartData };
      }
      return p;
    });
    setPatients(updated);
    saveStoredData(STORAGE_KEYS.PATIENTS, updated);
    showToast('Dental Chart Saved', `Updated tooth condition mapping in EHR.`);
  };

  const handleSaveInvoice = (invoice) => {
    const updated = [invoice, ...invoices];
    setInvoices(updated);
    saveStoredData(STORAGE_KEYS.INVOICES, updated);
    showToast('Invoice Created', `Generated Invoice #${invoice.invoiceNumber} ($${invoice.total}).`);
  };

  const handleSaveReminderLog = (remLog) => {
    const updated = [remLog, ...reminders];
    setReminders(updated);
    saveStoredData(STORAGE_KEYS.REMINDERS, updated);
    showToast('Reminder Sent', `Dispatched ${remLog.channel} reminder to ${remLog.patientName}.`);
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo appointments, patient charts, invoices, and users to defaults?')) {
      resetAllDemoData();
      setUsers(DEFAULT_USERS);
      setCurrentUser(DEFAULT_USERS[0]);
      setAppointments(DEFAULT_APPOINTMENTS);
      setPatients(DEFAULT_PATIENTS);
      setDoctors(DEFAULT_DOCTORS);
      setChairs(DEFAULT_CHAIRS);
      setProcedures(DEFAULT_PROCEDURES);
      setInvoices(DEFAULT_INVOICES);
      setReminders(DEFAULT_REMINDERS);
      showToast('Demo Data Reset', 'Practice records and user accounts refreshed.');
    }
  };

  // Quick Action: Book appointment for specific tooth from Dental Chart
  const handleBookForTooth = (patient, toothNum, condition) => {
    setSelectedPatientId(patient.id);
    let matchingProcId = procedures[0]?.id;
    if (condition === 'caries') matchingProcId = 'proc-3';
    else if (condition === 'root-canal') matchingProcId = 'proc-5';
    else if (condition === 'crown') matchingProcId = 'proc-4';
    else if (condition === 'implant') matchingProcId = 'proc-7';

    setAptModalInitialData({
      patientId: patient.id,
      toothNumber: String(toothNum),
      procedureId: matchingProcId,
      date: new Date().toISOString().split('T')[0],
      time: '11:00',
      notes: `Target: Tooth #${toothNum} (${condition.toUpperCase()})`
    });
    setIsAptModalOpen(true);
  };

  // Quick Action: Book emergency slot from AI Assistant
  const handleQuickBookEmergency = ({ procedureName, notes }) => {
    const matchProc = procedures.find(p => p.name.includes(procedureName.slice(0, 10))) || procedures[9];
    const surgChair = chairs.find(c => c.type.includes('Surgery')) || chairs[1];
    const surgDoc = doctors.find(d => d.specialty.includes('Surgery')) || doctors[1];

    setAptModalInitialData({
      procedureId: matchProc.id,
      chairId: surgChair.id,
      doctorId: surgDoc.id,
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      notes
    });
    setIsAptModalOpen(true);
  };

  // Filter appointments for patient or doctor view if needed
  const userAppointments = useMemo(() => {
    if (!currentUser) return appointments;
    if (currentUser.role === 'patient') {
      return appointments.filter(
        a => a.patientId === currentUser.patientId ||
             a.patientName?.toLowerCase() === currentUser.name?.toLowerCase() ||
             a.patientEmail?.toLowerCase() === currentUser.email?.toLowerCase()
      );
    } else if (currentUser.role === 'doctor') {
      return appointments.filter(
        a => a.doctorId === currentUser.doctorId ||
             a.doctorName?.toLowerCase().includes(currentUser.name?.toLowerCase())
      );
    }
    return appointments;
  }, [appointments, currentUser]);

  // Current Patient profile if patient is logged in
  const loggedInPatientProfile = useMemo(() => {
    if (currentUser?.role !== 'patient') return null;
    return patients.find(
      p => p.id === currentUser.patientId || 
           p.name.toLowerCase() === currentUser.name.toLowerCase() ||
           p.email.toLowerCase() === currentUser.email.toLowerCase()
    ) || patients[0];
  }, [patients, currentUser]);

  return (
    <div className={`app-root-container ${theme}-theme`}>
      
      {/* Interactive 3D Canvas Background */}
      <DentalCanvas3D 
        mode={threeDMode} 
        rotationSpeed={1} 
        showControls={currentUser?.role !== 'patient'} 
      />

      {/* Main Top Navigation with User Profile Details */}
      <Navbar 
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (soundEnabled) playClinicSound('pop');
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onQuickSwitchUser={handleQuickSwitchUser}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        threeDMode={threeDMode}
        onToggleThreeDMode={() => {
          setThreeDMode(m => m === 'cinematic' ? 'minimal' : m === 'minimal' ? 'off' : 'cinematic');
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(s => !s)}
        appointmentsCount={userAppointments.length}
      />

      {/* Toast Notification Alert */}
      <ToastNotification 
        notification={toastNotification} 
        onClose={() => setToastNotification(null)} 
      />

      {/* App Body Content */}
      <main className="main-content-viewport">
        
        {/* ========================================================
            ADMIN (RECEPTIONIST) & DOCTOR PRACTICE VIEWS
           ======================================================== */}
        {(currentUser?.role === 'admin' || currentUser?.role === 'doctor') && (
          <div className="staff-hub-view animate-fade-in">
            {activeTab === 'calendar' && (
              <AppointmentCalendar 
                appointments={currentUser.role === 'doctor' ? userAppointments : appointments}
                doctors={doctors}
                chairs={chairs}
                procedures={procedures}
                patients={patients}
                onOpenNewAppointment={(initials) => {
                  setAptModalInitialData(initials || {});
                  setIsAptModalOpen(true);
                }}
                onEditAppointment={(apt) => {
                  setAptModalInitialData(apt);
                  setIsAptModalOpen(true);
                }}
                onUpdateStatus={handleUpdateStatus}
                onSendReminder={() => {
                  if (currentUser.role === 'admin') setActiveTab('reminders');
                }}
                onViewPatientChart={(patId) => {
                  setSelectedPatientId(patId);
                  setActiveTab('chart');
                }}
              />
            )}

            {activeTab === 'chart' && (
              <DentalChart 
                patients={patients}
                selectedPatientId={selectedPatientId}
                onSelectPatient={(id) => setSelectedPatientId(id)}
                onSaveChart={handleSaveChart}
                onBookForTooth={handleBookForTooth}
              />
            )}

            {activeTab === 'patients' && (
              <PatientCRM 
                patients={patients}
                appointments={appointments}
                invoices={invoices}
                onSelectPatientChart={(id) => {
                  setSelectedPatientId(id);
                  setActiveTab('chart');
                }}
                onBookForPatient={(patient) => {
                  setSelectedPatientId(patient.id);
                  setAptModalInitialData({ patientId: patient.id });
                  setIsAptModalOpen(true);
                }}
                onSavePatient={handleSavePatient}
              />
            )}

            {activeTab === 'billing' && (
              <BillingInvoices 
                invoices={invoices}
                patients={patients}
                procedures={procedures}
                onSaveInvoice={handleSaveInvoice}
              />
            )}

            {activeTab === 'reminders' && (
              <ReminderCenter 
                reminders={reminders}
                appointments={appointments}
                patients={patients}
                onSendCustomReminder={handleSaveReminderLog}
              />
            )}

            {activeTab === 'ai' && (
              <DentalAIAssistant 
                onQuickBookEmergency={handleQuickBookEmergency}
                doctors={doctors}
                chairs={chairs}
                procedures={procedures}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsDashboard 
                appointments={currentUser.role === 'doctor' ? userAppointments : appointments}
                patients={patients}
                doctors={doctors}
                chairs={chairs}
                procedures={procedures}
                invoices={invoices}
              />
            )}

            {/* Clinic Footer */}
            <div className="clinic-footer-strip">
              <div className="footer-left">
                <span>🏥 {CLINIC_INFO.name}</span>
                <span className="bullet-sep">•</span>
                <span>Active Account: {currentUser.name} ({currentUser.role.toUpperCase()})</span>
              </div>
              <div className="footer-right">
                <button 
                  type="button" 
                  className="btn-text-muted" 
                  onClick={handleResetDemo}
                  title="Reload sample appointments, patient charts & invoices"
                >
                  ↻ Reset Demo Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            PATIENT DEDICATED PORTAL VIEWS
           ======================================================== */}
        {(currentUser?.role === 'patient' || !currentUser) && (
          <div className="patient-portal-view animate-fade-in">
            
            {/* Book Appointment View */}
            {activeTab === 'patient-book' && (
              <PatientBookingPortal 
                doctors={doctors}
                procedures={procedures}
                chairs={chairs}
                appointments={appointments}
                onBookAppointment={handleSaveAppointment}
                onSwitchToStaffMode={() => {
                  handleQuickSwitchUser(DEFAULT_USERS[0]);
                  setActiveTab('calendar');
                }}
              />
            )}

            {/* Patient Personal Appointments */}
            {activeTab === 'patient-my-apts' && (
              <div className="patient-appointments-screen glass-card">
                <div className="screen-header-row">
                  <div>
                    <h2>My Visits</h2>
                    <p className="subtitle">
                      Patient: <strong>{currentUser?.name || 'Guest Patient'}</strong>
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => setActiveTab('patient-book')}
                  >
                    + Book Visit
                  </button>
                </div>

                {userAppointments.length === 0 ? (
                  <div className="empty-selection-placeholder">
                    <p>No appointments on record. Click "Book Visit" above to schedule a visit.</p>
                  </div>
                ) : (
                  <div className="patient-apts-grid">
                    {userAppointments.map(apt => (
                      <div key={apt.id} className="patient-apt-card glass-card">
                        <div className="apt-card-top-head">
                          <span className="code-pill">Ref: #{apt.bookingCode}</span>
                          <span className={`status-badge ${apt.status}`}>{apt.status?.toUpperCase()}</span>
                        </div>

                        <h3>{apt.procedureName}</h3>
                        
                        <div className="apt-info-lines">
                          <div>📅 Date & Time: <strong>{apt.date} at {apt.time}</strong></div>
                          <div>👨‍⚕️ Specialist: <strong>{apt.doctorName}</strong></div>
                          <div>🪑 Operatory: <strong>{apt.chairName}</strong></div>
                          <div>💰 Estimated Fee: <strong>₹{Number(apt.amount || 0).toLocaleString('en-IN')}</strong> ({apt.paymentMethod})</div>
                        </div>

                        {apt.notes && (
                          <div className="apt-notes-quote">
                            <em>"{apt.notes}"</em>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Patient Personal Dental Chart */}
            {activeTab === 'patient-my-chart' && loggedInPatientProfile && (
              <div className="patient-chart-screen">
                <div className="screen-header-row mb-3">
                  <div>
                    <h2>My Dental Chart</h2>
                    <p className="subtitle">Overview of your teeth and treatments.</p>
                  </div>
                </div>

                <DentalChart 
                  patients={[loggedInPatientProfile]}
                  selectedPatientId={loggedInPatientProfile.id}
                  onSelectPatient={() => {}}
                  onSaveChart={handleSaveChart}
                  onBookForTooth={handleBookForTooth}
                />
              </div>
            )}

            {/* Track Booking View */}
            {activeTab === 'patient-track' && (
              <PatientBookingPortal 
                doctors={doctors}
                procedures={procedures}
                chairs={chairs}
                appointments={appointments}
                onBookAppointment={handleSaveAppointment}
                onSwitchToStaffMode={() => {
                  handleQuickSwitchUser(DEFAULT_USERS[0]);
                  setActiveTab('calendar');
                }}
              />
            )}

            {/* Symptom Triage AI for Patient */}
            {activeTab === 'ai' && (
              <DentalAIAssistant 
                onQuickBookEmergency={handleQuickBookEmergency}
                doctors={doctors}
                chairs={chairs}
                procedures={procedures}
              />
            )}
          </div>
        )}
      </main>

      {/* Appointment Modal */}
      {isAptModalOpen && (
        <AppointmentModal 
          isOpen={isAptModalOpen}
          initialData={aptModalInitialData}
          patients={patients}
          doctors={doctors}
          chairs={chairs}
          procedures={procedures}
          appointments={appointments}
          onClose={() => setIsAptModalOpen(false)}
          onSaveAppointment={handleSaveAppointment}
          onSaveNewPatient={handleSavePatient}
        />
      )}

      {/* Auth Modal (Login / Register) */}
      {isAuthModalOpen && (
        <AuthModalOrPage 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          users={users}
          onLoginSuccess={handleLoginSuccess}
          onRegisterUser={handleRegisterUser}
        />
      )}

    </div>
  );
}
