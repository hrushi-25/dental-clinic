import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastNotification({ notification, onClose }) {
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-green" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-amber" />;
      default:
        return <Info size={18} className="text-cyan" />;
    }
  };

  return (
    <div className={`global-toast-container ${notification.type || 'info'} animate-slide-up`}>
      <div className="toast-icon-wrap">
        {getIcon()}
      </div>
      <div className="toast-content-wrap">
        <strong className="toast-title">{notification.title || 'Notification'}</strong>
        <p className="toast-message">{notification.message}</p>
      </div>
      <button type="button" className="toast-close-btn" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}
