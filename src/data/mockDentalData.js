// DentPulse 3D - Mock Data & LocalStorage Management (Indian Market & Rupee Format)

export const DEFAULT_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Chen, BDS, MDS',
    specialty: 'Cosmetic & Restorative Dentistry',
    experience: '12 Years',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    color: '#ffffff',
    rating: 4.9,
    reviewsCount: 142,
    bio: 'Specialist in smile makeovers, porcelain veneers, and gentle minimally-invasive restorative dentistry.',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    chairs: ['chair-1', 'chair-3']
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance, BDS, MDS',
    specialty: 'Oral Surgery & Implantology',
    experience: '15 Years',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    color: '#e2e8f0',
    rating: 4.95,
    reviewsCount: 198,
    bio: 'Oral & maxillofacial surgeon specializing in dental implants, bone grafting, and wisdom teeth removal with localized sedation.',
    days: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    chairs: ['chair-2']
  },
  {
    id: 'doc-3',
    name: 'Dr. Emily Rodriguez, BDS, MDS',
    specialty: 'Pediatric & Orthodontics',
    experience: '9 Years',
    avatar: 'https://images.unsplash.com/photo-1594824813571-638f026385a4?w=300&auto=format&fit=crop&q=80',
    color: '#cbd5e1',
    rating: 4.88,
    reviewsCount: 116,
    bio: 'Warm and empathetic specialist focused on comfortable children’s dentistry, interceptive orthodontics, and clear aligners.',
    days: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    chairs: ['chair-4']
  },
  {
    id: 'doc-4',
    name: 'Dr. Liam Patel, BDS, MDS',
    specialty: 'Endodontics & Periodontics',
    experience: '11 Years',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
    color: '#94a3b8',
    rating: 4.92,
    reviewsCount: 165,
    bio: 'Painless microscopic root canal therapy (RCT), gum rejuvenation, and advanced laser periodontal treatment.',
    days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    chairs: ['chair-1', 'chair-2']
  }
];

export const DEFAULT_CHAIRS = [
  {
    id: 'chair-1',
    name: 'Operatory 1 (Alpha)',
    type: 'General & Restorative',
    equipment: 'A-dec 500 Dental Chair, KaVo High-Speed Handpiece, Digital Intraoral Scanner',
    color: '#ffffff',
    status: 'available'
  },
  {
    id: 'chair-2',
    name: 'Operatory 2 (Surgical)',
    type: 'Oral Surgery & Implants',
    equipment: 'Midmark Surgical Chair, CBCT 3D X-Ray, Piezoelectric Surgery Unit, Nitrous Oxide System',
    color: '#e2e8f0',
    status: 'in-use'
  },
  {
    id: 'chair-3',
    name: 'Operatory 3 (Hygiene)',
    type: 'Preventive & Whitening',
    equipment: 'Pelton & Crane Chair, Cavitron Ultrasonic Scaler, Zoom Laser Whitening Light',
    color: '#cbd5e1',
    status: 'available'
  },
  {
    id: 'chair-4',
    name: 'Operatory 4 (Pediatric & Ortho)',
    type: 'Pediatric & Aligners',
    equipment: 'Child-friendly Relax Chair, iTero 3D Aligner Scanner, Ceiling Entertainment Screen',
    color: '#94a3b8',
    status: 'available'
  }
];

