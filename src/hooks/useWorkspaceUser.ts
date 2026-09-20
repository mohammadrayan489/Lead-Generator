import { useState, useEffect, useCallback } from 'react';
import { WorkspaceUser } from '../types/user';

const USERS_STORAGE_KEY = 'workspace_users_list_v1';
const ACTIVE_USER_STORAGE_KEY = 'active_workspace_user_id_v1';

const DEFAULT_USERS: WorkspaceUser[] = [
  {
    id: 'mohammad_rayan',
    name: 'Mohammad Rayan',
    email: 'mohammadrayan489@gmail.com',
    role: 'Lead Strategist',
    createdAt: '2026-09-19T00:00:00.000Z',
  },
  {
    id: 'demo_workspace_user',
    name: 'Default Workspace',
    role: 'Demo Pipeline',
    createdAt: '2026-09-19T00:00:00.000Z',
  },
];

function getStoredUsers(): WorkspaceUser[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

function getStoredActiveUserId(users: WorkspaceUser[]): string {
  if (typeof window === 'undefined') return users[0]?.id || 'mohammad_rayan';
  try {
    const stored = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (stored && users.some((u) => u.id === stored)) {
      return stored;
    }
    const fallbackId = users[0]?.id || 'mohammad_rayan';
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, fallbackId);
    return fallbackId;
  } catch {
    return users[0]?.id || 'mohammad_rayan';
  }
}

export function useWorkspaceUser() {
  const [users, setUsers] = useState<WorkspaceUser[]>(getStoredUsers);
  const [activeUserId, setActiveUserId] = useState<string>(() =>
    getStoredActiveUserId(users)
  );

  const currentUser =
    users.find((u) => u.id === activeUserId) || users[0] || DEFAULT_USERS[0];

  const persistUsers = (newUsers: WorkspaceUser[]) => {
    setUsers(newUsers);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
      } catch {
        // ignore
      }
    }
  };

  const switchUser = useCallback((userId: string) => {
    setActiveUserId(userId);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ACTIVE_USER_STORAGE_KEY, userId);
      } catch {
        // ignore
      }
    }
  }, []);

  const createUser = useCallback(
    (name: string, customId?: string, role?: string): WorkspaceUser => {
      const cleanName = name.trim();
      const slug = cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 20);
      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      const newId = customId?.trim() || `${slug || 'user'}_${uniqueSuffix}`;

      const newUser: WorkspaceUser = {
        id: newId,
        name: cleanName,
        role: role || 'Lead Specialist',
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      persistUsers(updatedUsers);
      switchUser(newUser.id);
      return newUser;
    },
    [users, switchUser]
  );

  const deleteUser = useCallback(
    (id: string) => {
      if (users.length <= 1) return; // Keep at least one user
      const updated = users.filter((u) => u.id !== id);
      persistUsers(updated);
      if (activeUserId === id) {
        const nextUser = updated[0];
        if (nextUser) switchUser(nextUser.id);
      }
    },
    [users, activeUserId, switchUser]
  );

  return {
    currentUser,
    users,
    activeUserId,
    createUser,
    switchUser,
    deleteUser,
  };
}
