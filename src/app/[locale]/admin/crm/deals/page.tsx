'use client';

import React from 'react';
import { CrmBreadcrumb } from '@/components/crm/layout/CrmBreadcrumb';
import { KanbanBoard } from '@/components/crm/deals/KanbanBoard';

export default function CrmDealsPage() {
  return (
    <div className="space-y-4 animate-fadeIn">
      <CrmBreadcrumb currentTitle="مسار الصفقات (كانبان)" />
      <KanbanBoard />
    </div>
  );
}
