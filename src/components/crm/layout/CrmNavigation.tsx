'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCrm } from '../CrmContext';
import { LayoutDashboard, Users, Kanban, History } from 'lucide-react';

export const CrmNavigation: React.FC = () => {
  const pathname = usePathname();
  const { stats, activities } = useCrm();

  // Helper to check active route
  const isActive = (path: string) => {
    if (path === '/admin/crm') {
      return pathname.endsWith('/admin/crm') || pathname.endsWith('/admin/crm/');
    }
    return pathname.includes(path);
  };

  const navItems = [
    {
      label: 'نظرة عامة والمؤشرات',
      href: '/admin/crm',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: null,
    },
    {
      label: 'جهات الاتصال',
      href: '/admin/crm/contacts',
      icon: <Users className="w-4 h-4" />,
      badge: stats.totalContacts,
    },
    {
      label: 'مسار الصفقات (كانبان)',
      href: '/admin/crm/deals',
      icon: <Kanban className="w-4 h-4" />,
      badge: `${stats.pipelineValue.toLocaleString()} د.أ`,
    },
    {
      label: 'سجل التفاعلات والأنشطة',
      href: '/admin/crm/activities',
      icon: <History className="w-4 h-4" />,
      badge: activities.length,
    },
  ];

  return (
    <nav className="bg-otech-dark-950/80 border-b border-otech-dark-700/80 sticky top-16 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-3 rtl:space-x-reverse overflow-x-auto py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                  active
                    ? 'bg-otech-blue-500/20 text-otech-cyan-400 border border-otech-cyan-400/40 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-otech-dark-850'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      active
                        ? 'bg-otech-cyan-400/20 text-otech-cyan-300'
                        : 'bg-otech-dark-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
