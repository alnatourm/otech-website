'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type {
  Contact,
  Deal,
  Activity,
  DealStage,
  LeadStatus,
  LeadSource,
  ActivityType,
  CreateContactInput,
  CreateDealInput,
  LogActivityInput,
} from '@/lib/crm/types';
import * as crmActions from '@/lib/actions/crm';

export interface ExtendedDeal extends Deal {
  company_name?: string;
  contact_name?: string;
  urgent?: boolean;
}

export interface ExtendedActivity extends Activity {
  contact_name?: string;
  created_by_name?: string;
}

interface CrmContextType {
  contacts: Contact[];
  deals: ExtendedDeal[];
  activities: ExtendedActivity[];
  isLoading: boolean;

  // KPIs
  stats: {
    totalContacts: number;
    pipelineValue: number;
    wonDealsCount: number;
    wonDealsValue: number;
    winRate: number;
    dealsByStage: Record<DealStage, { deals: ExtendedDeal[]; count: number; totalValue: number }>;
  };

  // Modals & Drawer State
  isAddContactOpen: boolean;
  setIsAddContactOpen: (open: boolean) => void;
  isAddDealOpen: boolean;
  setIsAddDealOpen: (open: boolean) => void;
  pendingLostDeal: ExtendedDeal | null;
  setPendingLostDeal: (deal: ExtendedDeal | null) => void;
  wonCelebrationDeal: ExtendedDeal | null;
  setWonCelebrationDeal: (deal: ExtendedDeal | null) => void;
  isOttyHelpOpen: boolean;
  setIsOttyHelpOpen: (open: boolean) => void;
  drawerContact: Contact | null;
  openDrawer: (contact: Contact) => void;
  closeDrawer: () => void;

