import React, { useState, useRef, useEffect } from 'react';
import { User, Plus, Check, ChevronDown, Database, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { WorkspaceUser } from '../types/user';

interface UserWorkspaceSwitcherProps {
  currentUser: WorkspaceUser;
  users: WorkspaceUser[];
  onSwitchUser: (userId: string) => void;
  onCreateUser: (name: string, customId?: string, role?: string) => WorkspaceUser;
  onDeleteUser?: (userId: string) => void;
  leadCount?: number;
}

export const UserWorkspaceSwitcher: React.FC<UserWorkspaceSwitcherProps> = ({
  currentUser,
  users,
  onSwitchUser,
  onCreateUser,
  onDeleteUser,
  leadCount = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newCustomId, setNewCustomId] = useState('');
  const [newUserRole, setNewUserRole] = useState('Sales Rep');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
        setErrorMsg(null);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      setErrorMsg('Please enter a user or workspace name.');
      return;
    }

    const created = onCreateUser(newUserName.trim(), newCustomId.trim() || undefined, newUserRole);
    setNewUserName('');
    setNewCustomId('');
    setIsCreating(false);
    setIsOpen(false);
    setErrorMsg(null);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef} id="user-workspace-switcher-wrapper">
      {/* Trigger Button */}
      <button
        type="button"
        id="user-workspace-switcher-trigger"
        onClick={() => {
          setIsOpen(!isOpen);
          setIsCreating(false);
          setErrorMsg(null);
        }}
        className="group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer text-xs"
        title="Switch active user or create new user"
      >
        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-[160px]">
              {currentUser.name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Supabase Sync Ready" />
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[130px]">
            id: {currentUser.id}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="user-workspace-switcher-menu"
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Header Info */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Workspace Accounts</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
              <Database className="w-2.5 h-2.5" />
              <span>Supabase Auto-Sync</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 py-2">
            New leads are automatically tagged with the active user and synced directly to Supabase.
          </p>

          {/* User List */}
          {!isCreating && (
            <div className="space-y-1 max-h-56 overflow-y-auto py-1">
              {users.map((u) => {
                const isActive = u.id === currentUser.id;
                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors text-xs ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchUser(u.id);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2.5 flex-1 text-left cursor-pointer min-w-0"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                          id: {u.id}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      )}
                      {!isActive && onDeleteUser && users.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteUser(u.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Remove user"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Create User Inline Form */}
          {isCreating ? (
            <form onSubmit={handleCreateSubmit} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Create New User
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              {errorMsg && (
                <div className="text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  User / Agency Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rayan Agency, Sales Hunter..."
                  value={newUserName}
                  onChange={(e) => {
                    setNewUserName(e.target.value);
                    if (!newCustomId) {
                      setNewCustomId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 18));
                    }
                  }}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Custom User ID (Supabase <code className="font-mono text-[10px]">user_id</code>)
                </label>
                <input
                  type="text"
                  placeholder="e.g. agency_alpha"
                  value={newCustomId}
                  onChange={(e) => setNewCustomId(e.target.value)}
                  className="w-full text-xs font-mono px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create & Switch</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
              <button
                type="button"
                id="create-new-user-btn"
                onClick={() => setIsCreating(true)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create New User</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