export const DEFAULT_PROCEDURES = [
  {
    id: 'proc-1',
    code: 'D0150',
    name: 'Comprehensive Oral Exam & 3D Scan',
    category: 'Diagnostic',
    duration: 30,
    price: 800,
    icon: 'Scan',
    description: 'Complete digital examination of oral health, periodontal charting, and high-res intraoral 3D imaging.'
  },
  {
    id: 'proc-2',
    code: 'D1110',
    name: 'Full Mouth Ultrasonic Scaling & Polish',
    category: 'Preventive',
    duration: 45,
    price: 1500,
    icon: 'Sparkles',
    description: 'Ultrasonic calculus scaling, plaque removal, prophy paste polishing, and enamel strengthening.'
  },
  {
    id: 'proc-3',
    code: 'D2391',
    name: 'Composite Resin Aesthetic Tooth Filling',
    category: 'Restorative',
    duration: 45,
    price: 2200,
    icon: 'ShieldCheck',
    description: 'Tooth-colored composite restoration matching natural shade for cavities or damaged tooth surfaces.'
  },
  {
    id: 'proc-4',
    code: 'D2740',
    name: 'CAD/CAM Porcelain / Zirconia Crown',
    category: 'Prosthodontics',
    duration: 90,
    price: 9500,
    icon: 'Crown',
    description: 'Precision milled monolithic zirconia/porcelain crown to restore full strength, bite, and natural aesthetics.'
  },
  {
    id: 'proc-5',
    code: 'D3330',
    name: 'Molar Root Canal Therapy (RCT)',
    category: 'Endodontics',
    duration: 75,
    price: 6500,
    icon: 'Activity',
    description: 'Microscopic disinfection and 3D warm vertical obturation of root canals to relieve severe pain and save the tooth.'
  },
  {
    id: 'proc-6',
    code: 'D7210',
    name: 'Surgical Wisdom Tooth Extraction',
    category: 'Oral Surgery',
    duration: 60,
    price: 4500,
    icon: 'Scissors',
    description: 'Gentle surgical removal of impacted or symptomatic third molar with localized anesthesia and sutures.'
  },
  {
    id: 'proc-7',
    code: 'D6010',
    name: 'Titanium Dental Implant Placement',
    category: 'Implantology',
    duration: 90,
    price: 32000,
    icon: 'Anchor',
    description: 'Guided 3D surgical placement of Grade-IV titanium artificial tooth root for permanent lifetime tooth replacement.'
  },
  {
    id: 'proc-8',
    code: 'D9972',
    name: 'In-Office Laser Teeth Whitening',
    category: 'Cosmetic',
    duration: 60,
    price: 8500,
    icon: 'Sun',
    description: 'Fast medical-grade hydrogen peroxide gel activated with specialized cold laser for up to 8 shades lighter teeth.'
  },
  {
    id: 'proc-9',
    code: 'D8080',
    name: 'Clear Aligners (Invisible Braces) Consult',
    category: 'Orthodontics',
    duration: 45,
    price: 55000,
    icon: 'Smile',
    description: 'Digital 3D simulation of teeth straightening movement and custom transparent aligner treatment planning.'
  },
  {
    id: 'proc-10',
    code: 'D9110',
    name: 'Emergency Dental Pain Relief & Dressing',
    category: 'Emergency',
    duration: 30,
    price: 1200,
    icon: 'AlertCircle',
    description: 'Same-day urgent triage, emergency diagnostics, localized anesthesia, and immediate pain stabilization.'
  }
];