  // Actions
  handleAddContact: (input: CreateContactInput) => Promise<boolean>;
  handleAddDeal: (input: CreateDealInput) => Promise<boolean>;
  handleMoveDeal: (dealId: string, targetStage: DealStage) => void;
  handleConfirmLost: (dealId: string, reason: string, notes?: string) => Promise<void>;
  handleAddActivity: (input: LogActivityInput) => Promise<boolean>;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

// Initial verified demo data matching UI/UX spec & database schema
const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    company_id: null,
    full_name: 'م. زياد القضاة',
    phone: '+962791234567',
    email: 'ziad@adv-tech.jo',
    company_name: 'شركة التقنية المتقدمة',
    country: 'Jordan',
    city: 'عمّان',
    lead_source: 'website',
    lead_status: 'qualified',
    assigned_to: null,
    notes: 'مهتم بتطبيق OTECH لإدارة العمليات ومتابعة الفروع.',
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c2',
    company_id: null,
    full_name: 'د. ريم المجالي',
    phone: '+962788881234',
    email: 'reem@alamal.com',
    company_name: 'مركز الأمل الطبي',
    country: 'Jordan',
    city: 'إربد',
    lead_source: 'whatsapp',
    lead_status: 'contacted',
    assigned_to: null,
    notes: 'طلبوا استشارة حول أتمتة سجلات المرضى والمواعيد.',
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c3',
    company_id: null,
    full_name: 'عمر الكردي',
    phone: '+962770009988',
    email: 'omar@kurdi.jo',
    company_name: 'مؤسسة كردي للتجارة',
    country: 'Jordan',
    city: 'عمّان',
    lead_source: 'referral',
    lead_status: 'new',
    assigned_to: null,
    notes: 'ترشيح من م. زياد القضاة، يرغب بحلول ربط نقاط البيع.',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c4',
    company_id: null,
    full_name: 'لانا حداد',
    phone: '+962795554321',
    email: 'lana@ward.jo',
    company_name: 'سلسلة مطاعم ورد',
    country: 'Jordan',
    city: 'عمّان',
    lead_source: 'website',
    lead_status: 'qualified',
    assigned_to: null,
    notes: 'استفسار حول برنامج ولاء رقمي ودعم أبل والت وجوجل والت.',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c5',
    company_id: null,
    full_name: 'طارق الزعبي',
    phone: '+962781112233',
    email: 'tareq@alhadi.com',
    company_name: 'مجموعة الهادي للاستثمار',
    country: 'Jordan',
    city: 'الزرقاء',
    lead_source: 'phone',
    lead_status: 'new',
    assigned_to: null,
    notes: 'اتصال هاتفي مباشر لطلب عرض فني لمنظومة B2B.',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c6',
    company_id: null,
    full_name: 'م. حسام العبداللات',
    phone: '+962799001122',
    email: 'hossam@alofooq.jo',
    company_name: 'شركة الأفق الرقمي',
    country: 'Jordan',
    city: 'عمّان',
    lead_source: 'referral',
    lead_status: 'unqualified',
    assigned_to: null,
    notes: 'الميزانية الحالية لا تتناسب مع الحلول المؤسسية المخصصة.',
    created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_DEALS: ExtendedDeal[] = [
  {
    id: 'd1',
    contact_id: 'c1',
    contact_name: 'م. زياد القضاة',
    company_id: null,
    company_name: 'شركة التقنية المتقدمة',
    title: 'تطبيق OTECH لإدارة العمليات الميدانية',
    value: 2500,
    currency: 'JOD',
    stage: 'new_lead',
    probability: 20,
    expected_close_date: '2026-12-15',
    lost_reason: null,
    assigned_to: null,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
    urgent: false,
  },
  {
    id: 'd2',
    contact_id: 'c3',
    contact_name: 'عمر الكردي',
    company_id: null,
    company_name: 'مؤسسة كردي للتجارة',
    title: 'بوت الدعم الفني الذكي وربط وتساب الأعمال',
    value: 850,
    currency: 'JOD',
    stage: 'new_lead',
    probability: 25,
    expected_close_date: '2026-12-05',
    lost_reason: null,
    assigned_to: null,
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    updated_at: new Date().toISOString(),
    urgent: true,
  },
  {
    id: 'd3',
    contact_id: 'c4',
    contact_name: 'لانا حداد',
    company_id: null,
    company_name: 'سلسلة مطاعم ورد',
    title: 'منصة بطاقات ولاء العملاء PassLoyal',
    value: 4200,
    currency: 'JOD',
    stage: 'contacted',
    probability: 50,
    expected_close_date: '2026-12-20',
    lost_reason: null,
    assigned_to: null,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date().toISOString(),
    urgent: false,
  },
  {
    id: 'd4',
    contact_id: 'c2',
    contact_name: 'د. ريم المجالي',
    company_id: null,
    company_name: 'مركز الأمل الطبي',
    title: 'نظام الفوترة المعتمد وأتمتة التقارير الطبية',
    value: 6800,
    currency: 'JOD',
    stage: 'proposal_sent',
    probability: 75,
    expected_close_date: '2026-12-10',
    lost_reason: null,
    assigned_to: null,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date().toISOString(),
    urgent: false,
  },
  {
    id: 'd5',
    contact_id: 'c5',
    contact_name: 'طارق الزعبي',
    company_id: null,
    company_name: 'مجموعة الهادي للاستثمار',
    title: 'تطوير بوابة B2B للشركات والتبادل الرقمي',
    value: 5500,
    currency: 'JOD',
    stage: 'won',
    probability: 100,
    expected_close_date: '2026-11-25',
    lost_reason: null,
    assigned_to: null,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated_at: new Date().toISOString(),
    urgent: false,
  },
  {
    id: 'd6',
    contact_id: 'c6',
    contact_name: 'م. حسام العبداللات',
    company_id: null,
    company_name: 'شركة الأفق الرقمي',
    title: 'أتمتة المخازن والمنظومة اللوجستية',
    value: 4000,
    currency: 'JOD',
    stage: 'lost',
    probability: 0,
    expected_close_date: '2026-11-20',
    lost_reason: 'الميزانية غير كافية حالياً للمشروع',
    assigned_to: null,
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    updated_at: new Date().toISOString(),
    urgent: false,
  },
];

const INITIAL_ACTIVITIES: ExtendedActivity[] = [
  {
    id: 'a1',
    contact_id: 'c4',
    contact_name: 'لانا حداد (سلسلة مطاعم ورد)',
    deal_id: 'd3',
    type: 'whatsapp',
    description: 'إرسال مسودة العرض التوضيحي لمنصة PassLoyal ورابط التجربة الحية على هاتف الآيفون.',
    next_follow_up: '2026-11-30T10:00:00Z',
    created_by: null,
    created_by_name: 'رامي النجار',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'a2',
    contact_id: 'c1',
    contact_name: 'م. زياد القضاة (شركة التقنية المتقدمة)',
    deal_id: 'd1',
    type: 'call',
    description: 'مكالمة هاتفية مدتها 15 دقيقة لمناقشة المتطلبات الفنية للربط مع نظام ERP الحالي لديهم.',
    next_follow_up: '2026-12-01T14:30:00Z',
    created_by: null,
    created_by_name: 'رامي النجار',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'a3',
    contact_id: 'c2',
    contact_name: 'د. ريم المجالي (مركز الأمل الطبي)',
    deal_id: 'd4',
    type: 'meeting',
    description: 'اجتماع حضوري في مقر المركز بإربد لتقديم العرض الفني والمالي لمجلس الإدارة.',
    next_follow_up: null,
    created_by: null,
    created_by_name: 'سارة خالد',
    created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
  },
  {
    id: 'a4',
    contact_id: 'c5',
    contact_name: 'طارق الزعبي (مجموعة الهادي للاستثمار)',
    deal_id: 'd5',
    type: 'note',
    description: 'تم توقيع العقد رسمياً واستلام الدفعة الأولى. بدء مرحلة التحليل التقني وتحديد الـ Milestones.',
    next_follow_up: null,
    created_by: null,
    created_by_name: 'رامي النجار',
    created_at: new Date(Date.now() - 3600000 * 52).toISOString(),
  },
];

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [deals, setDeals] = useState<ExtendedDeal[]>(INITIAL_DEALS);
  const [activities, setActivities] = useState<ExtendedActivity[]>(INITIAL_ACTIVITIES);
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [pendingLostDeal, setPendingLostDeal] = useState<ExtendedDeal | null>(null);
  const [wonCelebrationDeal, setWonCelebrationDeal] = useState<ExtendedDeal | null>(null);
  const [isOttyHelpOpen, setIsOttyHelpOpen] = useState(false);
  const [drawerContact, setDrawerContact] = useState<Contact | null>(null);

