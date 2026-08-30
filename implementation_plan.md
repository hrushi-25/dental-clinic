# Implementation Plan - DentPulse 3D (Dental Clinic Appointment & Practice Management System)

Build an advanced, visually stunning, high-performance React web application for small-scale dental clinics. The application features an interactive 3D background, multi-chair/doctor appointment calendar, interactive adult/pediatric dental chart (odontogram), patient CRM, billing generator, automated reminder simulations, AI dental assistant, and a patient-facing self-booking portal.

## User Review Required

> [!IMPORTANT]
> The app is built with **React + Vite** and **Vanilla CSS (modern CSS design system with glassmorphism & dark/light themes)**, leveraging **Three.js** for interactive 3D dental clinic particle & tooth visualization. All data persists to `localStorage` with rich pre-loaded realistic clinic data.

## Key Features & Architecture

1. **3D Visual Experience (Three.js)**:
   - Interactive 3D floating dental tooth model & organic particle wave network with mouse-tracking parallax, glow shaders, dynamic lighting, and orbital controls.
   - Toggleable 3D visual effects & performance optimization mode.

2. **Clinic Staff & Doctor Management Dashboard**:
   - **Smart Appointment Calendar**: Day, Week, and Month views with chair/operatory filtering (Operatory 1, Operatory 2, Hygiene Suite), doctor filtering, color-coded procedure tags, and quick status changes (Scheduled, Confirmed, In Chair, Completed, Cancelled, No-show).
   - **Interactive Dental Chart (Visual Odontogram)**: 32 Adult teeth & 20 Pediatric teeth interactive visual diagram. Click teeth and surfaces (occlusal, buccal, lingual, mesial, distal) to flag conditions (Caries, Missing, Crown, Root Canal, Implant, Filling) and automatically generate treatment plan line items for appointments.
   - **Patient Records & CRM**: Complete patient profiles with medical risk badges (Penicillin allergy, Hypertension, Diabetic, Anticoagulant), visit history, upcoming appointments, custom clinical notes, and treatment histories.
   - **Billing & Invoice Generator**: Instant itemized dental bill generation from procedures/odontogram with printable invoice modal, discount calculations, and payment tracking (Paid, Partial, Pending).
   - **Automated Patient Reminders**: Simulated WhatsApp, SMS, and Email notification dispatcher with customized reminder templates for 24h prior, 2h prior, and post-op care follow-up.
   - **AI Clinic Assistant (DentBot)**: Smart slot finder, automated dental emergency triage advice, symptom-to-procedure mapper, and instant post-procedure care instruction generator.
   - **Analytics & Practice Health**: Chair occupancy rate, daily/monthly revenue metrics, appointment completion rate, no-show rate, top treatments breakdown.

3. **Patient Self-Booking Portal (Public Facing)**:
   - Dedicated patient-friendly booking wizard (Choose Treatment & Specialist -> Select Date & Intelligent Available Time Slot -> Patient Info & Symptoms -> Instant Confirmation with unique Booking Code).
   - Smart Symptom Triage helper to recommend appropriate urgency and appointment type.
   - "My Appointment" lookup with booking code to check status or request cancellation/reschedule.

4. **Design System & Aesthetics**:
   - Modern medical palette: Ocean Teal (`#0EA5E9`, `#0D9488`), Electric Cyan (`#06B6D4`), Deep Slate Navy (`#0B132B`, `#0F172A`), Rose Accent for medical alerts (`#F43F5E`), and Emerald for confirmed appointments (`#10B981`).
   - Glassmorphism surfaces (`backdrop-filter: blur(16px)`), luminous borders, micro-interactions, responsive mobile/tablet/desktop layouts, and dark/light mode toggle.

---

## Proposed Changes

### Project Scaffolding & Dependencies
- Initialize React project using Vite in `c:/Users/Admin/Desktop/Dental`.
- Install dependencies: `three`, `lucide-react`, `canvas-confetti`.

### Core Application Files

#### [NEW] [src/components/3d/DentalCanvas3D.jsx](file:///c:/Users/Admin/Desktop/Dental/src/components/3d/DentalCanvas3D.jsx)
- Three.js interactive canvas rendering a stylized 3D tooth geometry with anatomical curves, glowing particle field, ambient dental clinic lighting, and responsive mouse parallax.

