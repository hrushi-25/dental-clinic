import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  MapPin, 
  AlertTriangle, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  UserPlus,
  Sparkles
} from 'lucide-react';

export default function AppointmentModal({
  isOpen,
  initialData = {},
  patients = [],
  doctors = [],
  chairs = [],
  procedures = [],
  appointments = [],
  onClose,
  onSaveAppointment,
  onSaveNewPatient
}) {
  const isEditing = Boolean(initialData?.id);

  // Form State
  const [patientMode, setPatientMode] = useState('existing'); // 'existing' | 'new'
  const [selectedPatientId, setSelectedPatientId] = useState(initialData?.patientId || (patients[0]?.id || ''));
  
  // New Patient inline fields
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientDob, setNewPatientDob] = useState('');
  const [newPatientAllergies, setNewPatientAllergies] = useState('');

  // Appointment fields
  const [doctorId, setDoctorId] = useState(initialData?.doctorId || (doctors[0]?.id || ''));
  const [chairId, setChairId] = useState(initialData?.chairId || (chairs[0]?.id || ''));
  const [procedureId, setProcedureId] = useState(initialData?.procedureId || (procedures[0]?.id || ''));
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(initialData?.time || '09:00');
  const [duration, setDuration] = useState(initialData?.duration || 45);
  const [amount, setAmount] = useState(initialData?.amount || 180);
  const [toothNumber, setToothNumber] = useState(initialData?.toothNumber || '');
  const [status, setStatus] = useState(initialData?.status || 'scheduled');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [sendReminderChecked, setSendReminderChecked] = useState(true);

  // Pre-fill fields when initialData or procedure changes
  useEffect(() => {
    if (initialData?.patientId) setSelectedPatientId(initialData.patientId);
    if (initialData?.doctorId) setDoctorId(initialData.doctorId);
    if (initialData?.chairId) setChairId(initialData.chairId);
    if (initialData?.procedureId) setProcedureId(initialData.procedureId);
    if (initialData?.date) setDate(initialData.date);
    if (initialData?.time) setTime(initialData.time);
    if (initialData?.duration) setDuration(initialData.duration);
    if (initialData?.amount) setAmount(initialData.amount);
    if (initialData?.toothNumber) setToothNumber(initialData.toothNumber);
    if (initialData?.status) setStatus(initialData.status);
    if (initialData?.notes) setNotes(initialData.notes);
  }, [initialData]);

  // Handle Procedure Selection Change
  const handleProcedureChange = (newProcId) => {
    setProcedureId(newProcId);
    const proc = procedures.find(p => p.id === newProcId);
    if (proc) {
      setDuration(proc.duration);
      setAmount(proc.price);
      // Smart suggest chair / doctor based on category
      if (proc.category === 'Oral Surgery' || proc.category === 'Implantology') {
        const surgChair = chairs.find(c => c.type.includes('Surgery'));
        const surgDoc = doctors.find(d => d.specialty.includes('Surgery'));
        if (surgChair) setChairId(surgChair.id);
        if (surgDoc) setDoctorId(surgDoc.id);
      } else if (proc.category === 'Preventive' || proc.category === 'Cosmetic') {
        const hygChair = chairs.find(c => c.type.includes('Hygiene'));
        if (hygChair) setChairId(hygChair.id);
      }
    }
  };

  // Selected Patient Details
  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId);
  }, [patients, selectedPatientId]);

  // Chair Conflict Detector
  const conflictingAppointment = useMemo(() => {
    return appointments.find(a => {
      if (isEditing && a.id === initialData.id) return false;
      return a.chairId === chairId && a.date === date && a.time === time && a.status !== 'cancelled';
    });
  }, [appointments, chairId, date, time, isEditing, initialData]);

  // Calculate End Time
  const calculatedEndTime = useMemo(() => {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const totalMinutes = h * 60 + m + Number(duration);
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }, [time, duration]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalPatientId = selectedPatientId;
    let finalPatientName = selectedPatient?.name || 'Patient';
    let finalPatientPhone = selectedPatient?.phone || '';
    let finalPatientEmail = selectedPatient?.email || '';

    // If new patient mode, register patient first
    if (patientMode === 'new') {
      if (!newPatientName.trim() || !newPatientPhone.trim()) {
        alert('Please enter patient name and contact phone.');
        return;
      }
      const newPat = {
        id: `pat-${Date.now()}`,
        name: newPatientName,
        phone: newPatientPhone,
        email: newPatientEmail || 'no-email@clinic.local',
        dob: newPatientDob || '1995-01-01',
        gender: 'Not Specified',
        address: 'Local Clinic Region',
        bloodGroup: 'Unknown',
        allergies: newPatientAllergies ? newPatientAllergies.split(',').map(s => s.trim()) : ['None known'],
        medicalConditions: [],
        emergencyContact: 'None listed',
        insuranceProvider: 'Self-Pay / Pending',
        totalVisits: 1,
        lastVisit: date,
        balanceDue: 0,
        notes: 'Registered via appointment booking modal.',
        odontogram: {}
      };
      onSaveNewPatient(newPat);
      finalPatientId = newPat.id;
      finalPatientName = newPat.name;
      finalPatientPhone = newPat.phone;
      finalPatientEmail = newPat.email;
    }

    const doc = doctors.find(d => d.id === doctorId);
    const chair = chairs.find(c => c.id === chairId);
    const proc = procedures.find(p => p.id === procedureId);

    const bookingCode = initialData?.bookingCode || `DEN-${Math.floor(1000 + Math.random() * 9000)}`;

    const aptPayload = {
      id: initialData?.id || `apt-${Date.now()}`,
      bookingCode,
      patientId: finalPatientId,
      patientName: finalPatientName,
      patientPhone: finalPatientPhone,
      patientEmail: finalPatientEmail,
      doctorId,
      doctorName: doc?.name || 'Specialist',
      chairId,
      chairName: chair?.name || 'Operatory Chair',
      procedureId,
      procedureName: proc?.name || 'Dental Treatment',
      date,
      time,
      duration: Number(duration),
      status,
      amount: Number(amount),
      paid: initialData?.paid || false,
      paymentMethod: initialData?.paymentMethod || 'Pending',
      toothNumber: toothNumber || 'All',
      notes,
      source: initialData?.source || 'reception',
      reminderSent: sendReminderChecked
    };

    onSaveAppointment(aptPayload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card glass-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Calendar size={20} className="text-cyan" />
            </div>
            <div>
              <h3>{isEditing ? 'Edit Appointment' : 'New Appointment'}</h3>
              <p className="text-muted text-sm">
                {isEditing ? `Booking #${initialData.bookingCode}` : 'Schedule visit and chair assignment'}
              </p>
            </div>
          </div>
          <button type="button" className="icon-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          
          {/* Patient Selection Row */}
          <div className="form-section">
            <div className="section-title-row">
              <span className="section-heading">Patient</span>
              {!isEditing && (
                <div className="mini-toggle-group">
                  <button 
                    type="button" 
                    className={`mini-toggle-btn ${patientMode === 'existing' ? 'active' : ''}`}
                    onClick={() => setPatientMode('existing')}
                  >
                    Existing Patient
                  </button>
                  <button 
                    type="button" 
                    className={`mini-toggle-btn ${patientMode === 'new' ? 'active' : ''}`}
                    onClick={() => setPatientMode('new')}
                  >
                    + New Patient
                  </button>
                </div>
              )}
            </div>

            {patientMode === 'existing' ? (
              <div className="form-group">
                <label>Select Patient Record *</label>
                <select 
                  value={selectedPatientId} 
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="select-input"
                  required
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.phone} (DOB: {p.dob})
                    </option>
                  ))}
                </select>

                {/* Patient Medical Warning Banner */}
                {selectedPatient?.allergies && selectedPatient.allergies[0] !== 'None known' && (
                  <div className="medical-alert-strip">
                    <AlertTriangle size={15} className="text-red" />
                    <span>
                      <strong>Allergy / Risk:</strong> {selectedPatient.allergies.join(', ')}
                      {selectedPatient.medicalConditions?.length > 0 && ` | Conditions: ${selectedPatient.medicalConditions.join(', ')}`}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="new-patient-fields-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rachel Adams" 
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="text-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    className="text-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    placeholder="rachel@example.com" 
                    value={newPatientEmail}
                    onChange={(e) => setNewPatientEmail(e.target.value)}
                    className="text-input"
                  />
                </div>
                <div className="form-group">
                  <label>Medical Allergies (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Penicillin, Latex" 
                    value={newPatientAllergies}
                    onChange={(e) => setNewPatientAllergies(e.target.value)}
                    className="text-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Procedure & Tooth Row */}
          <div className="form-section">
            <span className="section-heading">Procedure & Tooth</span>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Procedure *</label>
                <select 
                  value={procedureId} 
                  onChange={(e) => handleProcedureChange(e.target.value)}
                  className="select-input"
                >
                  {procedures.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.name} (₹{p.price.toLocaleString('en-IN')} • {p.duration}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tooth # (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 14, 19, Upper Arch, All" 
                  value={toothNumber}
                  onChange={(e) => setToothNumber(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>
          </div>

          {/* Doctor & Operatory Chair */}
          <div className="form-section">
            <span className="section-heading">Doctor & Operatory</span>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Doctor *</label>
                <select 
                  value={doctorId} 
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="select-input"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Operatory Chair *</label>
                <select 
                  value={chairId} 
                  onChange={(e) => setChairId(e.target.value)}
                  className="select-input"
                >
                  {chairs.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chair Conflict Warning */}
            {conflictingAppointment && (
              <div className="conflict-alert-box">
                <AlertTriangle size={16} className="text-red" />
                <span>
                  <strong>Chair Booking Conflict:</strong> This chair is already booked at {conflictingAppointment.time} for {conflictingAppointment.patientName} ({conflictingAppointment.procedureName}).
                </span>
              </div>
            )}
          </div>

          {/* Date, Time & Estimated Duration */}
          <div className="form-section">
            <span className="section-heading">Timing & Fee</span>
            <div className="form-grid-4">
              <div className="form-group">
                <label>Date *</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="text-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Time *</label>
                <input 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)}
                  className="text-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration (mins)</label>
                <input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)}
                  className="text-input"
                  min="15"
                  step="15"
                />
                <span className="helper-text">Ends at ~{calculatedEndTime}</span>
              </div>

              <div className="form-group">
                <label>Estimated Fee (₹)</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-input"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Status & Clinical Notes */}
          <div className="form-section">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Appointment Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="select-input"
                >
                  <option value="scheduled">Scheduled (Pending confirmation)</option>
                  <option value="confirmed">Confirmed by Patient</option>
                  <option value="in-chair">In Chair (Active Treatment)</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No-Show</option>
                </select>
              </div>

              <div className="form-group">
                <label>Automated Reminder</label>
                <div className="checkbox-wrap">
                  <input 
                    type="checkbox" 
                    id="auto-remind-check"
                    checked={sendReminderChecked}
                    onChange={(e) => setSendReminderChecked(e.target.checked)}
                  />
                  <label htmlFor="auto-remind-check" className="checkbox-label">
                    Send automated 24h & 2h WhatsApp / SMS reminder to patient
                  </label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Clinical Notes / Patient Special Requests</label>
              <textarea 
                rows={2}
                placeholder="e.g. Nitrous oxide requested, severe needle phobia, pre-medication taken..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="textarea-input"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary glow-cyan">
              <CheckCircle2 size={16} />
              <span>{isEditing ? 'Update Appointment' : 'Confirm & Schedule'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
