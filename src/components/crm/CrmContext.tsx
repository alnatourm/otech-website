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

// Initial production clean state (empty)
const INITIAL_CONTACTS: Contact[] = [];
const INITIAL_DEALS: ExtendedDeal[] = [];
const INITIAL_ACTIVITIES: ExtendedActivity[] = [];

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
      setIsLoading(true);
      try {
        const [contactsRes, dealsRes, activitiesRes] = await Promise.all([
          crmActions.getContacts(),
          crmActions.getDeals(),
          crmActions.getActivities(),
        ]);

        if (mounted) {
          const loadedContacts = contactsRes.success && contactsRes.data ? contactsRes.data : [];
          setContacts(loadedContacts);

          if (dealsRes.success && dealsRes.data) {
            // Map deals with contact names
            const mappedDeals: ExtendedDeal[] = dealsRes.data.map((d) => ({
              ...d,
              contact_name: loadedContacts.find((c) => c.id === d.contact_id)?.full_name || 'عميل محلي',
              company_name: loadedContacts.find((c) => c.id === d.contact_id)?.company_name || 'شركة محلية',
            }));
            setDeals(mappedDeals);
          } else {
            setDeals([]);
          }

          if (activitiesRes.success && activitiesRes.data) {
            const mappedActivities: ExtendedActivity[] = activitiesRes.data.map((a) => ({
              ...a,
              contact_name: loadedContacts.find((c) => c.id === a.contact_id)?.full_name || 'العميل',
              created_by_name: 'أنت (مسؤول المبيعات)',
            }));
            setActivities(mappedActivities);
          } else {
            setActivities([]);
          }
        }
      } catch (err) {
        console.warn('Operating in offline/clean mode.');
        if (mounted) {
          setContacts([]);
          setDeals([]);
          setActivities([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
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