#### [NEW] [src/components/odontogram/DentalChart.jsx](file:///c:/Users/Admin/Desktop/Dental/src/components/odontogram/DentalChart.jsx)
- Interactive Adult (Universal Numbering System 1-32) & Pediatric (A-T) dental chart.
- Tooth surface selector (Buccal, Lingual, Mesial, Distal, Occlusal).
- Condition tagging (Healthy, Cavity/Caries, Filled, Root Canal, Crown, Veneer, Extracted/Missing, Implant) with visual color rendering.
- Quick export to appointment treatment plan.

#### [NEW] [src/components/calendar/AppointmentCalendar.jsx](file:///c:/Users/Admin/Desktop/Dental/src/components/calendar/AppointmentCalendar.jsx)
- Day, Week, Month, and Operatory Chair views.
- Filter by doctor, operatory chair, and appointment status.
- Add, edit, reschedule, and cancel appointment actions.

#### [NEW] [src/components/appointments/AppointmentModal.jsx](file:///c:/Users/Admin/Desktop/Dental/src/components/appointments/AppointmentModal.jsx)
- Modal for creating or editing appointments with patient autocomplete, chair selection, procedure picker with pre-filled duration & price, and notes.

#### [NEW] [src/components/patients/PatientCRM.jsx](file:///c:/Users/Admin/Desktop/Dental/src/components/patients/PatientCRM.jsx)
- Searchable patient list, new patient registration, medical alert tags, full treatment history, attached odontograms, and contact links.

#### [NEW] [src/components/billing/BillingInvoices.jsx](file:///c:/Users/Admin/Desktop/Dental/src/components/billing/BillingInvoices.jsx)
- Itemized billing management, invoice generation, tax & discount calculation, printable receipt modal.

#### [NEW] [src/components/ai/DentalAIAssistant.jsx](file:///c:/Users/Admin/Desktop/Dental/src/components/ai/DentalAIAssistant.jsx)
- Interactive AI Triage & Clinic Assistant for slot optimization, symptom analysis, emergency triage, and post-op care instruction generation.

#### [NEW] [src/components/portal/PatientBookingPortal.jsx](file:///c:/Users/Admin/Desktop/Dental/src/components/portal/PatientBookingPortal.jsx)
- Patient self-service booking flow, symptom triage assistant, booking confirmation card with confetti and printable pass, and appointment status tracker.

#### [NEW] [src/components/reminders/ReminderCenter.jsx](file:///c:/Users/Admin/Desktop/Dental/src/components/reminders/ReminderCenter.jsx)
- Automated appointment reminder dispatch simulation (WhatsApp, SMS, Email preview), customizable templates, and delivery logs.

#### [NEW] [src/components/analytics/AnalyticsDashboard.jsx](file:///c:/Users/Admin/Desktop/Dental/src/components/analytics/AnalyticsDashboard.jsx)
- Visual metrics for chair utilization, daily/weekly revenue, appointment status distribution, and top procedures.

#### [NEW] [src/data/mockDentalData.js](file:///c:/Users/Admin/Desktop/Dental/src/data/mockDentalData.js)
- Rich pre-populated dataset: procedures with CDT codes, chairs, doctors with specialties, comprehensive patient list with past and future visits, and default clinic settings.

#### [NEW] [src/styles/index.css](file:///c:/Users/Admin/Desktop/Dental/src/styles/index.css)
- Design tokens (variables for dark & light themes, spacing, typography, gradients, glassmorphism, animations, odontogram styling, and responsive breakpoints).

---

## Verification Plan

### Automated Tests / Build
- Run `npm run build` to verify there are no JSX, Vite, or bundling errors.

### Browser Testing & Visual Verification
- Use `browser_subagent` to open the local development server `http://localhost:5173`.
- Test 3D canvas rendering and interactivity.
- Test switching between Clinic Staff Hub and Patient Self-Booking Portal.
- Test booking an appointment from the patient portal and verifying it appears in the Doctor/Staff calendar.
- Test the interactive Dental Chart (Odontogram) by marking teeth and creating a treatment plan.
- Test the billing invoice generation and printable view.
- Test theme toggling (Dark/Light mode) and responsive view.
