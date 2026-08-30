import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  Plus, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  PlayCircle, 
  XCircle, 
  Send, 
  FileText,
  AlertCircle,
  Stethoscope,
  Sparkles,
  LayoutGrid,
  Columns,
  CalendarDays,
  CalendarRange
} from 'lucide-react';

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', 
  '17:00', '17:30', '18:00'
];

const STATUS_CONFIG = {
  'scheduled': { label: 'Scheduled', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', border: '#6366f1' },
  'confirmed': { label: 'Confirmed', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.15)', border: '#0ea5e9' },
  'in-chair': { label: 'In Chair', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981' },
  'completed': { label: 'Completed', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', border: '#8b5cf6' },
  'cancelled': { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444' },
  'no-show': { label: 'No-Show', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b' }
};

export default function AppointmentCalendar({
  appointments,
  doctors,
  chairs,
  procedures,
  patients,
  onOpenNewAppointment,
  onEditAppointment,
  onUpdateStatus,
  onSendReminder,
  onViewPatientChart
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('chairs'); // 'chairs' | 'day' | 'week' | 'month'
  const [selectedDoctorId, setSelectedDoctorId] = useState('all');
  const [selectedChairId, setSelectedChairId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAptPopover, setActiveAptPopover] = useState(null);

  // Date navigation helpers
  const handlePrevDate = () => {
    const d = new Date(currentDate);
    if (viewMode === 'week') d.setDate(d.getDate() - 7);
    else if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleNextDate = () => {
    const d = new Date(currentDate);
    if (viewMode === 'week') d.setDate(d.getDate() + 7);
    else if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setCurrentDate(new Date().toISOString().split('T')[0]);
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Date filter
      if (viewMode === 'chairs' || viewMode === 'day') {
        if (apt.date !== currentDate) return false;
      }
      // Doctor filter
      if (selectedDoctorId !== 'all' && apt.doctorId !== selectedDoctorId) return false;
      // Chair filter
      if (selectedChairId !== 'all' && apt.chairId !== selectedChairId) return false;
      // Status filter
      if (selectedStatus !== 'all' && apt.status !== selectedStatus) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = apt.patientName?.toLowerCase().includes(q);
        const matchPhone = apt.patientPhone?.toLowerCase().includes(q);
        const matchCode = apt.bookingCode?.toLowerCase().includes(q);
        const matchProc = apt.procedureName?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchCode && !matchProc) return false;
      }
      return true;
    });
  }, [appointments, currentDate, viewMode, selectedDoctorId, selectedChairId, selectedStatus, searchQuery]);

  // Formatted date display string
  const formattedDateTitle = useMemo(() => {
    const [year, month, day] = currentDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }, [currentDate]);

  // Quick stats for the selected date
  const dayStats = useMemo(() => {
    const dayApts = appointments.filter(a => a.date === currentDate);
    return {
      total: dayApts.length,
      inChair: dayApts.filter(a => a.status === 'in-chair').length,
      confirmed: dayApts.filter(a => a.status === 'confirmed').length,
      completed: dayApts.filter(a => a.status === 'completed').length,
      revenue: dayApts.reduce((sum, a) => sum + (Number(a.amount) || 0), 0)
    };
  }, [appointments, currentDate]);

  return (
    <div className="calendar-component-wrapper">
      {/* Top Header Control Bar */}
      <div className="calendar-header-bar glass-card">
        
        {/* Date Navigator */}
        <div className="date-navigation-cluster">
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleToday}>
            Today
          </button>
          <div className="nav-arrow-group">
            <button type="button" className="icon-btn" onClick={handlePrevDate} title="Previous">
              <ChevronLeft size={18} />
            </button>
            <div className="current-date-display">
              <CalendarIcon size={18} className="text-cyan" />
              <input 
                type="date" 
                value={currentDate} 
                onChange={(e) => setCurrentDate(e.target.value)}
                className="date-input-hidden"
              />
              <span className="date-title-text">{formattedDateTitle}</span>
            </div>
            <button type="button" className="icon-btn" onClick={handleNextDate} title="Next">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="view-mode-tabs">
          <button 
            type="button"
            className={`view-tab-btn ${viewMode === 'chairs' ? 'active' : ''}`}
            onClick={() => setViewMode('chairs')}
            title="Chairs Grid View"
          >
            <Columns size={16} />
            <span>Chairs</span>
          </button>
          <button 
            type="button"
            className={`view-tab-btn ${viewMode === 'day' ? 'active' : ''}`}
            onClick={() => setViewMode('day')}
            title="Day Timeline View"
          >
            <Clock size={16} />
            <span>Day</span>
          </button>
          <button 
            type="button"
            className={`view-tab-btn ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
            title="Week Overview"
          >
            <CalendarDays size={16} />
            <span>Week</span>
          </button>
          <button 
            type="button"
            className={`view-tab-btn ${viewMode === 'month' ? 'active' : ''}`}
            onClick={() => setViewMode('month')}
            title="Month Calendar"
          >
            <CalendarRange size={16} />
            <span>Month</span>
          </button>
        </div>

        {/* New Appointment Quick Button */}
        <button 
          type="button"
          className="btn btn-primary glow-cyan"
          onClick={() => onOpenNewAppointment({ date: currentDate, time: '09:00' })}
        >
          <Plus size={18} />
          <span>New Booking</span>
        </button>
      </div>

      {/* Filter and Metrics Strip */}
      <div className="calendar-filter-strip">
        <div className="search-box">
          <Search size={16} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search patient, phone, CDT code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="clear-search-btn">
              ✕
            </button>
          )}
        </div>

        {/* Doctor Dropdown */}
        <div className="filter-item">
          <label>Doctor:</label>
          <select 
            value={selectedDoctorId} 
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Specialists ({doctors.length})</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Chair Dropdown */}
        <div className="filter-item">
          <label>Operatory:</label>
          <select 
            value={selectedChairId} 
            onChange={(e) => setSelectedChairId(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Operatories ({chairs.length})</option>
            {chairs.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="filter-item">
          <label>Status:</label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-chair">In Chair</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Daily Stats Summary */}
        <div className="day-metric-pills">
          <span className="metric-pill cyan">
            <strong>{dayStats.total}</strong> Booked
          </span>
          {dayStats.inChair > 0 && (
            <span className="metric-pill green pulsing">
              <strong>{dayStats.inChair}</strong> In Chair
            </span>
          )}
          <span className="metric-pill gold">
            Est: <strong>${dayStats.revenue}</strong>
          </span>
        </div>
      </div>

      {/* Main Calendar Viewport */}
      {viewMode === 'chairs' && (
        <div className="operatory-chairs-grid glass-card">
          {/* Chairs Header Row */}
          <div className="chairs-header-row">
            <div className="time-column-header">
              <Clock size={16} />
              <span>Time Slot</span>
            </div>
            {chairs.map(chair => (
              <div key={chair.id} className="chair-column-header" style={{ borderTopColor: chair.color }}>
                <div className="chair-title-group">
                  <span className="chair-name">{chair.name}</span>
                  <span className="chair-type-tag">{chair.type}</span>
                </div>
                <button 
                  type="button" 
                  className="quick-slot-add-btn"
                  onClick={() => onOpenNewAppointment({ date: currentDate, chairId: chair.id, time: '09:00' })}
                  title={`Book in ${chair.name}`}
                >
                  <Plus size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Time Slot Rows with Chair Columns */}
          <div className="chairs-schedule-body">
            {TIME_SLOTS.map(time => (
              <div key={time} className="time-slot-row">
                <div className="time-slot-label">{time}</div>

                {chairs.map(chair => {
                  // Find appointment matching date, chair, and approximate time
                  const matchingApts = filteredAppointments.filter(
                    a => a.chairId === chair.id && a.time === time
                  );

                  return (
                    <div 
                      key={chair.id} 
                      className={`chair-slot-cell ${matchingApts.length ? 'occupied' : 'vacant'}`}
                      onClick={() => {
                        if (!matchingApts.length) {
                          onOpenNewAppointment({ date: currentDate, chairId: chair.id, time });
                        }
                      }}
                    >
                      {matchingApts.map(apt => {
                        const statusConf = STATUS_CONFIG[apt.status] || STATUS_CONFIG.scheduled;
                        const patient = patients.find(p => p.id === apt.patientId);
                        const hasAlert = patient?.allergies && patient.allergies[0] !== 'None known';

                        return (
                          <div 
                            key={apt.id} 
                            className={`appointment-card-compact ${apt.status}`}
                            style={{ 
                              borderLeftColor: statusConf.color, 
                              background: statusConf.bg 
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveAptPopover(activeAptPopover === apt.id ? null : apt.id);
                            }}
                          >
                            <div className="apt-card-top">
                              <span className="apt-time-badge">
                                {apt.time} ({apt.duration}m)
                              </span>
                              <span className="apt-status-pill" style={{ color: statusConf.color, borderColor: statusConf.color }}>
                                {statusConf.label}
                              </span>
                            </div>

                            <div className="apt-patient-info">
                              <span className="apt-patient-name">{apt.patientName}</span>
                              {hasAlert && (
                                <span className="allergy-warn-badge" title={`Alert: ${patient.allergies.join(', ')}`}>
                                  ⚠️
                                </span>
                              )}
                            </div>

                            <div className="apt-procedure-tag">
                              {apt.procedureName}
                            </div>

                            <div className="apt-card-footer">
                              <span className="apt-doctor-name">
                                <Stethoscope size={12} /> {apt.doctorName?.split(',')[0]}
                              </span>
                              {apt.toothNumber && apt.toothNumber !== 'All' && (
                                <span className="apt-tooth-badge">
                                  Tooth #{apt.toothNumber}
                                </span>
                              )}
                            </div>

                            {/* Quick Action Popover when clicked */}
                            {activeAptPopover === apt.id && (
                              <div className="apt-action-popover glass-card" onClick={(e) => e.stopPropagation()}>
                                <div className="popover-title">
                                  <strong>{apt.patientName}</strong>
                                  <span className="text-muted text-xs">#{apt.bookingCode}</span>
                                </div>
                                <div className="popover-phone">{apt.patientPhone}</div>
                                <div className="popover-proc">{apt.procedureName} • ${apt.amount}</div>

                                {apt.notes && (
                                  <div className="popover-notes">
                                    <em>"{apt.notes}"</em>
                                  </div>
                                )}

                                <div className="popover-status-actions">
                                  <span className="popover-label">Change Status:</span>
                                  <div className="status-button-grid">
                                    <button 
                                      type="button" 
                                      className="status-btn green"
                                      onClick={() => { onUpdateStatus(apt.id, 'in-chair'); setActiveAptPopover(null); }}
                                    >
                                      In Chair
                                    </button>
                                    <button 
                                      type="button" 
                                      className="status-btn purple"
                                      onClick={() => { onUpdateStatus(apt.id, 'completed'); setActiveAptPopover(null); }}
                                    >
                                      Complete
                                    </button>
                                    <button 
                                      type="button" 
                                      className="status-btn cyan"
                                      onClick={() => { onUpdateStatus(apt.id, 'confirmed'); setActiveAptPopover(null); }}
                                    >
                                      Confirm
                                    </button>
                                    <button 
                                      type="button" 
                                      className="status-btn red"
                                      onClick={() => { onUpdateStatus(apt.id, 'cancelled'); setActiveAptPopover(null); }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>

                                <div className="popover-footer-actions">
                                  <button 
                                    type="button" 
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => { onEditAppointment(apt); setActiveAptPopover(null); }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    type="button" 
                                    className="btn btn-sm btn-outline-cyan"
                                    onClick={() => { onSendReminder(apt); setActiveAptPopover(null); }}
                                  >
                                    <Send size={12} /> Reminder
                                  </button>
                                  <button 
                                    type="button" 
                                    className="btn btn-sm btn-primary"
                                    onClick={() => { onViewPatientChart(apt.patientId); setActiveAptPopover(null); }}
                                  >
                                    Dental Chart
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {!matchingApts.length && (
                        <div className="empty-slot-hover-hint">
                          <span>+ Book</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Day View */}
      {viewMode === 'day' && (
        <div className="timeline-day-view glass-card">
          <div className="timeline-day-header">
            <h3>Hourly Chronological Schedule</h3>
            <span>{filteredAppointments.length} appointment(s) scheduled for this day</span>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="empty-state-box">
              <CalendarIcon size={48} className="text-muted" />
              <h4>No appointments on this date</h4>
              <p>Click "New Appointment" or switch dates to view bookings.</p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => onOpenNewAppointment({ date: currentDate, time: '09:00' })}
              >
                <Plus size={16} /> Schedule Appointment
              </button>
            </div>
          ) : (
            <div className="timeline-list">
              {filteredAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(apt => {
                  const statusConf = STATUS_CONFIG[apt.status] || STATUS_CONFIG.scheduled;
                  const patient = patients.find(p => p.id === apt.patientId);

                  return (
                    <div key={apt.id} className="timeline-card glass-card">
                      <div className="timeline-time-block">
                        <span className="timeline-time">{apt.time}</span>
                        <span className="timeline-duration">{apt.duration} mins</span>
                      </div>

                      <div className="timeline-main-content">
                        <div className="timeline-patient-row">
                          <span className="timeline-patient-name">{apt.patientName}</span>
                          <span className="timeline-code">#{apt.bookingCode}</span>
                          <span className="apt-status-pill" style={{ color: statusConf.color, borderColor: statusConf.color }}>
                            {statusConf.label}
                          </span>
                        </div>

                        <div className="timeline-details-row">
                          <span><strong>Procedure:</strong> {apt.procedureName}</span>
                          <span><strong>Doctor:</strong> {apt.doctorName}</span>
                          <span><strong>Operatory:</strong> {apt.chairName}</span>
                          {apt.toothNumber && <span><strong>Tooth:</strong> #{apt.toothNumber}</span>}
                        </div>

                        {apt.notes && (
                          <div className="timeline-notes">
                            Note: {apt.notes}
                          </div>
                        )}
                      </div>

                      <div className="timeline-actions">
                        <button 
                          type="button" 
                          className="btn btn-sm btn-secondary"
                          onClick={() => onEditAppointment(apt)}
                        >
                          Edit
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-primary"
                          onClick={() => onUpdateStatus(apt.id, apt.status === 'in-chair' ? 'completed' : 'in-chair')}
                        >
                          {apt.status === 'in-chair' ? 'Mark Completed' : 'Start Chair'}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Week Overview */}
      {viewMode === 'week' && (
        <div className="week-overview-grid glass-card">
          <div className="week-header-info">
            <h3>7-Day Schedule Overview</h3>
            <p className="text-muted">Click any day to drill into that day's chair schedule</p>
          </div>
          <div className="week-columns-container">
            {[0, 1, 2, 3, 4, 5, 6].map(offset => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() + offset);
              const dateStr = d.toISOString().split('T')[0];
              const dayApts = appointments.filter(a => a.date === dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <div 
                  key={dateStr} 
                  className={`week-day-col ${isToday ? 'today-highlight' : ''}`}
                  onClick={() => { setCurrentDate(dateStr); setViewMode('chairs'); }}
                >
                  <div className="week-col-header">
                    <span className="week-day-name">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="week-day-number">{d.getDate()}</span>
                    <span className="week-apt-count">{dayApts.length} apts</span>
                  </div>

                  <div className="week-col-body">
                    {dayApts.slice(0, 5).map(apt => (
                      <div key={apt.id} className="week-mini-apt-card">
                        <span className="mini-time">{apt.time}</span>
                        <span className="mini-name">{apt.patientName}</span>
                        <span className="mini-proc">{apt.procedureName}</span>
                      </div>
                    ))}
                    {dayApts.length > 5 && (
                      <span className="more-count">+{dayApts.length - 5} more</span>
                    )}
                    {dayApts.length === 0 && (
                      <span className="empty-day-text">No bookings</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Month Overview */}
      {viewMode === 'month' && (
        <div className="month-overview-container glass-card">
          <div className="month-title-bar">
            <h3>Monthly Calendar View</h3>
            <span>Quick jump to any date</span>
          </div>
          <div className="month-calendar-grid">
            {[-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(offset => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() + offset);
              const dateStr = d.toISOString().split('T')[0];
              const dayApts = appointments.filter(a => a.date === dateStr);
              const isSelected = dateStr === currentDate;

              return (
                <div 
                  key={dateStr}
                  className={`month-cell ${isSelected ? 'selected' : ''}`}
                  onClick={() => { setCurrentDate(dateStr); setViewMode('chairs'); }}
                >
                  <span className="month-date-num">{d.getDate()}</span>
                  <span className="month-day-str">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  {dayApts.length > 0 && (
                    <span className="month-badge">{dayApts.length} appts</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
