import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface CrmBreadcrumbProps {
  currentTitle: string;
}

export const CrmBreadcrumb: React.FC<CrmBreadcrumbProps> = ({ currentTitle }) => {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
      <Link href="/admin/crm" className="hover:text-otech-cyan-400 transition">
        نظام المبيعات
      </Link>
      <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180 text-slate-600" />
      <span className="text-white font-medium">{currentTitle}</span>
    </div>
  );
};