  // Sync with server if authenticated
  useEffect(() => {
    let mounted = true;
    async function loadServerData() {
      try {
        const [contactsRes, dealsRes, activitiesRes] = await Promise.all([
          crmActions.getContacts(),
          crmActions.getDeals(),
          crmActions.getActivities(),
        ]);

        if (mounted) {
          if (contactsRes.success && contactsRes.data && contactsRes.data.length > 0) {
            setContacts(contactsRes.data);
          }
          if (dealsRes.success && dealsRes.data && dealsRes.data.length > 0) {
            // Map deals with contact names
            const mappedDeals: ExtendedDeal[] = dealsRes.data.map((d) => ({
              ...d,
              contact_name: contacts.find((c) => c.id === d.contact_id)?.full_name || 'عميل محلي',
              company_name: contacts.find((c) => c.id === d.contact_id)?.company_name || 'شركة محلية',
            }));
            setDeals(mappedDeals);
          }
          if (activitiesRes.success && activitiesRes.data && activitiesRes.data.length > 0) {
            const mappedActivities: ExtendedActivity[] = activitiesRes.data.map((a) => ({
              ...a,
              contact_name: contacts.find((c) => c.id === a.contact_id)?.full_name || 'العميل',
              created_by_name: 'أنت (مسؤول المبيعات)',
            }));
            setActivities(mappedActivities);
          }
        }
      } catch (err) {
        console.warn('Operating in offline/demo mode with rich mock data.');
      }
    }

    loadServerData();
    return () => {
      mounted = false;
    };
  }, []);

  // Compute KPIs
  const stats = useMemo(() => {
    const totalContacts = contacts.length;

    // Active pipeline includes new_lead, contacted, proposal_sent
    const activeDeals = deals.filter(
      (d) => d.stage === 'new_lead' || d.stage === 'contacted' || d.stage === 'proposal_sent'
    );
    const pipelineValue = activeDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);

    const wonDeals = deals.filter((d) => d.stage === 'won');
    const wonDealsCount = wonDeals.length;
    const wonDealsValue = wonDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);

    const lostDeals = deals.filter((d) => d.stage === 'lost');
    const closedCount = wonDeals.length + lostDeals.length;
    const winRate = closedCount > 0 ? Math.round((wonDeals.length / closedCount) * 100) : 0;

