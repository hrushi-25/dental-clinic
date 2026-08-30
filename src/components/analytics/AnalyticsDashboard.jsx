import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Award,
  Sparkles,
  PieChart
} from 'lucide-react';
import { CLINIC_INFO } from '../../data/mockDentalData';

export default function AnalyticsDashboard({
  appointments,
  patients,
  doctors,
  chairs,
  procedures,
  invoices
}) {
  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalApts = appointments.length;
    const completedApts = appointments.filter(a => a.status === 'completed').length;
    const inChairApts = appointments.filter(a => a.status === 'in-chair').length;
    const confirmedApts = appointments.filter(a => a.status === 'confirmed').length;
    const cancelledApts = appointments.filter(a => a.status === 'cancelled' || a.status === 'no-show').length;

    const totalRevenue = appointments.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
    const avgTicket = totalApts > 0 ? Math.round(totalRevenue / totalApts) : 0;
    const completionRate = totalApts > 0 ? Math.round((completedApts / totalApts) * 100) : 0;
    const noShowRate = totalApts > 0 ? Math.round((cancelledApts / totalApts) * 100) : 0;

    // Chair Occupancy
    const chairStats = chairs.map(c => {
      const chairApts = appointments.filter(a => a.chairId === c.id);
      const totalMinutes = chairApts.reduce((sum, a) => sum + (Number(a.duration) || 30), 0);
      const maxDailyMinutes = 480; // 8 hours working day
      const occupancyRate = Math.min(100, Math.round((totalMinutes / maxDailyMinutes) * 100));
      return {
        ...c,
        appointmentsCount: chairApts.length,
        occupancyRate
      };
    });

    // Top Procedures Breakdown
    const procMap = {};
    appointments.forEach(a => {
      const name = a.procedureName || 'General Procedure';
      if (!procMap[name]) {
        procMap[name] = { count: 0, revenue: 0 };
      }
      procMap[name].count += 1;
      procMap[name].revenue += Number(a.amount) || 0;
    });

    const topProcedures = Object.entries(procMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Doctor workload
    const doctorStats = doctors.map(d => {
      const docApts = appointments.filter(a => a.doctorId === d.id);
      const docRev = docApts.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
      return {
        ...d,
        count: docApts.length,
        revenue: docRev
      };
    });

    return {
      totalApts,
      completedApts,
      inChairApts,
      confirmedApts,
      cancelledApts,
      totalRevenue,
      avgTicket,
      completionRate,
      noShowRate,
      chairStats,
      topProcedures,
      doctorStats
    };
  }, [appointments, chairs, doctors, invoices]);

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header-row">
        <div>
          <h2>Clinic Analytics</h2>
          <p className="subtitle">
            Chair utilization, revenue flow, and provider productivity.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-cards-grid">
        <div className="kpi-card glass-card">
          <div className="kpi-icon-wrap cyan">
            <Calendar size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Appointments</span>
            <span className="kpi-value">{metrics.totalApts}</span>
            <span className="kpi-badge positive">↑ 14% this month</span>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon-wrap green">
            <span style={{ fontSize: '22px', fontWeight: '800' }}>₹</span>
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Revenue</span>
            <span className="kpi-value">₹{metrics.totalRevenue.toLocaleString('en-IN')}</span>
            <span className="kpi-badge positive">Avg ticket: ₹{metrics.avgTicket.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon-wrap purple">
            <Activity size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Chair Utilization</span>
            <span className="kpi-value">
              {Math.round(metrics.chairStats.reduce((s, c) => s + c.occupancyRate, 0) / (metrics.chairStats.length || 1))}%
            </span>
            <span className="kpi-badge positive">4 Chairs Active</span>
          </div>
        </div>

        <div className="kpi-card glass-card">
          <div className="kpi-icon-wrap amber">
            <Users size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Patients</span>
            <span className="kpi-value">{patients.length}</span>
            <span className="kpi-badge neutral">98.5% Satisfaction</span>
          </div>
        </div>
      </div>

      {/* Analytics Main Visual Grid */}
      <div className="analytics-visual-grid">
        
        {/* Operatory Chairs Utilization Breakdown */}
        <div className="analytics-card glass-card">
          <div className="card-header-line">
            <h3>Operatory Chair Capacity & Utilization</h3>
            <span className="badge-pill">Daily Efficiency</span>
          </div>
          <div className="chair-bars-list">
            {metrics.chairStats.map(chair => (
              <div key={chair.id} className="chair-stat-item">
                <div className="chair-stat-title-row">
                  <div>
                    <strong>{chair.name}</strong>
                    <span className="text-xs text-muted block">{chair.type}</span>
                  </div>
                  <div className="chair-rate-tag">
                    <span className="rate-num">{chair.occupancyRate}%</span>
                    <span className="text-xs text-muted">({chair.appointmentsCount} bookings)</span>
                  </div>
                </div>
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${chair.occupancyRate}%`,
                      backgroundColor: chair.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Procedures by Revenue Contribution */}
        <div className="analytics-card glass-card">
          <div className="card-header-line">
            <h3>Top Clinical Treatments by Revenue (₹)</h3>
            <span className="badge-pill">Procedure Mix</span>
          </div>
          <div className="proc-bars-list">
            {metrics.topProcedures.map((proc, idx) => (
              <div key={idx} className="proc-stat-item">
                <div className="proc-name-row">
                  <span className="proc-rank">#{idx + 1}</span>
                  <span className="proc-title">{proc.name}</span>
                  <span className="proc-rev text-cyan font-bold">₹{Number(proc.revenue || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="proc-count-line text-xs text-muted">
                  {proc.count} patient session(s)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialist Doctor Productivity */}
        <div className="analytics-card glass-card full-width">
          <div className="card-header-line">
            <h3>Specialist Doctor Case Distribution & Production (₹)</h3>
            <span className="badge-pill">Medical Staff</span>
          </div>
          <div className="doctors-metrics-grid">
            {metrics.doctorStats.map(doc => (
              <div key={doc.id} className="doc-metric-item">
                <div className="doc-avatar-wrap" style={{ borderColor: doc.color }}>
                  <img src={doc.avatar} alt={doc.name} className="doc-mini-img" />
                </div>
                <div className="doc-text-meta">
                  <h4>{doc.name}</h4>
                  <span className="text-xs text-muted">{doc.specialty}</span>
                  <div className="doc-num-stats">
                    <span><strong>{doc.count}</strong> Cases</span>
                    <span><strong>₹{Number(doc.revenue || 0).toLocaleString('en-IN')}</strong> Production</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
