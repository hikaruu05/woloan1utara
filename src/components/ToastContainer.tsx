import React from 'react';
import { useData } from '../context/DataContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-warm-lg border bg-white/95 backdrop-blur-md transition-all duration-300 transform translate-y-0"
          style={{
            borderColor:
              toast.type === 'success' ? '#277D55' : toast.type === 'error' ? '#C25E3E' : '#BA8D52'
          }}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-forest-600" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-wood-600" />}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-warm-900">{toast.title}</h4>
            <p className="text-xs text-warm-700 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-warm-400 hover:text-warm-700 p-1 transition-colors"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
