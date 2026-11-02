import React, { useState } from 'react';
import {
  LayoutDashboard,
  Boxes,
  ShieldCheck,
  Bell,
  LifeBuoy,
  Ticket as TicketIcon,
  HelpCircle,
  MessageSquarePlus,
  Sliders,
  Award,
  MoreHorizontal,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { SectionId, UserProfile } from './types';
import { LIDPREX_LOGO_URL } from './constants';

export interface SectionItem {
  id: SectionId;
  label: string;
  isSubItem?: boolean;
}

export interface PersonalAccountSidebarProps {
  theme: 'dark' | 'light' | 'system';
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
  onLogout: () => void;
  user: UserProfile;
  unreadNotificationsCount?: number;
  openTicketActive?: boolean;
  isOpen?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onCloseSidebar?: () => void;
}

export const PersonalAccountSidebar: React.FC<PersonalAccountSidebarProps> = ({
  activeSection,
  onSectionChange,
  onLogout,
  user,
  unreadNotificationsCount = 0,
  openTicketActive = false,
  isOpen = true,
  isCollapsed = false,
  onToggleCollapse,
  onCloseSidebar,
}) => {
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [logoImgError, setLogoImgError] = useState(false);

  const initial = (user.display || 'A').trim().charAt(0).toUpperCase();

  const getSectionIcon = (id: SectionId, _active: boolean) => {
    const iconProps = { className: 'w-4 h-4 shrink-0 transition-colors' };
    switch (id) {
      case 'dashboard':
        return <LayoutDashboard {...iconProps} />;
      case 'products':
        return <Boxes {...iconProps} />;
      case 'security':
        return <ShieldCheck {...iconProps} />;
      case 'notifications':
        return <Bell {...iconProps} />;
      case 'support':
        return <LifeBuoy {...iconProps} />;
      case 'open_ticket':
        return <TicketIcon {...iconProps} />;
      case 'faq':
        return <HelpCircle {...iconProps} />;
      case 'feedback':
        return <MessageSquarePlus {...iconProps} />;
      case 'settings':
        return <Sliders {...iconProps} />;
      default:
        return <LayoutDashboard {...iconProps} />;
    }
  };

  const navItems: SectionItem[] = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'products', label: 'Products' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'support', label: 'Support' },
    ...(openTicketActive
      ? [{ id: 'open_ticket' as SectionId, label: 'Open ticket', isSubItem: true }]
      : []),
    { id: 'faq', label: 'FAQ', isSubItem: true },
    { id: 'feedback', label: 'Feedback', isSubItem: true },
    { id: 'settings', label: 'Settings' },
  ];

  const mobilePrimaryIds: SectionId[] = ['dashboard', 'products', 'notifications', 'settings'];
  const mobileMoreIds: SectionId[] = ['security', 'support', 'faq', 'feedback'];

  if (!isOpen) {
    return null;
  }

  // COLLAPSED MINI SIDEBAR MODE
  if (isCollapsed) {
    return (
      <>
        {/* Desktop Collapsed Mini Rail (w-20) */}
        <aside className="fixed left-0 top-0 hidden h-screen w-20 border-r border-slate-200 dark:border-[var(--line)] bg-[#F8FAFC] dark:bg-[var(--side)] z-40 md:flex flex-col items-center py-4 select-none justify-between transition-all duration-300">
          {/* Top: Real Lidprex Logo Badge in Collapsed Navigation Bar */}
          <div className="flex flex-col items-center w-full px-2">
            <button
              type="button"
              onClick={() => onSectionChange('dashboard')}
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-700 shadow-md ring-2 ring-pink-500/20 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform p-1.5 overflow-hidden group"
              title="Lidprex Dashboard"
              aria-label="Lidprex Dashboard"
            >
              {!logoImgError ? (
                <img
                  src={LIDPREX_LOGO_URL}
                  alt="Lidprex"
                  onError={() => setLogoImgError(true)}
                  className="w-full h-full object-contain brightness-110 group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-xs ring-1 ring-white/30">
                  L
                </div>
              )}
            </button>
          </div>

          {/* Middle: Icon-only Navigation Buttons in pure white with pink icon on hover */}
          <nav className="flex flex-col items-center gap-2 w-full px-2 my-auto">
            {navItems
              .filter((item) => !item.isSubItem)
              .map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`sidebar-nav-btn w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all relative group cursor-pointer ${
                      isActive
                        ? 'active-nav border-pink-500 bg-white dark:bg-slate-900 text-pink-600 shadow-sm ring-2 ring-pink-500/20 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-pink-500 hover:shadow-sm'
                    }`}
                    title={item.label}
                  >
                    <div
                      className={`sidebar-icon-box transition-colors ${
                        isActive
                          ? 'text-pink-600'
                          : 'text-slate-700 dark:text-slate-300 group-hover:text-[#EC4899]'
                      }`}
                    >
                      {getSectionIcon(item.id, isActive)}
                    </div>
                    {item.id === 'notifications' && unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                );
              })}
          </nav>

          {/* Bottom: Expand button, then Profile Avatar (Logout button hidden in closed nav as requested) */}
          <div className="flex flex-col items-center gap-2.5 w-full px-2 pt-2 border-t border-slate-200 dark:border-[var(--line)]">
            {/* Expand Navigation Button at the bottom */}
            <button
              onClick={onToggleCollapse}
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-500 shadow-xs flex items-center justify-center transition-all cursor-pointer group sidebar-nav-btn"
              title="Expand navigation bar"
              aria-label="Expand navigation bar"
            >
              <PanelLeftOpen className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-pink-500 transition-colors" />
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => onSectionChange('settings')}
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white border border-slate-200 dark:border-slate-700 shadow-xs hover:border-pink-500 hover:scale-105 transition-all cursor-pointer mb-1"
              style={{ backgroundColor: user.color || 'var(--brand)' }}
              title={`${user.display} - Settings`}
            >
              {initial}
            </button>
          </div>
        </aside>

        {/* Mobile Bottom Navigation (for small screens) */}
        <nav className="md:hidden fixed bottom-3 left-3 right-3 bg-[var(--card)] border border-[var(--line)] rounded-2xl shadow-xl z-50 px-2 py-2 flex items-center justify-around">
          {mobilePrimaryIds.map((id) => {
            const isActive = activeSection === id;
            const label =
              id === 'dashboard'
                ? 'Home'
                : id === 'products'
                ? 'Products'
                : id === 'notifications'
                ? 'Alerts'
                : 'Settings';
            return (
              <button
                key={id}
                onClick={() => onSectionChange(id)}
                className={`relative flex flex-col items-center gap-1 py-1 px-1.5 sm:px-3 text-[10px] sm:text-[11px] font-medium transition-colors shrink-0 ${
                  isActive ? 'text-[var(--brand)] font-bold' : 'text-[var(--mut2)]'
                }`}
              >
                {getSectionIcon(id, isActive)}
                <span className="truncate max-w-[56px] text-center">{label}</span>
                {id === 'notifications' && unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[var(--brand)] text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => setMobileMoreOpen(true)}
            className={`flex flex-col items-center gap-1 py-1 px-1.5 sm:px-3 text-[10px] sm:text-[11px] font-medium transition-colors shrink-0 ${
              mobileMoreIds.includes(activeSection)
                ? 'text-[var(--brand)] font-bold'
                : 'text-[var(--mut2)]'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="truncate max-w-[56px] text-center">More</span>
          </button>
        </nav>
      </>
    );
  }

  // EXPANDED FULL SIDEBAR MODE
  return (
    <>
      {/* Desktop Sticky/Fixed Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 dark:border-[var(--line)] bg-[#F8FAFC] dark:bg-[var(--side)] z-40 md:flex flex-col select-none transition-all duration-300">
        {/* Brand / Logo (clean standalone card without close button, as requested) */}
        <div className="px-4 pt-4 pb-3.5 border-b border-slate-200 dark:border-[var(--line)]">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-700 shadow-md ring-2 ring-pink-500/20 text-white w-full">
            {!logoImgError ? (
              <img
                src={LIDPREX_LOGO_URL}
                alt="Lidprex"
                onError={() => setLogoImgError(true)}
                className="h-6 w-auto max-w-[100px] object-contain transition-transform hover:scale-105 brightness-110 shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-xs shrink-0 ring-1 ring-white/30">
                L
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm tracking-tight text-white leading-none">Lidprex</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-pink-500/30 text-pink-300 border border-pink-400/40 leading-none">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 mt-0.5 truncate leading-none">Dashboard</span>
            </div>
          </div>
        </div>

        {/* Navigation list: symmetrical metric alignment, decreased vertical padding (upper & lower) */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto py-3">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`sidebar-nav-btn w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 text-xs sm:text-[13px] font-semibold border group text-left cursor-pointer ${
                  isActive
                    ? 'active-nav border-pink-500 text-pink-700 dark:text-pink-300 bg-white dark:bg-slate-900 shadow-sm ring-1 ring-pink-500/20 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-pink-500 hover:shadow-xs'
                }`}
              >
                {/* Symmetrical Icon Container - exact same width, height, and alignment metric */}
                <div
                  className={`sidebar-icon-box w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    isActive
                      ? 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 border-pink-400 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 group-hover:border-pink-500 group-hover:text-[#EC4899] group-hover:scale-105 shadow-2xs'
                  }`}
                >
                  <span className="transition-colors group-hover:text-[#EC4899]">
                    {getSectionIcon(item.id, isActive)}
                  </span>
                </div>
                {/* Symmetrical Text Metric */}
                <span className="flex-1 truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  {item.label}
                </span>
                {item.isSubItem && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    ·
                  </span>
                )}
                {item.id === 'notifications' && unreadNotificationsCount > 0 && (
                  <span className="bg-[var(--brand)] text-white text-[10px] font-bold rounded-full px-1.5 py-0.2 leading-none shrink-0 shadow-xs">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse sidebar button - placed right above profile section as requested */}
        {(onToggleCollapse || onCloseSidebar) && (
          <div className="px-3 pt-2 pb-1.5 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onToggleCollapse || onCloseSidebar}
              className="sidebar-nav-btn w-full flex items-center justify-between px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-pink-500 hover:text-pink-600 transition-all shadow-xs cursor-pointer group"
              title="Collapse sidebar into mini navigation bar"
              aria-label="Collapse sidebar"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 group-hover:text-pink-500 transition-colors">
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </div>
                <span>Collapse navigation</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">◀</span>
            </button>
          </div>
        )}

        {/* Profile Button with Small Square Log Out Button on the right (Long button removed as requested) */}
        <div className="p-3 pt-1.5 border-t border-slate-200 dark:border-[var(--line)]">
          <div className="flex items-center gap-1.5">
            {/* Profile Button occupying bottom spot */}
            <button
              onClick={() => onSectionChange('settings')}
              className="sidebar-nav-btn flex-1 min-w-0 flex items-center gap-2.5 p-1.5 pr-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-400 transition-all text-left group shadow-xs cursor-pointer"
              title="Account Settings"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white border border-slate-200 dark:border-slate-700 transition-transform group-hover:scale-105 shrink-0 shadow-xs"
                style={{
                  backgroundColor: user.color || 'var(--brand)',
                }}
              >
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate text-[var(--fg)] group-hover:text-pink-600 transition-colors">
                  {user.display}
                </div>
                <div className="text-[10px] text-[var(--mut2)] truncate leading-none">
                  {user.email}
                </div>
              </div>
            </button>

            {/* Small Square Hold/Robot Type Log Out Button on the right */}
            <button
              type="button"
              onClick={onLogout}
              className="sidebar-nav-btn w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 dark:text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer group"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 bg-[var(--card)] border border-[var(--line)] rounded-2xl shadow-xl z-50 px-2 py-2 flex items-center justify-around">
        {mobilePrimaryIds.map((id) => {
          const isActive = activeSection === id;
          const label =
            id === 'dashboard'
              ? 'Home'
              : id === 'products'
              ? 'Products'
              : id === 'notifications'
              ? 'Alerts'
              : 'Settings';
          return (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={`relative flex flex-col items-center gap-1 py-1 px-1.5 sm:px-3 text-[10px] sm:text-[11px] font-medium transition-colors shrink-0 ${
                isActive ? 'text-[var(--brand)] font-bold' : 'text-[var(--mut2)]'
              }`}
            >
              {getSectionIcon(id, isActive)}
              <span className="truncate max-w-[56px] text-center">{label}</span>
              {id === 'notifications' && unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[var(--brand)] text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          );
        })}

        <button
          onClick={() => setMobileMoreOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 sm:px-3 text-[10px] sm:text-[11px] font-medium transition-colors shrink-0 ${
            mobileMoreIds.includes(activeSection)
              ? 'text-[var(--brand)] font-bold'
              : 'text-[var(--mut2)]'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="truncate max-w-[56px] text-center">More</span>
        </button>
      </nav>

      {/* Mobile More Sheet */}
      {mobileMoreOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center md:hidden"
          onClick={() => setMobileMoreOpen(false)}
        >
          <div
            className="w-full bg-[var(--card)] rounded-t-3xl border-t border-[var(--line)] p-6 space-y-3 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-[var(--line)]">
              <h3 className="font-bold text-base text-[var(--fg)]">More Options</h3>
              <button
                onClick={() => setMobileMoreOpen(false)}
                className="text-sm font-semibold text-[var(--mut2)]"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {mobileMoreIds.map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    onSectionChange(id);
                    setMobileMoreOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left border border-[var(--line)] transition-colors ${
                    activeSection === id ? 'bg-[var(--raised)] border-[var(--brand)]' : ''
                  }`}
                >
                  {getSectionIcon(id, activeSection === id)}
                  <span className="text-sm font-semibold capitalize">{id.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-[var(--line)]">
              <button
                onClick={() => {
                  setMobileMoreOpen(false);
                  onLogout();
                }}
                className="w-full py-3 rounded-xl text-center text-sm font-bold text-[var(--bad)] bg-[var(--raised)]"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalAccountSidebar;
