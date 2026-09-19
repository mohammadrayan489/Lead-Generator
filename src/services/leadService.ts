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
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Lead } from '../types/lead';

const LEADS_COLLECTION = 'leads';
const LOCAL_STORAGE_KEY = 'lead_generator_leads_cache';

// In-memory cache fallback for SSR and test run environments
let inMemoryLeads: Lead[] = [];

// Helper to access fallback local storage
function getLocalLeads(): Lead[] {
  if (typeof window === 'undefined') return inMemoryLeads;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : inMemoryLeads;
  } catch {
    return inMemoryLeads;
  }
}

function saveLocalLeads(leads: Lead[]): void {
  inMemoryLeads = leads;
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

  /**
   * Deletes a batch of leads by IDs from Firestore and local cache.
   */
  async batchDeleteLeads(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) return;
    try {
      const batch = writeBatch(db);
      for (const id of ids) {
        const docRef = doc(db, LEADS_COLLECTION, id);
        batch.delete(docRef);
      }
      await batch.commit();
    } catch (error) {
      console.warn('Firestore batchDeleteLeads fallback:', error);
    }

    // Update local cache
    const current = getLocalLeads();
    const idSet = new Set(ids);
    saveLocalLeads(current.filter((l) => !idSet.has(l.id)));
  },

  /**
   * Deletes all leads (optionally scoped to userId) from Firestore and local cache.
   */
  async deleteAllLeads(userId?: string): Promise<void> {
    try {
      const leadsRef = collection(db, LEADS_COLLECTION);
      const q = userId
        ? query(leadsRef, where('userId', '==', userId))
        : query(leadsRef);
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const batch = writeBatch(db);
        snapshot.docs.forEach((d) => {
          batch.delete(d.ref);
        });
        await batch.commit();
      }
    } catch (error) {
      console.warn('Firestore deleteAllLeads fallback:', error);
    }

    // Update local cache
    if (userId) {
      const current = getLocalLeads();
      saveLocalLeads(current.filter((l) => l.userId !== userId));
    } else {
      saveLocalLeads([]);
    }
  },
};