// Helper to get formatted dates relative to today
const getRelativeDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const DEFAULT_PATIENTS = [
  {
    id: 'pat-1',
    name: 'Sophia Montgomery',
    dob: '1992-04-14',
    gender: 'Female',
    phone: '+91 98191 23456',
    email: 'sophia.m@example.com',
    address: 'Bandra West, Mumbai, Maharashtra',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Latex'],
    medicalConditions: ['Mild Asthma'],
    emergencyContact: 'David Montgomery (Husband) - +91 98191 88990',
    insuranceProvider: 'Star Health Dental Care (ID: STR-98231)',
    totalVisits: 6,
    lastVisit: getRelativeDate(-14),
    balanceDue: 0,
    notes: 'Prefers numbing gel applied 5 mins before local anesthesia injection. Mild dental anxiety.',
    odontogram: {
      14: { condition: 'caries', surface: 'occlusal', notes: 'Incipient caries, watch closely' },
      19: { condition: 'crown', surface: 'all', notes: 'Zirconia crown placed 2024' },
      30: { condition: 'filling', surface: 'mesial-occlusal', notes: 'Composite restoration intact' }
    }
  },
  {
    id: 'pat-2',
    name: 'Alexander Hayes',
    dob: '1985-11-23',
    gender: 'Male',
    phone: '+91 98202 34567',
    email: 'alex.hayes@example.com',
    address: 'Indiranagar, Bengaluru, Karnataka',
    bloodGroup: 'A+',
    allergies: ['None known'],
    medicalConditions: ['Hypertension (Controlled)'],
    emergencyContact: 'Rachel Hayes (Wife) - +91 98202 77889',
    insuranceProvider: 'HDFC ERGO Health (ID: HDF-44109)',
    totalVisits: 9,
    lastVisit: getRelativeDate(-45),
    balanceDue: 2200,
    notes: 'Blood pressure checked before any surgical procedures. Regular flosser.',
    odontogram: {
      3: { condition: 'root-canal', surface: 'all', notes: 'Root canal treated' },
      4: { condition: 'filling', surface: 'occlusal', notes: 'Composite filled' },
      18: { condition: 'implant', surface: 'all', notes: 'Titanium fixture with custom abutment' }
    }
  },
  {
    id: 'pat-3',
    name: 'Olivia Bennett',
    dob: '2001-08-19',
    gender: 'Female',
    phone: '+91 98333 45678',
    email: 'olivia.b@example.com',
    address: 'Koregaon Park, Pune, Maharashtra',
    bloodGroup: 'B+',
    allergies: ['Sulfa Drugs', 'Codeine'],
    medicalConditions: ['None'],
    emergencyContact: 'Karen Bennett (Mother) - +91 98333 99887',
    insuranceProvider: 'ICICI Lombard Complete Health (ID: ICI-77321)',
    totalVisits: 3,
    lastVisit: getRelativeDate(-90),
    balanceDue: 0,
    notes: 'Interested in clear aligners for upper anterior crowding.',
    odontogram: {
      8: { condition: 'veneer', surface: 'facial', notes: 'Porcelain veneer' },
      9: { condition: 'veneer', surface: 'facial', notes: 'Porcelain veneer' }
    }
  },
  {
    id: 'pat-4',
    name: 'Ethan James Walker',
    dob: '2016-03-08',
    gender: 'Male',
    phone: '+91 98444 56789',
    email: 'walker.family@example.com',
    address: 'Vasant Vihar, New Delhi',
    bloodGroup: 'AB+',
    allergies: ['Peanuts'],
    medicalConditions: ['None'],
    emergencyContact: 'Jessica Walker (Mother) - +91 98444 56789',
    insuranceProvider: 'Aditya Birla Health (ID: ADB-55201)',
    totalVisits: 4,
    lastVisit: getRelativeDate(-60),
    balanceDue: 0,
    notes: 'Pediatric patient. Enjoys cartoon screen during fluoride application. No fear.',
    odontogram: {
      'B': { condition: 'filling', surface: 'occlusal', notes: 'Glass ionomer' },
      'I': { condition: 'healthy', surface: 'all', notes: 'Clean eruption' }
    }
  },
  {
    id: 'pat-5',
    name: 'Elena Rostova',
    dob: '1978-06-30',
    gender: 'Female',
    phone: '+91 98555 67890',
    email: 'elena.rostova@example.com',
    address: 'Jubilee Hills, Hyderabad, Telangana',
    bloodGroup: 'O-',
    allergies: ['Aspirin', 'NSAIDs'],
    medicalConditions: ['Type 2 Diabetes (Controlled)'],
    emergencyContact: 'Igor Rostov (Brother) - +91 98555 11223',
    insuranceProvider: 'Bajaj Allianz Health (ID: BAJ-33019)',
    totalVisits: 11,
    lastVisit: getRelativeDate(-7),
    balanceDue: 4500,
    notes: 'Diabetic protocol followed. Requires morning appointments after breakfast.',
    odontogram: {
      12: { condition: 'caries', surface: 'mesial-distal', notes: 'Interproximal caries' },
      14: { condition: 'missing', surface: 'all', notes: 'Extracted in 2021' },
      31: { condition: 'crown', surface: 'all', notes: 'Full zirconia crown' }
    }
  },
  {
    id: 'pat-6',
    name: 'Marcus Sterling',
    dob: '1995-12-05',
    gender: 'Male',
    phone: '+91 98666 78901',
    email: 'marcus.s@example.com',
    address: 'Sector 43, Gurugram, Haryana',
    bloodGroup: 'A-',
    allergies: ['None known'],
    medicalConditions: ['None'],
    emergencyContact: 'Chloe Sterling (Sister) - +91 98666 44556',
    insuranceProvider: 'Self-Pay / UPI Patient',
    totalVisits: 2,
    lastVisit: getRelativeDate(-180),
    balanceDue: 0,
    notes: 'Prefers digital WhatsApp communications and evening slots.',
    odontogram: {
      1: { condition: 'missing', surface: 'all', notes: 'Wisdom tooth extracted' },
      16: { condition: 'missing', surface: 'all', notes: 'Wisdom tooth extracted' },
      17: { condition: 'missing', surface: 'all', notes: 'Wisdom tooth extracted' },
      32: { condition: 'missing', surface: 'all', notes: 'Wisdom tooth extracted' }
    }
  }
];

