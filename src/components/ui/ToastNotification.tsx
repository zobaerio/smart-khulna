import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ToastNotification = ({ message, onClose, duration = 5000 }: { message: string; onClose: () => void; duration?: number }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-20 right-4 z-[1000] bg-red-600 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-4 duration-300">
      <AlertTriangle className="animate-pulse" size={24} />
      <div>
        <h4 className="font-bold text-sm">Weather Alert</h4>
        <p className="text-xs">{message}</p>
      </div>
      <button onClick={onClose} className="ml-2 hover:bg-red-700 rounded-full p-1"><X size={16} /></button>
    </div>
  );
};
