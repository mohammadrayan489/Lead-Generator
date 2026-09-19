import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Lead } from '../types/lead';

const LEADS_COLLECTION = 'leads';
const LOCAL_STORAGE_KEY = 'lead_generator_leads_cache';

// Helper to access fallback local storage
function getLocalLeads(): Lead[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalLeads(leads: Lead[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // Ignore quota or serialization errors
  }
}

export const leadService = {
  /**
   * Retrieves all leads for a specific user, with automatic local cache sync.
   */
  async getAllLeads(userId: string): Promise<Lead[]> {
    try {
      const q = query(
        collection(db, LEADS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const remoteLeads = snapshot.docs.map(
        (docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() } as Lead)
      );

      // Cache locally for offline access
      if (remoteLeads.length > 0) {
        saveLocalLeads(remoteLeads);
        return remoteLeads;
      }
    } catch (error) {
      console.warn('Firestore fetch failed, falling back to local workspace cache:', error);
    }

    // Fallback to local storage
    const local = getLocalLeads().filter((l) => l.userId === userId || !l.userId);
    return local;
  },

  /**
   * Adds a single structured lead to the database.
   */
  async addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...lead,
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const docRef = await addDoc(collection(db, LEADS_COLLECTION), {
        ...lead,
        createdAt: now,
        updatedAt: now,
      });
      newLead.id = docRef.id;
    } catch (error) {
      console.warn('Firestore addDoc fallback to local storage:', error);
    }

    // Save to local cache
    const current = getLocalLeads();
    saveLocalLeads([newLead, ...current]);

    return newLead;
  },

  /**
   * Batch stores leads into database and local cache.
   */
  async batchSaveLeads(leads: Lead[]): Promise<Lead[]> {
    const saved: Lead[] = [];
    for (const lead of leads) {
      try {
        const { id, ...data } = lead;
        const docRef = await addDoc(collection(db, LEADS_COLLECTION), data);
        saved.push({ ...lead, id: docRef.id });
      } catch {
        saved.push(lead);
      }
    }

    const current = getLocalLeads();
    const existingIds = new Set(current.map((l) => l.id));
    const merged = [...saved.filter((l) => !existingIds.has(l.id)), ...current];
    saveLocalLeads(merged);

    return saved;
  },

  /**
   * Updates an existing lead.
   */
  async updateLead(id: string, updates: Partial<Lead>): Promise<void> {
    const now = new Date().toISOString();
    try {
      const docRef = doc(db, LEADS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: now,
      });
    } catch (error) {
      console.warn('Firestore updateDoc fallback:', error);
    }

    // Update local cache
    const current = getLocalLeads();
    const updated = current.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: now } : l));
    saveLocalLeads(updated);
  },

  /**
   * Deletes a lead.
   */
  async deleteLead(id: string): Promise<void> {
    try {
      const docRef = doc(db, LEADS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn('Firestore deleteDoc fallback:', error);
    }

    // Update local cache
    const current = getLocalLeads();
    saveLocalLeads(current.filter((l) => l.id !== id));
  },
};
