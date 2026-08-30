import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  BellRing, 
  Copy, 
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { CLINIC_INFO } from '../../data/mockDentalData';

const TEMPLATES = [
  {
    id: 'tpl-24h',
    name: '24-Hour Confirmation Request',
    channel: 'WhatsApp',
    category: 'Confirmation',
    subject: 'DentPulse Appointment Confirmation',
    body: 'Hi {patient_name}! 🦷 This is a gentle reminder from DentPulse 3D Dental Center for your {procedure_name} scheduled tomorrow at {time} with {doctor_name}.\n\nPlease reply 1 to CONFIRM or 2 to RESCHEDULE.'
  },
  {
    id: 'tpl-2h',
    name: '2-Hour Arrival & Fasting Reminder',
    channel: 'SMS',
    category: 'Urgent',
    subject: 'Appointment in 2 Hours',
    body: 'DentPulse Alert: Hi {patient_name}, we look forward to seeing you at {time} ({chair_name}). Free patient parking available in Garage Level B. Call {clinic_phone} if delayed.'
  },
  {
    id: 'tpl-postop',
    name: 'Post-Op Surgical Care Instructions',
    channel: 'WhatsApp',
    category: 'Clinical Care',
    subject: 'Post-Procedure Care Directives',
    body: 'Hello {patient_name}, hope you are resting comfortably after your treatment today! Remember:\n1. Keep gentle pressure on gauze for 45 mins\n2. Avoid hot foods & drinking through straws\n3. Take prescribed meds with water\nNeed urgent assistance? Call our emergency line: {emergency_phone}.'
  },
  {
    id: 'tpl-recall',
    name: '6-Month Preventive Recall Notice',
    channel: 'Email',
    category: 'Recall',
    subject: 'Time for your 6-Month Dental Prophylaxis Cleaning!',
    body: 'Dear {patient_name},\n\nIt has been 6 months since your last dental exam and scaling! Maintaining regular cleanings protects your enamel and prevents periodontal issues.\n\nBook your preferred slot online at our patient portal or call us at {clinic_phone}.\n\nWarm regards,\n{clinic_name}'
  }
];