export const DEFAULT_APPOINTMENTS = [
  // Today's appointments
  {
    id: 'apt-101',
    bookingCode: 'DEN-1014',
    patientId: 'pat-1',
    patientName: 'Sophia Montgomery',
    patientPhone: '+91 98191 23456',
    patientEmail: 'sophia.m@example.com',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Chen, BDS, MDS',
    chairId: 'chair-1',
    chairName: 'Operatory 1 (Alpha)',
    procedureId: 'proc-3',
    procedureName: 'Composite Resin Aesthetic Tooth Filling',
    date: getRelativeDate(0),
    time: '09:00',
    duration: 45,
    status: 'in-chair', // scheduled, confirmed, in-chair, completed, cancelled, no-show
    amount: 2200,
    paid: true,
    paymentMethod: 'UPI (GPay / PhonePe)',
    toothNumber: '14',
    notes: 'Tooth #14 occlusal surface restoration. Topical gel applied first.',
    source: 'portal',
    reminderSent: true
  },
  {
    id: 'apt-102',
    bookingCode: 'DEN-1028',
    patientId: 'pat-2',
    patientName: 'Alexander Hayes',
    patientPhone: '+91 98202 34567',
    patientEmail: 'alex.hayes@example.com',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Vance, BDS, MDS',
    chairId: 'chair-2',
    chairName: 'Operatory 2 (Surgical)',
    procedureId: 'proc-7',
    procedureName: 'Titanium Dental Implant Placement',
    date: getRelativeDate(0),
    time: '10:30',
    duration: 90,
    status: 'confirmed',
    amount: 32000,
    paid: false,
    paymentMethod: 'Credit Card / EMI',
    toothNumber: '19',
    notes: 'Stage 1 fixture placement for tooth #19. Pre-op vitals check required.',
    source: 'reception',
    reminderSent: true
  },
  {
    id: 'apt-103',
    bookingCode: 'DEN-1035',
    patientId: 'pat-3',
    patientName: 'Olivia Bennett',
    patientPhone: '+91 98333 45678',
    patientEmail: 'olivia.b@example.com',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Chen, BDS, MDS',
    chairId: 'chair-3',
    chairName: 'Operatory 3 (Hygiene)',
    procedureId: 'proc-8',
    procedureName: 'In-Office Laser Teeth Whitening',
    date: getRelativeDate(0),
    time: '13:00',
    duration: 60,
    status: 'scheduled',
    amount: 8500,
    paid: true,
    paymentMethod: 'UPI (Paytm)',
    toothNumber: 'Full Arch',
    notes: 'Laser bleaching session prior to wedding event.',
    source: 'portal',
    reminderSent: true
  },
  {
    id: 'apt-104',
    bookingCode: 'DEN-1049',
    patientId: 'pat-4',
    patientName: 'Ethan James Walker',
    patientPhone: '+91 98444 56789',
    patientEmail: 'walker.family@example.com',
    doctorId: 'doc-3',
    doctorName: 'Dr. Emily Rodriguez, BDS, MDS',
    chairId: 'chair-4',
    chairName: 'Operatory 4 (Pediatric & Ortho)',
    procedureId: 'proc-2',
    procedureName: 'Full Mouth Ultrasonic Scaling & Polish',
    date: getRelativeDate(0),
    time: '14:30',
    duration: 45,
    status: 'scheduled',
    amount: 1500,
    paid: false,
    paymentMethod: 'Cash',
    toothNumber: 'Primary Teeth',
    notes: 'Routine 6-month pediatric recall + topical bubblegum fluoride.',
    source: 'reception',
    reminderSent: false
  },
  {
    id: 'apt-105',
    bookingCode: 'DEN-1052',
    patientId: 'pat-5',
    patientName: 'Elena Rostova',
    patientPhone: '+91 98555 67890',
    patientEmail: 'elena.rostova@example.com',
    doctorId: 'doc-4',
    doctorName: 'Dr. Liam Patel, BDS, MDS',
    chairId: 'chair-1',
    chairName: 'Operatory 1 (Alpha)',
    procedureId: 'proc-5',
    procedureName: 'Molar Root Canal Therapy (RCT)',
    date: getRelativeDate(0),
    time: '16:00',
    duration: 75,
    status: 'confirmed',
    amount: 6500,
    paid: false,
    paymentMethod: 'Star Health Insurance',
    toothNumber: '12',
    notes: 'Persistent irreversible pulpitis on tooth #12.',
    source: 'portal',
    reminderSent: true
  },
  // Tomorrow's appointments
  {
    id: 'apt-106',
    bookingCode: 'DEN-1067',
    patientId: 'pat-6',
    patientName: 'Marcus Sterling',
    patientPhone: '+91 98666 78901',
    patientEmail: 'marcus.s@example.com',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Chen, BDS, MDS',
    chairId: 'chair-1',
    chairName: 'Operatory 1 (Alpha)',
    procedureId: 'proc-1',
    procedureName: 'Comprehensive Oral Exam & 3D Scan',
    date: getRelativeDate(1),
    time: '10:00',
    duration: 30,
    status: 'confirmed',
    amount: 800,
    paid: false,
    paymentMethod: 'UPI (GPay)',
    toothNumber: 'All',
    notes: 'New patient exam and intraoral 3D scan.',
    source: 'portal',
    reminderSent: true
  },
  {
    id: 'apt-107',
    bookingCode: 'DEN-1073',
    patientId: 'pat-1',
    patientName: 'Sophia Montgomery',
    patientPhone: '+91 98191 23456',
    patientEmail: 'sophia.m@example.com',
    doctorId: 'doc-3',
    doctorName: 'Dr. Emily Rodriguez, BDS, MDS',
    chairId: 'chair-4',
    chairName: 'Operatory 4 (Pediatric & Ortho)',
    procedureId: 'proc-9',
    procedureName: 'Clear Aligners (Invisible Braces) Consult',
    date: getRelativeDate(1),
    time: '14:00',
    duration: 45,
    status: 'scheduled',
    amount: 1500,
    paid: false,
    paymentMethod: 'Pending',
    toothNumber: 'Both Arches',
    notes: 'Discuss smile alignment options and treatment timeline.',
    source: 'reception',
    reminderSent: false
  },
  // Day after tomorrow
  {
    id: 'apt-108',
    bookingCode: 'DEN-1089',
    patientId: 'pat-2',
    patientName: 'Alexander Hayes',
    patientPhone: '+91 98202 34567',
    patientEmail: 'alex.hayes@example.com',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Vance, BDS, MDS',
    chairId: 'chair-2',
    chairName: 'Operatory 2 (Surgical)',
    procedureId: 'proc-6',
    procedureName: 'Surgical Wisdom Tooth Extraction',
    date: getRelativeDate(2),
    time: '11:00',
    duration: 60,
    status: 'scheduled',
    amount: 4500,
    paid: false,
    paymentMethod: 'HDFC ERGO',
    toothNumber: '32',
    notes: 'Surgical extraction of partially impacted lower right third molar.',
    source: 'portal',
    reminderSent: false
  },
  // Past appointments
  {
    id: 'apt-109',
    bookingCode: 'DEN-1091',
    patientId: 'pat-3',
    patientName: 'Olivia Bennett',
    patientPhone: '+91 98333 45678',
    patientEmail: 'olivia.b@example.com',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Chen, BDS, MDS',
    chairId: 'chair-1',
    chairName: 'Operatory 1 (Alpha)',
    procedureId: 'proc-4',
    procedureName: 'CAD/CAM Porcelain / Zirconia Crown',
    date: getRelativeDate(-2),
    time: '09:30',
    duration: 90,
    status: 'completed',
    amount: 9500,
    paid: true,
    paymentMethod: 'ICICI Lombard + UPI',
    toothNumber: '19',
    notes: 'Successful monolithic zirconia crown delivery. Fit and occlusion verified.',
    source: 'reception',
    reminderSent: true
  },
  {
    id: 'apt-110',
    bookingCode: 'DEN-1104',
    patientId: 'pat-5',
    patientName: 'Elena Rostova',
    patientPhone: '+91 98555 67890',
    patientEmail: 'elena.rostova@example.com',
    doctorId: 'doc-4',
    doctorName: 'Dr. Liam Patel, BDS, MDS',
    chairId: 'chair-3',
    chairName: 'Operatory 3 (Hygiene)',
    procedureId: 'proc-2',
    procedureName: 'Full Mouth Ultrasonic Scaling & Polish',
    date: getRelativeDate(-5),
    time: '15:00',
    duration: 45,
    status: 'completed',
    amount: 1500,
    paid: true,
    paymentMethod: 'UPI (GPay)',
    toothNumber: 'All',
    notes: 'Deep periodontal maintenance scaling with chlorhexidine rinse.',
    source: 'portal',
    reminderSent: true
  }
];

