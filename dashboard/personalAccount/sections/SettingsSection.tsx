import React, { useState, useEffect } from 'react';
import { Sliders, User, Shield, AppWindow, Database, AlertTriangle, Check, Github, Disc as Discord, Sun, Moon, Monitor } from 'lucide-react';
import {
  DashboardState,
  SettingsTab,
  UserProfile,
  ThemeMode,
  LayoutDensity,
  NetworkSim,
  ProductKey,
} from '../types';
import { PROD_INFO, DAY } from '../constants';
import DataExportSection from './DataExportSection';
import SlidingTabs from '../SlidingTabs';

export interface ThemeToggleProps {
  currentTheme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  currentTheme,
  onSetTheme,
  className = '',
}) => {
  const handleToggle = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    root.dataset.theme = newTheme;
    const isDark = newTheme === 'dark';
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
    onSetTheme(newTheme);
  };

  const isLight = currentTheme === 'light';
  const isDark = currentTheme === 'dark';

  return (
    <div
      className={`bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 space-y-4 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-[var(--fg)]">Theme Mode</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30 uppercase tracking-wider">
              data-theme="{currentTheme}"
            </span>
          </div>
          <p className="text-xs text-[var(--mut2)] mt-1">
            Toggle between light and dark mode. Instantly synchronizes the root{' '}
            <code className="text-pink-600 dark:text-pink-400 font-mono">data-theme</code> attribute.
          </p>
        </div>

        {/* Quick segmented switch */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl shadow-xs">
          <button
            type="button"
            onClick={() => handleToggle('light')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isLight
                ? 'bg-white text-slate-900 border border-slate-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-[var(--fg)]'
            }`}
          >
            <Sun className={`w-4 h-4 ${isLight ? 'text-amber-500' : ''}`} />
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggle('dark')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-950 text-white border border-slate-700 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-[var(--fg)]'
            }`}
          >
            <Moon className={`w-4 h-4 ${isDark ? 'text-purple-400' : ''}`} />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Interactive Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {/* Light Mode Card */}
        <button
          type="button"
          onClick={() => handleToggle('light')}
          className={`p-4 rounded-xl border-2 border-b-[3px] text-left transition-all duration-200 cursor-pointer ${
            isLight
              ? 'border-pink-500 border-b-pink-600 bg-pink-50/70 dark:bg-pink-500/10 shadow-md ring-2 ring-pink-500/20'
              : 'border-slate-300 dark:border-slate-800 border-b-slate-400 dark:border-b-slate-700 bg-[var(--card)] hover:border-pink-400 hover:border-b-pink-500'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
                <Sun className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-[var(--fg)]">Light Theme</span>
            </div>
            {isLight && (
              <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/40 px-2 py-0.5 rounded-md">
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--mut2)] leading-relaxed">
            High-contrast slate borders with highlighted slider tabs, dark icons, and clean daylight readability.
          </p>
        </button>

        {/* Dark Mode Card */}
        <button
          type="button"
          onClick={() => handleToggle('dark')}
          className={`p-4 rounded-xl border-2 border-b-[3px] text-left transition-all duration-200 cursor-pointer ${
            isDark
              ? 'border-pink-500 border-b-pink-600 bg-pink-50/70 dark:bg-pink-500/10 shadow-md ring-2 ring-pink-500/20'
              : 'border-slate-300 dark:border-slate-800 border-b-slate-400 dark:border-b-slate-700 bg-[var(--card)] hover:border-pink-400 hover:border-b-pink-500'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Moon className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-[var(--fg)]">Dark Theme</span>
            </div>
            {isDark && (
              <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/40 px-2 py-0.5 rounded-md">
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--mut2)] leading-relaxed">
            Deep slate midnight backdrop with neon pink highlights and soft night-shift contrast.
          </p>
        </button>
      </div>
    </div>
  );
};

export interface SettingsSectionProps {
  state: DashboardState;
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  onUpdateProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  onChangeAvatarColor: () => void;
  onConnectGithub: () => void;
  onDisconnectGithub: () => void;
  onConnectDiscord: () => void;
  onDisconnectDiscord: () => void;
  onVerifyEmail: () => void;
  onAddBackupEmail: () => void;
  onRemoveBackupEmail: () => void;
  onNavigateToSecurity: () => void;
  onToggleAppVisibility: (prodId: ProductKey) => void;
  onSetTheme: (theme: ThemeMode) => void;
  onPreviewTheme?: (theme: ThemeMode | null) => void;
  onSetDensity: (density: LayoutDensity) => void;
  onSetNetworkSim: (sim: NetworkSim) => void;
  onReloadPage: () => void;
  onTriggerFailNext: () => void;
  onToggleMotion: () => void;
  onToggleOnboardSetting: () => void;
  onToggleHoverTabs: () => void;
  onOpenShortcutsModal: () => void;
  onGenerateExport: (json: string) => void;
  onResetDemoData: () => void;
  onDeleteAccount: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  state,
  activeTab,
  onTabChange,
  onUpdateProfile,
  onChangeAvatarColor,
  onConnectGithub,
  onDisconnectGithub,
  onConnectDiscord,
  onDisconnectDiscord,
  onVerifyEmail,
  onAddBackupEmail,
  onRemoveBackupEmail,
  onNavigateToSecurity,
  onToggleAppVisibility,
  onSetTheme,
  onPreviewTheme,
  onSetDensity,
  onSetNetworkSim,
  onReloadPage,
  onTriggerFailNext,
  onToggleMotion,
  onToggleOnboardSetting,
  onToggleHoverTabs,
  onOpenShortcutsModal,
  onGenerateExport,
  onResetDemoData,
  onDeleteAccount,
}) => {
  // Profile edit state
  const [display, setDisplay] = useState(state.user.display);
  const [name, setName] = useState(state.user.name);
  const [username, setUsername] = useState(state.user.username);
  const [birth, setBirth] = useState(state.user.birth);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    setDisplay(state.user.display);
    setName(state.user.name);
    setUsername(state.user.username);
    setBirth(state.user.birth);
  }, [state.user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const dVal = display.trim();
    const nVal = name.trim();
    const uVal = username.trim().toLowerCase();

    if (!dVal || dVal.length > 24) {
      errors.display = 'Enter a display name up to 24 characters.';
    }
    if (nVal.length < 2) {
      errors.name = 'Enter your name.';
    }
    if (!/^[a-z0-9_]{3,20}$/.test(uVal)) {
      errors.username = 'Use 3 to 20 letters, numbers, or underscores.';
    } else if (uVal !== state.user.username) {
      const recentChanges = state.unameChanges.filter((t: number) => Date.now() - t < 7 * DAY);
      if (recentChanges.length >= 2) {
        errors.username = 'You can change your username twice every 7 days.';
      }
    }

    if (birth) {
      const d = new Date(birth);
      const age = (Date.now() - d.getTime()) / (365.25 * DAY);
      if (isNaN(d.getTime()) || d.getTime() > Date.now()) {
        errors.birth = 'Enter a date in the past.';
      } else if (age < 13) {
        errors.birth = 'You must be at least 13 years old.';
      }
    }

    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setProfileSaving(true);
    const ok = await onUpdateProfile({
      display: dVal,
      name: nVal,
      username: uVal,
      birth,
    });
    setProfileSaving(false);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <User className="w-4 h-4" /> },
    { id: 'identity', label: 'Identity and verification', icon: <Shield className="w-4 h-4" /> },
    { id: 'apps', label: 'Dashboard apps', icon: <AppWindow className="w-4 h-4" /> },
    { id: 'prefs', label: 'Preferences', icon: <Sliders className="w-4 h-4" /> },
    { id: 'export', label: 'Data export', icon: <Database className="w-4 h-4" /> },
    { id: 'danger', label: 'Danger zone', icon: <AlertTriangle className="w-4 h-4" />, isDanger: true },
  ];

  const initial = (state.user.display || 'A').trim().charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      {/* Settings Navigation Top Bar */}
      <div className="w-full pb-3 border-b border-[var(--line)] overflow-x-auto scrollbar-none">
        <SlidingTabs
          tabs={tabs}
          activeId={activeTab}
          onChange={(id) => onTabChange(id as SettingsTab)}
          orientation="horizontal"
          hoverEnabled={state.hoverTabs}
          hoverDelay={140}
        />
      </div>

      {/* Tab Panels */}
      <div className="min-w-0 space-y-6">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* Avatar with Color Picker Action */}
                <div className="flex items-center gap-4 pb-4 border-b border-[var(--line)]">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white border-2 border-[var(--brand)] shadow-sm"
                    style={{
                      backgroundColor: state.user.color || 'var(--raised)',
                      color: state.user.color ? '#ffffff' : 'var(--fg)',
                    }}
                  >
                    {initial}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={onChangeAvatarColor}
                      className="px-4 py-2 bg-[var(--raised)] border border-[var(--line)] text-xs font-bold rounded-xl text-[var(--fg)] hover:border-[var(--mut2)] transition-colors"
                    >
                      Change photo
                    </button>
                    <p className="text-xs text-[var(--mut2)] mt-1.5">
                      Select custom avatar theme accent.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--mut2)] mb-1">
                      Display name
                    </label>
                    <input
                      type="text"
                      maxLength={24}
                      value={display}
                      onChange={(e) => setDisplay(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] text-sm focus:border-[var(--brand)] outline-none"
                    />
                    {profileErrors.display && (
                      <p className="text-xs text-[var(--bad)] mt-1">{profileErrors.display}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--mut2)] mb-1">
                      Full name
                    </label>
                    <input
                      type="text"
                      maxLength={40}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] text-sm focus:border-[var(--brand)] outline-none"
                    />
                    {profileErrors.name && (
                      <p className="text-xs text-[var(--bad)] mt-1">{profileErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--mut2)] mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] text-sm focus:border-[var(--brand)] outline-none"
                    />
                    {profileErrors.username && (
                      <p className="text-xs text-[var(--bad)] mt-1">{profileErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--mut2)] mb-1">
                      Birth date
                    </label>
                    <input
                      type="date"
                      value={birth}
                      onChange={(e) => setBirth(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--inbg)] text-[var(--fg)] text-sm focus:border-[var(--brand)] outline-none"
                    />
                    {profileErrors.birth && (
                      <p className="text-xs text-[var(--bad)] mt-1">{profileErrors.birth}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-5 py-2.5 bg-[var(--brand)] text-white text-sm font-bold rounded-xl hover:opacity-95 shadow-sm transition-all"
                >
                  {profileSaving ? 'Saving...' : 'Save changes'}
                </button>
              </form>
            </div>

            {/* Connected Accounts */}
            <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-[var(--cardsh)]">
              <h3 className="font-bold text-base text-[var(--fg)] mb-4">Connected accounts</h3>
              <div className="divide-y divide-[var(--line)]">
                <div className="py-3.5 flex items-center justify-between text-sm">
                  <div>
                    <b className="font-semibold text-[var(--fg)] block">GitHub</b>
                    <small className="text-xs text-[var(--mut2)]">
                      {state.conn.github ? `Linked as @${state.conn.github}` : 'Not linked'}
                    </small>
                  </div>
                  {state.conn.github ? (
                    <button
                      onClick={onDisconnectGithub}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-[var(--line)] text-[var(--fg)] hover:border-[var(--mut2)]"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={onConnectGithub}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[var(--brand)] text-white hover:opacity-95"
                    >
                      Connect
                    </button>
                  )}
                </div>

                <div className="py-3.5 flex items-center justify-between text-sm">
                  <div>
                    <b className="font-semibold text-[var(--fg)] block">Discord</b>
                    <small className="text-xs text-[var(--mut2)]">
                      {state.conn.discord ? `Linked as ${state.conn.discord}` : 'Not linked'}
                    </small>
                  </div>
                  {state.conn.discord ? (
                    <button
                      onClick={onDisconnectDiscord}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-[var(--line)] text-[var(--fg)] hover:border-[var(--mut2)]"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={onConnectDiscord}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[var(--brand)] text-white hover:opacity-95"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Identity & Verification Tab */}
        {activeTab === 'identity' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-[var(--cardsh)]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-base text-[var(--fg)]">Primary email</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    state.user.verified
                      ? 'bg-[var(--ok)]/15 text-[var(--ok)]'
                      : 'bg-[var(--warn)]/15 text-[var(--warn)]'
                  }`}
                >
                  {state.user.verified ? 'Verified' : 'Not verified'}
                </span>
              </div>
              <p className="text-sm font-semibold text-[var(--fg)] mb-4">{state.user.email}</p>
              {state.user.verified ? (
                <p className="text-xs text-[var(--ok)] flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4" /> Your email is confirmed.
                </p>
              ) : (
                <button
                  onClick={onVerifyEmail}
                  className="px-4 py-2 bg-[var(--brand)] text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-sm"
                >
                  Verify email
                </button>
              )}
            </div>

            <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-[var(--cardsh)]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-base text-[var(--fg)]">Backup email</h3>
                <span className="text-xs text-[var(--mut2)]">
                  {state.user.backup ? 'Added' : 'Optional'}
                </span>
              </div>
              {state.user.backup ? (
                <div className="flex items-center justify-between py-2 text-sm">
                  <span className="font-medium text-[var(--fg)]">{state.user.backup}</span>
                  <button
                    onClick={onRemoveBackupEmail}
                    className="text-xs font-semibold text-[var(--bad)] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-[var(--mut)] mb-4">
                    Helps you regain access if you ever lose your primary mailbox.
                  </p>
                  <button
                    onClick={onAddBackupEmail}
                    className="px-4 py-2 bg-[var(--raised)] border border-[var(--line)] text-xs font-bold rounded-xl text-[var(--fg)] hover:border-[var(--mut2)]"
                  >
                    Add backup email
                  </button>
                </>
              )}
            </div>

            <div className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between">
              <div>
                <b className="font-bold text-sm text-[var(--fg)] block">Two-factor authentication</b>
                <small className="text-xs text-[var(--mut2)]">
                  {state.twofa ? 'Enabled' : 'Disabled'}
                </small>
              </div>
              <button
                onClick={onNavigateToSecurity}
                className="px-4 py-2 bg-[var(--raised)] border border-[var(--line)] text-xs font-bold rounded-xl text-[var(--fg)] hover:border-[var(--mut2)]"
              >
                Manage in Security
              </button>
            </div>

            {/* User Settings Theme Toggle Component */}
            <ThemeToggle currentTheme={state.theme} onSetTheme={onSetTheme} />
          </div>
        )}

        {/* Dashboard Apps Tab */}
        {activeTab === 'apps' && (
          <div className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 animate-fade-in">
            <h3 className="font-bold text-base text-[var(--fg)] mb-1">Dashboard apps</h3>
            <p className="text-xs text-[var(--mut2)] mb-5">
              Choose which products are visible on your Overview page.
            </p>

            <div className="divide-y divide-[var(--line)]">
              {(Object.keys(PROD_INFO) as ProductKey[]).map((id) => {
                const p = PROD_INFO[id];
                const isVisible = state.apps[id] !== false;

                return (
                  <div key={id} className="py-3.5 flex items-center justify-between text-sm">
                    <div>
                      <b className="font-semibold text-[var(--fg)] block">{p.name}</b>
                      <small className="text-xs text-[var(--mut2)]">{p.desc}</small>
                    </div>

                    <button
                      onClick={() => onToggleAppVisibility(id)}
                      role="switch"
                      aria-checked={isVisible}
                      className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                        isVisible ? 'bg-[var(--brand)]' : 'bg-[var(--tgoff)]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          isVisible ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'prefs' && (
          <div className="space-y-6 animate-fade-in">
            {/* Theme Toggle Component in Preferences */}
            <ThemeToggle currentTheme={state.theme} onSetTheme={onSetTheme} />

            {/* Layout Density */}
            <div className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
              <h3 className="font-bold text-base text-[var(--fg)] mb-3">Layout density</h3>
              <div className="flex gap-2">
                {(['comfortable', 'compact'] as LayoutDensity[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => onSetDensity(d)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 border-b-[3px] transition-all duration-200 capitalize ${
                      state.density === d
                        ? 'bg-[var(--card)] border-pink-500 border-b-pink-600 text-[var(--fg)] font-bold shadow-xs'
                        : 'border-slate-300 dark:border-slate-700 border-b-slate-400 dark:border-b-slate-800 text-[var(--mut)] hover:border-pink-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Loading & Error States */}
            <div className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
              <h3 className="font-bold text-base text-[var(--fg)] mb-1">
                Test loading and error states
              </h3>
              <p className="text-xs text-[var(--mut2)] mb-4">
                Designed for review. Pages display an animated skeleton upon first load.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(['normal', 'slow', 'offline'] as NetworkSim[]).map((sim) => (
                  <button
                    key={sim}
                    onClick={() => onSetNetworkSim(sim)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-b-[3px] border-slate-300 dark:border-slate-700 border-b-slate-400 dark:border-b-slate-800 capitalize transition-colors hover:border-pink-400"
                  >
                    {sim}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onReloadPage}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-[var(--line)] text-[var(--fg)] hover:border-[var(--mut2)]"
                >
                  Reload this page
                </button>
                <button
                  onClick={onTriggerFailNext}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-[var(--line)] text-[var(--fg)] hover:border-[var(--mut2)]"
                >
                  Show error state
                </button>
              </div>
            </div>

            {/* Extras Toggles */}
            <div className="bg-[var(--card)] border-2 border-slate-300 dark:border-slate-700/80 border-b-4 border-b-slate-400 dark:border-b-slate-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200 divide-y divide-[var(--line)]">
              <h3 className="font-bold text-base text-[var(--fg)] pb-3">Extras</h3>

              <div className="py-3.5 flex items-center justify-between text-sm">
                <div>
                  <b className="font-semibold text-[var(--fg)] block">Animations</b>
                  <small className="text-xs text-[var(--mut2)]">
                    Score ring and micro-transitions
                  </small>
                </div>
                <button
                  onClick={onToggleMotion}
                  role="switch"
                  aria-checked={state.motion}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    state.motion ? 'bg-[var(--brand)]' : 'bg-[var(--tgoff)]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      state.motion ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="py-3.5 flex items-center justify-between text-sm">
                <div>
                  <b className="font-semibold text-[var(--fg)] block">Setup checklist</b>
                  <small className="text-xs text-[var(--mut2)]">
                    Show Getting started on Overview
                  </small>
                </div>
                <button
                  onClick={onToggleOnboardSetting}
                  role="switch"
                  aria-checked={state.onboard === 'show'}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    state.onboard === 'show' ? 'bg-[var(--brand)]' : 'bg-[var(--tgoff)]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      state.onboard === 'show' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="py-3.5 flex items-center justify-between text-sm">
                <div>
                  <b className="font-semibold text-[var(--fg)] block">Hover shortcuts</b>
                  <small className="text-xs text-[var(--mut2)]">
                    Switch tabs and preview themes when the mouse rests on them
                  </small>
                </div>
                <button
                  onClick={onToggleHoverTabs}
                  role="switch"
                  aria-checked={state.hoverTabs}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    state.hoverTabs ? 'bg-[var(--brand)]' : 'bg-[var(--tgoff)]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      state.hoverTabs ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-3.5 flex items-center justify-between text-sm">
                <div>
                  <b className="font-semibold text-[var(--fg)] block">Keyboard shortcuts</b>
                  <small className="text-xs text-[var(--mut2)]">Navigate without the mouse</small>
                </div>
                <button
                  onClick={onOpenShortcutsModal}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border border-[var(--line)] text-[var(--fg)] hover:border-[var(--mut2)]"
                >
                  View shortcuts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Export Tab */}
        {activeTab === 'export' && (
          <div className="animate-fade-in">
            <DataExportSection state={state} onGenerateExport={onGenerateExport} />
          </div>
        )}

        {/* Danger Zone Tab */}
        {activeTab === 'danger' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[var(--card)] border border-[var(--line)] rounded-2xl p-6 shadow-[var(--cardsh)]">
              <h3 className="font-bold text-base text-[var(--fg)] mb-2">Reset demo data</h3>
              <p className="text-xs text-[var(--mut2)] mb-4">
                Restore all sample data and settings to original state.
              </p>
              <button
                onClick={onResetDemoData}
                className="px-4 py-2 bg-[var(--raised)] border border-[var(--line)] text-xs font-bold rounded-xl text-[var(--fg)] hover:border-[var(--mut2)] transition-colors"
              >
                Reset demo data
              </button>
            </div>

            <div className="bg-[var(--card)] border border-[var(--bad)]/40 rounded-2xl p-6 shadow-[var(--cardsh)]">
              <h3 className="font-bold text-base text-[var(--bad)] mb-2">Delete account</h3>
              <p className="text-xs text-[var(--mut2)] mb-4">
                This removes your profile, tickets, and activity. You will be prompted to enter your
                username to confirm.
              </p>
              <button
                onClick={onDeleteAccount}
                className="px-4 py-2 bg-[var(--bad)] text-white text-xs font-bold rounded-xl hover:opacity-95 shadow-sm transition-all"
              >
                Delete account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;