export default function ReminderCenter({
  reminders,
  appointments,
  patients,
  onSendCustomReminder
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('tpl-24h');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(appointments[0]?.id || '');
  const [customBody, setCustomBody] = useState(TEMPLATES[0].body);
  const [activeTabChannel, setActiveTabChannel] = useState('all'); // 'all' | 'WhatsApp' | 'SMS' | 'Email'
  const [phoneSimulatorStatus, setPhoneSimulatorStatus] = useState('idle'); // 'idle' | 'sending' | 'delivered'
  const [copiedNotification, setCopiedNotification] = useState(false);

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];
  const selectedApt = appointments.find(a => a.id === selectedAppointmentId) || appointments[0];

  // Resolve template variables
  const resolveTemplateText = (tplText) => {
    if (!selectedApt) return tplText;
    return tplText
      .replace(/{patient_name}/g, selectedApt.patientName || 'Patient')
      .replace(/{procedure_name}/g, selectedApt.procedureName || 'Dental Procedure')
      .replace(/{doctor_name}/g, selectedApt.doctorName || 'Specialist')
      .replace(/{chair_name}/g, selectedApt.chairName || 'Operatory Chair')
      .replace(/{time}/g, selectedApt.time || '10:00 AM')
      .replace(/{date}/g, selectedApt.date || 'Today')
      .replace(/{clinic_name}/g, CLINIC_INFO.name)
      .replace(/{clinic_phone}/g, CLINIC_INFO.phone)
      .replace(/{emergency_phone}/g, CLINIC_INFO.emergencyPhone);
  };

  const handleSelectTemplate = (tplId) => {
    setSelectedTemplateId(tplId);
    const tpl = TEMPLATES.find(t => t.id === tplId);
    if (tpl) {
      setCustomBody(tpl.body);
    }
  };

  // Handle Send Test Notification
  const handleTriggerDispatch = () => {
    if (!selectedApt) return;
    setPhoneSimulatorStatus('sending');

    setTimeout(() => {
      setPhoneSimulatorStatus('delivered');
      
      const newReminderLog = {
        id: `rem-${Date.now()}`,
        appointmentId: selectedApt.id,
        patientName: selectedApt.patientName,
        channel: selectedTemplate.channel,
        phone: selectedApt.patientPhone || selectedApt.patientEmail,
        type: selectedTemplate.name,
        status: 'Delivered & Confirmed',
        timestamp: 'Just now',
        messageText: resolveTemplateText(customBody)
      };

      onSendCustomReminder(newReminderLog);
    }, 1200);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(resolveTemplateText(customBody));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Filter reminder logs
  const filteredReminders = reminders.filter(r => {
    if (activeTabChannel === 'all') return true;
    return r.channel === activeTabChannel;
  });

  return (
    <div className="reminders-container">
      {/* Header */}
      <div className="reminders-header-row">
        <div>
          <h2>Automated Patient Reminder & Dispatch Center</h2>
          <p className="subtitle">
            Reduce no-shows with automated WhatsApp, SMS, and Email reminders tailored for dental practices.
          </p>
        </div>
      </div>

      {/* Main Grid: Template & Dispatcher + Interactive Mobile Simulator */}
      <div className="reminders-main-grid">
        
        {/* Left Column: Template Config & Message Composer */}
        <div className="composer-card glass-card">
          <div className="composer-header">
            <BellRing size={20} className="text-cyan" />
            <h3>Automated Dispatch Studio</h3>
          </div>

          {/* Select Target Appointment */}
          <div className="form-group">
            <label>Select Recipient Appointment:</label>
            <select 
              value={selectedAppointmentId} 
              onChange={(e) => setSelectedAppointmentId(e.target.value)}
              className="select-input"
            >
              {appointments.map(a => (
                <option key={a.id} value={a.id}>
                  {a.patientName} — {a.procedureName} ({a.date} @ {a.time})
                </option>
              ))}
            </select>
          </div>

          {/* Preset Template Selector */}
          <div className="form-group">
            <label>Select Dental Reminder Template:</label>
            <div className="template-cards-grid">
              {TEMPLATES.map(tpl => (
                <div 
                  key={tpl.id}
                  className={`template-pick-item ${selectedTemplateId === tpl.id ? 'active' : ''}`}
                  onClick={() => handleSelectTemplate(tpl.id)}
                >
                  <div className="tpl-top">
                    <span className="tpl-name">{tpl.name}</span>
                    <span className={`channel-pill ${tpl.channel.toLowerCase()}`}>
                      {tpl.channel}
                    </span>
                  </div>
                  <span className="tpl-cat text-xs text-muted">{tpl.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Template Body */}
          <div className="form-group">
            <div className="section-title-row">
              <label>Message Content (Supports dynamic variables):</label>
              <span className="text-xs text-cyan">Live Rendered</span>
            </div>
            <textarea 
              rows={5} 
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              className="textarea-input font-mono text-sm"
            />
          </div>

          {/* Action Row */}
          <div className="composer-actions-row">
            <button 
              type="button" 
              className="btn btn-primary glow-cyan"
              onClick={handleTriggerDispatch}
              disabled={phoneSimulatorStatus === 'sending'}
            >
              {phoneSimulatorStatus === 'sending' ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Notification Now</span>
                </>
              )}
            </button>

            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCopyMessage}
            >
              <Copy size={16} />
              <span>{copiedNotification ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Smartphone Device Preview */}
        <div className="phone-simulator-card glass-card">
          <div className="phone-outer-frame">
            {/* Phone Notch & Speaker */}
            <div className="phone-notch">
              <div className="speaker-slot"></div>
              <div className="camera-dot"></div>
            </div>

            {/* Phone Screen */}
            <div className="phone-screen">
              <div className="phone-status-bar">
                <span>09:41</span>
                <span className="network-icons">5G 📶 100% 🔋</span>
              </div>

              {/* Chat App Header */}
              <div className="chat-app-header">
                <div className="chat-avatar">
                  🦷
                </div>
                <div>
                  <div className="chat-name">{CLINIC_INFO.name}</div>
                  <div className="chat-status">Official Verified Medical Channel</div>
                </div>
              </div>

              {/* Chat Bubble Thread */}
              <div className="chat-messages-body">
                <div className="message-date-divider">Today</div>

                {/* Sent Message Bubble */}
                <div className="chat-bubble clinic">
                  <div className="bubble-text">
                    {resolveTemplateText(customBody).split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                  <div className="bubble-meta">
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="check-double">✓✓</span>
                  </div>
                </div>

                {/* Simulated Patient Auto-Reply */}
                {phoneSimulatorStatus === 'delivered' && (
                  <div className="chat-bubble patient animate-fade-in">
                    <p>Yes, confirmed! Thank you Dr. Sarah and team. See you tomorrow!</p>
                    <div className="bubble-meta">
                      <span>Just now</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Footer Input bar */}
              <div className="phone-bottom-bar">
                <span className="placeholder-text">Type a reply...</span>
                <span className="mic-icon">🎙️</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Dispatched Logs Table */}
      <div className="reminder-logs-card glass-card">
        <div className="logs-header">
          <h3>Recent Automated Reminder Dispatch History</h3>
          <div className="channel-filter-tabs">
            <button 
              type="button" 
              className={`filter-btn ${activeTabChannel === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTabChannel('all')}
            >
              All Channels ({reminders.length})
            </button>
            <button 
              type="button" 
              className={`filter-btn ${activeTabChannel === 'WhatsApp' ? 'active' : ''}`}
              onClick={() => setActiveTabChannel('WhatsApp')}
            >
              WhatsApp
            </button>
            <button 
              type="button" 
              className={`filter-btn ${activeTabChannel === 'SMS' ? 'active' : ''}`}
              onClick={() => setActiveTabChannel('SMS')}
            >
              SMS Text
            </button>
            <button 
              type="button" 
              className={`filter-btn ${activeTabChannel === 'Email' ? 'active' : ''}`}
              onClick={() => setActiveTabChannel('Email')}
            >
              Email
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Recipient Patient</th>
                <th>Channel</th>
                <th>Notification Type</th>
                <th>Delivery Status</th>
                <th>Timestamp</th>
                <th>Message Snippet</th>
              </tr>
            </thead>
            <tbody>
              {filteredReminders.map(log => (
                <tr key={log.id}>
                  <td><strong>{log.patientName}</strong></td>
                  <td>
                    <span className={`channel-pill ${log.channel.toLowerCase()}`}>
                      {log.channel}
                    </span>
                  </td>
                  <td>{log.type}</td>
                  <td>
                    <span className="status-badge paid">
                      <CheckCircle2 size={12} /> {log.status}
                    </span>
                  </td>
                  <td className="text-xs text-muted">{log.timestamp}</td>
                  <td className="text-xs max-w-xs truncate">{log.messageText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
