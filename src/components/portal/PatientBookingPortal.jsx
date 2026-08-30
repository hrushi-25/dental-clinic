import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Stethoscope, 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  AlertCircle,
  Download,
  Share2,
  Smile,
  Activity,
  ArrowRight
} from 'lucide-react';
import { CLINIC_INFO } from '../../data/mockDentalData';

const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All Services', icon: '✨' },
  { id: 'Preventive', label: 'Cleanings & Hygiene', icon: '🪥' },
  { id: 'Emergency', label: 'Emergency Toothache', icon: '🚨' },
  { id: 'Restorative', label: 'Fillings & Repairs', icon: '🛡️' },
  { id: 'Cosmetic', label: 'Laser Whitening & Veneers', icon: '✨' },
  { id: 'Oral Surgery', label: 'Implants & Surgery', icon: '🦷' },
  { id: 'Orthodontics', label: 'Invisalign Aligners', icon: '😁' }
];

export default function PatientBookingPortal({
  doctors,
  procedures,
  chairs,
  appointments,
  onBookAppointment,
  onSwitchToStaffMode
}) {
  const [activePortalTab, setActivePortalTab] = useState('book'); // 'book' | 'track'
  
  // 3-Step Booking Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProcedureId, setSelectedProcedureId] = useState(procedures[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // default tomorrow
    return d.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('10:00');

  // Patient Info Form
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [anxietyLevel, setAnxietyLevel] = useState(1); // 1 = Relaxed, 5 = Very Nervous
  const [symptomNotes, setSymptomNotes] = useState('');
  const [isInsurance, setIsInsurance] = useState(true);

  // Completed Booking State
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Track Booking State
  const [trackSearchCode, setTrackSearchCode] = useState('');
  const [foundBooking, setFoundBooking] = useState(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Filter procedures by category
  const filteredProcedures = useMemo(() => {
    if (selectedCategory === 'all') return procedures;
    return procedures.filter(p => p.category === selectedCategory);
  }, [procedures, selectedCategory]);

  const selectedProcedure = procedures.find(p => p.id === selectedProcedureId) || procedures[0];
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  // Available Time Slots
  const morningSlots = ['08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
  const afternoonSlots = ['12:30', '13:00', '13:30', '14:00', '14:30', '15:00'];
  const eveningSlots = ['15:30', '16:00', '16:30', '17:00', '17:30'];

  // Handle Form Submission
  const handleFinalBooking = (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      alert('Please enter your full name and contact phone number.');
      return;
    }

    const bookingCode = `DEN-${Math.floor(1000 + Math.random() * 9000)}`;
    const matchedChair = chairs.find(c => c.type.includes(selectedProcedure.category)) || chairs[0];

    const aptPayload = {
      id: `apt-${Date.now()}`,
      bookingCode,
      patientId: `pat-web-${Date.now()}`,
      patientName,
      patientPhone,
      patientEmail: patientEmail || 'patient@online.portal',
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      chairId: matchedChair.id,
      chairName: matchedChair.name,
      procedureId: selectedProcedure.id,
      procedureName: selectedProcedure.name,
      date: bookingDate,
      time: bookingTime,
      duration: selectedProcedure.duration,
      status: 'confirmed',
      amount: selectedProcedure.price,
      paid: false,
      paymentMethod: isInsurance ? 'Insurance Verification' : 'Self-Pay',
      toothNumber: 'All',
      notes: `Online Booking. Dental Anxiety: ${anxietyLevel}/5. Notes: ${symptomNotes}`,
      source: 'portal',
      reminderSent: true
    };

    onBookAppointment(aptPayload);
    setConfirmedBooking(aptPayload);
    setCurrentStep(4);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti triggered', err);
    }
  };

  // Handle Track Lookup
  const handleTrackLookup = (e) => {
    e.preventDefault();
    setTrackSearched(true);
    const match = appointments.find(
      a => a.bookingCode?.toLowerCase() === trackSearchCode.trim().toLowerCase() ||
           a.patientPhone?.includes(trackSearchCode.trim())
    );
    setFoundBooking(match || null);
  };

  return (
    <div className="patient-portal-wrapper">
      
      {/* Patient Portal Hero Banner */}
      <section className="portal-hero-section glass-card">
        <div className="portal-hero-content">
          <div className="badge-pill medical-pulse">
            <Sparkles size={14} className="text-cyan" />
            <span>Smart Digital Dental Experience</span>
          </div>

          <h1 className="portal-hero-title">
            Gentle, Precision Dental Care Designed Around Your Comfort
          </h1>
          
          <p className="portal-hero-subtitle">
            Book appointments in seconds with our specialist team. Instant 3D slot confirmation, transparent fees, and automated reminders.
          </p>

          <div className="portal-badges-row">
            <span className="hero-feature-badge"><Star size={15} className="text-amber" /> 4.96/5 Patient Rating</span>
            <span className="hero-feature-badge"><ShieldCheck size={15} className="text-green" /> 100% Painless Technology</span>
            <span className="hero-feature-badge"><Clock size={15} className="text-cyan" /> Zero Waiting Time Policy</span>
          </div>
        </div>

        {/* Portal Mode Navigation */}
        <div className="portal-nav-pills">
          <button 
            type="button" 
            className={`portal-nav-btn ${activePortalTab === 'book' ? 'active' : ''}`}
            onClick={() => setActivePortalTab('book')}
          >
            <Calendar size={16} />
            <span>Book New Visit</span>
          </button>
          <button 
            type="button" 
            className={`portal-nav-btn ${activePortalTab === 'track' ? 'active' : ''}`}
            onClick={() => setActivePortalTab('track')}
          >
            <Search size={16} />
            <span>Check My Booking Status</span>
          </button>
        </div>
      </section>

      {/* Main Tab 1: 3-Step Booking Wizard */}
      {activePortalTab === 'book' && (
        <section className="portal-wizard-container">
          
          {/* Step Progress Bar */}
          {currentStep < 4 && (
            <div className="wizard-progress-bar glass-card">
              <div className={`step-node ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="node-circle">1</div>
                <span className="node-label">Treatment & Specialist</span>
              </div>
              <div className="node-connector"></div>
              <div className={`step-node ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="node-circle">2</div>
                <span className="node-label">Date & Available Slot</span>
              </div>
              <div className="node-connector"></div>
              <div className={`step-node ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="node-circle">3</div>
                <span className="node-label">Patient Details</span>
              </div>
            </div>
          )}

          {/* STEP 1: Select Procedure & Doctor */}
          {currentStep === 1 && (
            <div className="wizard-step-card glass-card">
              <div className="step-heading-row">
                <div>
                  <span className="step-count">Step 1 of 3</span>
                  <h2>Choose Your Dental Treatment & Specialist</h2>
                  <p className="text-muted text-sm">Select the reason for your visit</p>
                </div>
              </div>

              {/* Service Categories Filter */}
              <div className="service-categories-strip">
                {SERVICE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Procedures Grid */}
              <div className="portal-procedures-grid">
                {filteredProcedures.map(proc => {
                  const isSelected = selectedProcedureId === proc.id;
                  return (
                    <div 
                      key={proc.id} 
                      className={`portal-proc-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedProcedureId(proc.id)}
                    >
                      <div className="proc-card-header">
                        <span className="proc-code-badge">{proc.code}</span>
                        <span className="proc-price-tag">₹{Number(proc.price).toLocaleString('en-IN')}</span>
                      </div>
                      <h3>{proc.name}</h3>
                      <p className="proc-desc">{proc.description}</p>
                      <div className="proc-footer">
                        <span className="proc-duration"><Clock size={13} /> {proc.duration} mins</span>
                        <span className="select-radio">{isSelected ? '✓ Selected' : 'Choose'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Doctor Specialist Selection */}
              <div className="doctor-select-section">
                <div className="section-title-line">
                  <h3>Preferred Dental Specialist</h3>
                  <span className="text-xs text-muted">All specialists are board certified</span>
                </div>

                <div className="portal-doctors-grid">
                  {doctors.map(doc => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div 
                        key={doc.id}
                        className={`portal-doc-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedDoctorId(doc.id)}
                      >
                        <img src={doc.avatar} alt={doc.name} className="doc-avatar-img" />
                        <div className="doc-card-info">
                          <h4>{doc.name}</h4>
                          <span className="doc-spec">{doc.specialty}</span>
                          <div className="doc-rating">
                            <Star size={14} className="text-amber fill-amber" />
                            <span>{doc.rating} ({doc.reviewsCount} reviews)</span>
                          </div>
                        </div>
                        {isSelected && <span className="doc-check">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 1 Next Button */}
              <div className="wizard-bottom-actions">
                <div></div>
                <button 
                  type="button" 
                  className="btn btn-primary glow-cyan"
                  onClick={() => setCurrentStep(2)}
                >
                  <span>Continue to Date & Time</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Pick Date & Time Slot */}
          {currentStep === 2 && (
            <div className="wizard-step-card glass-card">
              <div className="step-heading-row">
                <div>
                  <span className="step-count">Step 2 of 3</span>
                  <h2>Pick Your Preferred Date & Time Slot</h2>
                  <p className="text-muted text-sm">
                    Selected Treatment: <strong>{selectedProcedure.name}</strong> (₹{Number(selectedProcedure.price).toLocaleString('en-IN')}) with <strong>{selectedDoctor.name}</strong>
                  </p>
                </div>
              </div>

              {/* Date Picker Bar */}
              <div className="date-picker-card">
                <label className="picker-label">Select Date for Visit:</label>
                <input 
                  type="date" 
                  value={bookingDate} 
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="date-input-large"
                />
              </div>

              {/* Time Slots Sections */}
              <div className="time-slots-wrapper">
                
                {/* Morning Slots */}
                <div className="slot-group">
                  <div className="slot-group-header">
                    <span>🌅 Morning Sessions (8:30 AM - 12:00 PM)</span>
                  </div>
                  <div className="slots-grid">
                    {morningSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        className={`time-slot-pill ${bookingTime === time ? 'selected' : ''}`}
                        onClick={() => setBookingTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Afternoon Slots */}
                <div className="slot-group">
                  <div className="slot-group-header">
                    <span>☀️ Afternoon Sessions (12:30 PM - 3:30 PM)</span>
                  </div>
                  <div className="slots-grid">
                    {afternoonSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        className={`time-slot-pill ${bookingTime === time ? 'selected' : ''}`}
                        onClick={() => setBookingTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Evening Slots */}
                <div className="slot-group">
                  <div className="slot-group-header">
                    <span>🌆 Evening Sessions (3:30 PM - 6:00 PM)</span>
                  </div>
                  <div className="slots-grid">
                    {eveningSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        className={`time-slot-pill ${bookingTime === time ? 'selected' : ''}`}
                        onClick={() => setBookingTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Step 2 Actions */}
              <div className="wizard-bottom-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep(1)}
                >
                  <ChevronLeft size={18} />
                  <span>Back to Services</span>
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary glow-cyan"
                  onClick={() => setCurrentStep(3)}
                >
                  <span>Continue to Patient Details</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Information Form */}
          {currentStep === 3 && (
            <div className="wizard-step-card glass-card">
              <div className="step-heading-row">
                <div>
                  <span className="step-count">Step 3 of 3</span>
                  <h2>Patient Information & Visit Details</h2>
                  <p className="text-muted text-sm">Almost done! Enter your details to confirm your reservation.</p>
                </div>
              </div>

              <form onSubmit={handleFinalBooking} className="portal-patient-form">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Full Patient Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Sarah Jenkins" 
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="text-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Phone Number (For WhatsApp / SMS confirmations) *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+1 (555) 000-0000" 
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Email Address (For Calendar Invite)</label>
                    <input 
                      type="email" 
                      placeholder="sarah@example.com" 
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="text-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Dental Comfort & Anxiety Level:</label>
                    <div className="anxiety-level-picker">
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          className={`anxiety-btn ${anxietyLevel === lvl ? 'active' : ''}`}
                          onClick={() => setAnxietyLevel(lvl)}
                        >
                          {lvl === 1 && '😌 Calm'}
                          {lvl === 2 && '🙂 Mild'}
                          {lvl === 3 && '😐 Moderate'}
                          {lvl === 4 && '😟 Anxious'}
                          {lvl === 5 && '😰 High Phobia'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Describe your symptoms or specific concerns (Optional):</label>
                  <textarea 
                    rows={3} 
                    placeholder="e.g. Sensitivity when drinking iced water, slight gum soreness..."
                    value={symptomNotes}
                    onChange={(e) => setSymptomNotes(e.target.value)}
                    className="textarea-input"
                  />
                </div>

                {/* Booking Summary Box */}
                <div className="portal-summary-card">
                  <h4>Your Appointment Reservation:</h4>
                  <div className="summary-details-grid">
                    <div><span>Procedure:</span> <strong>{selectedProcedure.name}</strong></div>
                    <div><span>Doctor:</span> <strong>{selectedDoctor.name}</strong></div>
                    <div><span>Date & Time:</span> <strong>{bookingDate} at {bookingTime}</strong></div>
                    <div><span>Estimated Fee:</span> <strong>₹{Number(selectedProcedure.price).toLocaleString('en-IN')}</strong></div>
                  </div>
                </div>

                {/* Step 3 Actions */}
                <div className="wizard-bottom-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    <ChevronLeft size={18} />
                    <span>Back</span>
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary glow-cyan"
                  >
                    <CheckCircle2 size={18} />
                    <span>Confirm & Reserve Appointment</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: Instant Confirmation & Digital Pass */}
          {currentStep === 4 && confirmedBooking && (
            <div className="confirmation-card glass-card animate-fade-in">
              <div className="confirmation-celebrate-icon">
                🎉
              </div>

              <h2>Appointment Confirmed!</h2>
              <p className="subtitle">
                We have reserved your chair. A confirmation SMS & WhatsApp reminder have been dispatched.
              </p>

              {/* Digital Clinic Pass */}
              <div className="digital-clinic-pass">
                <div className="pass-header">
                  <div>
                    <span className="pass-clinic-name">{CLINIC_INFO.name}</span>
                    <span className="pass-booking-ref">Code: #{confirmedBooking.bookingCode}</span>
                  </div>
                  <div className="pass-status-pill">CONFIRMED</div>
                </div>

                <div className="pass-body-grid">
                  <div className="pass-item">
                    <span className="pass-label">Patient</span>
                    <span className="pass-val">{confirmedBooking.patientName}</span>
                  </div>
                  <div className="pass-item">
                    <span className="pass-label">Date & Time</span>
                    <span className="pass-val">{confirmedBooking.date} @ {confirmedBooking.time}</span>
                  </div>
                  <div className="pass-item">
                    <span className="pass-label">Specialist</span>
                    <span className="pass-val">{confirmedBooking.doctorName}</span>
                  </div>
                  <div className="pass-item">
                    <span className="pass-label">Treatment</span>
                    <span className="pass-val">{confirmedBooking.procedureName}</span>
                  </div>
                </div>

                <div className="pass-footer-clinic">
                  <p>📍 {CLINIC_INFO.address}</p>
                  <p>📞 Emergency: {CLINIC_INFO.emergencyPhone}</p>
                </div>
              </div>

              {/* Confirmation Actions */}
              <div className="confirmation-actions-row">
                <button 
                  type="button" 
                  className="btn btn-primary glow-cyan"
                  onClick={() => {
                    setCurrentStep(1);
                    setConfirmedBooking(null);
                    setPatientName('');
                    setPatientPhone('');
                  }}
                >
                  Book Another Visit
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-cyan"
                  onClick={onSwitchToStaffMode}
                >
                  Go to Clinic Staff Dashboard
                </button>
              </div>
            </div>
          )}

        </section>
      )}

      {/* Main Tab 2: Track & Check Booking */}
      {activePortalTab === 'track' && (
        <section className="portal-track-container glass-card">
          <div className="track-header">
            <h2>Track or Manage Your Appointment</h2>
            <p className="text-muted text-sm">
              Enter your 4-digit booking code (e.g. <code>DEN-1014</code>) or your registered mobile phone number.
            </p>
          </div>

          <form onSubmit={handleTrackLookup} className="track-form">
            <div className="search-box-large">
              <Search size={20} className="text-cyan" />
              <input 
                type="text" 
                placeholder="Enter Booking Reference # or Phone..." 
                value={trackSearchCode}
                onChange={(e) => setTrackSearchCode(e.target.value)}
                className="track-input"
                required
              />
              <button type="submit" className="btn btn-primary">
                Search Booking
              </button>
            </div>
          </form>

          {trackSearched && (
            <div className="track-result-area">
              {foundBooking ? (
                <div className="found-booking-card glass-card animate-fade-in">
                  <div className="found-card-head">
                    <div>
                      <span className="badge-pill">Booking Found</span>
                      <h3>#{foundBooking.bookingCode} — {foundBooking.patientName}</h3>
                    </div>
                    <span className={`status-badge ${foundBooking.status}`}>
                      {foundBooking.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="found-meta-grid">
                    <div><span>Date:</span> <strong>{foundBooking.date}</strong></div>
                    <div><span>Time:</span> <strong>{foundBooking.time} ({foundBooking.duration}m)</strong></div>
                    <div><span>Specialist:</span> <strong>{foundBooking.doctorName}</strong></div>
                    <div><span>Operatory:</span> <strong>{foundBooking.chairName}</strong></div>
                    <div><span>Treatment:</span> <strong>{foundBooking.procedureName}</strong></div>
                    <div><span>Estimated Fee:</span> <strong>₹{Number(foundBooking.amount || 0).toLocaleString('en-IN')}</strong></div>
                  </div>

                  <div className="found-footer-tips">
                    <p>💡 <strong>Patient Preparation:</strong> Please arrive 10 minutes prior to your scheduled time. Bring your ID and dental insurance card if applicable.</p>
                  </div>
                </div>
              ) : (
                <div className="not-found-card glass-card">
                  <AlertCircle size={40} className="text-amber" />
                  <h4>No appointment found for "{trackSearchCode}"</h4>
                  <p className="text-muted text-sm">Please check your booking reference code or call our reception at {CLINIC_INFO.phone}.</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

    </div>
  );
}