export const DEFAULT_INVOICES = [
  {
    id: 'inv-3001',
    invoiceNumber: 'INV-2026-081',
    patientId: 'pat-3',
    patientName: 'Olivia Bennett',
    patientPhone: '+91 98333 45678',
    date: getRelativeDate(-2),
    dueDate: getRelativeDate(12),
    items: [
      { code: 'D2740', description: 'CAD/CAM Zirconia Crown (Tooth #19)', quantity: 1, unitPrice: 9500, amount: 9500 },
      { code: 'D0150', description: 'Digital Bite & Occlusion Verification', quantity: 1, unitPrice: 0, amount: 0 }
    ],
    subtotal: 9500,
    discount: 500,
    tax: 0,
    total: 9000,
    insuranceCovered: 5000,
    patientPortion: 4000,
    amountPaid: 9000,
    status: 'paid', // paid, partial, pending, overdue
    paymentMethod: 'ICICI Lombard + UPI'
  },
  {
    id: 'inv-3002',
    invoiceNumber: 'INV-2026-082',
    patientId: 'pat-5',
    patientName: 'Elena Rostova',
    patientPhone: '+91 98555 67890',
    date: getRelativeDate(-5),
    dueDate: getRelativeDate(9),
    items: [
      { code: 'D1110', description: 'Full Mouth Ultrasonic Scaling & Polish', quantity: 1, unitPrice: 1500, amount: 1500 },
      { code: 'D9630', description: 'Chlorhexidine Antimicrobial Rinse', quantity: 1, unitPrice: 300, amount: 300 }
    ],
    subtotal: 1800,
    discount: 0,
    tax: 0,
    total: 1800,
    insuranceCovered: 1000,
    patientPortion: 800,
    amountPaid: 1800,
    status: 'paid',
    paymentMethod: 'UPI (GPay)'
  },
  {
    id: 'inv-3003',
    invoiceNumber: 'INV-2026-083',
    patientId: 'pat-2',
    patientName: 'Alexander Hayes',
    patientPhone: '+91 98202 34567',
    date: getRelativeDate(0),
    dueDate: getRelativeDate(14),
    items: [
      { code: 'D6010', description: 'Titanium Dental Implant Placement (Tooth #19)', quantity: 1, unitPrice: 32000, amount: 32000 },
      { code: 'D7953', description: 'Bone Grafting in Extraction Socket', quantity: 1, unitPrice: 6000, amount: 6000 }
    ],
    subtotal: 38000,
    discount: 2000,
    tax: 0,
    total: 36000,
    insuranceCovered: 20000,
    patientPortion: 16000,
    amountPaid: 10000,
    status: 'partial',
    paymentMethod: 'Advance UPI Deposit'
  }
];

