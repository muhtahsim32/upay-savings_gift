import React, { useState } from 'react';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';

export const PrototypeDisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="font-medium">
            <span className="font-semibold text-amber-950 uppercase tracking-wider text-[11px] mr-1.5">
              Prototype Notice:
            </span>
            This is a frontend prototype concept for educational and demonstration purposes. It is
            <span className="font-semibold text-amber-950"> NOT an official upay product</span> and does not process real banking, payments, or KYC data.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-800 hover:text-amber-950 p-1 shrink-0 rounded transition-colors"
          title="Dismiss notice"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
