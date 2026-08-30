import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  AlertCircle, 
  Send, 
  FileText, 
  Calendar, 
  Stethoscope, 
  ShieldAlert, 
  Copy, 
  Check, 
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';
import { CLINIC_INFO } from '../../data/mockDentalData';

const TRIAGE_PRESETS = [
  {
    title: 'Severe Throbbing Toothache with Facial Swelling',
    symptoms: 'Patient reports unbearable continuous pain in lower left molar (#19), throbbing keeping them awake at night, visibly swollen cheek and mild fever.',
    urgency: 'HIGH_EMERGENCY',
    diagnosis: 'Acute Periapical Abscess / Acute Irreversible Pulpitis',
    recommendedProcedure: 'Molar Root Canal Therapy (Endo) or Emergency Drainage',
    code: 'D3330 / D9110',
    doctorRecommendation: 'Dr. Marcus Vance (Oral Surgery) or Dr. Liam Patel (Endodontics)',
    chairRecommendation: 'Operatory 2 (Surgical)',
    clinicalAction: 'Priority immediate slot required. Pre-medicate with amoxicillin/clindamycin if febrile. Vitality test & periapical radiograph.'
  },
  {
    title: 'Chipped Front Tooth with Mild Sensitivity',
    symptoms: 'Patient chipped upper right central incisor (#8) while eating hard food. No severe pain, but sharp edge cutting tongue and sensitive to cold water.',
    urgency: 'MODERATE_URGENT',
    diagnosis: 'Enamel-Dentin Fracture (Ellis Class II)',
    recommendedProcedure: 'Composite Resin Aesthetic Filling or Porcelain Veneer',
    code: 'D2391 / D2740',
    doctorRecommendation: 'Dr. Sarah Chen (Cosmetic & Restorative)',
    chairRecommendation: 'Operatory 1 (Alpha)',
    clinicalAction: 'Schedule within 24-48 hours. Aesthetic shade matching and composite bonding.'
  },
  {
    title: 'Bleeding Gums During Brushing & Flossing',
    symptoms: 'Patient notices red swollen gums and bleeding every time they brush. Mild bad breath, no acute pain.',
    urgency: 'ROUTINE_PREVENTIVE',
    diagnosis: 'Chronic Marginal Gingivitis / Early Periodontitis',
    recommendedProcedure: 'Dental Prophylaxis & Deep Polish / Periodontal Scaling',
    code: 'D1110 / D4341',
    doctorRecommendation: 'Dr. Liam Patel or Hygiene Specialist',
    chairRecommendation: 'Operatory 3 (Hygiene)',
    clinicalAction: 'Routine appointment. Full periodontal pocket probing chart and ultrasonic debridement.'
  },
  {
    title: 'Impacted Wisdom Tooth Pressure in Teenager',
    symptoms: '18-year-old patient complaining of soreness in lower back jaw, difficulty opening mouth wide (trismus), bad taste.',
    urgency: 'URGENT',
    diagnosis: 'Pericoronitis of Lower 3rd Molar (#32)',
    recommendedProcedure: 'Surgical Wisdom Tooth Extraction',
    code: 'D7210',
    doctorRecommendation: 'Dr. Marcus Vance (Oral Surgery)',
    chairRecommendation: 'Operatory 2 (Surgical)',
    clinicalAction: 'Irrigate operculum with chlorhexidine. Schedule surgical extraction with local anesthesia.'
  }
];