export const DEFAULT_REMINDERS = [
  {
    id: 'rem-1',
    appointmentId: 'apt-101',
    patientName: 'Sophia Montgomery',
    channel: 'WhatsApp',
    phone: '+91 98191 23456',
    type: '24h Confirmation',
    status: 'Delivered & Confirmed',
    timestamp: 'Today, 08:00 AM',
    messageText: 'Namaste Sophia! Reminder from DentPulse Clinic for your Composite Filling appointment today at 09:00 AM with Dr. Sarah Chen. Estimated fee: ₹2,200. Reply YES to confirm.'
  },
  {
    id: 'rem-2',
    appointmentId: 'apt-102',
    patientName: 'Alexander Hayes',
    channel: 'SMS',
    phone: '+91 98202 34567',
    type: 'Pre-Op Surgical Fasting',
    status: 'Delivered',
    timestamp: 'Today, 07:30 AM',
    messageText: 'Hello Alexander, Dr. Marcus Vance expects you for your Implant procedure today at 10:30 AM. Total procedure: ₹32,000. Remember to take prescribed pre-medication 1 hour prior.'
  },
  {
    id: 'rem-3',
    appointmentId: 'apt-103',
    patientName: 'Olivia Bennett',
    channel: 'Email',
    phone: 'olivia.b@example.com',
    type: '2h Urgent Reminder',
    status: 'Sent',
    timestamp: 'Today, 11:00 AM',
    messageText: 'Dear Olivia, Your Laser Teeth Whitening session (₹8,500) is scheduled at 1:00 PM today. Free patient parking is available at the BKC clinic building.'
  }
];

