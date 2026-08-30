import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  PlusCircle, 
  Printer, 
  Sparkles,
  Info,
  Layers
} from 'lucide-react';

const CONDITIONS = [
  { id: 'healthy', label: 'Healthy', color: '#e2e8f0', border: '#cbd5e1', badge: 'bg-platinum' },
  { id: 'caries', label: 'Caries / Decay', color: '#ef4444', border: '#dc2626', badge: 'bg-red' },
  { id: 'filling', label: 'Composite Filling', color: '#94a3b8', border: '#64748b', badge: 'bg-silver' },
  { id: 'root-canal', label: 'Root Canal (Endo)', color: '#64748b', border: '#475569', badge: 'bg-charcoal' },
  { id: 'crown', label: 'Porcelain Crown', color: '#ffffff', border: '#e2e8f0', badge: 'bg-white' },
  { id: 'veneer', label: 'Aesthetic Veneer', color: '#f8fafc', border: '#ffffff', badge: 'bg-white' },
  { id: 'implant', label: 'Dental Implant', color: '#cbd5e1', border: '#94a3b8', badge: 'bg-chrome' },
  { id: 'missing', label: 'Missing / Extracted', color: '#334155', border: '#1e293b', badge: 'bg-slate' },
  { id: 'fracture', label: 'Chipped / Fractured', color: '#f97316', border: '#ea580c', badge: 'bg-orange' }
];

const ADULT_UPPER_TEETH = [
  { num: 1, name: 'Upper Right 3rd Molar (Wisdom)' },
  { num: 2, name: 'Upper Right 2nd Molar' },
  { num: 3, name: 'Upper Right 1st Molar' },
  { num: 4, name: 'Upper Right 2nd Premolar' },
  { num: 5, name: 'Upper Right 1st Premolar' },
  { num: 6, name: 'Upper Right Canine' },
  { num: 7, name: 'Upper Right Lateral Incisor' },
  { num: 8, name: 'Upper Right Central Incisor' },
  { num: 9, name: 'Upper Left Central Incisor' },
  { num: 10, name: 'Upper Left Lateral Incisor' },
  { num: 11, name: 'Upper Left Canine' },
  { num: 12, name: 'Upper Left 1st Premolar' },
  { num: 13, name: 'Upper Left 2nd Premolar' },
  { num: 14, name: 'Upper Left 1st Molar' },
  { num: 15, name: 'Upper Left 2nd Molar' },
  { num: 16, name: 'Upper Left 3rd Molar (Wisdom)' }
];

const ADULT_LOWER_TEETH = [
  { num: 32, name: 'Lower Right 3rd Molar (Wisdom)' },
  { num: 31, name: 'Lower Right 2nd Molar' },
  { num: 30, name: 'Lower Right 1st Molar' },
  { num: 29, name: 'Lower Right 2nd Premolar' },
  { num: 28, name: 'Lower Right 1st Premolar' },
  { num: 27, name: 'Lower Right Canine' },
  { num: 26, name: 'Lower Right Lateral Incisor' },
  { num: 25, name: 'Lower Right Central Incisor' },
  { num: 24, name: 'Lower Left Central Incisor' },
  { num: 23, name: 'Lower Left Lateral Incisor' },
  { num: 22, name: 'Lower Left Canine' },
  { num: 21, name: 'Lower Left 1st Premolar' },
  { num: 20, name: 'Lower Left 2nd Premolar' },
  { num: 19, name: 'Lower Left 1st Molar' },
  { num: 18, name: 'Lower Left 2nd Molar' },
  { num: 17, name: 'Lower Left 3rd Molar (Wisdom)' }
];

const PEDIATRIC_UPPER_TEETH = [
  { num: 'A', name: 'Primary Upper Right 2nd Molar' },
  { num: 'B', name: 'Primary Upper Right 1st Molar' },
  { num: 'C', name: 'Primary Upper Right Canine' },
  { num: 'D', name: 'Primary Upper Right Lateral' },
  { num: 'E', name: 'Primary Upper Right Central' },
  { num: 'F', name: 'Primary Upper Left Central' },
  { num: 'G', name: 'Primary Upper Left Lateral' },
  { num: 'H', name: 'Primary Upper Left Canine' },
  { num: 'I', name: 'Primary Upper Left 1st Molar' },
  { num: 'J', name: 'Primary Upper Left 2nd Molar' }
];

