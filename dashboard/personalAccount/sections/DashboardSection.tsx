import React, { useState } from 'react';
import {
  Check,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  ShieldAlert,
  Sparkles,
  Megaphone,
  CheckCheck,
  ExternalLink,
  Activity,
  Smartphone,
  Key,
  ShieldCheck,
  Zap,
  Mail,
  History,
  AlertTriangle,
  FileText,
  Lock,
} from 'lucide-react';
import { DashboardState, ProductKey, ScoreItem, NotificationType } from '../types';
import { PROD_INFO } from '../constants';
import {
  computeSecurityScore,
  getNextSecurityStep,
  generateActivitySeries,
  ago,
  useHoverDelay,
} from '../utils';
import SlidingTabs from '../SlidingTabs';

interface RecentActivityCardProps {
  onOpenActivityDrawer: () => void;
  onNavigate: (section: string) => void;
  isFocused?: boolean;
  cardIndex?: number;
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  onOpenActivityDrawer,
  onNavigate,
  isFocused = false,
  cardIndex,
}) => {
  const [filter, setFilter] = useState<'all' | 'security' | 'auth'>('all');
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Hook for 300ms delay when hovering over category tabs
  const tabHover = useHoverDelay<'all' | 'security' | 'auth'>((val) => {
    setFilter(val);
  }, 300);

  // Hook for 300ms delay when hovering over individual activity items
  const itemHover = useHoverDelay<string | null>((val) => {
    setHoveredEventId(val);
  }, 300);

  const mockUserActions = [
    {
      id: 'act-1',
      action: 'Login from new device',
      category: 'auth',
      device: 'Safari on iPhone 15 Pro • San Francisco, US',
      timeAgo: '14 mins ago',
      status: 'Notice',
      statusColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      icon: <Smartphone className="w-4 h-4 text-sky-500" />,
      details: 'IP: 192.168.1.42 • TLS 1.3 encrypted • 2FA prompt acknowledged • Session authorized',
      verdict: 'Authorized Login',
    },
    {
      id: 'act-2',
      action: 'Password changed',
      category: 'security',
      device: 'Account credential refreshed successfully',
      timeAgo: '2 hours ago',
      status: 'Success',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      icon: <Key className="w-4 h-4 text-amber-500" />,
      details: 'Credential update confirmed via primary email. All active sessions re-authenticated.',
      verdict: 'High Security Passed',
    },
    {
      id: 'act-3',
      action: 'Two-factor authentication verified',
      category: 'security',
      device: 'Authenticator app paired and verified',
      timeAgo: 'Yesterday',
      status: 'Verified',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      details: 'TOTP 6-digit cryptographic verification successful. 8 emergency backup codes refreshed.',
      verdict: 'Multi-Factor Shield Active',
    },
    {
      id: 'act-4',
      action: 'API token generated',
      category: 'auth',
      device: 'Production deployment token for LidBridge',
      timeAgo: '2 days ago',
      status: 'Success',
      statusColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      icon: <Zap className="w-4 h-4 text-purple-500" />,
      details: 'Scoped read-write permissions for CI/CD automated deployment. Expires in 90 days.',
      verdict: 'Scoped Token Access',
    },
    {
      id: 'act-5',
      action: 'Backup recovery email confirmed',
      category: 'security',
      device: 'recovery@example.com verified for safety',
      timeAgo: '4 days ago',
      status: 'Verified',
      statusColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      icon: <Mail className="w-4 h-4 text-pink-500" />,
      details: 'Verification link confirmed within 15 minutes. Fallback security recovery channel verified.',
      verdict: 'Confirmed Recovery Channel',
    },
    {
      id: 'act-6',
      action: 'LeakShield repository scan',
      category: 'security',
      device: '0 credential leaks found across 14 branches',
      timeAgo: '5 days ago',
      status: 'Success',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      icon: <Sparkles className="w-4 h-4 text-indigo-500" />,
      details: 'Automated heuristic entropy scan over 8,420 commits. Zero exposed private API secrets.',
      verdict: 'Clean Audit Verdict',
    },
  ];

  const filtered = mockUserActions.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div
      data-dashboard-card={cardIndex}
      tabIndex={0}
      className={`bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg flex flex-col justify-between transition-all duration-200 outline-none relative ${
        isFocused
          ? 'ring-2 ring-pink-500 shadow-xl shadow-pink-500/10 scale-[1.006] !border-pink-500 !border-b-pink-600'
          : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-500 border-2 border-pink-500/30 flex items-center justify-center font-bold">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[var(--fg)]">Recent Activity</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700">
                  {filtered.length} events
                </span>
              </div>
              <p className="text-xs text-[var(--mut2)]">Hover over security & auth tabs or events to inspect</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenActivityDrawer}
            className="text-xs font-bold text-[var(--brandtxt)] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Full log</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter controls with 300ms hover-to-switch and persistent selected state */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[var(--shell)] border-2 border-slate-300 dark:border-slate-700 rounded-xl mb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'all' as const, label: 'All Actions', icon: '⚡' },
            { id: 'security' as const, label: 'Security Events', icon: '🛡️' },
            { id: 'auth' as const, label: 'Logins & Auth', icon: '🔐' },
          ].map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => tabHover.handleClick(tab.id)}
                onMouseEnter={() => tabHover.handleMouseEnter(tab.id)}
                onMouseLeave={tabHover.handleMouseLeave}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 border-2 border-pink-600 text-white shadow-md ring-2 ring-pink-500/30 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-pink-500 hover:text-[var(--fg)] shadow-xs font-semibold'
                }`}
                title={`Click or hover for 300ms to show ${tab.label}`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* List of user actions with 300ms hover inspection */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {filtered.map((item) => {
            const isHovered = hoveredEventId === item.id;
            return (
              <div
                key={item.id}
                onClick={onOpenActivityDrawer}
                onMouseEnter={() => itemHover.handleMouseEnter(item.id)}
                onMouseLeave={itemHover.handleMouseLeave}
                className={`p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                  isHovered
                    ? 'bg-pink-50/90 dark:bg-pink-950/40 border-2 border-pink-500 border-b-4 border-b-pink-600 shadow-md ring-2 ring-pink-500/20 -translate-y-0.5'
                    : 'bg-white/95 dark:bg-slate-900/80 border-2 border-slate-300 dark:border-slate-700/90 border-b-[3px] border-b-slate-400 dark:border-b-slate-600 hover:border-pink-500 hover:border-b-pink-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border-2 transition-colors ${
                      isHovered
                        ? 'bg-pink-500 text-white border-pink-600 shadow-2xs'
                        : 'bg-[var(--panel)] border-slate-300 dark:border-slate-700 group-hover:border-pink-500/60'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-bold transition-colors truncate ${
                          isHovered
                            ? 'text-pink-600 dark:text-pink-400 font-extrabold'
                            : 'text-[var(--fg)] group-hover:text-pink-600 dark:group-hover:text-pink-400'
                        }`}
                      >
                        {item.action}
                      </h4>
                      <span className="text-[10px] text-[var(--mut2)] shrink-0 font-medium">
                        {item.timeAgo}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-[11px] text-[var(--mut2)] truncate">
                        {item.device}
                      </p>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border-2 uppercase shrink-0 ${item.statusColor}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detailed content shown after 300ms consistent hover */}
                {isHovered && (
                  <div className="mt-2.5 pt-2 border-t-2 border-pink-200 dark:border-pink-900/50 text-[11px] space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[10px] text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                        Event Detail (Hovered)
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {item.verdict}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--fg)] bg-white/90 dark:bg-slate-900/80 p-2 rounded-lg border-2 border-slate-200 dark:border-slate-800 leading-relaxed font-mono">
                      {item.details}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-[var(--mut2)]">
        <span>Continuous security session monitoring</span>
        <button
          onClick={() => onNavigate('security')}
          className="font-semibold text-[var(--brandtxt)] hover:underline"
        >
          Security settings →
        </button>
      </div>
    </div>
  );
};

interface DashboardNotificationsProps {
  notifications: DashboardState['notifs'];
  recentActivities: DashboardState['activity'];
  onToggleRead: (id: number) => void;
  onMarkAllRead: () => void;
  onNavigate: (section: string) => void;
  onOpenActivityDrawer: () => void;
  isFocused?: boolean;
  cardIndex?: number;
}

const DashboardNotifications: React.FC<DashboardNotificationsProps> = ({
  notifications,
  recentActivities,
  onToggleRead,
  onMarkAllRead,
  onNavigate,
  onOpenActivityDrawer,
  isFocused = false,
  cardIndex,
}) => {
  const [tabFilter, setTabFilter] = useState<'all' | 'unread' | 'activity'>('all');
  const [hoveredNotifId, setHoveredNotifId] = useState<number | null>(null);

  // Hook for 300ms delay when hovering over category tabs (All Items, Unread, User Activity)
  const tabHover = useHoverDelay<'all' | 'unread' | 'activity'>((val) => {
    setTabFilter(val);
  }, 300);

  // Hook for 300ms delay when hovering over individual notification or activity items
  const itemHover = useHoverDelay<number | null>((val) => {
    setHoveredNotifId(val);
  }, 300);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotifIcon = (type: NotificationType | 'activity') => {
    switch (type) {
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'update':
        return <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'announce':
        return <Megaphone className="w-4 h-4 text-pink-500 shrink-0" />;
      case 'activity':
      default:
        return <Activity className="w-4 h-4 text-sky-500 shrink-0" />;
    }
  };

  const notifItems = notifications.map((n) => ({
    id: n.id,
    isActivity: false,
    type: n.type,
    title: n.title,
    text: n.text,
    ts: n.ts,
    read: n.read,
  }));

  const actItems = recentActivities.map((a, idx) => ({
    id: 10000 + idx,
    isActivity: true,
    type: 'activity' as const,
    title: a.t,
    text: 'Recorded user account action in session',
    ts: a.ts,
    read: true,
  }));

  let displayedItems = [...notifItems, ...actItems].sort((a, b) => b.ts - a.ts);

  if (tabFilter === 'unread') {
    displayedItems = notifItems.filter((item) => !item.read);
  } else if (tabFilter === 'activity') {
    displayedItems = actItems;
  }

  const notificationTabs = [
    {
      id: 'all' as const,
      label: 'All Items',
      count: notifItems.length + actItems.length,
    },
    {
      id: 'unread' as const,
      label: 'Unread',
      count: unreadCount,
    },
    {
      id: 'activity' as const,
      label: 'User Activity',
      count: actItems.length,
    },
  ];

  return (
    <div
      data-dashboard-card={cardIndex}
      tabIndex={0}
      className={`bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg flex flex-col justify-between transition-all duration-200 outline-none relative ${
        isFocused
          ? 'ring-2 ring-pink-500 shadow-xl shadow-pink-500/10 scale-[1.006] !border-pink-500 !border-b-pink-600'
          : ''
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--brand)]/15 border-2 border-[var(--brand)]/30 flex items-center justify-center text-[var(--brandtxt)] shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[var(--fg)]">Notifications & Activity</h3>
                {unreadCount > 0 && (
                  <span className="bg-[var(--brand)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--mut2)]">Hover category 300ms to switch views</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-xs font-semibold text-[var(--brandtxt)] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('notifications')}
              className="text-xs font-bold text-[var(--brandtxt)] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>View all</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter controls with 300ms hover delay & persistent selected styling */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[var(--shell)] border-2 border-slate-300 dark:border-slate-700 rounded-xl mb-4 max-w-full overflow-x-auto scrollbar-none">
          {notificationTabs.map((tab) => {
            const isSelected = tabFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => tabHover.handleClick(tab.id)}
                onMouseEnter={() => tabHover.handleMouseEnter(tab.id)}
                onMouseLeave={tabHover.handleMouseLeave}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 border-2 border-pink-600 text-white shadow-md ring-2 ring-pink-500/30 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-pink-500 hover:text-[var(--fg)] shadow-xs font-semibold'
                }`}
                title={`Click or hover for 300ms to switch to ${tab.label}`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-white text-pink-600 shadow-xs'
                        : 'bg-[var(--raised)] text-[var(--fg)] border border-[var(--line)]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notification List with Read/Unread Indicators and 300ms Hover Inspection */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {displayedItems.slice(0, 5).map((item) => {
            const isHovered = hoveredNotifId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => itemHover.handleMouseEnter(item.id)}
                onMouseLeave={itemHover.handleMouseLeave}
                className={`p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                  isHovered
                    ? 'bg-pink-50/90 dark:bg-pink-950/40 border-2 border-pink-500 border-b-4 border-b-pink-600 shadow-md ring-2 ring-pink-500/20 -translate-y-0.5'
                    : !item.read
                    ? 'bg-pink-500/10 dark:bg-pink-500/15 border-2 border-pink-400 dark:border-pink-700/90 border-b-[3px] border-b-pink-500/80 hover:border-pink-500 hover:border-b-pink-600 shadow-xs hover:shadow-md'
                    : 'bg-white/95 dark:bg-slate-900/80 border-2 border-slate-300 dark:border-slate-700/90 border-b-[3px] border-b-slate-400 dark:border-b-slate-600 hover:border-pink-500 hover:border-b-pink-600 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Read / Unread Status Indicator */}
                  <div className="pt-1.5 shrink-0">
                    {!item.isActivity ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleRead(item.id);
                        }}
                        className="p-0.5 rounded-full hover:scale-125 transition-transform cursor-pointer"
                        title={item.read ? 'Mark unread' : 'Mark read'}
                      >
                        {!item.read ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand)] block shadow-xs ring-2 ring-pink-500/30 animate-pulse" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-[var(--mut2)]/40 hover:bg-[var(--mut2)] block" />
                        )}
                      </button>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-sky-400 block" title="Logged activity" />
                    )}
                  </div>

                  {/* Icon circle */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isHovered
                        ? 'bg-pink-500 text-white'
                        : 'bg-[var(--raised)]'
                    }`}
                  >
                    {getNotifIcon(item.type)}
                  </div>

                  {/* Content text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!item.isActivity) {
                            if (!item.read) onToggleRead(item.id);
                            onNavigate('notifications');
                          } else {
                            onOpenActivityDrawer();
                          }
                        }}
                        className="text-left font-semibold text-xs sm:text-sm text-[var(--fg)] hover:text-[var(--brand)] transition-colors truncate block cursor-pointer"
                        title={item.title}
                      >
                        {item.title}
                      </button>
                      <span className="text-[11px] text-[var(--mut2)] whitespace-nowrap shrink-0">
                        {ago(item.ts)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--mut)] mt-0.5 line-clamp-1 break-words">
                      {item.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-[var(--mut2)]">
                      <span className="capitalize font-medium">{item.type}</span>
                      <span>·</span>
                      <span className={!item.read ? 'text-[var(--brandtxt)] font-bold' : ''}>
                        {!item.read ? 'Unread notification' : 'Read'}
                      </span>
                    </div>
                  </div>

                  {/* Mark as read quick toggle */}
                  {!item.isActivity && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleRead(item.id);
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--mut2)] hover:text-[var(--fg)] hover:bg-[var(--raised)] transition-colors opacity-70 group-hover:opacity-100 shrink-0 cursor-pointer"
                      title={item.read ? 'Mark unread' : 'Mark read'}
                    >
                      <Check className={`w-3.5 h-3.5 ${item.read ? 'text-[var(--ok)]' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Detailed content shown after 300ms consistent hover */}
                {isHovered && (
                  <div className="mt-2.5 pt-2 border-t border-pink-200 dark:border-pink-900/50 text-[11px] space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[10px] text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                        Quick Preview (300ms Hover)
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                        {item.isActivity ? 'Audit Log Entry' : 'System Alert'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--fg)] bg-white/90 dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed">
                      {item.text}
                    </p>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      {!item.isActivity && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleRead(item.id);
                          }}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 hover:bg-pink-200 cursor-pointer"
                        >
                          {item.read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!item.isActivity) onNavigate('notifications');
                          else onOpenActivityDrawer();
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--brand)] text-white hover:opacity-90 cursor-pointer flex items-center gap-1"
                      >
                        <span>Open Details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {displayedItems.length === 0 && (
            <div className="py-8 text-center text-xs text-[var(--mut2)]">
              No items in this filter view.
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="pt-3 mt-2 border-t-2 border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onOpenActivityDrawer}
          className="text-[var(--mut)] hover:text-[var(--fg)] hover:underline"
        >
          View activity log
        </button>
        <button
          type="button"
          onClick={() => onNavigate('notifications')}
          className="font-bold text-[var(--brandtxt)] hover:underline flex items-center gap-1"
        >
          <span>All notifications</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

interface DashboardSectionProps {
  state: DashboardState;
  onNavigate: (section: string) => void;
  onOpenProduct: (id: ProductKey) => void;
  onOpenBreakdown: () => void;
  onTriggerSecurityStep: (act?: string) => void;
  onToggleOnboard: () => void;
  onChangeRange: (range: 7 | 30) => void;
  onOpenActivityDrawer: () => void;
  onToggleRead?: (id: number) => void;
  onMarkAllRead?: () => void;
  focusedCardIndex?: number | null;
  onCardFocus?: (index: number) => void;
  isCardLocked?: boolean;
  onToggleLockCard?: () => void;
  onReportProblem?: () => void;
  onViewStatements?: () => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  state,
  onNavigate,
  onOpenProduct,
  onOpenBreakdown,
  onTriggerSecurityStep,
  onToggleOnboard,
  onChangeRange,
  onOpenActivityDrawer,
  onToggleRead,
  onMarkAllRead,
  focusedCardIndex = null,
  onCardFocus,
  isCardLocked = false,
  onToggleLockCard,
  onReportProblem,
  onViewStatements,
}) => {
  const sc = computeSecurityScore(state);
  const st = getNextSecurityStep(state);

  // Dynamic card index mapping for keyboard navigation
  const hasOnboard = state.onboard === 'show';
  const cardIndices = {
    score: 0,
    onboard: hasOnboard ? 1 : -1,
    metrics: hasOnboard ? 2 : 1,
    products: hasOnboard ? 3 : 2,
    chart: hasOnboard ? 4 : 3,
    recentActivity: hasOnboard ? 5 : 4,
    notifications: hasOnboard ? 6 : 5,
  };

  // Activity calculation
  const ser14 = generateActivitySeries(14, state.actDate, state.actCount);
  const last7 = ser14.slice(7).reduce((acc, x) => acc + x.v, 0);
  const prev7 = ser14.slice(0, 7).reduce((acc, x) => acc + x.v, 0);
  const pct = prev7 ? Math.round(((last7 - prev7) / prev7) * 100) : 0;

  // Chart data
  const chartSeries = generateActivitySeries(state.range, state.actDate, state.actCount);
  const maxVal = Math.max(...chartSeries.map((x) => x.v), 1);
  const peakIdx = chartSeries.findIndex((x) => x.v === maxVal);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // SVG Ring values
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference * (1 - sc / 100);

  // Visible products sorted by pinned status
  const visibleProductIds = (Object.keys(PROD_INFO) as ProductKey[])
    .filter((id) => state.apps[id] !== false)
    .sort((a, b) => (state.fav[b] ? 1 : 0) - (state.fav[a] ? 1 : 0));

  // Onboarding items
  const onboardItems = [
    { label: 'Verify your email', done: state.user.verified, act: 'verify' },
    { label: 'Link your GitHub account', done: !!state.conn.github, act: 'github' },
    { label: 'Open a product', done: !!state.awarded.prod, act: 'prod' },
    { label: 'Send feedback', done: !!state.awarded.feedback, act: 'feedback' },
  ];
  const completedOnboardCount = onboardItems.filter((i) => i.done).length;
  const allOnboardCompleted = completedOnboardCount === onboardItems.length;

  const currentHoveredDay =
    hoveredBarIndex !== null ? chartSeries[hoveredBarIndex] : chartSeries[chartSeries.length - 1];

  const formatDayLabel = (dTimestamp: number) => {
    const d = new Date(dTimestamp * 864e5);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${dayNames[d.getUTCDay()]} ${d.getUTCDate()} ${monthNames[d.getUTCMonth()]}`;
  };

  const rangeTabs = [
    { id: '7', label: '7 days' },
    { id: '30', label: '30 days' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Security Score + Onboarding */}
      <div className={`grid gap-5 ${state.onboard === 'show' ? 'lg:grid-cols-[1.6fr_1fr]' : 'grid-cols-1'}`}>
        {/* Security Score Banner (Card 0) */}
        <div
          data-dashboard-card={cardIndices.score}
          tabIndex={0}
          onFocus={() => onCardFocus?.(cardIndices.score)}
          className={`bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-md hover:shadow-lg transition-all duration-200 outline-none relative ${
            focusedCardIndex === cardIndices.score
              ? 'ring-2 ring-pink-500 shadow-xl shadow-pink-500/10 scale-[1.006] !border-pink-500 !border-b-pink-600'
              : ''
          }`}
        >
          {/* Circular SVG Ring with Pink-Purple Gradient & Glow */}
          <div className="relative w-36 h-36 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
              <defs>
                <linearGradient id="scoreRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <filter id="scoreGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#EC4899" floodOpacity="0.4" />
                </filter>
              </defs>
              <circle
                cx="64"
                cy="64"
                r={radius}
                fill="none"
                stroke="var(--track)"
                strokeWidth="10"
              />
              <circle
                className="arc draw transition-all duration-700 ease-out"
                cx="64"
                cy="64"
                r={radius}
                fill="none"
                stroke="url(#scoreRingGrad)"
                filter="url(#scoreGlow)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference.toFixed(1)}
                strokeDashoffset={strokeOffset.toFixed(1)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold tracking-tight text-[var(--fg)]">{sc}</span>
              <span className="text-[11px] font-medium text-[var(--mut2)]">out of 100</span>
            </div>
          </div>

          {/* Score Details & Actions */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <span className="text-xs font-semibold text-[#EC4899] uppercase tracking-wider">
              Security score
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[var(--fg)] mt-1 break-words">
              {st ? st.do : 'Your account is fully protected'}
            </h2>
            <p className="text-sm text-[var(--mut)] mt-1.5 mb-4 leading-relaxed break-words">
              {st
                ? `Adds +${st.pts} to your score. ${st.why}`
                : 'Two-factor, a verified email, a fresh password, few devices, and a backup email are all in place.'}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              {st && (
                <button
                  onClick={() => onTriggerSecurityStep(st.act)}
                  className="px-4 py-2 bg-gradient-to-r from-[#EC4899] to-[#D946EF] text-white text-sm font-bold rounded-xl hover:opacity-95 shadow-md shadow-pink-500/20 transition-all cursor-pointer"
                >
                  {st.btn}
                </button>
              )}
              <button
                onClick={onOpenBreakdown}
                className="px-4 py-2 bg-[var(--raised)] border border-[var(--line)] text-sm font-semibold rounded-xl text-[var(--fg)] hover:border-[#EC4899] transition-colors cursor-pointer"
              >
                See breakdown
              </button>
            </div>
          </div>
        </div>

        {/* Onboarding Getting Started Checklist (Card 1 if shown) */}
        {state.onboard === 'show' && (
          <div
            data-dashboard-card={cardIndices.onboard}
            tabIndex={0}
            onFocus={() => onCardFocus?.(cardIndices.onboard)}
            className={`bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg flex flex-col justify-between transition-all duration-200 outline-none relative ${
              focusedCardIndex === cardIndices.onboard
                ? 'ring-2 ring-pink-500 shadow-xl shadow-pink-500/10 scale-[1.006] !border-pink-500 !border-b-pink-600'
                : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-[var(--fg)]">Getting started</h3>
                <button
                  onClick={onToggleOnboard}
                  className="w-7 h-7 rounded-lg border border-[var(--line)] flex items-center justify-center text-[var(--mut2)] hover:text-[var(--fg)] cursor-pointer"
                  title="Hide checklist"
                >
                  ✕
                </button>
              </div>

              {allOnboardCompleted ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[var(--ok)]/15 text-[var(--ok)] mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-sm text-[var(--fg)]">Setup complete</p>
                  <p className="text-xs text-[var(--mut2)]">You have tried all the essentials.</p>
                </div>
              ) : (
                <>
                  <div className="h-1.5 w-full bg-[var(--raised)] rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-[var(--brand)] transition-all duration-500 rounded-full"
                      style={{
                        width: `${(completedOnboardCount / onboardItems.length) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-[var(--mut2)] mb-3">
                    {completedOnboardCount} of {onboardItems.length} done
                  </p>
                  <div className="space-y-1.5">
                    {onboardItems.map((item, idx) => (
                      <button
                        key={idx}
                        disabled={item.done}
                        onClick={() => onTriggerSecurityStep(item.act)}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm transition-colors ${
                          item.done
                            ? 'text-[var(--mut2)] line-through cursor-default'
                            : 'hover:bg-[var(--raised)] text-[var(--fg)] font-medium cursor-pointer'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            item.done
                              ? 'bg-[var(--ok)] border-[var(--ok)] text-white'
                              : 'border-[var(--mut2)]'
                          }`}
                        >
                          {item.done && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3 Metric Cards */}
      <div
        data-dashboard-card={cardIndices.metrics}
        tabIndex={0}
        onFocus={() => onCardFocus?.(cardIndices.metrics)}
        className={`grid grid-cols-1 sm:grid-cols-3 gap-6 rounded-2xl transition-all duration-200 outline-none relative my-3 ${
          focusedCardIndex === cardIndices.metrics
            ? 'ring-2 ring-pink-500 bg-pink-500/5 shadow-xl shadow-pink-500/10'
            : ''
        }`}
      >
        <button
          onClick={() => onNavigate('security')}
          className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-5 text-left hover:border-pink-500 hover:border-b-pink-600 hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          <span className="text-xs font-semibold text-[var(--mut2)] uppercase tracking-wider">
            Signed-in devices
          </span>
          <div className="text-3xl font-extrabold tracking-tight text-[var(--fg)] my-1.5">
            {state.sessions.length}
          </div>
          <span className="text-xs text-[var(--mut2)]">
            Last login {ago(state.sessions[0]?.ts || Date.now()).toLowerCase()}
          </span>
        </button>

        <button
          onClick={() => onNavigate('products')}
          className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-5 text-left hover:border-pink-500 hover:border-b-pink-600 hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
        >
          <span className="text-xs font-semibold text-[var(--mut2)] uppercase tracking-wider">
            Active Products
          </span>
          <div className="text-3xl font-extrabold tracking-tight text-[var(--fg)] my-1.5">
            {Object.keys(PROD_INFO).filter((id) => state.apps[id as ProductKey] !== false).length}
          </div>
          <span className="text-xs text-[var(--ok)] font-medium">
            4 of 4 products connected
          </span>
        </button>

        <div className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-200">
          <span className="text-xs font-semibold text-[var(--mut2)] uppercase tracking-wider">
            Actions in last 7 days
          </span>
          <div className="text-3xl font-extrabold tracking-tight text-[var(--fg)] my-1.5">
            {last7}
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--raised)] text-[var(--fg)]">
            {Math.abs(pct) < 5 ? (
              'Same as last week'
            ) : pct >= 0 ? (
              <>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--ok)]" />
                <span className="text-[var(--ok)]">Up {pct}% on last week</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-3.5 h-3.5 text-[var(--warn)]" />
                <span className="text-[var(--warn)]">Down {Math.abs(pct)}% on last week</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Connected Products Quick Grid */}
      <div
        data-dashboard-card={cardIndices.products}
        tabIndex={0}
        onFocus={() => onCardFocus?.(cardIndices.products)}
        className={`bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 outline-none relative my-3 ${
          focusedCardIndex === cardIndices.products
            ? 'ring-2 ring-pink-500 shadow-xl shadow-pink-500/10 scale-[1.006] !border-pink-500 !border-b-pink-600'
            : ''
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-[var(--fg)]">Your products</h3>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-[var(--brandtxt)] hover:underline cursor-pointer"
          >
            Manage
          </button>
        </div>

        {visibleProductIds.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 pt-1">
            {visibleProductIds.map((id) => {
              const p = PROD_INFO[id];
              const isPinned = !!state.fav[id];
              const isLinked = id === 'lidbridge' ? !!state.conn.github : true;
              return (
                <button
                  key={id}
                  onClick={() => onOpenProduct(id)}
                  className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-[3px] border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-4 text-left hover:border-pink-500 hover:border-b-pink-600 hover:-translate-y-0.5 transition-all duration-200 shadow-xs hover:shadow-md relative group cursor-pointer"
                >
                  {isPinned && (
                    <span className="absolute top-3.5 right-3.5 text-[var(--brand)]">
                      <Star className="w-4 h-4 fill-current" />
                    </span>
                  )}
                  <div className="font-bold text-sm text-[var(--fg)] mb-2 group-hover:text-[var(--brand)] transition-colors">
                    {p.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--mut2)]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isLinked ? 'bg-[var(--ok)]' : 'bg-[var(--warn)]'
                      }`}
                    />
                    <span>{isLinked ? 'Active' : 'Not linked'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 text-center text-sm text-[var(--mut2)]">
            All products are hidden. Turn them back on in Settings under Dashboard apps.
          </div>
        )}
      </div>

      {/* Activity Bar Chart Card */}
      <div
        data-dashboard-card={cardIndices.chart}
        tabIndex={0}
        onFocus={() => onCardFocus?.(cardIndices.chart)}
        className={`bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 outline-none relative ${
          focusedCardIndex === cardIndices.chart
            ? 'ring-2 ring-pink-500 shadow-xl shadow-pink-500/10 scale-[1.006] !border-pink-500 !border-b-pink-600'
            : ''
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-base text-[var(--fg)]">Activity</h3>
          {/* SlidingTabs with hover-to-switch for 7 days / 30 days */}
          <SlidingTabs
            tabs={rangeTabs}
            activeId={String(state.range)}
            onChange={(id) => onChangeRange(Number(id) as 7 | 30)}
            hoverEnabled={state.hoverTabs}
            hoverDelay={140}
          />
        </div>

        <p className="text-xs text-[var(--mut2)] mb-4" id="barInfo">
          {formatDayLabel(currentHoveredDay.d)}: {currentHoveredDay.v} actions{' '}
          {currentHoveredDay === chartSeries[chartSeries.length - 1] ? 'today' : ''}
        </p>

        {/* SVG Bar Chart with Hover and Keyboard interaction */}
        <div className="w-full">
          <svg
            className="w-full h-auto"
            viewBox="0 0 460 190"
            role="group"
            aria-label={`Activity last ${state.range} days`}
          >
            {chartSeries.map((x, i) => {
              const slot = 444 / state.range;
              const bw = Math.min(32, slot * 0.65);
              const h = Math.max(6, (x.v / maxVal) * 120);
              const cx = 8 + slot * i + slot / 2;
              const isToday = i === state.range - 1;
              const isHovered = hoveredBarIndex === i;

              return (
                <g
                  key={i}
                  tabIndex={0}
                  role="button"
                  aria-label={`${formatDayLabel(x.d)}: ${x.v} actions`}
                  className="cursor-pointer outline-none focus:opacity-80"
                  onMouseEnter={() => setHoveredBarIndex(i)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  onFocus={() => setHoveredBarIndex(i)}
                  onBlur={() => setHoveredBarIndex(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setHoveredBarIndex(i);
                    }
                  }}
                >
                  {/* Transparent hover hit target */}
                  <rect
                    x={(cx - slot / 2).toFixed(1)}
                    y="0"
                    width={slot.toFixed(1)}
                    height="190"
                    fill="transparent"
                  />
                  {/* Bar */}
                  <rect
                    x={(cx - bw / 2).toFixed(1)}
                    y={(152 - h).toFixed(1)}
                    width={bw.toFixed(1)}
                    height={h.toFixed(1)}
                    rx={Math.min(6, bw / 2).toFixed(1)}
                    fill={
                      isHovered || i === peakIdx
                        ? 'var(--brand)'
                        : 'color-mix(in srgb, var(--mut2) 35%, var(--card))'
                    }
                    className="transition-all duration-150"
                  />
                  {/* Label */}
                  {(state.range === 7 || i % 6 === 0 || isToday) && (
                    <text
                      x={cx.toFixed(1)}
                      y="176"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight={isToday ? 700 : 500}
                      fill={isToday ? 'var(--fg)' : 'var(--mut2)'}
                    >
                      {state.range === 7 ? 'SMTWTFS'[x.dow] : new Date(x.d * 864e5).getUTCDate()}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2-Column Grid: Recent Activity Component + Notifications Component */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Component with keyboard focus and cardIndex */}
        <RecentActivityCard
          onOpenActivityDrawer={onOpenActivityDrawer}
          onNavigate={(sec) => onNavigate(sec)}
          isFocused={focusedCardIndex === cardIndices.recentActivity}
          cardIndex={cardIndices.recentActivity}
        />

        {/* Notifications Component with keyboard focus and cardIndex */}
        <DashboardNotifications
          notifications={state.notifs}
          recentActivities={state.activity}
          onToggleRead={onToggleRead || (() => {})}
          onMarkAllRead={onMarkAllRead || (() => {})}
          onNavigate={(sec) => onNavigate(sec)}
          onOpenActivityDrawer={onOpenActivityDrawer}
          isFocused={focusedCardIndex === cardIndices.notifications}
          cardIndex={cardIndices.notifications}
        />
      </div>

    </div>
  );
};

export default DashboardSection;