    const stages: DealStage[] = ['new_lead', 'contacted', 'proposal_sent', 'won', 'lost'];
    const dealsByStage = stages.reduce(
      (acc, stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage);
        acc[stage] = {
          deals: stageDeals,
          count: stageDeals.length,
          totalValue: stageDeals.reduce((sum, d) => sum + Number(d.value || 0), 0),
        };
        return acc;
      },
      {} as Record<DealStage, { deals: ExtendedDeal[]; count: number; totalValue: number }>
    );

    return {
      totalContacts,
      pipelineValue,
      wonDealsCount,
      wonDealsValue,
      winRate,
      dealsByStage,
    };
  }, [contacts, deals]);

  // Drawer handlers
  const openDrawer = (contact: Contact) => setDrawerContact(contact);
  const closeDrawer = () => setDrawerContact(null);

  // Add Contact handler
  const handleAddContact = async (input: CreateContactInput): Promise<boolean> => {
    // Optimistic UI update
    const newContact: Contact = {
      id: 'c_' + Date.now(),
      company_id: null,
      full_name: input.full_name,
      phone: input.phone,
      email: input.email || null,
      company_name: input.company_name || null,
      country: input.country || 'Jordan',
      city: input.city || 'عمّان',
      lead_source: input.lead_source || 'website',
      lead_status: input.lead_status || 'new',
      assigned_to: null,
      notes: input.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setContacts((prev) => [newContact, ...prev]);

    // Try server sync
    try {
      const res = await crmActions.createContact(input);
      if (res.success && res.data) {
        setContacts((prev) => prev.map((c) => (c.id === newContact.id ? res.data : c)));
      }
    } catch (e) {
      // Keep optimistic item
    }

    return true;
  };

  // Add Deal handler
  const handleAddDeal = async (input: CreateDealInput): Promise<boolean> => {
    const relatedContact = contacts.find((c) => c.id === input.contact_id);

    const newDeal: ExtendedDeal = {
      id: 'd_' + Date.now(),
      contact_id: input.contact_id || null,
      contact_name: relatedContact?.full_name || 'عميل جديد',
      company_id: null,
      company_name: relatedContact?.company_name || 'شركة محلية',
      title: input.title,
      value: Number(input.value) || 0,
      currency: input.currency || 'JOD',
      stage: input.stage || 'new_lead',
      probability: input.probability || 20,
      expected_close_date: input.expected_close_date || null,
      lost_reason: null,
      assigned_to: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      urgent: false,
    };

    setDeals((prev) => [newDeal, ...prev]);

    try {
      const res = await crmActions.createDeal(input);
      if (res.success && res.data) {
        setDeals((prev) =>
          prev.map((d) => (d.id === newDeal.id ? { ...res.data, contact_name: newDeal.contact_name } : d))
        );
      }
    } catch (e) {
      // Keep optimistic
    }

    return true;
  };

  // Deal Stage move handler with validation guards
  const handleMoveDeal = (dealId: string, targetStage: DealStage) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    if (targetStage === 'lost') {
      // Trigger mandatory Lost Reason modal
      setPendingLostDeal(deal);
      return;
    }

    if (targetStage === 'won') {
      // Trigger Won Celebration modal with OTTY
      setDeals((prev) =>
        prev.map((d) =>
          d.id === dealId ? { ...d, stage: 'won', probability: 100, urgent: false } : d
        )
      );
      setWonCelebrationDeal(deal);
      crmActions.updateDealStage(dealId, 'won').catch(() => {});
      return;
    }

    // Normal stage movement
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId ? { ...d, stage: targetStage, urgent: false } : d
      )
    );
    crmActions.updateDealStage(dealId, targetStage).catch(() => {});
  };

  // Confirm Lost move
  const handleConfirmLost = async (dealId: string, reason: string, notes?: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    const fullReason = notes ? `${reason} — ${notes}` : reason;

    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId ? { ...d, stage: 'lost', lost_reason: fullReason, probability: 0 } : d
      )
    );

    setPendingLostDeal(null);

    try {
      await crmActions.updateDealStage(dealId, 'lost', fullReason);
    } catch (e) {
      // Handled optimistically
    }
  };

  // Add Activity handler
  const handleAddActivity = async (input: LogActivityInput): Promise<boolean> => {
    const relatedContact = contacts.find((c) => c.id === input.contact_id);

    const newActivity: ExtendedActivity = {
      id: 'a_' + Date.now(),
      contact_id: input.contact_id || null,
      contact_name: relatedContact ? `${relatedContact.full_name} (${relatedContact.company_name || 'عميل'})` : 'جهة اتصال عامة',
      deal_id: input.deal_id || null,
      type: input.type,
      description: input.description,
      next_follow_up: input.next_follow_up || null,
      created_by: null,
      created_by_name: 'أنت (مسؤول المبيعات)',
      created_at: new Date().toISOString(),
    };

    setActivities((prev) => [newActivity, ...prev]);

    try {
      const res = await crmActions.logActivity(input);
      if (res.success && res.data) {
        setActivities((prev) =>
          prev.map((a) => (a.id === newActivity.id ? { ...res.data, contact_name: newActivity.contact_name } : a))
        );
      }
    } catch (e) {
      // Keep optimistic
    }

    return true;
  };

  return (
    <CrmContext.Provider
      value={{
        contacts,
        deals,
        activities,
        isLoading,
        stats,
        isAddContactOpen,
        setIsAddContactOpen,
        isAddDealOpen,
        setIsAddDealOpen,
        pendingLostDeal,
        setPendingLostDeal,
        wonCelebrationDeal,
        setWonCelebrationDeal,
        isOttyHelpOpen,
        setIsOttyHelpOpen,
        drawerContact,
        openDrawer,
        closeDrawer,
        handleAddContact,
        handleAddDeal,
        handleMoveDeal,
        handleConfirmLost,
        handleAddActivity,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
