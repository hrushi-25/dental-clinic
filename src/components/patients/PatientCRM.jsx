import React, { useState, useMemo } from 'react';
import { 
  User, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  HeartPulse, 
  FileText, 
  ExternalLink,
  Edit2,
  DollarSign,
  Activity,
  UserCheck
} from 'lucide-react';

export default function PatientCRM({
  patients,
  appointments,
  invoices,
  onSelectPatientChart,
  onBookForPatient,
  onSavePatient
}) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all'); // 'all' | 'high-risk' | 'balance'
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    name: '',
    dob: '',
    gender: 'Female',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'O+',
    allergies: '',
    medicalConditions: '',
    emergencyContact: '',
    insuranceProvider: '',
    notes: ''
  });

  // Filtered Patients List
  const filteredPatients = useMemo(() => {
    return patients.filter(pat => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = pat.name?.toLowerCase().includes(q);
        const matchPhone = pat.phone?.toLowerCase().includes(q);
        const matchEmail = pat.email?.toLowerCase().includes(q);
        const matchInsurance = pat.insuranceProvider?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchEmail && !matchInsurance) return false;
      }
      // Risk Filter
      if (riskFilter === 'high-risk') {
        const hasAllergy = pat.allergies && pat.allergies[0] !== 'None known';
        const hasCondition = pat.medicalConditions && pat.medicalConditions.length > 0 && pat.medicalConditions[0] !== 'None';
        if (!hasAllergy && !hasCondition) return false;
      }
      if (riskFilter === 'balance' && (pat.balanceDue || 0) <= 0) {
        return false;
      }
      return true;
    });
  }, [patients, searchQuery, riskFilter]);

  // Selected Patient Details
  const activePatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Patient Appointments
  const patientAppointments = useMemo(() => {
    if (!activePatient) return [];
    return appointments.filter(a => a.patientId === activePatient.id)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [appointments, activePatient]);

  // Patient Invoices
  const patientInvoices = useMemo(() => {
    if (!activePatient) return [];
    return invoices.filter(inv => inv.patientId === activePatient.id);
  }, [invoices, activePatient]);

  // Handle Save Notes
  const handleSaveNotes = () => {
    if (!activePatient) return;
    const updated = { ...activePatient, notes: editedNotes };
    onSavePatient(updated);
    setIsEditingNotes(false);
  };

  // Handle Create Patient Submit
  const handleCreatePatientSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `pat-${Date.now()}`,
      name: newPatient.name,
      dob: newPatient.dob || '1990-01-01',
      gender: newPatient.gender,
      phone: newPatient.phone,
      email: newPatient.email || 'care@patient.local',
      address: newPatient.address || 'Local Clinic District',
      bloodGroup: newPatient.bloodGroup,
      allergies: newPatient.allergies ? newPatient.allergies.split(',').map(s => s.trim()) : ['None known'],
      medicalConditions: newPatient.medicalConditions ? newPatient.medicalConditions.split(',').map(s => s.trim()) : ['None'],
      emergencyContact: newPatient.emergencyContact || 'Not provided',
      insuranceProvider: newPatient.insuranceProvider || 'Self-Pay',
      totalVisits: 0,
      lastVisit: 'None',
      balanceDue: 0,
      notes: newPatient.notes || '',
      odontogram: {}
    };

    onSavePatient(created);
    setSelectedPatientId(created.id);
    setIsAddPatientModalOpen(false);
    setNewPatient({
      name: '',
      dob: '',
      gender: 'Female',
      phone: '',
      email: '',
      address: '',
      bloodGroup: 'O+',
      allergies: '',
      medicalConditions: '',
      emergencyContact: '',
      insuranceProvider: '',
      notes: ''
    });
  };

  return (
    <div className="patient-crm-container">
      {/* Top Banner & Quick Stats */}
      <div className="crm-header-row">
        <div>
          <h2>Patient Records</h2>
          <p className="subtitle">
            Search patient records, medical alerts, and visit history.
          </p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary glow-cyan"
          onClick={() => setIsAddPatientModalOpen(true)}
        >
          <Plus size={18} />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Main CRM Grid */}
      <div className="crm-main-layout">
        
        {/* Left Column: Search & Patient Directory */}
        <div className="patients-sidebar glass-card">
          <div className="sidebar-search-header">
            <div className="search-box">
              <Search size={16} className="text-muted" />
              <input 
                type="text" 
                placeholder="Search patient name, phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="risk-filter-tabs">
              <button 
                type="button" 
                className={`risk-tab ${riskFilter === 'all' ? 'active' : ''}`}
                onClick={() => setRiskFilter('all')}
              >
                All ({patients.length})
              </button>
              <button 
                type="button" 
                className={`risk-tab ${riskFilter === 'high-risk' ? 'active' : ''}`}
                onClick={() => setRiskFilter('high-risk')}
              >
                ⚠️ Medical Alerts
              </button>
              <button 
                type="button" 
                className={`risk-tab ${riskFilter === 'balance' ? 'active' : ''}`}
                onClick={() => setRiskFilter('balance')}
              >
                💳 Balances
              </button>
            </div>
          </div>

          <div className="patient-cards-list">
            {filteredPatients.map(patient => {
              const isSelected = activePatient?.id === patient.id;
              const hasAllergy = patient.allergies && patient.allergies[0] !== 'None known';

              return (
                <div 
                  key={patient.id} 
                  className={`patient-list-card ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPatientId(patient.id);
                    setEditedNotes(patient.notes || '');
                    setIsEditingNotes(false);
                  }}
                >
                  <div className="patient-card-avatar">
                    {patient.name.charAt(0)}
                  </div>

                  <div className="patient-card-meta">
                    <div className="patient-card-top-line">
                      <span className="patient-card-name">{patient.name}</span>
                      {hasAllergy && (
                        <span className="medical-alert-dot" title="Has medical alert / allergy">⚠️</span>
                      )}
                    </div>
                    <span className="patient-card-phone">{patient.phone}</span>
                    <span className="patient-card-ins text-xs text-muted">{patient.insuranceProvider}</span>
                  </div>

                  {patient.balanceDue > 0 && (
                    <span className="patient-balance-pill">
                      ₹{Number(patient.balanceDue).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Patient Profile & History */}
        {activePatient ? (
          <div className="patient-profile-viewport glass-card">
            
            {/* Patient Header Banner */}
            <div className="profile-header-banner">
              <div className="profile-identity">
                <div className="profile-large-avatar">
                  {activePatient.name.charAt(0)}
                </div>
                <div>
                  <div className="profile-name-row">
                    <h3>{activePatient.name}</h3>
                    <span className="blood-group-badge">{activePatient.bloodGroup}</span>
                    <span className="gender-badge">{activePatient.gender}</span>
                  </div>
                  <div className="profile-contact-row">
                    <span><Phone size={14} /> {activePatient.phone}</span>
                    <span><Mail size={14} /> {activePatient.email}</span>
                    <span><MapPin size={14} /> {activePatient.address}</span>
                  </div>
                </div>
              </div>

              <div className="profile-quick-actions">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => onBookForPatient(activePatient)}
                >
                  <Calendar size={16} />
                  <span>Book Appointment</span>
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-cyan"
                  onClick={() => onSelectPatientChart(activePatient.id)}
                >
                  <Activity size={16} />
                  <span>Open Dental Chart</span>
                </button>
              </div>
            </div>

            {/* Medical Risk Alerts Section */}
            <div className="medical-alert-banner-box">
              <div className="alert-box-header">
                <AlertTriangle size={18} className="text-red" />
                <strong>Clinical & Medical Safety Warnings:</strong>
              </div>
              <div className="medical-tags-row">
                {activePatient.allergies?.map((alg, i) => (
                  <span key={i} className="medical-tag allergy">
                    Allergy: {alg}
                  </span>
                ))}
                {activePatient.medicalConditions?.map((cond, i) => (
                  <span key={i} className="medical-tag condition">
                    Condition: {cond}
                  </span>
                ))}
                <span className="medical-tag emergency">
                  Emergency: {activePatient.emergencyContact}
                </span>
              </div>
            </div>

            {/* Overview Metric Cards */}
            <div className="profile-metrics-grid">
              <div className="profile-stat-card">
                <span className="stat-label">Insurance Provider</span>
                <span className="stat-value text-cyan">{activePatient.insuranceProvider}</span>
              </div>
              <div className="profile-stat-card">
                <span className="stat-label">Total Visits</span>
                <span className="stat-value">{patientAppointments.length || activePatient.totalVisits}</span>
              </div>
              <div className="profile-stat-card">
                <span className="stat-label">Last Visit Date</span>
                <span className="stat-value">{activePatient.lastVisit || 'N/A'}</span>
              </div>
              <div className="profile-stat-card">
                <span className="stat-label">Outstanding Balance</span>
                <span className={`stat-value ${activePatient.balanceDue > 0 ? 'text-red' : 'text-green'}`}>
                  ₹{Number(activePatient.balanceDue || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Clinical Observations & History Tabs */}
            <div className="patient-tabs-content">
              
              {/* Doctor Clinical Notes */}
              <div className="clinical-notes-card">
                <div className="notes-header">
                  <div className="notes-title">
                    <FileText size={18} className="text-teal" />
                    <h4>Special Clinical Directives & Patient Preferences</h4>
                  </div>
                  {!isEditingNotes ? (
                    <button 
                      type="button" 
                      className="btn btn-sm btn-secondary"
                      onClick={() => { setIsEditingNotes(true); setEditedNotes(activePatient.notes || ''); }}
                    >
                      <Edit2 size={14} /> Edit Directives
                    </button>
                  ) : (
                    <div className="btn-group-sm">
                      <button type="button" className="btn btn-sm btn-primary" onClick={handleSaveNotes}>
                        Save
                      </button>
                      <button type="button" className="btn btn-sm btn-secondary" onClick={() => setIsEditingNotes(false)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {!isEditingNotes ? (
                  <p className="clinical-notes-text">
                    {activePatient.notes || 'No specific clinical notes recorded.'}
                  </p>
                ) : (
                  <textarea 
                    rows={3} 
                    value={editedNotes} 
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="textarea-input"
                    placeholder="Enter special clinical notes, anxiety preferences, medication notes..."
                  />
                )}
              </div>

              {/* Treatment & Visit History Timeline */}
              <div className="visit-history-section">
                <div className="section-title-line">
                  <h4>Treatment & Visit Timeline ({patientAppointments.length})</h4>
                </div>

                {patientAppointments.length === 0 ? (
                  <p className="text-muted text-sm py-4">No appointments on file for this patient.</p>
                ) : (
                  <div className="history-timeline">
                    {patientAppointments.map(apt => (
                      <div key={apt.id} className="timeline-event-item">
                        <div className="event-date-col">
                          <span className="event-date">{apt.date}</span>
                          <span className="event-time">{apt.time}</span>
                        </div>

                        <div className="event-details-col">
                          <div className="event-title-row">
                            <strong>{apt.procedureName}</strong>
                            <span className={`apt-status-pill ${apt.status}`}>{apt.status}</span>
                          </div>
                          <p className="event-doc-meta">
                            {apt.doctorName} • {apt.chairName} {apt.toothNumber && `• Tooth #${apt.toothNumber}`}
                          </p>
                          {apt.notes && (
                            <p className="event-notes text-muted text-xs">
                              <em>Notes: {apt.notes}</em>
                            </p>
                          )}
                        </div>

                        <div className="event-amount-col">
                          <span className="event-fee">₹{Number(apt.amount || 0).toLocaleString('en-IN')}</span>
                          <span className={`paid-tag ${apt.paid ? 'paid' : 'pending'}`}>
                            {apt.paid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        ) : (
          <div className="empty-selection-placeholder glass-card">
            <User size={48} className="text-muted" />
            <h3>Select a patient to view full EHR profile</h3>
          </div>
        )}
      </div>

      {/* Add New Patient Modal */}
      {isAddPatientModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card glass-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <UserCheck size={20} className="text-cyan" />
                </div>
                <div>
                  <h3>Register New Dental Patient</h3>
                  <p className="text-muted text-sm">Create digital electronic health record</p>
                </div>
              </div>
              <button type="button" className="icon-close-btn" onClick={() => setIsAddPatientModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatientSubmit} className="modal-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Patient Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Jordan Miller" 
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    className="text-input"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input 
                    type="date" 
                    required 
                    value={newPatient.dob}
                    onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
                    className="text-input"
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Gender</label>
                  <select 
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="select-input"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+1 (555) 000-0000" 
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="text-input"
                  />
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select 
                    value={newPatient.bloodGroup}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                    className="select-input"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="patient@example.com" 
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    className="text-input"
                  />
                </div>
                <div className="form-group">
                  <label>Residential Address</label>
                  <input 
                    type="text" 
                    placeholder="Street, City, State" 
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    className="text-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Medical Allergies (e.g. Penicillin, Latex, Sulfa)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Penicillin, Latex" 
                    value={newPatient.allergies}
                    onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                    className="text-input"
                  />
                </div>
                <div className="form-group">
                  <label>Pre-existing Conditions (e.g. Diabetes, Hypertension)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Type 2 Diabetes, High BP" 
                    value={newPatient.medicalConditions}
                    onChange={(e) => setNewPatient({ ...newPatient, medicalConditions: e.target.value })}
                    className="text-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Insurance Carrier & Policy ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Delta Dental PPO (DLT-123)" 
                    value={newPatient.insuranceProvider}
                    onChange={(e) => setNewPatient({ ...newPatient, insuranceProvider: e.target.value })}
                    className="text-input"
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact</label>
                  <input 
                    type="text" 
                    placeholder="Name & Relationship - Phone" 
                    value={newPatient.emergencyContact}
                    onChange={(e) => setNewPatient({ ...newPatient, emergencyContact: e.target.value })}
                    className="text-input"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddPatientModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary glow-cyan">
                  Register Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
