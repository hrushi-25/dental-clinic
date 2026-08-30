import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Activity, 
  Users, 
  DollarSign, 
  BellRing, 
  Bot, 
  TrendingUp, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Layers, 
  User, 
  ShieldCheck, 
  Stethoscope, 
  LogOut, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  CalendarCheck
} from 'lucide-react';
import { CLINIC_INFO, DEFAULT_USERS } from '../../data/mockDentalData';

export default function Navbar({
  activeTab,
  onTabChange,
  currentUser,
  onOpenAuth,
  onLogout,
  onQuickSwitchUser,
  theme,
  onToggleTheme,
  threeDMode,
  onToggleThreeDMode,
  soundEnabled,
  onToggleSound,
  appointmentsCount
}) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Define tabs based on role
  const getTabsForRole = () => {
    if (!currentUser) return [];

    if (currentUser.role === 'admin') {
      return [
        { id: 'calendar', label: 'Calendar', icon: Calendar, badge: appointmentsCount },
        { id: 'chart', label: 'Dental Chart', icon: Activity },
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'billing', label: 'Billing', icon: DollarSign },
        { id: 'reminders', label: 'Reminders', icon: BellRing },
        { id: 'ai', label: 'AI Assistant', icon: Bot },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp }
      ];
    } else if (currentUser.role === 'doctor') {
      return [
        { id: 'calendar', label: 'My Schedule', icon: Calendar, badge: appointmentsCount },
        { id: 'chart', label: 'Dental Charts', icon: Activity },
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'ai', label: 'AI Assistant', icon: Bot },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp }
      ];
    } else {
      // Patient tabs
      return [
        { id: 'patient-book', label: 'Book Visit', icon: CalendarCheck },
        { id: 'patient-my-apts', label: 'My Visits', icon: Calendar },
        { id: 'patient-my-chart', label: 'Dental Chart', icon: Activity },
        { id: 'patient-track', label: 'Track Booking', icon: BookOpen },
        { id: 'ai', label: 'AI Triage', icon: Bot }
      ];
    }
  };

  const currentTabs = getTabsForRole();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="user-role-tag admin"><ShieldCheck size={11} /> Admin</span>;
      case 'doctor':
        return <span className="user-role-tag doctor"><Stethoscope size={11} /> Doctor</span>;
      default:
        return <span className="user-role-tag patient"><User size={11} /> Patient</span>;
    }
  };

  return (
    <header className="main-navbar-header glass-card">
      <div className="navbar-container">
        
        {/* Brand Logo & Tagline */}
        <div className="brand-logo-area">
          <div className="brand-icon-mesh">
            <span className="brand-tooth-emoji">🦷</span>
          </div>
          <div>
            <div className="brand-title-line">
              <span className="brand-title-main">DentPulse</span>
            </div>
            <p className="brand-subtext">Dental Practice OS</p>
          </div>
        </div>

        {/* Dynamic Role-Based Navigation Tabs */}
        <nav className="staff-navigation-nav">
          {currentTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-tab-link ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="nav-badge-num">{tab.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: User Profile & Utility Toggles */}
        <div className="navbar-controls-cluster">
          
          {/* User Profile Pill & Dropdown */}
          <div className="user-profile-wrapper" ref={dropdownRef}>
            {currentUser ? (
              <button
                type="button"
                className="user-profile-chip-btn"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                title="View account details & switch profile"
              >
                <div className="user-chip-avatar">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar-img" />
                  ) : (
                    <span>{currentUser.name?.charAt(0)}</span>
                  )}
                </div>

                <div className="user-chip-text">
                  <span className="user-chip-name">{currentUser.name}</span>
                  <div className="user-chip-role-line">
                    {getRoleBadge(currentUser.role)}
                  </div>
                </div>

                <ChevronDown size={14} className={`user-chip-arrow ${isProfileDropdownOpen ? 'open' : ''}`} />
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={onOpenAuth}
              >
                <User size={14} />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && currentUser && (
              <div className="user-profile-dropdown glass-card animate-slide-up">
                
                {/* User Summary Header */}
                <div className="dropdown-user-header">
                  <div className="dropdown-user-avatar">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar-img" />
                    ) : (
                      <span>{currentUser.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <strong className="dropdown-user-name">{currentUser.name}</strong>
                    <span className="dropdown-user-email">{currentUser.email}</span>
                    <span className="dropdown-user-title">{currentUser.title || currentUser.role?.toUpperCase()}</span>
                  </div>
                </div>

                <div className="dropdown-divider" />

                {/* Quick Account Switcher for Pair Testing */}
                <div className="dropdown-switch-section">
                  <span className="dropdown-section-title">Quick Switch Active Account:</span>
                  <div className="dropdown-switch-list">
                    {DEFAULT_USERS.map(u => {
                      const isCurrent = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          className={`switch-user-item ${isCurrent ? 'active' : ''}`}
                          onClick={() => {
                            onQuickSwitchUser(u);
                            setIsProfileDropdownOpen(false);
                          }}
                        >
                          <div className="switch-avatar">
                            {u.name.charAt(0)}
                          </div>
                          <div className="switch-text">
                            <span className="switch-name">{u.name}</span>
                            <span className="switch-role">{u.role?.toUpperCase()}</span>
                          </div>
                          {isCurrent && <CheckCircle2 size={14} className="switch-check" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="dropdown-divider" />

                {/* Actions: Sign In / Register Other Account & Logout */}
                <div className="dropdown-actions-footer">
                  <button
                    type="button"
                    className="dropdown-action-btn"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenAuth();
                    }}
                  >
                    <User size={14} />
                    <span>Login with Different Account</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-action-btn text-red"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* 3D Visual Effects Toggle */}
          <button
            type="button"
            className={`tool-icon-btn ${threeDMode !== 'off' ? 'active' : ''}`}
            onClick={onToggleThreeDMode}
            title={`3D Background: ${threeDMode.toUpperCase()} (Click to toggle)`}
          >
            <Layers size={16} />
            <span className="tool-btn-text">3D {threeDMode === 'off' ? 'Off' : 'FX'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            className="tool-icon-btn"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Interface Sounds' : 'Enable Interface Sounds'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-muted" />}
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            type="button"
            className="tool-icon-btn theme-toggle-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

        </div>

      </div>
    </header>
  );
}
