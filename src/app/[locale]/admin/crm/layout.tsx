import React from 'react';
import type { Metadata } from 'next';
import { CrmProvider } from '@/components/crm/CrmContext';
import { CrmHeader } from '@/components/crm/layout/CrmHeader';
import { CrmNavigation } from '@/components/crm/layout/CrmNavigation';
import { CreateContactModal } from '@/components/crm/modals/CreateContactModal';
import { CreateDealModal } from '@/components/crm/modals/CreateDealModal';
import { LostReasonModal } from '@/components/crm/modals/LostReasonModal';
import { WonCelebrationModal } from '@/components/crm/modals/WonCelebrationModal';
import { OttyHelpModal } from '@/components/crm/modals/OttyHelpModal';
import { LoginModal } from '@/components/crm/modals/LoginModal';

export const metadata: Metadata = {
  title: 'نظام المبيعات الداخلي (Sales CRM) | OTECH Amman',
  description: 'نظام إدارة خط المبيعات والصفقات وجهات الاتصال الداخلي لشركة OTECH في عمّان، الأردن.',
};

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <CrmProvider>
      <div className="min-h-screen bg-otech-dark-950 text-white flex flex-col font-tajawal">
        {/* CRM Top Header */}
        <CrmHeader />

        {/* CRM Subnavigation Bar */}
        <CrmNavigation />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Global CRM Modals */}
        <CreateContactModal />
        <CreateDealModal />
        <LostReasonModal />
        <WonCelebrationModal />
        <OttyHelpModal />
        <LoginModal />
      </div>
    </CrmProvider>
  );
}