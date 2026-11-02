import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  WifiOff,
  AlertCircle,
  Copy,
  Check,
  X,
  Star,
  ExternalLink,
  LifeBuoy,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Megaphone,
  CheckCheck,
  Activity,
  PanelLeftOpen,
  Boxes,
  Sliders,
  Shield,
  Database,
  LayoutDashboard,
  Globe,
  CreditCard,
  Lock,
  Unlock,
  FileText,
  Download,
  Printer,
  Send,
} from 'lucide-react';
import {
  DashboardState,
  SectionId,
  SettingsTab,
  SecurityTab,
  NotifTab,
  ProductKey,
  SupportTicket,
  TicketCategory,
  FeedbackType,
  UserProfile,
  ThemeMode,
  LayoutDensity,
  NetworkSim,
  AppNotification,
  NotificationType,
} from './personalAccount/types';
import {
  STORAGE_KEY,
  getDefaultState,
  PROD_INFO,
  LEVELS,
  FAQ_DATA,
  DAY,
  HR,
  MIN,
} from './personalAccount/constants';
import {
  ago,
  dayKey,
  scoreItems,
  computeSecurityScore,
  copyToClipboard,
  useDashboardKeyboardNav,
} from './personalAccount/utils';
import PersonalAccountSidebar from './personalAccount/PersonalAccountSidebar';
import DashboardSection from './personalAccount/sections/DashboardSection';
import ProductsSection from './personalAccount/sections/ProductsSection';
import SecuritySection from './personalAccount/sections/SecuritySection';
import NotificationsSection from './personalAccount/sections/NotificationsSection';
import SupportSection from './personalAccount/sections/SupportSection';
import OpenTicketSection from './personalAccount/sections/OpenTicketSection';
import FaqSection from './personalAccount/sections/FaqSection';
import FeedbackSection from './personalAccount/sections/FeedbackSection';
import SettingsSection from './personalAccount/sections/SettingsSection';
import ActivitySection from './personalAccount/sections/ActivitySection';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  recentActivities?: { t: string; ts: number }[];
  onToggleRead: (id: number) => void;
  onMarkAllRead: () => void;
  onNavigateToNotifications: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  recentActivities = [],
  onToggleRead,
  onMarkAllRead,
  onNavigateToNotifications,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotifIcon = (type: NotificationType | 'activity') => {
    switch (type) {
      case 'security':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
      case 'update':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'announce':
        return <Megaphone className="w-3.5 h-3.5 text-pink-500 shrink-0" />;
      case 'activity':
      default:
        return <Activity className="w-3.5 h-3.5 text-sky-500 shrink-0" />;
    }
  };

  const handleItemClick = (notif: AppNotification) => {
    if (!notif.read) {
      onToggleRead(notif.id);
    }
    onClose();
    onNavigateToNotifications();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm rounded-2xl bg-[var(--card)] border-2 border-slate-300 dark:border-[var(--line)] shadow-2xl z-50 overflow-hidden animate-fade-in text-[var(--fg)]"
      style={{
        boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05)',
      }}
      role="dialog"
      aria-label="Recent notifications"
    >
      {/* Dropdown Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--line)] bg-[var(--shell)]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[var(--brand)]/15 flex items-center justify-center text-[var(--brandtxt)] shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-[var(--fg)] truncate">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-white text-[10px] font-extrabold rounded-full px-2 py-0.5 shrink-0">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="px-2 py-1 text-[11px] font-semibold text-[var(--brandtxt)] hover:bg-[var(--raised)] rounded-md transition-colors flex items-center gap-1 shrink-0"
              title="Mark all notifications as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Mark read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-[var(--mut2)] hover:text-[var(--fg)] hover:bg-[var(--raised)] flex items-center justify-center transition-colors"
            title="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Notification Items List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[var(--line)] overscroll-contain">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 transition-colors flex items-start gap-3 group relative cursor-pointer ${
                !notif.read
                  ? 'bg-pink-500/5 dark:bg-pink-500/10 hover:bg-pink-500/10 dark:hover:bg-pink-500/15'
                  : 'hover:bg-[var(--raised)] opacity-90'
              }`}
              onClick={() => handleItemClick(notif)}
            >
              {/* Read / Unread Status Indicator */}
              <div className="pt-1 flex flex-col items-center gap-1 shrink-0">
                {!notif.read ? (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-[var(--brand)] shadow-xs animate-pulse"
                    title="Unread notification"
                  />
                ) : (
                  <span
                    className="w-2 h-2 rounded-full bg-[var(--mut2)]/40"
                    title="Read notification"
                  />
                )}
              </div>

              {/* Icon Circle */}
              <div className="w-8 h-8 rounded-xl bg-[var(--raised)] flex items-center justify-center shrink-0 mt-0.5">
                {getNotifIcon(notif.type)}
              </div>

              {/* Notification Content - Click takes directly to Notification page */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h4
                    className={`text-xs font-bold truncate group-hover:text-[var(--brand)] transition-colors ${
                      !notif.read ? 'text-[var(--fg)]' : 'text-[var(--mut)]'
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-[var(--mut2)] whitespace-nowrap shrink-0">
                    {ago(notif.ts)}
                  </span>
                </div>
                <p className="text-xs text-[var(--mut)] mt-1 line-clamp-2 leading-relaxed break-words">
                  {notif.text}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[var(--mut2)] font-medium">
                  <span className="capitalize">{notif.type}</span>
                  <span>·</span>
                  <span className="text-[var(--brandtxt)] group-hover:underline">Click to open full page</span>
                </div>
              </div>

              {/* Quick Toggle Read button without navigating */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleRead(notif.id);
                }}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--mut2)] hover:text-[var(--brand)] hover:bg-[var(--raised)] opacity-60 group-hover:opacity-100 transition-opacity shrink-0"
                title={notif.read ? 'Mark as unread' : 'Mark as read'}
              >
                <Check className={`w-3.5 h-3.5 ${notif.read ? 'text-[var(--ok)]' : ''}`} />
              </button>
            </div>
          ))
        ) : (
          <div className="py-8 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-[var(--raised)] flex items-center justify-center mx-auto mb-2 text-[var(--mut2)]">
              <Bell className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[var(--fg)]">No notifications</p>
            <p className="text-[11px] text-[var(--mut2)] mt-0.5">You are all caught up!</p>
          </div>
        )}
      </div>

      {/* Dropdown Footer */}
      <div className="p-2.5 bg-[var(--shell)] border-t border-[var(--line)] flex items-center justify-between gap-2">
        <span className="text-[11px] text-[var(--mut2)] px-2">
          {notifications.length} total alerts
        </span>
        <button
          onClick={() => {
            onClose();
            onNavigateToNotifications();
          }}
          className="px-3 py-1.5 text-xs font-bold text-[var(--brandtxt)] hover:bg-[var(--raised)] rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span>View all in Notifications page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

interface ToastItem {
  id: string;
  message: string;
  bad?: boolean;
  undo?: () => void;
  undoLabel?: string;
}

export const PersonalAccountPage: React.FC = () => {
  // Load state from localStorage
  const [state, setState] = useState<DashboardState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.user) {
          const def = getDefaultState();
          return {
            ...def,
            ...parsed,
            user: { ...def.user, ...parsed.user },
            stats: { ...def.stats, ...parsed.stats },
            conn: { ...def.conn, ...parsed.conn },
            apps: { ...def.apps, ...parsed.apps },
            fav: { ...def.fav, ...parsed.fav },
            prefs: { ...def.prefs, ...parsed.prefs },
            pp: { ...def.pp, ...parsed.pp },
            tab: { ...def.tab, ...parsed.tab },
          };
        }
      }
    } catch (e) {}
    return getDefaultState();
  });

  // UI Navigation state
  const [activeSection, setActiveSection] = useState<SectionId>(() => {
    const hash = window.location.hash.slice(1);
    if (hash.startsWith('ticket:')) return 'open_ticket';
    if (hash === 'products') return 'products';
    if (hash === 'security') return 'security';
    if (hash === 'notifications') return 'notifications';
    if (hash === 'support') return 'support';
    if (hash === 'faq') return 'faq';
    if (hash === 'feedback') return 'feedback';
    if (hash === 'settings') return 'settings';
    if (hash === 'activity') return 'activity';
    return 'dashboard';
  });

  const [openTicketId, setOpenTicketId] = useState<number | null>(() => {
    const hash = window.location.hash.slice(1);
    if (hash.startsWith('ticket:')) {
      return Number(hash.split(':')[1]) || 1042;
    }
    return 1042;
  });

  // Active tabs
  const [settingsTab, setSettingsTab] = useState<SettingsTab>(state.tab.settings || 'general');
  const [securityTab, setSecurityTab] = useState<SecurityTab>(state.tab.security || 'account');
  const [notifTab, setNotifTab] = useState<NotifTab>(state.tab.notifp || 'inbox');

  // Field drafts preservation across tabs/routes
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const updateDraft = useCallback((key: string, val: string) => {
    setDrafts((prev) => ({ ...prev, [key]: val }));
  }, []);

  // Rate limiter & timers
  const [browserAlertsLockTime, setBrowserAlertsLockTime] = useState<number>(0);
  const [browserToggleTimestamps, setBrowserToggleTimestamps] = useState<number[]>([]);

  // Network Simulation State
  const [networkSim, setNetworkSim] = useState<NetworkSim>('normal');
  const [isSimulatedLoading, setIsSimulatedLoading] = useState(false);
  const [simulatedError, setSimulatedError] = useState(false);

  // Navigation sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Quick Actions floating menu & Card Lock state
  const [isCardLocked, setIsCardLocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lidprex_card_locked') === 'true';
    } catch {
      return false;
    }
  });
  const [quickActionsExpanded, setQuickActionsExpanded] = useState(true);

  // Report Problem form state
  const [reportCategory, setReportCategory] = useState<'bug' | 'security' | 'billing' | 'glitch'>('bug');
  const [reportUrgency, setReportUrgency] = useState<'normal' | 'urgent'>('normal');
  const [reportSummary, setReportSummary] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportAttachLogs, setReportAttachLogs] = useState(true);
  const [reportSubmitting, setReportSubmitting] = useState(false);

  // Search Pop-up Tab & Scope state
  const [searchScope, setSearchScope] = useState<'global' | 'page'>('global');

  // User menu & command palette modals
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const [cmdIndex, setCmdIndex] = useState(0);

  // Modals & Dialogs
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);

  // Hook to handle 'ArrowDown' and 'ArrowUp' to cycle focus through dashboard cards and 'Escape' to reset or collapse
  const totalDashboardCards = state.onboard === 'show' ? 7 : 6;
  useDashboardKeyboardNav({
    enabled: activeSection === 'dashboard',
    totalCards: totalDashboardCards,
    focusedCardIndex,
    setFocusedCardIndex,
    onEscape: () => {
      setCmdOpen(false);
      setActiveModal(null);
      setMenuOpen(false);
      setNotifDropdownOpen(false);
      setFocusedCardIndex(null);
    },
    isBlocked: !!(activeModal || cmdOpen),
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Interactive Product Modal States
  // LeakShield
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<Array<{ text: string; ok: boolean }>>([]);
  // RepoPrep
  const [repoPrepName, setRepoPrepName] = useState('');
  const [repoPrepItems, setRepoPrepItems] = useState<string[]>([]);
  const [isPreparingRepo, setIsPreparingRepo] = useState(false);
  // Idea2Project
  const [ideaText, setIdeaText] = useState('');
  const [generatedBlueprint, setGeneratedBlueprint] = useState('');

  // Save state on change
  const saveState = useCallback((updater: (prev: DashboardState) => DashboardState) => {
    setState((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  // Toast helper
  const addToast = useCallback(
    (message: string, bad: boolean = false, undo?: () => void, undoLabel?: string) => {
      const id = `${Date.now()}_${Math.random()}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, bad, undo, undoLabel }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, undo ? 6500 : 3500);
    },
    []
  );

  // Log activity
  const logActivity = useCallback(
    (text: string) => {
      saveState((prev) => {
        const k = dayKey();
        const nextCount = prev.actDate === k ? prev.actCount + 1 : 1;
        const newActivity = [{ t: text, ts: Date.now() }, ...prev.activity.slice(0, 29)];
        return {
          ...prev,
          activity: newActivity,
          actDate: k,
          actCount: nextCount,
        };
      });
    },
    [saveState]
  );

  // Award points / action completion
  const awardPoints = useCallback(
    (key: string, points: number, _label: string) => {
      saveState((prev) => {
        if (prev.awarded[key]) return prev;
        return {
          ...prev,
          awarded: { ...prev.awarded, [key]: 1 },
          points: prev.points + points,
        };
      });
    },
    [saveState]
  );

  // Theme & Density sync
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      state.theme === 'dark' ||
      (state.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const effectiveTheme = isDark ? 'dark' : 'light';
    root.dataset.theme = state.theme === 'system' ? effectiveTheme : state.theme;
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
    root.dataset.density = state.density;
    root.dataset.motion = state.motion ? 'on' : 'off';
  }, [state.theme, state.density, state.motion]);

  // Sync hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('ticket:')) {
        const id = Number(hash.split(':')[1]);
        setOpenTicketId(id);
        setActiveSection('open_ticket');
      } else if (hash) {
        const validSections: SectionId[] = [
          'dashboard',
          'products',
          'security',
          'notifications',
          'support',
          'faq',
          'feedback',
          'settings',
          'activity',
        ];
        if (validSections.includes(hash as SectionId)) {
          setActiveSection(hash as SectionId);
        }
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const changeSection = (id: SectionId) => {
    if (networkSim === 'slow') {
      setIsSimulatedLoading(true);
      setTimeout(() => setIsSimulatedLoading(false), 800);
    }
    setActiveSection(id);
    if (id === 'open_ticket') {
      window.location.hash = `ticket:${openTicketId || 1042}`;
    } else {
      window.location.hash = id;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcuts handler (Global shortcuts: Arrow keys, Escape, Cmd+K, etc.)
  useEffect(() => {
    let gPressTime = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdQuery('');
        setCmdIndex(0);
        setCmdOpen((prev) => !prev);
        return;
      }

      // Escape key collapses all expanded views, modals, drawers, and card focus
      if (e.key === 'Escape') {
        setCmdOpen(false);
        setActiveModal(null);
        setMenuOpen(false);
        setNotifDropdownOpen(false);
        setFocusedCardIndex(null);
        return;
      }

      if (isInput || activeModal || cmdOpen) return;

      // Global Arrow Navigation between dashboard cards
      if (activeSection === 'dashboard') {
        const totalCards = state.onboard === 'show' ? 7 : 6;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedCardIndex((prev) => {
            const next = prev === null ? 0 : (prev + 1) % totalCards;
            setTimeout(() => {
              const el = document.querySelector(`[data-dashboard-card="${next}"]`);
              if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 10);
            return next;
          });
          return;
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedCardIndex((prev) => {
            const next = prev === null ? totalCards - 1 : (prev - 1 + totalCards) % totalCards;
            setTimeout(() => {
              const el = document.querySelector(`[data-dashboard-card="${next}"]`);
              if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 10);
            return next;
          });
          return;
        }
      }

      if (e.key === '/') {
        e.preventDefault();
        setCmdQuery('');
        setCmdIndex(0);
        setCmdOpen(true);
        return;
      }
      if (e.key === '?') {
        e.preventDefault();
        setActiveModal('shortcuts');
        return;
      }
      if (e.key === 'g') {
        gPressTime = Date.now();
        return;
      }
      if (Date.now() - gPressTime < 1200) {
        const map: Record<string, SectionId> = {
          o: 'dashboard',
          p: 'products',
          s: 'security',
          n: 'notifications',
          h: 'support',
          t: 'settings',
        };
        const dest = map[e.key];
        if (dest) {
          gPressTime = 0;
          changeSection(dest);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, cmdOpen, networkSim, activeSection, state.onboard]);


  // Section titles
  const getHeaderTitle = () => {
    const hour = new Date().getHours();
    const greeting =
      hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    switch (activeSection) {
      case 'dashboard':
        return {
          title: `${greeting}, ${state.user.display}`,
          subtitle:
            computeSecurityScore(state) >= 90
              ? 'Your account is in good shape'
              : 'A few things could make your account safer',
        };
      case 'products':
        return { title: 'Connected Products', subtitle: 'Everything you use, in one place' };
      case 'security':
        return { title: 'Security', subtitle: 'Protect your account and devices' };
      case 'notifications':
        return { title: 'Notifications', subtitle: 'Alerts and updates from your products' };
      case 'support':
        return { title: 'Support', subtitle: 'Get help from the Lidprex team' };
      case 'open_ticket':
        return { title: 'Open ticket', subtitle: 'Follow the conversation with support' };
      case 'faq':
        return { title: 'Account FAQ', subtitle: 'Quick answers about your account' };
      case 'feedback':
        return { title: 'Feedback', subtitle: 'Tell us what to build next' };
      case 'settings':
        return { title: 'Settings', subtitle: 'Profile, connections, and preferences' };
      case 'activity':
        return { title: 'Activity', subtitle: 'Complete log of recent actions' };
      default:
        return { title: 'Dashboard', subtitle: 'Account management' };
    }
  };

  const headerMeta = getHeaderTitle();

  // Command palette item dataset
  const cmdList = useMemo(() => {
    const list: Array<{ title: string; group: string; action: () => void }> = [
      { title: 'Go to Overview', group: 'Navigation', action: () => changeSection('dashboard') },
      { title: 'Go to Products', group: 'Navigation', action: () => changeSection('products') },
      { title: 'Go to Security', group: 'Navigation', action: () => changeSection('security') },
      { title: 'Go to Notifications', group: 'Navigation', action: () => changeSection('notifications') },
      { title: 'Go to Support', group: 'Navigation', action: () => changeSection('support') },
      { title: 'Go to FAQ', group: 'Navigation', action: () => changeSection('faq') },
      { title: 'Go to Feedback', group: 'Navigation', action: () => changeSection('feedback') },
      { title: 'Go to Settings', group: 'Navigation', action: () => changeSection('settings') },
      {
        title: 'Run a LeakShield scan',
        group: 'Action',
        action: () => {
          setActiveModal('leakshield');
        },
      },
      {
        title: 'Prepare a repo with RepoPrep',
        group: 'Action',
        action: () => {
          setActiveModal('repoprep');
        },
      },
      {
        title: 'Create a blueprint with Idea2Project',
        group: 'Action',
        action: () => {
          setActiveModal('idea2project');
        },
      },
      {
        title: 'Open LidBridge pushes',
        group: 'Action',
        action: () => {
          setActiveModal('lidbridge');
        },
      },
      {
        title: state.twofa ? 'Disable two-factor' : 'Turn on two-factor',
        group: 'Security',
        action: () => {
          if (state.twofa) {
            setActiveModal('disable2fa');
          } else {
            setActiveModal('enable2fa');
          }
        },
      },
      {
        title: 'Verify my email',
        group: 'Security',
        action: () => setActiveModal('verifyEmail'),
      },
      {
        title: 'Add a backup email',
        group: 'Security',
        action: () => setActiveModal('backupEmail'),
      },
      {
        title: 'View activity logs',
        group: 'Account',
        action: () => setActiveModal('activityDrawer'),
      },
      {
        title: 'Keyboard shortcuts',
        group: 'Help',
        action: () => setActiveModal('shortcuts'),
      },
      {
        title: 'Switch theme',
        group: 'Appearance',
        action: () => {
          saveState((prev) => ({
            ...prev,
            theme: prev.theme === 'dark' ? 'light' : 'dark',
          }));
          addToast(`Theme set to ${state.theme === 'dark' ? 'light' : 'dark'}`);
        },
      },
    ];

    if (!cmdQuery.trim()) return list.slice(0, 9);
    const q = cmdQuery.toLowerCase();
    return list.filter((i) => i.title.toLowerCase().includes(q) || i.group.toLowerCase().includes(q)).slice(0, 9);
  }, [cmdQuery, state.twofa, state.theme]);

  // Product modal trigger
  const handleOpenProduct = (id: ProductKey) => {
    awardPoints('prod', 5, 'opened a product');
    logActivity(`Opened ${PROD_INFO[id].name}`);
    setActiveModal(id);
  };

  // Global & Page search dataset
  const searchResults = useMemo(() => {
    const q = cmdQuery.trim().toLowerCase();

    // 1. Products
    const products = (Object.keys(PROD_INFO) as ProductKey[]).map((key) => {
      const p = PROD_INFO[key];
      return {
        id: `prod-${key}`,
        category: 'Products',
        title: p.name,
        description: p.desc,
        section: 'products' as SectionId,
        action: () => handleOpenProduct(key),
      };
    });

    // 2. Quick Actions
    const quickActions = [
      {
        id: 'act-lock-card',
        category: 'Actions',
        title: isCardLocked ? 'Unlock Card (•••• 8492)' : 'Lock Card (•••• 8492)',
        description: isCardLocked
          ? 'Unfreeze your Visa Pro debit card'
          : 'Temporarily freeze your Visa Pro card against transactions',
        section: 'security' as SectionId,
        action: () => handleToggleLockCard(),
      },
      {
        id: 'act-statements',
        category: 'Actions',
        title: 'View Account Statements',
        description: 'View monthly statements and download PDF reports',
        section: 'dashboard' as SectionId,
        action: () => setActiveModal('viewStatements'),
      },
      {
        id: 'act-report-problem',
        category: 'Actions',
        title: 'Report a Problem',
        description: 'Submit an issue, bug, or security glitch to Lidprex Support',
        section: 'support' as SectionId,
        action: () => setActiveModal('reportProblem'),
      },
      {
        id: 'act-shortcuts',
        category: 'Actions',
        title: 'Keyboard Shortcuts',
        description: 'View full list of keyboard shortcuts (⌘K, ?, g-keys)',
        section: 'settings' as SectionId,
        action: () => setActiveModal('shortcuts'),
      },
      {
        id: 'act-checkin',
        category: 'Actions',
        title: 'Daily Streak Check-in',
        description: 'Check in today to maintain your activity streak and earn points',
        section: 'dashboard' as SectionId,
        action: () => handleDailyCheckin(),
      },
      {
        id: 'act-theme',
        category: 'Actions',
        title: `Switch to ${state.theme === 'dark' ? 'Light' : 'Dark'} Mode`,
        description: `Change visual theme to ${state.theme === 'dark' ? 'light' : 'dark'} mode`,
        section: 'settings' as SectionId,
        action: () => {
          const next = state.theme === 'dark' ? 'light' : 'dark';
          saveState((prev) => ({ ...prev, theme: next }));
          addToast(`Switched to ${next} mode`);
        },
      },
      {
        id: 'act-leakshield',
        category: 'Actions',
        title: 'Run LeakShield Security Scan',
        description: 'Scan your repositories and cloud assets for leaked API keys',
        section: 'products' as SectionId,
        action: () => runLeakShieldScan(),
      },
    ];

    // 3. Settings
    const settingsItems = [
      {
        id: 'set-theme',
        category: 'Settings',
        title: 'Theme Mode (Light / Dark)',
        description: 'Toggle between light and dark modes, update data-theme attribute',
        section: 'settings' as SectionId,
        action: () => {
          changeSection('settings');
          setSettingsTab('prefs');
        },
      },
      {
        id: 'set-density',
        category: 'Settings',
        title: 'Interface Density',
        description: 'Adjust spacing and visual density across cards and tables',
        section: 'settings' as SectionId,
        action: () => {
          changeSection('settings');
          setSettingsTab('prefs');
        },
      },
      {
        id: 'set-profile',
        category: 'Settings',
        title: 'Profile & Display Name',
        description: 'Update username, full name, birthday, and avatar color',
        section: 'settings' as SectionId,
        action: () => {
          changeSection('settings');
          setSettingsTab('general');
        },
      },
      {
        id: 'set-2fa',
        category: 'Settings',
        title: 'Two-Factor Authentication (2FA)',
        description: 'Configure authenticator app and backup verification codes',
        section: 'security' as SectionId,
        action: () => {
          changeSection('security');
          setSecurityTab('account');
        },
      },
      {
        id: 'set-backup-email',
        category: 'Settings',
        title: 'Backup Recovery Email',
        description: 'Add or update recovery email for account safeguard',
        section: 'settings' as SectionId,
        action: () => setActiveModal('backupEmail'),
      },
      {
        id: 'set-password',
        category: 'Settings',
        title: 'Change Password',
        description: 'Update your account login password securely',
        section: 'security' as SectionId,
        action: () => {
          changeSection('security');
          setSecurityTab('account');
        },
      },
      {
        id: 'set-notifs-prefs',
        category: 'Settings',
        title: 'Notification Preferences',
        description: 'Configure email alerts, push channels, and product alerts',
        section: 'notifications' as SectionId,
        action: () => {
          changeSection('notifications');
          setNotifTab('prefs');
        },
      },
      {
        id: 'set-export',
        category: 'Settings',
        title: 'Data Export & Backup',
        description: 'Export all account activity and profile data as JSON',
        section: 'settings' as SectionId,
        action: () => {
          changeSection('settings');
          setSettingsTab('export');
        },
      },
      {
        id: 'set-apps',
        category: 'Settings',
        title: 'Dashboard Apps Visibility',
        description: 'Choose which product apps appear on the Overview page',
        section: 'settings' as SectionId,
        action: () => {
          changeSection('settings');
          setSettingsTab('apps');
        },
      },
    ];

    // 4. Notification Items
    const notificationItems = state.notifs.map((n) => ({
      id: `notif-${n.id}`,
      category: 'Notifications',
      title: n.title,
      description: n.text,
      section: 'notifications' as SectionId,
      action: () => {
        saveState((prev) => ({
          ...prev,
          notifs: prev.notifs.map((item) => (item.id === n.id ? { ...item, read: true } : item)),
        }));
        changeSection('notifications');
        setNotifTab('inbox');
      },
    }));

    // 5. Activity Logs
    const activityItems = state.activity.slice(0, 8).map((a, idx) => ({
      id: `act-${a.ts}-${idx}`,
      category: 'Notifications',
      title: a.t,
      description: `Activity logged • ${ago(a.ts)}`,
      section: 'activity' as SectionId,
      action: () => setActiveModal('activityDrawer'),
    }));

    // 6. Navigation Items
    const navigationItems = [
      { id: 'nav-dash', category: 'Navigation', title: 'Overview Dashboard', description: 'Account summary, metrics, onboarding, and activity', section: 'dashboard' as SectionId, action: () => changeSection('dashboard') },
      { id: 'nav-prod', category: 'Navigation', title: 'Products Overview', description: 'Explore LeakShield, RepoPrep, Idea2Project, and LidBridge', section: 'products' as SectionId, action: () => changeSection('products') },
      { id: 'nav-sec', category: 'Navigation', title: 'Security Overview', description: '2FA, audit logs, authorized devices, and password', section: 'security' as SectionId, action: () => changeSection('security') },
      { id: 'nav-notif', category: 'Navigation', title: 'Notifications Center', description: 'Alerts, updates, security alerts, and system notices', section: 'notifications' as SectionId, action: () => changeSection('notifications') },
      { id: 'nav-sup', category: 'Navigation', title: 'Help & Support', description: 'Support tickets, knowledgebase, and assistance', section: 'support' as SectionId, action: () => changeSection('support') },
      { id: 'nav-faq', category: 'Navigation', title: 'Frequently Asked Questions', description: 'Help articles, guides, and account FAQ', section: 'faq' as SectionId, action: () => changeSection('faq') },
      { id: 'nav-feed', category: 'Navigation', title: 'Product Feedback', description: 'Submit suggestions, ideas, or report issues', section: 'feedback' as SectionId, action: () => changeSection('feedback') },
      { id: 'nav-set', category: 'Navigation', title: 'User Settings', description: 'Profile, theme toggle, layout density, and export', section: 'settings' as SectionId, action: () => changeSection('settings') },
    ];

    let all = [
      ...products,
      ...quickActions,
      ...settingsItems,
      ...notificationItems,
      ...activityItems,
      ...navigationItems,
    ];

    if (searchScope === 'page') {
      all = all.filter((item) => {
        if (item.section === activeSection) return true;
        if (
          activeSection === 'dashboard' &&
          (item.category === 'Products' ||
            item.category === 'Notifications' ||
            item.category === 'Actions')
        )
          return true;
        if (activeSection === 'support' && (item.section === 'open_ticket' || item.section === 'faq'))
          return true;
        return false;
      });
    }

    if (!q) {
      return all.slice(0, 10);
    }

    return all
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [
    cmdQuery,
    searchScope,
    activeSection,
    state.notifs,
    state.activity,
    state.theme,
    isCardLocked,
  ]);

  // LeakShield scan runner
  const runLeakShieldScan = () => {
    if (networkSim === 'offline') {
      addToast('Scan failed. You are offline. Check your connection.', true);
      return;
    }
    setIsScanning(true);
    setScanProgress(0);
    setScanResults([]);

    let p = 0;
    const iv = setInterval(() => {
      p += 8;
      setScanProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(iv);
        setIsScanning(false);
        const hasWarning = Math.random() < 0.3;
        const res = [
          { text: 'No exposed API keys', ok: true },
          { text: '.env file is ignored by git', ok: true },
          hasWarning
            ? { text: 'Possible token in config.js, line 12', ok: false }
            : { text: 'No secrets in the last 20 commits', ok: true },
        ];
        setScanResults(res);
        saveState((prev) => ({
          ...prev,
          stats: { ...prev.stats, scans: prev.stats.scans + 1 },
          scans: [{ ts: Date.now(), found: hasWarning ? 1 : 0 }, ...prev.scans.slice(0, 4)],
        }));
        logActivity('Ran a LeakShield scan');
        if (hasWarning) {
          saveState((prev) => ({
            ...prev,
            notifs: [
              {
                id: Date.now(),
                type: 'security',
                title: 'LeakShield',
                text: 'A possible token was found in config.js.',
                prod: 'leakshield',
                ts: Date.now(),
                read: false,
              },
              ...prev.notifs,
            ],
          }));
        }
        addToast(
          hasWarning ? 'Scan finished with 1 warning' : 'Scan finished, no leaks found',
          hasWarning
        );
      }
    }, 140);
  };

  // RepoPrep runner
  const runRepoPrep = (repoName: string) => {
    if (!repoName.trim() || !/^[\w.-]+(\/[\w.-]+)?$/.test(repoName.trim())) {
      addToast('Enter a repository name like your-name/project.', true);
      return;
    }
    setIsPreparingRepo(true);
    setRepoPrepItems([]);

    const items = [
      'README.md added',
      'LICENSE added',
      '.gitignore updated',
      'CONTRIBUTING.md added',
      'CI workflow checked',
    ];
    let i = 0;
    const iv = setInterval(() => {
      setRepoPrepItems((prev) => [...prev, items[i]]);
      i++;
      if (i >= items.length) {
        clearInterval(iv);
        setIsPreparingRepo(false);
        saveState((prev) => ({
          ...prev,
          stats: { ...prev.stats, repos: prev.stats.repos + 1 },
        }));
        logActivity(`Prepared ${repoName} with RepoPrep`);
        addToast('Repo prepared');
      }
    }, 260);
  };

  // Idea2Project blueprint generator
  const generateIdeaBlueprint = (idea: string) => {
    if (idea.trim().length < 10) {
      addToast('Describe your idea in at least 10 characters.', true);
      return;
    }
    const words = idea
      .split(/\s+/)
      .filter((w) => w.length > 3 && !/^(that|with|helps|this|from|your|have|will|want)$/i.test(w));
    const nm =
      (words
        .slice(0, 2)
        .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase().replace(/[^a-z]/g, ''))
        .join('') || 'Idea') + 'Kit';
    const isWeb = /web|site|app|platform|dashboard/i.test(idea);

    const bp = `Name: ${nm}\nStack: ${
      isWeb ? 'React, Node.js, PostgreSQL' : 'Python, SQLite, CLI'
    }\n\nMilestones:\n1. Define the core problem and target persona\n2. Build a ${
      isWeb ? 'single-page prototype' : 'working command-line version'
    }\n3. Add authentication and database persistence\n4. Test with five real users\n5. Launch and gather feedback`;

    setGeneratedBlueprint(bp);
    saveState((prev) => ({
      ...prev,
      stats: { ...prev.stats, projects: prev.stats.projects + 1 },
    }));
    logActivity('Created a blueprint with Idea2Project');
    addToast('Blueprint created');
  };

  // 2FA Actions
  const handleTurnOnTwoFactor = (code: string) => {
    if (!/^\d{6}$/.test(code.trim())) {
      return false;
    }
    saveState((prev) => ({
      ...prev,
      twofa: true,
      notifs: [
        {
          id: Date.now(),
          type: 'security',
          title: 'Security alert',
          text: 'Two-factor authentication was turned on.',
          ts: Date.now(),
          read: false,
        },
        ...prev.notifs,
      ],
    }));
    logActivity('Turned on two-factor');
    addToast('Two-factor is on');
    setActiveModal(null);
    return true;
  };

  const handleDisableTwoFactor = () => {
    saveState((prev) => ({
      ...prev,
      twofa: false,
      notifs: [
        {
          id: Date.now(),
          type: 'security',
          title: 'Security alert',
          text: 'Two-factor authentication was turned off.',
          ts: Date.now(),
          read: false,
        },
        ...prev.notifs,
      ],
    }));
    logActivity('Turned off two-factor');
    addToast('Two-factor is off');
    setActiveModal(null);
  };

  // Email verification
  const handleVerifyEmail = (code: string) => {
    if (code.trim() !== '123456') return false;
    saveState((prev) => ({
      ...prev,
      user: { ...prev.user, verified: true },
      notifs: [
        {
          id: Date.now(),
          type: 'security',
          title: 'Security alert',
          text: 'Your email address was verified.',
          ts: Date.now(),
          read: false,
        },
        ...prev.notifs,
      ],
    }));
    logActivity('Verified your email');
    awardPoints('verify', 10, 'verified your email');
    addToast('Email verified');
    setActiveModal(null);
    return true;
  };

  // Password update
  const handleUpdatePassword = async (cur: string, nw: string, code: string) => {
    saveState((prev) => ({
      ...prev,
      pwChanged: Date.now(),
      pwCode: '',
      notifs: [
        {
          id: Date.now(),
          type: 'security',
          title: 'Security alert',
          text: 'Your password was changed.',
          ts: Date.now(),
          read: false,
        },
        ...prev.notifs,
      ],
    }));
    logActivity('Changed your password');
    addToast('Password updated');
    return true;
  };

  // GitHub Link
  const handleConnectGithub = (username: string) => {
    const clean = username.trim().replace(/^@/, '');
    if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(clean)) return false;
    saveState((prev) => ({
      ...prev,
      conn: { ...prev.conn, github: clean },
      notifs: [
        {
          id: Date.now(),
          type: 'update',
          title: 'LidBridge',
          text: 'GitHub is linked. Your pushes will show up here.',
          prod: 'lidbridge',
          ts: Date.now(),
          read: false,
        },
        ...prev.notifs,
      ],
    }));
    logActivity(`Linked GitHub as @${clean}`);
    awardPoints('github', 10, 'linked GitHub');
    addToast('GitHub linked');
    setActiveModal(null);
    return true;
  };

  // Support ticket actions
  const handleCreateTicket = async (category: TicketCategory, subject: string, message: string) => {
    const newId = state.nextTicket;
    const newTicket: SupportTicket = {
      id: newId,
      subject,
      cat: category,
      status: 'Open',
      ts: Date.now(),
      opened: Date.now(),
      msgs: [{ f: 'me', t: message, ts: Date.now() }],
    };

    saveState((prev) => ({
      ...prev,
      nextTicket: prev.nextTicket + 1,
      tickets: [newTicket, ...prev.tickets],
    }));
    logActivity(`Opened ticket #${newId}`);
    awardPoints('ticket', 5, 'opened a ticket');
    addToast(`Ticket #${newId} opened`);
    setOpenTicketId(newId);
    changeSection('open_ticket');

    // Simulate auto-responder from Lidprex team
    setTimeout(() => {
      saveState((prev) => {
        const target = prev.tickets.find((t) => t.id === newId);
        if (!target) return prev;
        const autoReplies: Record<TicketCategory, string> = {
          Account: `Thanks ${prev.user.display}, we are checking your account settings now. Can you tell us when this started?`,
          Product: `Thanks ${prev.user.display}, we have passed this to the product team. Which product were you using?`,
          Billing: `Thanks ${prev.user.display}, we are looking at your billing details. We will update you shortly.`,
          Other: `Thanks ${prev.user.display}, we received your inquiry and our team is investigating.`,
        };
        const replyText = autoReplies[category];
        const updatedTicket: SupportTicket = {
          ...target,
          status: 'In progress',
          ts: Date.now(),
          msgs: [...target.msgs, { f: 'support', t: replyText, ts: Date.now() }],
        };
        return {
          ...prev,
          tickets: prev.tickets.map((t) => (t.id === newId ? updatedTicket : t)),
          notifs: [
            {
              id: Date.now(),
              type: 'update',
              title: `Support replied to #${newId}`,
              text: target.subject,
              ts: Date.now(),
              read: false,
            },
            ...prev.notifs,
          ],
        };
      });
      addToast(`Support replied to #${newId}`);
    }, 2800);

    return true;
  };

  const handleSendTicketReply = async (ticketId: number, msgText: string) => {
    saveState((prev) => {
      const target = prev.tickets.find((t) => t.id === ticketId);
      if (!target) return prev;
      const updatedTicket: SupportTicket = {
        ...target,
        status: target.status === 'Resolved' ? 'Open' : target.status,
        ts: Date.now(),
        msgs: [...target.msgs, { f: 'me', t: msgText, ts: Date.now() }],
      };
      return {
        ...prev,
        tickets: prev.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
      };
    });
    logActivity(`Replied on ticket #${ticketId}`);
    addToast('Reply sent');

    // Simulated follow-up
    setTimeout(() => {
      saveState((prev) => {
        const target = prev.tickets.find((t) => t.id === ticketId);
        if (!target) return prev;
        const updatedTicket: SupportTicket = {
          ...target,
          ts: Date.now(),
          msgs: [
            ...target.msgs,
            { f: 'support', t: 'Got it, thank you. We are reviewing this update right away.', ts: Date.now() },
          ],
        };
        return {
          ...prev,
          tickets: prev.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
          notifs: [
            {
              id: Date.now(),
              type: 'update',
              title: `Support replied to #${ticketId}`,
              text: target.subject,
              ts: Date.now(),
              read: false,
            },
            ...prev.notifs,
          ],
        };
      });
      addToast(`Support replied to #${ticketId}`);
    }, 2500);

    return true;
  };

  // Feedback action
  const handleSubmitFeedback = async (type: FeedbackType, title: string, details: string) => {
    const newId = Date.now();
    saveState((prev) => ({
      ...prev,
      feedback: [{ id: newId, type, title, status: 'Received', details }, ...prev.feedback],
    }));
    logActivity(`Sent feedback: ${title}`);
    awardPoints('feedback', 10, 'sent feedback');
    addToast('Thanks, your feedback was sent');

    setTimeout(() => {
      saveState((prev) => ({
        ...prev,
        feedback: prev.feedback.map((f) =>
          f.id === newId ? { ...f, status: 'In review' as const } : f
        ),
      }));
    }, 5000);

    return true;
  };

  // Daily check-in
  const handleDailyCheckin = () => {
    const today = dayKey();
    if (state.checkin === today) return;
    const yesterday = dayKey(Date.now() - DAY);
    const newStreak = state.checkin === yesterday ? state.streak + 1 : 1;

    saveState((prev) => ({
      ...prev,
      streak: newStreak,
      checkin: today,
      points: prev.points + 2,
    }));
    logActivity('Daily check-in');
    addToast(`Daily check-in: ${newStreak}-day streak!`);
  };

  // Quick Action: Toggle Card Lock
  const handleToggleLockCard = () => {
    setIsCardLocked((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('lidprex_card_locked', String(next));
      } catch {}
      if (next) {
        logActivity('Security freeze: Card #•••• 8492 locked');
        addToast('🔒 Card locked: All card transactions & API billing are now frozen');
      } else {
        logActivity('Security unfreeze: Card #•••• 8492 unlocked');
        addToast('🔓 Card unlocked: Card transactions resumed');
      }
      return next;
    });
  };

  // Quick Action: Submit Problem Report
  const handleSubmitProblemReport = () => {
    if (!reportSummary.trim()) {
      addToast('Please enter a brief summary of the problem', true);
      return;
    }
    setReportSubmitting(true);
    setTimeout(() => {
      const newTicketId = Date.now();
      const catMap: Record<string, TicketCategory> = {
        bug: 'Product',
        security: 'Account',
        billing: 'Billing',
        glitch: 'Other',
      };
      const newTicket: SupportTicket = {
        id: newTicketId,
        subject: `[Problem Report] ${reportSummary}`,
        cat: catMap[reportCategory] || 'Other',
        status: 'Open',
        ts: Date.now(),
        opened: Date.now(),
        msgs: [
          {
            f: 'me',
            t: `Category: ${reportCategory}\nUrgency: ${reportUrgency}\nDiagnostic logs attached: ${reportAttachLogs ? 'Yes (Safari/macOS)' : 'No'}\n\nDetails:\n${reportDetails || reportSummary}`,
            ts: Date.now(),
          },
        ],
      };
      saveState((prev) => ({
        ...prev,
        tickets: [newTicket, ...prev.tickets],
        notifs: [
          {
            id: Date.now(),
            type: 'update',
            title: `Problem Report submitted (#${newTicketId})`,
            text: reportSummary,
            ts: Date.now(),
            read: false,
          },
          ...prev.notifs,
        ],
      }));
      logActivity(`Reported problem: ${reportSummary}`);
      addToast('🚨 Problem report submitted. Our security team will review it within 1 hour.');
      setReportSubmitting(false);
      setReportSummary('');
      setReportDetails('');
      setActiveModal(null);
    }, 400);
  };

  // Quick Action: Download Statement
  const handleDownloadStatement = (month: string) => {
    logActivity(`Downloaded statement: ${month}`);
    addToast(`📄 Statement downloaded: Statement_${month.replace(/\s+/g, '_')}.pdf`);
  };

  // If user signed out or deleted account
  if (state.out) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)]">
        <div className="bg-[var(--card)] border border-[var(--line)] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[var(--brand)] text-white font-black text-2xl mx-auto flex items-center justify-center mb-4">
            L
          </div>
          <h1 className="text-2xl font-bold text-[var(--fg)] mb-2">
            {state.out === 'deleted' ? 'Account deleted' : 'You are signed out'}
          </h1>
          <p className="text-sm text-[var(--mut)] mb-6">
            {state.out === 'deleted'
              ? 'This was a demo, so no real data was destroyed. Start over with fresh sample data.'
              : 'Log back in to return to your personal dashboard.'}
          </p>
          <button
            onClick={() => {
              if (state.out === 'deleted') {
                const fresh = getDefaultState();
                setState(fresh);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
                window.location.hash = 'dashboard';
                setActiveSection('dashboard');
                addToast('Demo data restored');
              } else {
                saveState((prev) => ({ ...prev, out: null }));
              }
            }}
            className="w-full py-3 bg-[var(--brand)] text-white font-bold text-sm rounded-xl hover:opacity-95 shadow-sm transition-all"
          >
            {state.out === 'deleted' ? 'Start over' : `Log in as ${state.user.display}`}
          </button>
        </div>
      </div>
    );
  }

  const currentOpenTicket = state.tickets.find((t) => t.id === openTicketId) || state.tickets[0];
  const initial = (state.user.display || 'A').trim().charAt(0).toUpperCase();

  // Skeleton shimmer placeholder
  const renderSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-44 w-full bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 flex gap-6">
        <div className="w-32 h-32 rounded-full bg-[var(--raised)]" />
        <div className="flex-1 space-y-3 pt-2">
          <div className="h-4 bg-[var(--raised)] rounded w-1/3" />
          <div className="h-6 bg-[var(--raised)] rounded w-2/3" />
          <div className="h-4 bg-[var(--raised)] rounded w-1/2" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="h-28 bg-[var(--card)] border border-[var(--line)] rounded-2xl p-5" />
        <div className="h-28 bg-[var(--card)] border border-[var(--line)] rounded-2xl p-5" />
        <div className="h-28 bg-[var(--card)] border border-[var(--line)] rounded-2xl p-5" />
      </div>
    </div>
  );

  // Simulated error box
  const renderErrorBox = () => (
    <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-8 max-w-lg shadow-[var(--cardsh)] space-y-4">
      <div className="w-12 h-12 rounded-xl bg-[var(--bad)]/15 border border-[var(--bad)]/35 flex items-center justify-center text-[var(--bad)]">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-[var(--fg)]">
        {networkSim === 'offline' ? 'You are offline' : `We could not load ${headerMeta.title.toLowerCase()}`}
      </h2>
      <p className="text-sm text-[var(--mut)]">
        {networkSim === 'offline'
          ? 'Check your connection. Nothing was lost, and your drafts are safe.'
          : 'Something went wrong on our side. Try again in a moment.'}
      </p>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => {
            setSimulatedError(false);
            setIsSimulatedLoading(true);
            setTimeout(() => setIsSimulatedLoading(false), 500);
          }}
          className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
        >
          Try again
        </button>
        <button
          onClick={() => {
            setSimulatedError(false);
            changeSection('dashboard');
          }}
          className="px-4 py-2 bg-[var(--raised)] border border-[var(--line)] text-xs font-semibold rounded-xl text-[var(--fg)]"
        >
          Back to Overview
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex">
      {/* Sidebar Navigation */}
      <PersonalAccountSidebar
        theme={state.theme}
        activeSection={activeSection}
        onSectionChange={changeSection}
        onLogout={() => {
          saveState((prev) => ({ ...prev, out: 'out' }));
        }}
        user={state.user}
        unreadNotificationsCount={state.notifs.filter((n) => !n.read).length}
        openTicketActive={activeSection === 'open_ticket'}
        isOpen={true}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        onCloseSidebar={() => setSidebarCollapsed(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 p-3 sm:p-6 lg:p-8 min-w-0 pb-24 md:pb-8 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-6 bg-[var(--shell)] border border-[var(--line)] rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xs">
          {/* Header Bar */}
          <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--fg)] break-words">
                  {headerMeta.title}
                </h1>
                <p className="text-xs sm:text-sm text-[var(--mut2)] mt-0.5 break-words">
                  {headerMeta.subtitle}
                </p>
              </div>
            </div>

            {/* Quick Actions & Profile Header Menu */}
            <div className="flex items-center gap-2 sm:gap-2.5 relative shrink-0 flex-wrap sm:flex-nowrap">
              {/* Header Search Trigger Bar Button (Opens Search Pop-Up Tab Modal) */}
              <button
                type="button"
                onClick={() => {
                  setCmdQuery('');
                  setCmdIndex(0);
                  setSearchScope('global');
                  setCmdOpen(true);
                }}
                className={`flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl border-2 transition-all shadow-xs cursor-pointer min-w-[200px] sm:min-w-[260px] lg:min-w-[320px] text-left group ${
                  cmdOpen
                    ? 'border-pink-500 border-b-4 border-b-pink-600 bg-pink-500/10 text-[var(--fg)] shadow-[0_4px_16px_rgba(236,72,153,0.35)] scale-[1.02]'
                    : 'border-slate-300 dark:border-slate-700 bg-[var(--card)] hover:border-pink-500 text-slate-500 dark:text-slate-400 hover:text-[var(--fg)] active:border-b-4 active:border-b-pink-500 active:shadow-[0_4px_12px_rgba(236,72,153,0.3)]'
                }`}
                title="Search products, settings, or dashboard (⌘K or click)"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Search className="w-4 h-4 text-pink-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-[var(--mut2)] truncate font-medium">
                    Search products, settings, alerts...
                  </span>
                </div>
                <kbd className="text-[10px] font-mono text-[var(--mut2)] px-1.5 py-0.5 rounded bg-[var(--raised)] border border-[var(--line)] shrink-0 select-none font-bold">
                  ⌘K
                </kbd>
              </button>

              {/* Quick Light/Dark Theme Switcher */}
              <button
                onClick={() => {
                  const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
                  saveState((prev) => ({ ...prev, theme: nextTheme }));
                  addToast(`Switched to ${nextTheme} theme`);
                }}
                className="w-10 h-10 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-[var(--card)] flex items-center justify-center text-[var(--fg)] hover:border-pink-500 hover:text-pink-600 transition-all shadow-xs shrink-0 active:scale-95 active:border-b-4 active:border-b-pink-500 active:shadow-[0_4px_14px_rgba(236,72,153,0.35)] cursor-pointer"
                title={`Switch to ${state.theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {state.theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-purple-600" />
                )}
              </button>

              {/* Notification icon & Small Card Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDropdownOpen((prev) => !prev);
                    setMenuOpen(false);
                  }}
                  className={`w-10 h-10 rounded-xl border-2 bg-[var(--card)] flex items-center justify-center text-[var(--fg)] transition-all shadow-xs relative shrink-0 cursor-pointer active:scale-95 ${
                    notifDropdownOpen
                      ? 'border-pink-500 border-b-4 border-b-pink-600 text-pink-600 shadow-[0_4px_16px_rgba(236,72,153,0.35)] bg-pink-500/10 ring-2 ring-pink-500/30 scale-[1.02]'
                      : 'border-slate-300 dark:border-slate-700 hover:border-pink-500 hover:text-pink-600'
                  }`}
                  title="Notifications"
                  aria-expanded={notifDropdownOpen}
                >
                  <Bell className="w-4 h-4" />
                  {state.notifs.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {state.notifs.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Small notification card popup */}
                <NotificationDropdown
                  isOpen={notifDropdownOpen}
                  onClose={() => setNotifDropdownOpen(false)}
                  notifications={state.notifs}
                  recentActivities={state.activity}
                  onToggleRead={(nId) => {
                    saveState((prev) => ({
                      ...prev,
                      notifs: prev.notifs.map((n) => (n.id === nId ? { ...n, read: !n.read } : n)),
                    }));
                  }}
                  onMarkAllRead={() => {
                    const unreadIds = state.notifs.filter((n) => !n.read).map((n) => n.id);
                    saveState((prev) => ({
                      ...prev,
                      notifs: prev.notifs.map((n) => ({ ...n, read: true })),
                    }));
                    addToast('All notifications marked read', false, () => {
                      saveState((prev) => ({
                        ...prev,
                        notifs: prev.notifs.map((n) =>
                          unreadIds.includes(n.id) ? { ...n, read: false } : n
                        ),
                      }));
                    });
                  }}
                  onNavigateToNotifications={() => {
                    setNotifDropdownOpen(false);
                    changeSection('notifications');
                    setNotifTab('inbox');
                  }}
                />
              </div>

              {/* Account Dropdown Button with Pink/Purple Gradient */}
              <button
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                  setNotifDropdownOpen(false);
                }}
                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm shadow-md transition-all shrink-0 cursor-pointer active:scale-95 ${
                  menuOpen
                    ? 'border-pink-600 border-b-4 border-b-pink-700 ring-2 ring-pink-500/40 shadow-[0_4px_18px_rgba(236,72,153,0.45)] scale-105'
                    : 'border-[#EC4899] hover:scale-105 hover:shadow-[0_4px_12px_rgba(236,72,153,0.3)]'
                } ${
                  !state.user.color ? 'bg-gradient-to-tr from-[#EC4899] to-[#8B5CF6] text-white' : 'text-white'
                }`}
                style={{
                  backgroundColor: state.user.color || undefined,
                }}
              >
                {initial}
              </button>

              {/* Menu Dropdown Popup */}
              {menuOpen && (
                <div className="absolute right-0 top-12 w-52 rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-2xl p-2 z-50 space-y-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      changeSection('settings');
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold rounded-lg hover:bg-[var(--raised)] text-[var(--fg)]"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      changeSection('support');
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold rounded-lg hover:bg-[var(--raised)] text-[var(--fg)]"
                  >
                    Support
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      saveState((prev) => ({
                        ...prev,
                        theme: prev.theme === 'dark' ? 'light' : 'dark',
                      }));
                      addToast(`Switched to ${state.theme === 'dark' ? 'light' : 'dark'} theme`);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold rounded-lg hover:bg-[var(--raised)] text-[var(--fg)]"
                  >
                    Switch to {state.theme === 'dark' ? 'light' : 'dark'} theme
                  </button>
                  <hr className="border-[var(--line)] my-1" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      saveState((prev) => ({ ...prev, out: 'out' }));
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold rounded-lg text-[var(--bad)] hover:bg-[var(--raised)]"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Offline Simulator Warning Banner */}
          {networkSim === 'offline' && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--warn)]/15 border border-[var(--warn)]/30 text-[var(--fg)] text-xs">
              <WifiOff className="w-4 h-4 text-[var(--warn)] flex-shrink-0" />
              <span className="flex-1">
                You are offline. Changes cannot be permanently synced until you reconnect.
              </span>
              <button
                onClick={() => setNetworkSim('normal')}
                className="font-bold text-[var(--brandtxt)] hover:underline"
              >
                Go online
              </button>
            </div>
          )}

          {/* Active Section Rendering */}
          <main>
            {isSimulatedLoading ? (
              renderSkeleton()
            ) : simulatedError ? (
              renderErrorBox()
            ) : (
              <>
                {activeSection === 'dashboard' && (
                  <DashboardSection
                    state={state}
                    onNavigate={(dest) => changeSection(dest as SectionId)}
                    onOpenProduct={handleOpenProduct}
                    onOpenBreakdown={() => setActiveModal('breakdown')}
                    onTriggerSecurityStep={(act) => {
                      if (act === 'on2fa') setActiveModal('enable2fa');
                      else if (act === 'verify') setActiveModal('verifyEmail');
                      else if (act === 'pwgo') {
                        changeSection('security');
                        setSecurityTab('password');
                      } else if (act === 'devgo') {
                        changeSection('security');
                        setSecurityTab('history');
                      } else if (act === 'backup') setActiveModal('backupEmail');
                      else if (act === 'github') setActiveModal('github');
                      else if (act === 'prod') changeSection('products');
                      else if (act === 'feedback') changeSection('feedback');
                    }}
                    onToggleOnboard={() => {
                      saveState((prev) => ({
                        ...prev,
                        onboard: prev.onboard === 'show' ? 'hidden' : 'show',
                      }));
                    }}
                    onChangeRange={(r) => saveState((prev) => ({ ...prev, range: r }))}
                    onOpenActivityDrawer={() => setActiveModal('activityDrawer')}
                    onToggleRead={(nId) => {
                      saveState((prev) => ({
                        ...prev,
                        notifs: prev.notifs.map((n) => (n.id === nId ? { ...n, read: !n.read } : n)),
                      }));
                    }}
                    onMarkAllRead={() => {
                      const unreadIds = state.notifs.filter((n) => !n.read).map((n) => n.id);
                      saveState((prev) => ({
                        ...prev,
                        notifs: prev.notifs.map((n) => ({ ...n, read: true })),
                      }));
                      addToast('All notifications marked read', false, () => {
                        saveState((prev) => ({
                          ...prev,
                          notifs: prev.notifs.map((n) =>
                            unreadIds.includes(n.id) ? { ...n, read: false } : n
                          ),
                        }));
                      });
                    }}
                    focusedCardIndex={focusedCardIndex}
                    onCardFocus={(idx) => setFocusedCardIndex(idx)}
                    isCardLocked={isCardLocked}
                    onToggleLockCard={handleToggleLockCard}
                    onReportProblem={() => setActiveModal('reportProblem')}
                    onViewStatements={() => setActiveModal('viewStatements')}
                  />
                )}

                {activeSection === 'products' && (
                  <ProductsSection
                    state={state}
                    onOpenProduct={handleOpenProduct}
                    onToggleFavorite={(id) => {
                      saveState((prev) => {
                        const nextFav = !prev.fav[id];
                        if (nextFav) logActivity(`Saved ${PROD_INFO[id].name} to favorites`);
                        addToast(nextFav ? 'Saved to favorites' : 'Removed from favorites');
                        return {
                          ...prev,
                          fav: { ...prev.fav, [id]: nextFav },
                        };
                      });
                    }}
                    onConnectGithub={() => setActiveModal('github')}
                    onOpenActivityDrawer={() => setActiveModal('activityDrawer')}
                  />
                )}

                {activeSection === 'security' && (
                  <SecuritySection
                    state={state}
                    activeTab={securityTab}
                    onTabChange={setSecurityTab}
                    onOpenTwoFactorModal={() => setActiveModal('enable2fa')}
                    onDisableTwoFactor={() => setActiveModal('disable2fa')}
                    onOpenRecoveryCodesModal={() => setActiveModal('recoveryCodes')}
                    onOpenVerifyEmailModal={() => setActiveModal('verifyEmail')}
                    onOpenBreakdownModal={() => setActiveModal('breakdown')}
                    onSignOutSession={(sId) => {
                      saveState((prev) => ({
                        ...prev,
                        sessions: prev.sessions.filter((s) => s.id !== sId),
                      }));
                      logActivity('Signed out a device');
                      addToast('Signed out device');
                    }}
                    onSignOutOthers={() => {
                      const count = state.sessions.length - 1;
                      saveState((prev) => ({
                        ...prev,
                        sessions: prev.sessions.filter((s) => s.cur),
                        notifs: [
                          {
                            id: Date.now(),
                            type: 'security',
                            title: 'Security alert',
                            text: `You signed out ${count} other device${count === 1 ? '' : 's'}.`,
                            ts: Date.now(),
                            read: false,
                          },
                          ...prev.notifs,
                        ],
                      }));
                      logActivity('Signed out other devices');
                      addToast(`Signed out ${count} device${count === 1 ? '' : 's'}`);
                    }}
                    onUpdatePassword={handleUpdatePassword}
                    onSendPasswordCode={() => {
                      saveState((prev) => ({ ...prev, pwCode: '482913' }));
                      addToast('Code sent. In this demo the code is 482913.');
                    }}
                    onTriggerSecurityAction={(act) => {
                      if (act === 'on2fa') setActiveModal('enable2fa');
                      else if (act === 'verify') setActiveModal('verifyEmail');
                      else if (act === 'pwgo') setSecurityTab('password');
                      else if (act === 'devgo') setSecurityTab('history');
                      else if (act === 'backup') setActiveModal('backupEmail');
                    }}
                    drafts={drafts}
                    onUpdateDraft={updateDraft}
                  />
                )}

                {activeSection === 'notifications' && (
                  <NotificationsSection
                    state={state}
                    activeTab={notifTab}
                    onTabChange={setNotifTab}
                    onToggleRead={(nId) => {
                      saveState((prev) => ({
                        ...prev,
                        notifs: prev.notifs.map((n) => (n.id === nId ? { ...n, read: !n.read } : n)),
                      }));
                    }}
                    onDismiss={(nId) => {
                      const dismissed = state.notifs.find((n) => n.id === nId);
                      saveState((prev) => ({
                        ...prev,
                        notifs: prev.notifs.filter((n) => n.id !== nId),
                      }));
                      if (dismissed) {
                        addToast('Notification dismissed', false, () => {
                          saveState((prev) => ({
                            ...prev,
                            notifs: [dismissed, ...prev.notifs].sort((a, b) => b.ts - a.ts),
                          }));
                        });
                      }
                    }}
                    onMarkAllRead={() => {
                      const unreadIds = state.notifs.filter((n) => !n.read).map((n) => n.id);
                      saveState((prev) => ({
                        ...prev,
                        notifs: prev.notifs.map((n) => ({ ...n, read: true })),
                      }));
                      addToast('All notifications marked read', false, () => {
                        saveState((prev) => ({
                          ...prev,
                          notifs: prev.notifs.map((n) =>
                            unreadIds.includes(n.id) ? { ...n, read: false } : n
                          ),
                        }));
                      });
                    }}
                    onToggleEmailPref={(key) => {
                      saveState((prev) => ({
                        ...prev,
                        prefs: { ...prev.prefs, [key]: !prev.prefs[key] },
                      }));
                      addToast('Email preferences updated');
                    }}
                    onToggleBrowserAlerts={() => {
                      const now = Date.now();
                      const recent = browserToggleTimestamps.filter((t) => now - t < 20000);
                      if (browserAlertsLockTime > now) return;
                      if (recent.length >= 3) {
                        const lockUntil = recent[0] + 20000;
                        setBrowserAlertsLockTime(lockUntil);
                        addToast('Too many changes. Please wait.', true);
                        return;
                      }
                      setBrowserToggleTimestamps([...recent, now]);
                      saveState((prev) => ({ ...prev, browser: !prev.browser }));
                      addToast(`Browser alerts ${!state.browser ? 'on' : 'off'}`);
                    }}
                    browserAlertsLockTime={browserAlertsLockTime}
                    onToggleProductChannel={(prodId, channel) => {
                      saveState((prev) => ({
                        ...prev,
                        pp: {
                          ...prev.pp,
                          [prodId]: {
                            ...prev.pp[prodId],
                            [channel]: !prev.pp[prodId][channel],
                          },
                        },
                      }));
                      addToast(`${PROD_INFO[prodId].name}: ${channel} channel toggled`);
                    }}
                    onChangeProductMute={(prodId, hours) => {
                      const prevMute = state.pp[prodId].mute;
                      const newMute = hours === 0 ? 0 : hours === -1 ? -1 : Date.now() + hours * HR;
                      saveState((prev) => ({
                        ...prev,
                        pp: {
                          ...prev.pp,
                          [prodId]: {
                            ...prev.pp[prodId],
                            mute: newMute,
                          },
                        },
                      }));
                      addToast(
                        `${PROD_INFO[prodId].name} ${hours === 0 ? 'unmuted' : 'muted'}`,
                        false,
                        () => {
                          saveState((prev) => ({
                            ...prev,
                            pp: {
                              ...prev.pp,
                              [prodId]: { ...prev.pp[prodId], mute: prevMute },
                            },
                          }));
                        }
                      );
                    }}
                    onSendProductTest={(prodId) => {
                      const pref = state.pp[prodId];
                      const muted = pref.mute === -1 || pref.mute > Date.now();
                      if (muted) {
                        addToast(`${PROD_INFO[prodId].name} is currently muted. Nothing was sent.`);
                        return;
                      }
                      const sentChans: string[] = [];
                      if (pref.inapp) {
                        saveState((prev) => ({
                          ...prev,
                          notifs: [
                            {
                              id: Date.now(),
                              type: 'update',
                              prod: prodId,
                              title: PROD_INFO[prodId].name,
                              text: 'This is a test notification.',
                              ts: Date.now(),
                              read: false,
                            },
                            ...prev.notifs,
                          ],
                        }));
                        sentChans.push('In-app');
                      }
                      if (pref.email) sentChans.push('Email');
                      if (pref.browser && state.browser) sentChans.push('Browser');

                      if (sentChans.length) {
                        addToast(`Test sent: ${sentChans.join(', ')}`);
                      } else {
                        addToast(`All delivery channels are off for ${PROD_INFO[prodId].name}.`);
                      }
                    }}
                    onResetProductPrefs={() => {
                      saveState((prev) => ({
                        ...prev,
                        pp: {
                          leakshield: { email: true, inapp: true, browser: false, mute: 0 },
                          repoprep: { email: true, inapp: true, browser: false, mute: 0 },
                          idea2project: { email: true, inapp: true, browser: false, mute: 0 },
                          lidbridge: { email: true, inapp: true, browser: false, mute: 0 },
                        },
                      }));
                      addToast('Product notification preferences reset to defaults');
                    }}
                  />
                )}

                {activeSection === 'support' && (
                  <SupportSection
                    state={state}
                    onOpenTicket={(id) => {
                      setOpenTicketId(id);
                      changeSection('open_ticket');
                    }}
                    onCreateTicket={handleCreateTicket}
                    onNavigateToFaq={() => changeSection('faq')}
                  />
                )}

                {activeSection === 'open_ticket' && (
                  <OpenTicketSection
                    ticket={currentOpenTicket}
                    userEmail={state.user.email}
                    onBack={() => changeSection('support')}
                    onSendReply={handleSendTicketReply}
                    onToggleStatus={(tId) => {
                      saveState((prev) => {
                        const target = prev.tickets.find((t) => t.id === tId);
                        if (!target) return prev;
                        const nextStatus = target.status === 'Resolved' ? 'Open' : 'Resolved';
                        return {
                          ...prev,
                          tickets: prev.tickets.map((t) =>
                            t.id === tId ? { ...t, status: nextStatus, ts: Date.now() } : t
                          ),
                        };
                      });
                      addToast('Ticket status updated');
                    }}
                    onCopyTranscript={(t) => {
                      const transcript =
                        `#${t.id} ${t.subject} (${t.status})\n\n` +
                        t.msgs
                          .map((m) => `${m.f === 'me' ? 'You' : 'Support'} (${ago(m.ts)}): ${m.t}`)
                          .join('\n');
                      setModalData({ transcript });
                      setActiveModal('transcript');
                    }}
                    onRemoveTicket={(tId) => {
                      const removed = state.tickets.find((t) => t.id === tId);
                      saveState((prev) => ({
                        ...prev,
                        tickets: prev.tickets.filter((t) => t.id !== tId),
                      }));
                      changeSection('support');
                      if (removed) {
                        addToast(`Ticket #${tId} removed`, false, () => {
                          saveState((prev) => ({
                            ...prev,
                            tickets: [removed, ...prev.tickets].sort((a, b) => b.ts - a.ts),
                          }));
                        });
                      }
                    }}
                  />
                )}

                {activeSection === 'faq' && (
                  <FaqSection
                    onNavigateAction={(dest) => {
                      if (dest === 'settings') changeSection('settings');
                      else if (dest === 'photo') {
                        changeSection('settings');
                        setSettingsTab('general');
                        setActiveModal('photoColor');
                      } else if (dest === 'security') changeSection('security');
                      else if (dest === 'github') setActiveModal('github');
                      else if (dest === 'notifications') changeSection('notifications');
                      else if (dest === 'danger') {
                        changeSection('settings');
                        setSettingsTab('danger');
                      }
                    }}
                    onOpenTicket={() => changeSection('support')}
                  />
                )}

                {activeSection === 'feedback' && (
                  <FeedbackSection
                    feedbackList={state.feedback}
                    onSubmitFeedback={handleSubmitFeedback}
                  />
                )}

                {activeSection === 'settings' && (
                  <SettingsSection
                    state={state}
                    activeTab={settingsTab}
                    onTabChange={setSettingsTab}
                    onUpdateProfile={async (prof) => {
                      saveState((prev) => ({
                        ...prev,
                        user: { ...prev.user, ...prof },
                      }));
                      logActivity('Updated your profile');
                      addToast('Profile saved');
                      return true;
                    }}
                    onChangeAvatarColor={() => setActiveModal('photoColor')}
                    onConnectGithub={() => setActiveModal('github')}
                    onDisconnectGithub={() => {
                      const prevVal = state.conn.github;
                      saveState((prev) => ({
                        ...prev,
                        conn: { ...prev.conn, github: '' },
                      }));
                      addToast('GitHub disconnected', false, () => {
                        saveState((prev) => ({
                          ...prev,
                          conn: { ...prev.conn, github: prevVal },
                        }));
                      });
                    }}
                    onConnectDiscord={() => setActiveModal('discord')}
                    onDisconnectDiscord={() => {
                      const prevVal = state.conn.discord;
                      saveState((prev) => ({
                        ...prev,
                        conn: { ...prev.conn, discord: '' },
                      }));
                      addToast('Discord disconnected', false, () => {
                        saveState((prev) => ({
                          ...prev,
                          conn: { ...prev.conn, discord: prevVal },
                        }));
                      });
                    }}
                    onVerifyEmail={() => setActiveModal('verifyEmail')}
                    onAddBackupEmail={() => setActiveModal('backupEmail')}
                    onRemoveBackupEmail={() => {
                      const prevVal = state.user.backup;
                      saveState((prev) => ({
                        ...prev,
                        user: { ...prev.user, backup: '' },
                      }));
                      addToast('Backup email removed', false, () => {
                        saveState((prev) => ({
                          ...prev,
                          user: { ...prev.user, backup: prevVal },
                        }));
                      });
                    }}
                    onNavigateToSecurity={() => {
                      changeSection('security');
                      setSecurityTab('account');
                    }}
                    onToggleAppVisibility={(prodId) => {
                      saveState((prev) => ({
                        ...prev,
                        apps: {
                          ...prev.apps,
                          [prodId]: prev.apps[prodId] === false,
                        },
                      }));
                    }}
                    onSetTheme={(t) => {
                      saveState((prev) => ({ ...prev, theme: t }));
                      addToast(`Theme set to ${t}`);
                    }}
                    onPreviewTheme={(t) => {
                      const root = document.documentElement;
                      const effective = t || state.theme;
                      const isDark =
                        effective === 'dark' ||
                        (effective === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                      if (effective === 'system') {
                        root.removeAttribute('data-theme');
                      } else {
                        root.dataset.theme = effective;
                      }
                      root.classList.toggle('dark', isDark);
                      root.classList.toggle('light', !isDark);
                    }}
                    onSetDensity={(d) => {
                      saveState((prev) => ({ ...prev, density: d }));
                      addToast(`Layout density set to ${d}`);
                    }}
                    onSetNetworkSim={(sim) => {
                      setNetworkSim(sim);
                      addToast(`Network simulation set to ${sim}`);
                    }}
                    onReloadPage={() => {
                      setIsSimulatedLoading(true);
                      setTimeout(() => setIsSimulatedLoading(false), 700);
                      addToast('Page reloaded');
                    }}
                    onTriggerFailNext={() => {
                      setSimulatedError(true);
                      addToast('Simulating error state');
                    }}
                    onToggleMotion={() => {
                      saveState((prev) => ({ ...prev, motion: !prev.motion }));
                      addToast(`Animations ${!state.motion ? 'enabled' : 'disabled'}`);
                    }}
                    onToggleOnboardSetting={() => {
                      saveState((prev) => ({
                        ...prev,
                        onboard: prev.onboard === 'show' ? 'hidden' : 'show',
                      }));
                    }}
                    onToggleHoverTabs={() => {
                      saveState((prev) => ({ ...prev, hoverTabs: !prev.hoverTabs }));
                      addToast(`Hover shortcuts ${!state.hoverTabs ? 'on' : 'off'}`);
                    }}
                    onOpenShortcutsModal={() => setActiveModal('shortcuts')}
                    onGenerateExport={(json) => {
                      setModalData({ exportJson: json });
                      setActiveModal('exportJson');
                    }}
                    onResetDemoData={() => setActiveModal('resetData')}
                    onDeleteAccount={() => setActiveModal('deleteAccount')}
                  />
                )}


                {activeSection === 'activity' && (
                  <ActivitySection activityList={state.activity} />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* SEARCH POP-UP TAB MODAL (CMD+K / SEARCH BUTTON) */}
      {cmdOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center pt-16 sm:pt-20 p-3 sm:p-4 animate-fade-in"
          onClick={() => setCmdOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Search Input Bar */}
            <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-[var(--line)] bg-[var(--card)]">
              <Search className="w-5 h-5 text-pink-500 shrink-0" />
              <input
                autoFocus
                type="text"
                value={cmdQuery}
                onChange={(e) => {
                  setCmdQuery(e.target.value);
                  setCmdIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setCmdIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setCmdIndex((prev) => Math.max(prev - 1, 0));
                  } else if (e.key === 'Tab') {
                    e.preventDefault();
                    setSearchScope((prev) => (prev === 'global' ? 'page' : 'global'));
                    setCmdIndex(0);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (searchResults[cmdIndex]) {
                      setCmdOpen(false);
                      searchResults[cmdIndex].action();
                    }
                  } else if (e.key === 'Escape') {
                    setCmdOpen(false);
                  }
                }}
                placeholder={
                  searchScope === 'global'
                    ? 'Search products, actions, settings, or alerts...'
                    : `Search on this page (${headerMeta.title})...`
                }
                className="w-full bg-transparent text-sm sm:text-base font-semibold text-[var(--fg)] placeholder-[var(--mut2)] outline-none border-none min-w-0"
              />
              {cmdQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setCmdQuery('');
                    setCmdIndex(0);
                  }}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-[var(--fg)] hover:bg-[var(--raised)] flex items-center justify-center transition-colors cursor-pointer text-xs font-bold shrink-0"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
              <button
                type="button"
                onClick={() => setCmdOpen(false)}
                className="px-2 py-1 rounded-lg text-[11px] font-mono font-bold bg-[var(--raised)] text-[var(--mut2)] hover:text-[var(--fg)] border border-[var(--line)] shrink-0 cursor-pointer"
                title="Close (Esc)"
              >
                ESC
              </button>
            </div>

            {/* Scope Filter Tabs Header (shown in pop-up modal as requested) */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[var(--mut2)]">Search Scope:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchScope('global');
                    setCmdIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    searchScope === 'global'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 border-2 border-pink-600 text-white shadow-md ring-2 ring-pink-500/30 scale-[1.02]'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-pink-500 shadow-xs'
                  }`}
                >
                  <span>🌐 Global</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchScope('page');
                    setCmdIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    searchScope === 'page'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 border-2 border-pink-600 text-white shadow-md ring-2 ring-pink-500/30 scale-[1.02]'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-pink-500 shadow-xs'
                  }`}
                >
                  <span>📄 This Page ({headerMeta.title})</span>
                </button>
              </div>

              <span className="text-[11px] font-semibold text-[var(--mut2)] hidden sm:inline">
                {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'}
              </span>
            </div>

            {/* Search Results List */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-3 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[50vh]">
              {searchResults.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center mx-auto text-xl">
                    🔍
                  </div>
                  <p className="text-sm font-bold text-[var(--fg)]">No matching results found</p>
                  <p className="text-xs text-[var(--mut2)] max-w-sm mx-auto">
                    {searchScope === 'page'
                      ? 'Try switching to Global search to find items across all dashboard pages'
                      : 'Try searching for products like LeakShield, settings like 2FA, or actions like Lock Card'}
                  </p>
                  {searchScope === 'page' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchScope('global');
                        setCmdIndex(0);
                      }}
                      className="mt-2 px-3 py-1.5 rounded-xl bg-pink-500 text-white text-xs font-bold hover:bg-pink-600 transition-colors cursor-pointer"
                    >
                      Switch to Global Search
                    </button>
                  )}
                </div>
              ) : (
                searchResults.map((item, i) => {
                  const isSelected = cmdIndex === i;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCmdOpen(false);
                        item.action();
                      }}
                      onMouseEnter={() => setCmdIndex(i)}
                      className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-pink-50/80 dark:bg-pink-950/30 border-2 border-pink-500 shadow-xs'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-2 border-transparent'
                      }`}
                    >
                      {/* Category Icon Badge */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                          isSelected
                            ? 'bg-pink-500 text-white border-pink-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 group-hover:border-pink-500 group-hover:text-pink-500'
                        }`}
                      >
                        {item.category === 'Products' && <Boxes className="w-4 h-4" />}
                        {item.category === 'Settings' && <Sliders className="w-4 h-4" />}
                        {item.category === 'Notifications' && <Bell className="w-4 h-4" />}
                        {item.category === 'Navigation' && <LayoutDashboard className="w-4 h-4" />}
                        {item.category === 'Actions' && <Sparkles className="w-4 h-4" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-sm font-bold truncate transition-colors ${
                              isSelected
                                ? 'text-pink-600 dark:text-pink-400'
                                : 'text-[var(--fg)] group-hover:text-pink-600'
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="text-[10px] font-bold text-[var(--mut2)] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--mut2)] line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      {/* Enter prompt indicator */}
                      {isSelected && (
                        <div className="hidden sm:flex items-center text-xs font-mono font-bold text-pink-500 self-center shrink-0 pr-1">
                          <span>Open ↵</span>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Modal Keyboard Shortcuts Footer */}
            <div className="p-3 sm:px-5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-[var(--mut2)]">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-[var(--raised)] border border-[var(--line)] font-mono text-[10px] font-bold">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-[var(--raised)] border border-[var(--line)] font-mono text-[10px] font-bold">
                    ↓
                  </kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-[var(--raised)] border border-[var(--line)] font-mono text-[10px] font-bold">
                    ↵
                  </kbd>
                  <span>select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-[var(--raised)] border border-[var(--line)] font-mono text-[10px] font-bold">
                    Tab
                  </kbd>
                  <span>scope</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-[var(--raised)] border border-[var(--line)] font-mono text-[10px] font-bold">
                    Esc
                  </kbd>
                  <span>close</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCmdOpen(false)}
                className="hover:text-[var(--fg)] cursor-pointer font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KEYBOARD SHORTCUTS MODAL (?) */}
      {activeModal === 'shortcuts' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-[var(--line)]">
              <h3 className="font-bold text-base text-[var(--fg)]">Keyboard shortcuts</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[var(--mut2)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </div>
            <div className="divide-y divide-[var(--line)] text-sm">
              {[
                ['⌘K or /', 'Search and run actions'],
                ['← / → or ↑ / ↓', 'Navigate between dashboard cards'],
                ['Esc', 'Collapse expanded views or close dialogs'],
                ['?', 'Show this shortcuts list'],
                ['g then o', 'Overview'],
                ['g then p', 'Products'],
                ['g then s', 'Security'],
                ['g then n', 'Notifications'],
                ['g then h', 'Support'],
                ['g then t', 'Settings'],
              ].map(([key, desc], i) => (
                <div key={i} className="py-2.5 flex justify-between items-center">
                  <span className="text-[var(--mut)]">{desc}</span>
                  <kbd className="px-2 py-1 rounded bg-[var(--raised)] border border-[var(--line)] font-mono text-xs text-[var(--fg)] font-bold">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECURITY BREAKDOWN MODAL */}
      {activeModal === 'breakdown' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-[var(--line)]">
              <h3 className="font-bold text-base text-[var(--fg)]">
                Security score: {computeSecurityScore(state)} of 100
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[var(--mut2)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </div>
            <div className="divide-y divide-[var(--line)] max-h-96 overflow-y-auto">
              {scoreItems(state).map((item, i) => (
                <div key={i} className="py-3 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className={item.on ? 'text-[var(--ok)]' : 'text-[var(--mut2)]'}>
                      {item.on ? <Check className="w-5 h-5" /> : '—'}
                    </span>
                    <div>
                      <b className="font-bold text-[var(--fg)] block">{item.l}</b>
                      <small className="text-xs text-[var(--mut2)]">{item.on ? 'Done' : item.why}</small>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.on ? 'bg-[var(--ok)]/15 text-[var(--ok)]' : 'bg-[var(--raised)] text-[var(--mut2)]'
                    }`}
                  >
                    {item.on ? `+${item.pts} pts` : `${item.pts} pts`}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VERIFY EMAIL MODAL */}
      {activeModal === 'verifyEmail' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[var(--fg)]">Verify your email</h3>
            <p className="text-sm text-[var(--mut)]">
              We will send a 6-digit confirmation code to <b>{state.user.email}</b>.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => addToast('Code sent. In this demo the code is 123456.')}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-[var(--line)] text-[var(--fg)] hover:border-[var(--mut2)]"
              >
                Send code
              </button>
              <input
                type="text"
                maxLength={6}
                id="verifyCodeInput"
                placeholder="6-digit code (use 123456)"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] font-mono text-sm outline-none focus:border-[var(--brand)]"
              />
              <p className="text-xs text-[var(--mut2)]">In this demo, the code is 123456.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-[var(--fg)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById('verifyCodeInput') as HTMLInputElement;
                  const val = input ? input.value : '';
                  if (!handleVerifyEmail(val)) {
                    addToast('Invalid verification code. Please enter 123456.', true);
                  }
                }}
                className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENABLE 2FA MODAL */}
      {activeModal === 'enable2fa' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[var(--fg)]">Turn on two-factor</h3>
            <p className="text-sm text-[var(--mut)]">
              Add this secret key to your authenticator app, then enter the 6-digit code it shows.
            </p>
            <div className="p-3 bg-[var(--raised)] border border-[var(--line)] rounded-xl text-center font-mono font-bold tracking-widest text-[var(--fg)] text-sm">
              JBSW Y3DP EHPK 3PXP
            </div>
            <input
              type="text"
              id="twoFactorCodeInput"
              maxLength={6}
              placeholder="6-digit code (e.g. 123456)"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] font-mono text-sm outline-none focus:border-[var(--brand)]"
            />
            <p className="text-xs text-[var(--mut2)]">In this demo, any 6 digits will work.</p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-[var(--fg)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById('twoFactorCodeInput') as HTMLInputElement;
                  const val = input ? input.value : '';
                  if (!handleTurnOnTwoFactor(val)) {
                    addToast('Enter a 6-digit numeric code from your authenticator app.', true);
                  }
                }}
                className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
              >
                Turn on
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISABLE 2FA CONFIRMATION MODAL */}
      {activeModal === 'disable2fa' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[var(--bad)]">Disable two-factor?</h3>
            <p className="text-sm text-[var(--mut)] leading-relaxed">
              Your account will be less protected and your security score will drop by 20 points.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-[var(--fg)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDisableTwoFactor}
                className="px-4 py-2 bg-[var(--bad)] text-white text-xs font-bold rounded-xl"
              >
                Disable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECOVERY CODES MODAL */}
      {activeModal === 'recoveryCodes' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-[var(--line)]">
              <h3 className="font-bold text-base text-[var(--fg)]">Recovery codes</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[var(--mut2)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[var(--mut2)]">
              Each code works once. Keep them stored somewhere safe offline.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {state.codes.map((code, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--inbg)] text-center font-mono text-xs font-bold text-[var(--fg)]"
                >
                  {code}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => {
                  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                  const rnd = (len: number) =>
                    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                  const newCodes = Array.from({ length: 8 }, () => `${rnd(4)}-${rnd(4)}`);
                  saveState((prev) => ({ ...prev, codes: newCodes }));
                  logActivity('Regenerated recovery codes');
                  addToast('New recovery codes generated');
                }}
                className="text-xs font-bold text-[var(--brandtxt)] hover:underline"
              >
                Regenerate
              </button>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await copyToClipboard(state.codes.join('\n'));
                    addToast('Codes copied to clipboard');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-[var(--line)] text-[var(--fg)]"
                >
                  Copy
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-1.5 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BACKUP EMAIL MODAL */}
      {activeModal === 'backupEmail' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[var(--fg)]">Add backup email</h3>
            <p className="text-sm text-[var(--mut)]">
              Use a different address from your primary email.
            </p>
            <input
              type="email"
              id="backupEmailInput"
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] text-sm outline-none focus:border-[var(--brand)]"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-[var(--fg)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById('backupEmailInput') as HTMLInputElement;
                  const val = input ? input.value.trim() : '';
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    addToast('Enter a valid email address.', true);
                    return;
                  }
                  if (val.toLowerCase() === state.user.email.toLowerCase()) {
                    addToast('Use an address different from your primary email.', true);
                    return;
                  }
                  saveState((prev) => ({
                    ...prev,
                    user: { ...prev.user, backup: val },
                  }));
                  logActivity('Added a backup email');
                  addToast('Backup email saved');
                  setActiveModal(null);
                }}
                className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
              >
                Save email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GITHUB LINK MODAL */}
      {activeModal === 'github' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[var(--fg)]">Link GitHub</h3>
            <p className="text-sm text-[var(--mut)]">
              Enter your GitHub handle to synchronize pushes with LidBridge.
            </p>
            <input
              type="text"
              id="githubHandleInput"
              placeholder="username"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] text-sm outline-none focus:border-[var(--brand)]"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-[var(--fg)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById('githubHandleInput') as HTMLInputElement;
                  const val = input ? input.value : '';
                  if (!handleConnectGithub(val)) {
                    addToast('Please enter a valid GitHub username.', true);
                  }
                }}
                className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
              >
                Link GitHub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISCORD LINK MODAL */}
      {activeModal === 'discord' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[var(--fg)]">Link Discord</h3>
            <input
              type="text"
              id="discordHandleInput"
              placeholder="name#0000"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] text-sm outline-none focus:border-[var(--brand)]"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-[var(--fg)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById('discordHandleInput') as HTMLInputElement;
                  const val = input ? input.value.trim() : '';
                  if (val.length < 3) {
                    addToast('Enter a valid Discord handle.', true);
                    return;
                  }
                  saveState((prev) => ({
                    ...prev,
                    conn: { ...prev.conn, discord: val },
                  }));
                  addToast('Discord connected');
                  setActiveModal(null);
                }}
                className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
              >
                Link Discord
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AVATAR COLOR PICKER MODAL */}
      {activeModal === 'photoColor' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[var(--fg)]">Change photo</h3>
            <p className="text-sm text-[var(--mut)]">Pick an accent color for your profile avatar.</p>
            <div className="flex flex-wrap gap-3 py-2">
              {['', '#EC4899', '#8b5cf6', '#0ea5a4', '#d97706', '#2563eb', '#e11d48'].map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    saveState((prev) => ({
                      ...prev,
                      user: { ...prev.user, color: col },
                    }));
                    addToast('Avatar color updated');
                    setActiveModal(null);
                  }}
                  className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                    state.user.color === col ? 'border-[var(--fg)] scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: col || 'var(--raised)' }}
                >
                  {state.user.color === col && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL: LEAKSHIELD (INTERACTIVE LIVE SCANNER) */}
      {activeModal === 'leakshield' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-[var(--line)]">
              <h3 className="font-bold text-base text-[var(--fg)]">LeakShield</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[var(--mut2)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-[var(--mut)]">
              Scan repositories and staged files for exposed API keys, secret credentials, and tokens before you push.
            </p>

            <div className="space-y-4">
              <button
                disabled={isScanning}
                onClick={runLeakShieldScan}
                className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl hover:opacity-95 disabled:opacity-50"
              >
                {isScanning ? 'Scanning...' : scanResults.length ? 'Run again' : 'Run scan'}
              </button>

              {isScanning && (
                <div className="space-y-1">
                  <div className="h-2 w-full bg-[var(--raised)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand)] transition-all duration-150"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[var(--mut2)]">{scanProgress}% complete</span>
                </div>
              )}

              {scanResults.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-[var(--line)] text-xs">
                  {scanResults.map((r, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 font-medium ${
                        r.ok ? 'text-[var(--ok)]' : 'text-[var(--warn)]'
                      }`}
                    >
                      {r.ok ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      <span>{r.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-[var(--line)]">
                <span className="text-xs font-semibold text-[var(--mut2)] uppercase tracking-wider block mb-2">
                  Recent scans
                </span>
                <div className="divide-y divide-[var(--line)] text-xs">
                  {state.scans.slice(0, 3).map((s, idx) => (
                    <div key={idx} className="py-2 flex justify-between">
                      <span className={s.found ? 'text-[var(--warn)] font-semibold' : 'text-[var(--fg)]'}>
                        {s.found ? '1 warning' : 'No issues'}
                      </span>
                      <span className="text-[var(--mut2)]">{ago(s.ts)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL: REPOPREP (PROGRESSIVE AUDIT CHECKLIST) */}
      {activeModal === 'repoprep' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-[var(--line)]">
              <h3 className="font-bold text-base text-[var(--fg)]">RepoPrep</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[var(--mut2)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-[var(--mut)]">
              Get a repository ready to share. Enter its name and we will check and audit the essentials.
            </p>
            <input
              type="text"
              value={repoPrepName}
              onChange={(e) => setRepoPrepName(e.target.value)}
              placeholder="organization/project-name"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] text-sm outline-none focus:border-[var(--brand)]"
            />
            <button
              disabled={isPreparingRepo}
              onClick={() => runRepoPrep(repoPrepName)}
              className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl disabled:opacity-50"
            >
              {isPreparingRepo ? 'Preparing...' : 'Prepare repo'}
            </button>

            {repoPrepItems.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[var(--line)] text-xs">
                {repoPrepItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[var(--ok)] font-medium animate-fade-in">
                    <Check className="w-4 h-4" /> {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCT MODAL: IDEA2PROJECT (BLUEPRINT GENERATOR) */}
      {activeModal === 'idea2project' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-[var(--line)]">
              <h3 className="font-bold text-base text-[var(--fg)]">Idea2Project</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[var(--mut2)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-[var(--mut)]">
              Describe your software concept and generate a starter blueprint with architecture milestones.
            </p>
            <textarea
              rows={3}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="e.g. A web app that helps students share notes and study flashcards"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] text-sm outline-none focus:border-[var(--brand)] resize-none"
            />
            <button
              onClick={() => generateIdeaBlueprint(ideaText)}
              className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
            >
              Create blueprint
            </button>

            {generatedBlueprint && (
              <div className="space-y-3 pt-3 border-t border-[var(--line)]">
                <pre className="p-3 bg-[var(--inbg)] border border-[var(--line)] rounded-xl text-xs font-mono whitespace-pre-wrap text-[var(--fg)] overflow-x-auto max-h-56">
                  {generatedBlueprint}
                </pre>
                <button
                  onClick={async () => {
                    await copyToClipboard(generatedBlueprint);
                    addToast('Blueprint copied to clipboard');
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-[var(--line)] text-[var(--fg)] hover:border-[var(--mut2)] flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy blueprint
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCT MODAL: LIDBRIDGE */}
      {activeModal === 'lidbridge' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-[var(--line)]">
              <h3 className="font-bold text-base text-[var(--fg)]">LidBridge</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[var(--mut2)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </div>
            {state.conn.github ? (
              <div className="space-y-4">
                <p className="text-sm text-[var(--mut)]">
                  Linked as <b>@{state.conn.github}</b>. Recent synchronized commits:
                </p>
                <div className="divide-y divide-[var(--line)] text-sm">
                  {[
                    ['api-server', 'Fix auth callback redirect', '2 hours ago'],
                    ['web-client', 'Implement theme and density switches', 'Yesterday'],
                    ['docs', 'Update deployment guidelines', '3 days ago'],
                  ].map(([repo, msg, time], i) => (
                    <div key={i} className="py-2.5 flex justify-between items-center">
                      <div>
                        <b className="font-bold text-[var(--fg)] block">{repo}</b>
                        <small className="text-xs text-[var(--mut2)]">{msg}</small>
                      </div>
                      <span className="text-xs text-[var(--mut2)]">{time}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex justify-between items-center border-t border-[var(--line)]">
                  <button
                    onClick={() => {
                      const prevVal = state.conn.github;
                      saveState((prev) => ({ ...prev, conn: { ...prev.conn, github: '' } }));
                      setActiveModal(null);
                      addToast('GitHub disconnected', false, () => {
                        saveState((prev) => ({ ...prev, conn: { ...prev.conn, github: prevVal } }));
                      });
                    }}
                    className="text-xs font-bold text-[var(--bad)] hover:underline"
                  >
                    Unlink
                  </button>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-1.5 text-xs font-semibold rounded-xl border border-[var(--line)] text-[var(--fg)]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center space-y-3">
                <p className="text-sm text-[var(--mut2)]">
                  Link your GitHub account to view real-time commit push streams.
                </p>
                <button
                  onClick={() => {
                    setActiveModal('github');
                  }}
                  className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
                >
                  Link GitHub
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRANSCRIPT MODAL */}
      {activeModal === 'transcript' && modalData && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-[var(--line)]">
              <h3 className="font-bold text-base text-[var(--fg)]">Ticket transcript</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[var(--mut2)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </div>
            <textarea
              readOnly
              rows={10}
              value={modalData.transcript}
              className="w-full p-3 font-mono text-xs rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={async () => {
                  await copyToClipboard(modalData.transcript);
                  addToast('Transcript copied to clipboard');
                }}
                className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT JSON MODAL */}
      {activeModal === 'exportJson' && modalData && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-xl bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-[var(--line)]">
              <h3 className="font-bold text-base text-[var(--fg)]">Your data export</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[var(--mut2)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </div>
            <textarea
              readOnly
              rows={12}
              value={modalData.exportJson}
              className="w-full p-3 font-mono text-xs rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={async () => {
                  await copyToClipboard(modalData.exportJson);
                  addToast('Data export JSON copied');
                }}
                className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
              >
                Copy JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET DEMO DATA MODAL */}
      {activeModal === 'resetData' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[var(--fg)]">Reset demo data?</h3>
            <p className="text-sm text-[var(--mut)]">
              This will restore every sample value, preference, ticket, and score metric.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-[var(--fg)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const fresh = getDefaultState();
                  setState(fresh);
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
                  setActiveModal(null);
                  addToast('Demo data restored');
                }}
                className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {activeModal === 'deleteAccount' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[var(--bad)]">Delete account</h3>
            <p className="text-sm text-[var(--mut)]">
              Type <b>{state.user.username}</b> to confirm deletion. (This is a prototype simulation).
            </p>
            <input
              type="text"
              id="deleteConfirmInput"
              placeholder={state.user.username}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] text-sm outline-none focus:border-[var(--brand)]"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-[var(--fg)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById('deleteConfirmInput') as HTMLInputElement;
                  if (input && input.value.trim() === state.user.username) {
                    saveState((prev) => ({ ...prev, out: 'deleted' }));
                    setActiveModal(null);
                  } else {
                    addToast('That username does not match.', true);
                  }
                }}
                className="px-4 py-2 bg-[var(--bad)] text-white text-xs font-bold rounded-xl"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY DRAWER MODAL */}
      {activeModal === 'activityDrawer' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md bg-[var(--card)] h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-[var(--line)] mb-4">
                <h3 className="font-bold text-base text-[var(--fg)]">Activity timeline</h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-[var(--mut2)] hover:text-[var(--fg)]"
                >
                  ✕
                </button>
              </div>
              <ActivitySection activityList={state.activity} />
            </div>
          </div>
        </div>
      )}

      {/* REPORT A PROBLEM MODAL */}
      {activeModal === 'reportProblem' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg bg-[var(--card)] border border-[var(--line)] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[var(--fg)]">Report a Problem</h3>
                  <p className="text-xs text-[var(--mut2)]">Direct security and operations team support ticket</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[var(--mut2)] hover:text-[var(--fg)] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-[var(--fg)] mb-2">Issue Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bug', label: 'Bug / Glitch', icon: '🐛' },
                  { id: 'security', label: 'Security issue', icon: '🛡️' },
                  { id: 'billing', label: 'Billing / Card', icon: '💳' },
                  { id: 'glitch', label: 'Access problem', icon: '🔑' },
                ].map((c) => {
                  const isSelected = reportCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setReportCategory(c.id as any)}
                      className={`py-2 px-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'border-pink-600 bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md ring-2 ring-pink-500/30 scale-[1.02]'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-pink-400 shadow-xs'
                      }`}
                    >
                      <span className="text-xs">{c.icon}</span>
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-bold text-[var(--fg)] mb-2">Urgency Level</label>
              <div className="flex gap-2">
                {[
                  { id: 'normal', label: 'Normal Priority' },
                  { id: 'urgent', label: 'Urgent / Critical' },
                ].map((u) => {
                  const isSelected = reportUrgency === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setReportUrgency(u.id as any)}
                      className={`flex-1 py-2 px-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'border-amber-600 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md ring-2 ring-amber-500/30 scale-[1.02]'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-amber-400 shadow-xs'
                      }`}
                    >
                      <span>{u.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-bold text-[var(--fg)] mb-1.5">Problem Summary</label>
              <input
                type="text"
                value={reportSummary}
                onChange={(e) => setReportSummary(e.target.value)}
                placeholder="e.g., Session timed out unexpectedly during transaction"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--shell)] border border-[var(--line)] text-xs text-[var(--fg)] outline-none focus:border-pink-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[var(--fg)] mb-1.5">Detailed Description</label>
              <textarea
                rows={3}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Describe what occurred, any error codes shown, or steps to reproduce..."
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--shell)] border border-[var(--line)] text-xs text-[var(--fg)] outline-none focus:border-pink-500"
              />
            </div>

            {/* Attach diagnostics checkbox */}
            <label className="flex items-center gap-2.5 text-xs text-[var(--mut)] cursor-pointer">
              <input
                type="checkbox"
                checked={reportAttachLogs}
                onChange={(e) => setReportAttachLogs(e.target.checked)}
                className="rounded border-[var(--line)] text-pink-600 focus:ring-pink-500"
              />
              <span>Attach client diagnostic state & recent security logs</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--mut2)] hover:text-[var(--fg)] hover:bg-[var(--raised)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitProblemReport}
                disabled={reportSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 text-white text-xs font-bold shadow-md hover:bg-pink-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{reportSubmitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW STATEMENTS MODAL */}
      {activeModal === 'viewStatements' && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-xl bg-[var(--card)] border border-[var(--line)] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[var(--fg)]">Account Statements</h3>
                  <p className="text-xs text-[var(--mut2)]">Monthly statements, activity records, and card invoices</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[var(--mut2)] hover:text-[var(--fg)] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Card Overview Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-700 text-white shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-sm">
                  💳
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-300">Visa Pro Card</div>
                  <div className="text-sm font-mono font-bold tracking-wider">•••• •••• •••• 8492</div>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isCardLocked
                      ? 'bg-rose-500 text-white ring-2 ring-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isCardLocked ? 'Card Locked' : 'Active • Pro'}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Next bill: Nov 15, 2026</p>
              </div>
            </div>

            {/* Statement records list */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {[
                {
                  period: 'October 2026',
                  desc: 'Current cycle • 84 actions • Account Pro active',
                  amount: '$0.00 (In progress)',
                  status: 'Current',
                  isCurrent: true,
                },
                {
                  period: 'September 2026',
                  desc: 'Full cycle statement • 112 actions • No security alerts',
                  amount: '$29.00 USD',
                  status: 'Paid',
                  isCurrent: false,
                },
                {
                  period: 'August 2026',
                  desc: 'Full cycle statement • 98 actions • 2FA enabled',
                  amount: '$29.00 USD',
                  status: 'Paid',
                  isCurrent: false,
                },
                {
                  period: 'July 2026',
                  desc: 'Pro subscription initial billing • Verified account',
                  amount: '$29.00 USD',
                  status: 'Paid',
                  isCurrent: false,
                },
              ].map((stmt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--shell)] border border-[var(--line)] hover:border-pink-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-pink-500 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[var(--fg)] flex items-center gap-2">
                        <span>{stmt.period}</span>
                        <span className="text-[10px] font-bold text-[var(--ok)]">{stmt.status}</span>
                      </div>
                      <p className="text-[11px] text-[var(--mut2)] mt-0.5">{stmt.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[var(--fg)] mr-1 hidden sm:inline">
                      {stmt.amount}
                    </span>
                    <button
                      onClick={() => handleDownloadStatement(stmt.period)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--card)] hover:border-pink-500 hover:text-pink-600 text-xs font-semibold text-[var(--fg)] transition-all shadow-2xs cursor-pointer"
                      title="Download statement PDF"
                    >
                      <Download className="w-3 h-3 text-pink-500" />
                      <span className="hidden sm:inline">PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--line)] text-xs text-[var(--mut2)]">
              <span>All statements are verified cryptographic exports</span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--fg)] bg-[var(--raised)] hover:bg-[var(--line)] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



      {/* TOASTS CONTAINER */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-3 animate-fade-in ${
              toast.bad ? 'bg-[var(--bad)] text-white' : 'bg-[var(--fg)] text-[var(--bg)]'
            }`}
          >
            <span>{toast.message}</span>
            {toast.undo && (
              <button
                onClick={() => {
                  toast.undo?.();
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id));
                }}
                className="underline font-black hover:opacity-85 text-xs ml-1"
              >
                {toast.undoLabel || 'Undo'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalAccountPage;
