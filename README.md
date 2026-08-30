# 🦷 DentPulse 3D - Clinical Dental Appointment & Practice OS

A modern, full-featured web application designed for small-to-medium scale dental clinics to streamline appointment scheduling, operatory chair management, interactive 3D odontograms, electronic health records (EHR), Indian market billing (₹ INR), automated multi-channel reminders, and AI clinical symptom triage.

---

## 🌟 Key Features

* **Multi-Operatory Chairs & Calendar**: Real-time scheduling across 4 operatory chairs with Chairs, Day Timeline, 7-Day Week, and Month overview modes.
* **Interactive Dental Odontogram**: Anatomical 32-tooth adult and 20-tooth pediatric charts for condition mapping, surface selection, and treatment planning.
* **Patient Records (EHR)**: Searchable patient directory, medical risk alerts, allergy badges, and appointment histories.
* **Indian Market Billing (₹ INR)**: Itemized CDT procedure invoicing, UPI/GPay/PhonePe & Indian dental insurance support (Star Health, HDFC ERGO), and printable tax receipts.
* **Automated Reminders**: WhatsApp, SMS, and Email reminder simulators with an interactive live smartphone preview.
* **DentBot AI Clinical Assistant**: Intelligent emergency triage, automated chair assignment, and customized post-op care sheet generator.
* **Patient Self-Booking Portal**: 3-step online booking wizard with pain/anxiety indicators and instant digital clinic pass with confetti celebrations.
* **Multi-Role Authentication**: Seamless login and registration for **Patients**, **Specialist Doctors (BDS, MDS)**, and **Clinic Reception/Admins** with 1-click instant demo switchers.
* **Mobile-First UX**: Dedicated mobile app bottom navigation bar (`< 768px`), touch-optimized tooth charts, and responsive modal bottom sheets.
* **Interactive 3D Background**: Real-time Three.js dental molar model with titanium/enamel shaders and particle animations.

---

## 🛠️ Technology Stack & Dependencies

* **Frontend**: React 19 (`react`, `react-dom`)
* **Build Tooling & Bundler**: Vite 8 (`vite`, `@vitejs/plugin-react`)
* **3D Graphics Engine**: Three.js (`three`)
* **Iconography**: Lucide React (`lucide-react`)
* **Celebration Effects**: Canvas Confetti (`canvas-confetti`)
* **Styling**: Vanilla CSS Design System with luxury Smokey Grey, White & Black themes and full mobile media queries.

See [`requirements.txt`](./requirements.txt) and [`package.json`](./package.json) for exact version specifications.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
Preview the production bundle:
```bash
npm run preview
```

