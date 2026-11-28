'use client';

import React, { useState, useMemo } from 'react';
import { useCrm } from '../CrmContext';
import { StatusBadge } from '../shared/StatusBadge';
import { SourceBadge } from '../shared/SourceBadge';
import { OttyEmptyState } from '../shared/OttyEmptyState';
import {
  Search,
  Filter,
  Phone,
  MessageCircle,
  Eye,
  Download,
  Plus,
  Building,
  UserCheck,
} from 'lucide-react';
import type { LeadStatus, LeadSource, Contact } from '@/lib/crm/types';

export const ContactsTable: React.FC = () => {
  const { contacts, openDrawer, setIsAddContactOpen } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.full_name.toLowerCase().includes(q) ||
        (c.company_name && c.company_name.toLowerCase().includes(q)) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || c.lead_status === statusFilter;
      const matchesSource = sourceFilter === 'all' || c.lead_source === sourceFilter;
      const matchesCity = cityFilter === 'all' || c.city === cityFilter;

      return matchesSearch && matchesStatus && matchesSource && matchesCity;
    });
  }, [contacts, searchQuery, statusFilter, sourceFilter, cityFilter]);

  // Export CSV helper
  const handleExportCsv = () => {
    const headers = ['الاسم', 'الشركة', 'الهاتف', 'البريد', 'المدينة', 'المصدر', 'الحالة'];
    const rows = filteredContacts.map((c) => [
      c.full_name,
      c.company_name || '',
      c.phone,
      c.email || '',
      c.city || '',
      c.lead_source,
      c.lead_status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,﻿' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `otech_crm_contacts_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-otech-dark-700 flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، الهاتف، الشركة، البريد..."
            className="w-full ps-10 pe-4 py-2 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-xs focus:border-otech-cyan-400 focus:outline-none transition placeholder:text-slate-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-xs focus:border-otech-cyan-400 focus:outline-none transition"
          >
            <option value="all">كل الحالات (All)</option>
            <option value="new">جديد (New)</option>
            <option value="contacted">تم التواصل (Contacted)</option>
            <option value="qualified">مؤهل (Qualified)</option>
            <option value="unqualified">غير مؤهل (Unqualified)</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-xs focus:border-otech-cyan-400 focus:outline-none transition"
          >
            <option value="all">كل المصادر (All)</option>
            <option value="website">موقع OTECH</option>
            <option value="whatsapp">وتساب</option>
            <option value="phone">اتصال مباشر</option>
            <option value="referral">معارف وترشيح</option>
            <option value="ads">حملة إعلانية</option>
            <option value="other">أخرى</option>
          </select>

          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-xs focus:border-otech-cyan-400 focus:outline-none transition"
          >
            <option value="all">كل المدن</option>
            <option value="عمّان">عمّان</option>
            <option value="إربد">إربد</option>
            <option value="الزرقاء">الزرقاء</option>
            <option value="العقبة">العقبة</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            title="تصدير النتائج إلى CSV"
            className="p-2 text-slate-400 hover:text-white bg-otech-dark-850 hover:bg-otech-dark-800 border border-otech-dark-700 rounded-xl transition"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contacts Table or OTTY Empty State */}
      {filteredContacts.length === 0 ? (
        <OttyEmptyState
          title={
            searchQuery
              ? 'لم نتمكن من العثور على أي جهة اتصال تطابق بحثك'
              : 'لا توجد جهات اتصال مسجلة بعد'
          }
          description={
            searchQuery
              ? `لا توجد نتائج مطابقة لـ '${searchQuery}'. يمكنك إضافة عميل جديد بهذا الاسم أو تعديل معايير الفلترة.`
              : 'ابدأ ببناء قاعدة عملائك عبر إضافة جهة اتصال جديدة الآن.'
          }
          actionLabel="+ إضافة جهة اتصال جديدة"
          onAction={() => setIsAddContactOpen(true)}
        />
      ) : (
        <div className="glass-card rounded-2xl border border-otech-dark-700 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-otech-dark-950/80 text-slate-400 uppercase text-[11px] font-bold border-b border-otech-dark-700">
                <tr>
                  <th className="py-3.5 px-4 text-start">العميل والشركة</th>
                  <th className="py-3.5 px-4 text-start">الهاتف والوتساب</th>
                  <th className="py-3.5 px-4 text-start">المدينة</th>
                  <th className="py-3.5 px-4 text-start">المصدر</th>
                  <th className="py-3.5 px-4 text-start">الحالة</th>
                  <th className="py-3.5 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-otech-dark-800">
                {filteredContacts.map((contact) => {
                  const rawPhone = contact.phone.replace(/[^0-9]/g, '');
                  const waLink = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
                    `مرحباً ${contact.full_name}، نتواصل معك من شركة OTECH للحلول البرمجية والذكاء الاصطناعي.`
                  )}`;

                  return (
                    <tr
                      key={contact.id}
                      onClick={() => openDrawer(contact)}
                      className="hover:bg-otech-dark-850/60 transition cursor-pointer group"
                    >
                      {/* Name & Company */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-otech-blue-500/20 text-otech-cyan-400 border border-otech-cyan-400/30 flex items-center justify-center font-bold text-xs">
                            {contact.full_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-heading font-bold text-white group-hover:text-otech-cyan-400 transition">
                              {contact.full_name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {contact.company_name || 'جهة اتصال مستقلة'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Direct Links */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <span dir="ltr" className="font-mono text-slate-300 font-medium">
                            {contact.phone}
                          </span>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="محادثة وتساب سريعة"
                            className="p-1 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <a
                            href={`tel:${contact.phone}`}
                            title="اتصال هاتفي مباشر"
                            className="p-1 rounded-lg text-otech-cyan-400 hover:bg-otech-cyan-500/20 transition"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </td>

                      {/* City */}
                      <td className="py-3 px-4 text-slate-300">
                        {contact.city || 'عمّان'}
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4">
                        <SourceBadge source={contact.lead_source} />
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <StatusBadge status={contact.lead_status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openDrawer(contact)}
                          className="px-2.5 py-1 text-xs font-semibold text-otech-cyan-400 bg-otech-blue-500/15 hover:bg-otech-blue-500/25 border border-otech-cyan-400/30 rounded-lg transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>عرض 360°</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          <div className="px-4 py-3 bg-otech-dark-950/80 border-t border-otech-dark-700 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>
              عرض {filteredContacts.length} من أصل {contacts.length} عميل مسجل
            </span>
            <span className="text-otech-cyan-400">OTECH Jordanian Native Directory</span>
          </div>
        </div>
      )}
    </div>
  );
};