const PEDIATRIC_LOWER_TEETH = [
  { num: 'T', name: 'Primary Lower Right 2nd Molar' },
  { num: 'S', name: 'Primary Lower Right 1st Molar' },
  { num: 'R', name: 'Primary Lower Right Canine' },
  { num: 'Q', name: 'Primary Lower Right Lateral' },
  { num: 'P', name: 'Primary Lower Right Central' },
  { num: 'O', name: 'Primary Lower Left Central' },
  { num: 'N', name: 'Primary Lower Left Lateral' },
  { num: 'M', name: 'Primary Lower Left Canine' },
  { num: 'L', name: 'Primary Lower Left 1st Molar' },
  { num: 'K', name: 'Primary Lower Left 2nd Molar' }
];

export default function DentalChart({ 
  patients, 
  selectedPatientId, 
  onSelectPatient,
  onSaveChart,
  onBookForTooth
}) {
  const [dentitionType, setDentitionType] = useState('adult'); // 'adult' | 'pediatric'
  const [selectedTooth, setSelectedTooth] = useState(14);
  const [selectedCondition, setSelectedCondition] = useState('caries');
  const [selectedSurface, setSelectedSurface] = useState('occlusal');
  const [toothNotes, setToothNotes] = useState('');
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  // Active patient and their chart state
  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const chartData = currentPatient?.odontogram || {};

  const handleToothClick = (toothNum) => {
    setSelectedTooth(toothNum);
    const existing = chartData[toothNum];
    if (existing) {
      setSelectedCondition(existing.condition || 'healthy');
      setSelectedSurface(existing.surface || 'all');
      setToothNotes(existing.notes || '');
    } else {
      setSelectedCondition('healthy');
      setSelectedSurface('all');
      setToothNotes('');
    }
  };

  const handleApplyCondition = (condId = selectedCondition, surf = selectedSurface) => {
    if (!currentPatient) return;
    const updatedChart = {
      ...chartData,
      [selectedTooth]: {
        condition: condId,
        surface: surf,
        notes: toothNotes || `${CONDITIONS.find(c => c.id === condId)?.label} applied`
      }
    };
    onSaveChart(currentPatient.id, updatedChart);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2000);
  };

  const handleResetTooth = () => {
    if (!currentPatient) return;
    const updatedChart = { ...chartData };
    delete updatedChart[selectedTooth];
    onSaveChart(currentPatient.id, updatedChart);
    setSelectedCondition('healthy');
    setSelectedSurface('all');
    setToothNotes('');
  };

  const getToothColor = (toothNum) => {
    const data = chartData[toothNum];
    if (!data) return '#10b981'; // default healthy
    const match = CONDITIONS.find(c => c.id === data.condition);
    return match ? match.color : '#10b981';
  };

  const getToothData = (toothNum) => chartData[toothNum];

  // Count stats
  const conditionCounts = CONDITIONS.reduce((acc, c) => {
    acc[c.id] = Object.values(chartData).filter(item => item.condition === c.id).length;
    return acc;
  }, {});

  const upperTeeth = dentitionType === 'adult' ? ADULT_UPPER_TEETH : PEDIATRIC_UPPER_TEETH;
  const lowerTeeth = dentitionType === 'adult' ? ADULT_LOWER_TEETH : PEDIATRIC_LOWER_TEETH;

  // Selected tooth metadata
  const selectedToothMeta = [...ADULT_UPPER_TEETH, ...ADULT_LOWER_TEETH, ...PEDIATRIC_UPPER_TEETH, ...PEDIATRIC_LOWER_TEETH]
    .find(t => String(t.num) === String(selectedTooth));

  return (
    <div className="odontogram-container">
      {/* Top Controls Bar */}
      <div className="odontogram-header">
        <div className="odontogram-title-area">
          <h2>Dental Chart</h2>
          <p className="subtitle">
            Tooth condition mapping, diagnosis, and procedure planning.
          </p>
        </div>

        <div className="odontogram-patient-picker">
          <label htmlFor="patient-select">Patient:</label>
          <select 
            id="patient-select"
            value={currentPatient?.id || ''} 
            onChange={(e) => onSelectPatient(e.target.value)}
            className="select-input"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.gender}, DOB: {p.dob})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode Switch & Summary Metrics */}
      <div className="odontogram-toolbar">
        <div className="toggle-group">
          <button 
            type="button"
            className={`toggle-btn ${dentitionType === 'adult' ? 'active' : ''}`}
            onClick={() => { setDentitionType('adult'); setSelectedTooth(14); }}
          >
            Adult (32)
          </button>
          <button 
            type="button"
            className={`toggle-btn ${dentitionType === 'pediatric' ? 'active' : ''}`}
            onClick={() => { setDentitionType('pediatric'); setSelectedTooth('B'); }}
          >
            Pediatric (20)
          </button>
        </div>

        {/* Condition Summary Pills */}
        <div className="condition-stats-strip">
          <div className="stat-pill">
            <span className="dot healthy"></span>
            <span>Healthy: <strong>{(dentitionType === 'adult' ? 32 : 20) - Object.keys(chartData).length + (conditionCounts.healthy || 0)}</strong></span>
          </div>
          {conditionCounts.caries > 0 && (
            <div className="stat-pill alert">
              <span className="dot caries"></span>
              <span>Caries: <strong>{conditionCounts.caries}</strong></span>
            </div>
          )}
          {conditionCounts.filling > 0 && (
            <div className="stat-pill info">
              <span className="dot filling"></span>
              <span>Fillings: <strong>{conditionCounts.filling}</strong></span>
            </div>
          )}
          {conditionCounts['root-canal'] > 0 && (
            <div className="stat-pill purple">
              <span className="dot root-canal"></span>
              <span>Endo: <strong>{conditionCounts['root-canal']}</strong></span>
            </div>
          )}
          {conditionCounts.crown > 0 && (
            <div className="stat-pill gold">
              <span className="dot crown"></span>
              <span>Crowns: <strong>{conditionCounts.crown}</strong></span>
            </div>
          )}
          {conditionCounts.implant > 0 && (
            <div className="stat-pill pink">
              <span className="dot implant"></span>
              <span>Implants: <strong>{conditionCounts.implant}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Main Chart Layout: Chart Canvas + Inspector Sidebar */}
      <div className="odontogram-main-grid">
        
        {/* Left Side: Visual Odontogram Teeth Arch */}
        <div className="odontogram-board glass-card">
          
          {/* Upper Maxillary Arch */}
          <div className="arch-section upper-arch">
            <div className="arch-label">
              <span>MAXILLARY ARCH (UPPER JAW)</span>
              <span className="arch-guide">Right ➔ Left</span>
            </div>

            <div className="teeth-row">
              {upperTeeth.map((tooth) => {
                const data = getToothData(tooth.num);
                const isSelected = String(selectedTooth) === String(tooth.num);
                const color = getToothColor(tooth.num);
                const isMissing = data?.condition === 'missing';

                return (
                  <div 
                    key={tooth.num} 
                    className={`tooth-item ${isSelected ? 'selected' : ''} ${isMissing ? 'missing' : ''}`}
                    onClick={() => handleToothClick(tooth.num)}
                    title={`${tooth.num}: ${tooth.name}`}
                  >
                    <div className="tooth-num-badge">{tooth.num}</div>
                    
                    {/* SVG Graphic of 5 Anatomical Surfaces */}
                    <div className="tooth-svg-wrap">
                      <svg viewBox="0 0 50 50" className="tooth-svg">
                        {/* Buccal/Facial (Top trapezoid) */}
                        <polygon 
                          points="5,5 45,5 35,15 15,15" 
                          fill={data?.surface === 'buccal' || data?.surface === 'facial' || data?.surface === 'all' ? color : 'var(--tooth-bg)'}
                          stroke="currentColor" 
                          strokeWidth="1.2"
                          className="surface-part buccal"
                        />
                        {/* Distal (Right trapezoid) */}
                        <polygon 
                          points="45,5 45,45 35,35 35,15" 
                          fill={data?.surface === 'distal' || data?.surface === 'all' ? color : 'var(--tooth-bg)'}
                          stroke="currentColor" 
                          strokeWidth="1.2"
                          className="surface-part distal"
                        />
                        {/* Lingual/Palatal (Bottom trapezoid) */}
                        <polygon 
                          points="5,45 45,45 35,35 15,35" 
                          fill={data?.surface === 'lingual' || data?.surface === 'palatal' || data?.surface === 'all' ? color : 'var(--tooth-bg)'}
                          stroke="currentColor" 
                          strokeWidth="1.2"
                          className="surface-part lingual"
                        />
                        {/* Mesial (Left trapezoid) */}
                        <polygon 
                          points="5,5 5,45 15,35 15,15" 
                          fill={data?.surface === 'mesial' || data?.surface === 'all' ? color : 'var(--tooth-bg)'}
                          stroke="currentColor" 
                          strokeWidth="1.2"
                          className="surface-part mesial"
                        />
                        {/* Occlusal / Incisal (Center Square) */}
                        <rect 
                          x="15" 
                          y="15" 
                          width="20" 
                          height="20" 
                          fill={data?.surface === 'occlusal' || data?.surface === 'incisal' || data?.surface === 'all' ? color : 'var(--tooth-bg)'}
                          stroke="currentColor" 
                          strokeWidth="1.2"
                          className="surface-part occlusal"
                        />
                        
                        {/* Cross mark if missing */}
                        {isMissing && (
                          <g stroke="#ef4444" strokeWidth="3">
                            <line x1="8" y1="8" x2="42" y2="42" />
                            <line x1="42" y1="8" x2="8" y2="42" />
                          </g>
                        )}
                        {/* Implant icon overlay */}
                        {data?.condition === 'implant' && (
                          <circle cx="25" cy="25" r="5" fill="#ec4899" />
                        )}
                        {/* Root canal lines */}
                        {data?.condition === 'root-canal' && (
                          <line x1="25" y1="5" x2="25" y2="45" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="2 2" />
                        )}
                      </svg>
                    </div>

                    {/* Condition Pill Indicator */}
                    {data && (
                      <span className="tooth-status-tag" style={{ backgroundColor: color }}>
                        {data.condition.slice(0, 4)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Occlusal Midline Separator */}
          <div className="arch-divider">
            <span className="divider-line"></span>
            <span className="divider-badge">OCCLUSAL PLANE / MIDLINE</span>
            <span className="divider-line"></span>
          </div>

          {/* Lower Mandibular Arch */}
          <div className="arch-section lower-arch">
            <div className="teeth-row">
              {lowerTeeth.map((tooth) => {
                const data = getToothData(tooth.num);
                const isSelected = String(selectedTooth) === String(tooth.num);
                const color = getToothColor(tooth.num);
                const isMissing = data?.condition === 'missing';

                return (
                  <div 
                    key={tooth.num} 
                    className={`tooth-item ${isSelected ? 'selected' : ''} ${isMissing ? 'missing' : ''}`}
                    onClick={() => handleToothClick(tooth.num)}
                    title={`${tooth.num}: ${tooth.name}`}
                  >
                    {/* Condition Pill Indicator */}
                    {data && (
                      <span className="tooth-status-tag" style={{ backgroundColor: color }}>
                        {data.condition.slice(0, 4)}
                      </span>
                    )}

                    {/* SVG Graphic */}
                    <div className="tooth-svg-wrap">
                      <svg viewBox="0 0 50 50" className="tooth-svg">
                        <polygon 
                          points="5,5 45,5 35,15 15,15" 
                          fill={data?.surface === 'buccal' || data?.surface === 'facial' || data?.surface === 'all' ? color : 'var(--tooth-bg)'}
                          stroke="currentColor" 
                          strokeWidth="1.2"
                          className="surface-part buccal"
                        />
                        <polygon 
                          points="45,5 45,45 35,35 35,15" 
                          fill={data?.surface === 'distal' || data?.surface === 'all' ? color : 'var(--tooth-bg)'}
                          stroke="currentColor" 
                          strokeWidth="1.2"
                          className="surface-part distal"
                        />
                        <polygon 
                          points="5,45 45,45 35,35 15,35" 
                          fill={data?.surface === 'lingual' || data?.surface === 'all' ? color : 'var(--tooth-bg)'}
                          stroke="currentColor" 
                          strokeWidth="1.2"
                          className="surface-part lingual"
                        />
                        <polygon 
                          points="5,5 5,45 15,35 15,15" 
                          fill={data?.surface === 'mesial' || data?.surface === 'all' ? color : 'var(--tooth-bg)'}
                          stroke="currentColor" 
                          strokeWidth="1.2"
                          className="surface-part mesial"
                        />
                        <rect 
                          x="15" 
                          y="15" 
                          width="20" 
                          height="20" 
                          fill={data?.surface === 'occlusal' || data?.surface === 'incisal' || data?.surface === 'all' ? color : 'var(--tooth-bg)'}
                          stroke="currentColor" 
                          strokeWidth="1.2"
                          className="surface-part occlusal"
                        />
                        {isMissing && (
                          <g stroke="#ef4444" strokeWidth="3">
                            <line x1="8" y1="8" x2="42" y2="42" />
                            <line x1="42" y1="8" x2="8" y2="42" />
                          </g>
                        )}
                        {data?.condition === 'implant' && (
                          <circle cx="25" cy="25" r="5" fill="#ec4899" />
                        )}
                        {data?.condition === 'root-canal' && (
                          <line x1="25" y1="5" x2="25" y2="45" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="2 2" />
                        )}
                      </svg>
                    </div>

                    <div className="tooth-num-badge">{tooth.num}</div>
                  </div>
                );
              })}
            </div>

            <div className="arch-label">
              <span>MANDIBULAR ARCH (LOWER JAW)</span>
              <span className="arch-guide">Right ➔ Left</span>
            </div>
          </div>

          {/* Odontogram Interactive Legend */}
          <div className="odontogram-legend">
            <span className="legend-title">Clinical Condition Key:</span>
            <div className="legend-grid">
              {CONDITIONS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={`legend-item ${selectedCondition === c.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCondition(c.id);
                    handleApplyCondition(c.id, selectedSurface);
                  }}
                >
                  <span className="legend-color-dot" style={{ backgroundColor: c.color }}></span>
                  <span className="legend-name">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Tooth Inspector & Treatment Action Panel */}
        <div className="tooth-inspector-panel glass-card">
          <div className="inspector-header">
            <div className="tooth-highlight-badge">
              <span className="badge-num">#{selectedTooth}</span>
            </div>
            <div>
              <h3>{selectedToothMeta?.name || `Tooth #${selectedTooth}`}</h3>
              <p className="text-muted">
                {currentPatient ? `Patient: ${currentPatient.name}` : 'Select a tooth on chart'}
              </p>
            </div>
          </div>

          {showSavedNotification && (
            <div className="chart-alert-toast">
              <CheckCircle2 size={16} />
              <span>Chart updated successfully!</span>
            </div>
          )}

          {/* Surface Selector */}
          <div className="inspector-section">
            <label className="section-label">Target Surface:</label>
            <div className="surface-buttons-grid">
              {[
                { id: 'all', label: 'Entire Tooth (All Surfaces)' },
                { id: 'occlusal', label: 'Occlusal (Chewing)' },
                { id: 'buccal', label: 'Buccal (Cheek side)' },
                { id: 'lingual', label: 'Lingual (Tongue side)' },
                { id: 'mesial', label: 'Mesial (Front contact)' },
                { id: 'distal', label: 'Distal (Back contact)' }
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={`surface-btn ${selectedSurface === s.id ? 'active' : ''}`}
                  onClick={() => setSelectedSurface(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Selector */}
          <div className="inspector-section">
            <label className="section-label">Diagnosis / Condition:</label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="select-input"
            >
              {CONDITIONS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clinical Notes for this Tooth */}
          <div className="inspector-section">
            <label className="section-label">Clinical Observations & Treatment Notes:</label>
            <textarea
              value={toothNotes}
              onChange={(e) => setToothNotes(e.target.value)}
              placeholder="e.g. Mild sensitivity to cold, 4mm pocket depth, margin breakdown..."
              rows={3}
              className="textarea-input"
            />
          </div>

          {/* Inspector Action Buttons */}
          <div className="inspector-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleApplyCondition(selectedCondition, selectedSurface)}
            >
              <Save size={16} />
              <span>Save Tooth #{selectedTooth}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResetTooth}
              title="Reset tooth to healthy default"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>

          <div className="divider-hr" />

          {/* Quick Action: Book Appointment for this Tooth */}
          <div className="tooth-quick-book">
            <div className="quick-book-header">
              <PlusCircle size={18} className="text-teal" />
              <h4>Create Treatment Appointment</h4>
            </div>
            <p className="text-muted text-sm">
              Instantly create a scheduled procedure pre-linked with Tooth #{selectedTooth} for {currentPatient?.name}.
            </p>
            <button
              type="button"
              className="btn btn-outline-cyan w-full"
              onClick={() => onBookForTooth(currentPatient, selectedTooth, selectedCondition)}
            >
              <span>+ Schedule Appointment for Tooth #{selectedTooth}</span>
            </button>
          </div>

          {/* Patient Medical Risk Reminder */}
          {currentPatient?.allergies && currentPatient.allergies.length > 0 && currentPatient.allergies[0] !== 'None known' && (
            <div className="patient-medical-alert-box">
              <AlertTriangle size={16} className="text-amber" />
              <div>
                <strong>Medical Alert for {currentPatient.name}:</strong>
                <p>Allergies: {currentPatient.allergies.join(', ')}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