export default function DentalAIAssistant({
  onQuickBookEmergency,
  doctors,
  chairs,
  procedures
}) {
  const [activeTab, setActiveTab] = useState('triage'); // 'triage' | 'postop' | 'codes'
  const [customSymptomInput, setCustomSymptomInput] = useState('');
  const [analyzedResult, setAnalyzedResult] = useState(TRIAGE_PRESETS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Post-Op Generator State
  const [selectedPostOpProc, setSelectedPostOpProc] = useState('extraction');
  const [patientNameInput, setPatientNameInput] = useState('Valued Patient');

  const handleSelectPreset = (preset) => {
    setCustomSymptomInput(preset.symptoms);
    setAnalyzedResult(preset);
  };

  const handleAnalyzeCustom = () => {
    if (!customSymptomInput.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      const text = customSymptomInput.toLowerCase();
      
      if (text.includes('bleed') || text.includes('gum') || text.includes('clean')) {
        setAnalyzedResult(TRIAGE_PRESETS[2]);
      } else if (text.includes('chip') || text.includes('crack') || text.includes('front') || text.includes('broken')) {
        setAnalyzedResult(TRIAGE_PRESETS[1]);
      } else if (text.includes('wisdom') || text.includes('back') || text.includes('jaw')) {
        setAnalyzedResult(TRIAGE_PRESETS[3]);
      } else {
        setAnalyzedResult(TRIAGE_PRESETS[0]);
      }
    }, 800);
  };

  const getPostOpText = () => {
    switch (selectedPostOpProc) {
      case 'extraction':
        return `🦷 POST-OPERATIVE CARE: SURGICAL EXTRACTION\nPatient: ${patientNameInput}\nClinic: ${CLINIC_INFO.name}\n\n1. BLEEDING CONTROL: Bite firmly on the sterile gauze for 45-60 minutes. If slight oozing persists, place a damp black tea bag on the socket and bite gently.\n2. SWELLING & PAIN: Apply an ice pack to your cheek in 15-minute intervals for the first 24 hours. Take prescribed ibuprofen/acetaminophen before numbness wears off.\n3. DO NOTS (Crucial for first 48 hours):\n   ❌ Do NOT spit forcefully or drink through a straw (prevents painful Dry Socket)\n   ❌ Do NOT smoke, vape, or consume alcoholic beverages\n   ❌ Do NOT rinse vigorously\n4. DIET: Stick to soft, cool foods (yogurt, smoothies, lukewarm soup, mashed potatoes).\n5. EMERGENCY: Call ${CLINIC_INFO.emergencyPhone} if you experience severe unmanaged pain or heavy bleeding.`;
      case 'rootcanal':
        return `🦷 POST-OPERATIVE CARE: ROOT CANAL THERAPY (ENDODONTICS)\nPatient: ${patientNameInput}\nClinic: ${CLINIC_INFO.name}\n\n1. ANESTHESIA: Your lips and tongue will remain numb for 2-3 hours. Avoid chewing until sensation completely returns.\n2. TENDERNESS: It is normal for the tooth to feel bruised or tender when biting for 3-5 days as the surrounding ligament heals. Over-the-counter anti-inflammatories work best.\n3. TEMPORARY FILLING: Do not chew hard or sticky foods on the treated side until your permanent crown is placed.\n4. CROWN APPOINTMENT: Schedule your permanent crown within 2-4 weeks to prevent tooth fracture.\nEmergency contact: ${CLINIC_INFO.phone}`;
      case 'implant':
        return `🦷 POST-OPERATIVE CARE: DENTAL IMPLANT SURGERY\nPatient: ${patientNameInput}\nClinic: ${CLINIC_INFO.name}\n\n1. REST: Avoid strenuous physical activity for 48 hours to prevent elevated blood pressure and bleeding.\n2. ORAL HYGIENE: Do NOT brush directly over the surgical site today. Tomorrow, begin gentle warm saltwater rinses (1/2 tsp salt in warm water) after every meal.\n3. SUTURES: Dissolvable sutures will soften in 7-10 days.\n4. SOFT DIET: Maintain a soft food diet on the opposite side of your mouth for 2 weeks.\nClinic Emergency Hotline: ${CLINIC_INFO.emergencyPhone}`;
      default:
        return `General Dental Post-Op Care Guidelines for ${patientNameInput}.`;
    }
  };

  const handleCopyPostOp = () => {
    navigator.clipboard.writeText(getPostOpText());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="ai-assistant-container">
      {/* Header */}
      <div className="ai-header-row">
        <div className="ai-title-block">
          <h2>AI Assistant</h2>
          <p className="subtitle">
            Symptom triage, chair allocation, and post-op care generator.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="ai-tabs">
          <button 
            type="button" 
            className={`ai-tab-btn ${activeTab === 'triage' ? 'active' : ''}`}
            onClick={() => setActiveTab('triage')}
          >
            <AlertCircle size={16} />
            <span>Emergency Triage</span>
          </button>
          <button 
            type="button" 
            className={`ai-tab-btn ${activeTab === 'postop' ? 'active' : ''}`}
            onClick={() => setActiveTab('postop')}
          >
            <FileText size={16} />
            <span>Post-Op Care</span>
          </button>
          <button 
            type="button" 
            className={`ai-tab-btn ${activeTab === 'codes' ? 'active' : ''}`}
            onClick={() => setActiveTab('codes')}
          >
            <HelpCircle size={16} />
            <span>Procedure Directory</span>
          </button>
        </div>
      </div>

      {/* Main Tab 1: Emergency & Triage */}
      {activeTab === 'triage' && (
        <div className="triage-grid">
          
          {/* Left Column: Symptom Input & Presets */}
          <div className="triage-input-card glass-card">
            <div className="card-top-title">
              <Bot size={20} className="text-cyan" />
              <h3>Clinical Symptom Analyzer</h3>
            </div>

            <p className="text-muted text-sm mb-3">
              Describe what the patient is experiencing or select a common dental emergency profile:
            </p>

            <div className="triage-presets-list">
              {TRIAGE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`preset-btn ${analyzedResult.title === p.title ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(p)}
                >
                  <span className="preset-bullet">⚡</span>
                  <span>{p.title}</span>
                </button>
              ))}
            </div>

            <div className="form-group mt-3">
              <label>Custom Patient Symptom Description:</label>
              <textarea 
                rows={3}
                placeholder="e.g. Broken molar, sharp throbbing pain radiating to temple, fever..."
                value={customSymptomInput}
                onChange={(e) => setCustomSymptomInput(e.target.value)}
                className="textarea-input"
              />
            </div>

            <button 
              type="button" 
              className="btn btn-primary glow-cyan w-full"
              onClick={handleAnalyzeCustom}
              disabled={isAnalyzing}
            >
              <Sparkles size={16} />
              <span>{isAnalyzing ? 'Analyzing Symptoms...' : 'Analyze & Optimize Schedule'}</span>
            </button>
          </div>

          {/* Right Column: AI Triage Recommendation Card */}
          <div className="triage-result-card glass-card">
            <div className="triage-result-header">
              <div className="urgency-badge-wrap">
                <span className={`urgency-badge ${analyzedResult.urgency?.toLowerCase()}`}>
                  {analyzedResult.urgency?.replace('_', ' ')}
                </span>
              </div>
              <span className="text-xs text-muted">AI Clinical Assessment</span>
            </div>

            <h3 className="diagnosis-title">{analyzedResult.diagnosis}</h3>

            <div className="triage-meta-box">
              <div className="meta-item">
                <span className="meta-label">Recommended Treatment:</span>
                <span className="meta-val font-bold text-cyan">{analyzedResult.recommendedProcedure}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">CDT Procedure Code:</span>
                <span className="meta-val font-mono">{analyzedResult.code}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Suggested Specialist:</span>
                <span className="meta-val">{analyzedResult.doctorRecommendation}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Assigned Chair:</span>
                <span className="meta-val">{analyzedResult.chairRecommendation}</span>
              </div>
            </div>

            <div className="clinical-protocol-box">
              <div className="protocol-title">
                <Stethoscope size={16} className="text-teal" />
                <strong>Clinical Action Protocol:</strong>
              </div>
              <p className="protocol-text">{analyzedResult.clinicalAction}</p>
            </div>

            <button 
              type="button" 
              className="btn btn-primary glow-cyan w-full"
              onClick={() => {
                onQuickBookEmergency({
                  procedureName: analyzedResult.recommendedProcedure,
                  notes: `AI Triage: ${analyzedResult.diagnosis}. ${analyzedResult.clinicalAction}`,
                  urgency: analyzedResult.urgency
                });
              }}
            >
              <Calendar size={16} />
              <span>Book Priority Emergency Slot Now</span>
            </button>
          </div>

        </div>
      )}

      {/* Main Tab 2: Post-Op Care Instructions */}
      {activeTab === 'postop' && (
        <div className="postop-grid glass-card">
          <div className="postop-controls">
            <h3>Generate Patient Post-Procedure Instructions</h3>
            <p className="text-muted text-sm">
              Customized care sheets with emergency protocols ready for SMS/WhatsApp.
            </p>

            <div className="form-group mt-3">
              <label>Select Procedure Type:</label>
              <div className="toggle-group-vertical">
                <button 
                  type="button" 
                  className={`toggle-btn ${selectedPostOpProc === 'extraction' ? 'active' : ''}`}
                  onClick={() => setSelectedPostOpProc('extraction')}
                >
                  Surgical Tooth Extraction (Wisdom Teeth)
                </button>
                <button 
                  type="button" 
                  className={`toggle-btn ${selectedPostOpProc === 'rootcanal' ? 'active' : ''}`}
                  onClick={() => setSelectedPostOpProc('rootcanal')}
                >
                  Root Canal Therapy (Endodontics)
                </button>
                <button 
                  type="button" 
                  className={`toggle-btn ${selectedPostOpProc === 'implant' ? 'active' : ''}`}
                  onClick={() => setSelectedPostOpProc('implant')}
                >
                  Dental Implant Placement & Bone Graft
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Patient Name:</label>
              <input 
                type="text" 
                value={patientNameInput}
                onChange={(e) => setPatientNameInput(e.target.value)}
                className="text-input"
              />
            </div>
          </div>

          <div className="postop-preview-box">
            <div className="preview-top-bar">
              <span className="text-xs text-cyan font-bold">READY TO DISPATCH</span>
              <button 
                type="button" 
                className="btn btn-sm btn-primary"
                onClick={handleCopyPostOp}
              >
                {copiedText ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedText ? 'Copied to Clipboard!' : 'Copy Instructions'}</span>
              </button>
            </div>

            <div className="postop-rendered-text">
              {getPostOpText().split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 3: CDT Code Reference */}
      {activeTab === 'codes' && (
        <div className="cdt-codes-card glass-card">
          <div className="codes-title-row">
            <h3>Standard Dental Procedure & ADA/CDT Code Directory</h3>
            <span className="badge-pill">Common Practice Codes</span>
          </div>

          <div className="cdt-grid">
            {procedures.map(p => (
              <div key={p.id} className="cdt-item-card">
                <div className="cdt-code-tag">{p.code}</div>
                <div className="cdt-info">
                  <h4>{p.name}</h4>
                  <p className="text-muted text-xs">{p.description}</p>
                  <div className="cdt-stats-row">
                    <span>Category: <strong>{p.category}</strong></span>
                    <span>Duration: <strong>{p.duration} mins</strong></span>
                    <span>Std Fee: <strong>₹{Number(p.price).toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
