import React from 'react';
import Image from 'next/image';

export interface OttyEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const OttyEmptyState: React.FC<OttyEmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`glass-card rounded-2xl p-8 sm:p-12 border border-otech-dark-700 text-center max-w-lg mx-auto ${className}`}
    >
      <div className="relative w-24 h-24 mx-auto mb-4">
        <Image
          src="/otty.png"
          alt="OTTY Mascot"
          width={96}
          height={96}
          className="rounded-2xl border-2 border-otech-cyan-400/40 p-1.5 shadow-glow-cyan bg-otech-dark-850 object-cover"
        />
      </div>
      <h4 className="text-lg font-heading font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-400 hover:from-otech-cyan-300 hover:to-otech-blue-300 rounded-xl shadow-glow-cyan transition duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
