'use client';

import React from 'react';
import { CrmBreadcrumb } from '@/components/crm/layout/CrmBreadcrumb';
import { ContactsTable } from '@/components/crm/contacts/ContactsTable';
import { ContactDrawer } from '@/components/crm/contacts/ContactDrawer';

export default function CrmContactsPage() {
  return (
    <div className="space-y-4 animate-fadeIn">
      <CrmBreadcrumb currentTitle="إدارة جهات الاتصال" />
      <ContactsTable />
      <ContactDrawer />
    </div>
  );
}
