'use client';

import React from 'react';
import { CrmBreadcrumb } from '@/components/crm/layout/CrmBreadcrumb';
import { ActivityComposer } from '@/components/crm/activities/ActivityComposer';
import { ActivityTimeline } from '@/components/crm/activities/ActivityTimeline';

export default function CrmActivitiesPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <CrmBreadcrumb currentTitle="سجل التفاعلات والأنشطة" />
      <ActivityComposer />
      <ActivityTimeline />
    </div>
  );
}