export const CLINIC_INFO = {
  name: 'DentPulse 3D Dental Clinic & Implant Center',
  tagline: 'Modern Digital Dental Excellence & Smart Appointments',
  currency: '₹',
  phone: '+91 98200 54321',
  emergencyPhone: '+91 98200 91100',
  email: 'care@dentpulse3d.in',
  address: 'Suite 402, Signature Towers, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051',
  hours: 'Mon - Sat: 9:00 AM - 8:30 PM | Sun: 10:00 AM - 2:00 PM (Emergency On-Call)',
  rating: 4.96,
  totalPatientsServed: '8,500+'
};

export const DEFAULT_USERS = [
  {
    id: 'user-admin-1',
    email: 'admin@dentpulse3d.com',
    password: 'password',
    name: 'Pooja Kulkarni',
    role: 'admin', // 'admin' | 'doctor' | 'patient'
    phone: '+91 98200 54321',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    title: 'Lead Clinic Receptionist & Practice Admin',
    employeeId: 'ADM-001'
  },
  {
    id: 'user-doc-1',
    email: 'sarah.chen@dentpulse3d.com',
    password: 'password',
    name: 'Dr. Sarah Chen, BDS, MDS',
    role: 'doctor',
    doctorId: 'doc-1',
    phone: '+91 98200 11001',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    title: 'Cosmetic & Restorative Dentist',
    licenseNumber: 'MCI-DEN-99214'
  },
  {
    id: 'user-doc-2',
    email: 'marcus.vance@dentpulse3d.com',
    password: 'password',
    name: 'Dr. Marcus Vance, BDS, MDS',
    role: 'doctor',
    doctorId: 'doc-2',
    phone: '+91 98200 11002',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    title: 'Oral Surgeon & Implantologist',
    licenseNumber: 'MCI-DEN-88741'
  },
  {
    id: 'user-pat-1',
    email: 'sophia.m@example.com',
    password: 'password',
    name: 'Sophia Montgomery',
    role: 'patient',
    patientId: 'pat-1',
    phone: '+91 98191 23456',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    insuranceProvider: 'Star Health Dental Care'
  },
  {
    id: 'user-pat-2',
    email: 'alex.hayes@example.com',
    password: 'password',
    name: 'Alexander Hayes',
    role: 'patient',
    patientId: 'pat-2',
    phone: '+91 98202 34567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    insuranceProvider: 'HDFC ERGO Health'
  }
];

// Storage keys
export const STORAGE_KEYS = {
  APPOINTMENTS: 'dentpulse_appointments',
  PATIENTS: 'dentpulse_patients',
  DOCTORS: 'dentpulse_doctors',
  CHAIRS: 'dentpulse_chairs',
  PROCEDURES: 'dentpulse_procedures',
  INVOICES: 'dentpulse_invoices',
  REMINDERS: 'dentpulse_reminders',
  USERS: 'dentpulse_users',
  CURRENT_USER: 'dentpulse_current_user',
  SETTINGS: 'dentpulse_settings'
};

export const getStoredData = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading localStorage', e);
  }
  return defaultValue;
};

export const saveStoredData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing to localStorage', e);
  }
};

export const initializeStorage = () => {
  const currentVersion = '2.0_inr';
  const savedVersion = localStorage.getItem('dentpulse_version');

  if (savedVersion !== currentVersion) {
    // Automatically migrate to INR pricing
    resetAllDemoData();
    localStorage.setItem('dentpulse_version', currentVersion);
    return;
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    saveStoredData(STORAGE_KEYS.USERS, DEFAULT_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    saveStoredData(STORAGE_KEYS.CURRENT_USER, DEFAULT_USERS[0]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    saveStoredData(STORAGE_KEYS.APPOINTMENTS, DEFAULT_APPOINTMENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    saveStoredData(STORAGE_KEYS.PATIENTS, DEFAULT_PATIENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
    saveStoredData(STORAGE_KEYS.DOCTORS, DEFAULT_DOCTORS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CHAIRS)) {
    saveStoredData(STORAGE_KEYS.CHAIRS, DEFAULT_CHAIRS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROCEDURES)) {
    saveStoredData(STORAGE_KEYS.PROCEDURES, DEFAULT_PROCEDURES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
    saveStoredData(STORAGE_KEYS.INVOICES, DEFAULT_INVOICES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REMINDERS)) {
    saveStoredData(STORAGE_KEYS.REMINDERS, DEFAULT_REMINDERS);
  }
};

export const resetAllDemoData = () => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(DEFAULT_PATIENTS));
  localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(DEFAULT_DOCTORS));
  localStorage.setItem(STORAGE_KEYS.CHAIRS, JSON.stringify(DEFAULT_CHAIRS));
  localStorage.setItem(STORAGE_KEYS.PROCEDURES, JSON.stringify(DEFAULT_PROCEDURES));
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(DEFAULT_INVOICES));
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(DEFAULT_REMINDERS));
};
