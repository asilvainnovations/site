/**
 * ASilva Innovations — App.tsx
 * Refactored: Liquid Glass Design System · Apple HIG · Government-Grade UI
 * Features: Auth, Role-Based Access, Elektra AI, Notifications, Settings, Profile
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import {
  Mail, Linkedin, Facebook, Instagram, ArrowRight, Phone, Globe,
  X, Menu, Bell, User, Settings, LogOut, Shield, ChevronDown,
  ChevronRight, Send, Bot, Sparkles, AlertTriangle, CheckCircle,
  Info, Eye, EyeOff, Lock, Moon, Sun, Zap, MessageSquare,
  BarChart3, MapPin, FileText, Users, Building2, Star, Clock,
  Volume2, VolumeX, Smartphone, Monitor, Check, RefreshCw
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = 'Systems Thinking' | 'Risk Management' | 'Strategic Leadership' | 'Disaster Resilience' | 'AI Innovation' | 'Compliance';
type UserRole = 'admin' | 'analyst' | 'field_officer' | 'viewer' | 'lgu_official' | 'ngo_partner';
type Theme = 'dark' | 'light';
type NotifPriority = 'critical' | 'high' | 'medium' | 'low';
type AuthView = 'login' | 'register' | 'forgot';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  phone?: string;
  avatar?: string;
  twoFactorEnabled: boolean;
  notifEmail: boolean;
  notifSMS: boolean;
  notifPush: boolean;
  notifPriority: NotifPriority;
  quietHoursStart: string;
  quietHoursEnd: string;
  aiStyle: 'concise' | 'detailed';
  aiSuggestions: boolean;
  language: string;
  timezone: string;
  theme: Theme;
}

interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  body: string;
  time: string;
  read: boolean;
  category: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const OFFICIAL_LOGO_URL = 'https://appimize.app/assets/apps/user_1097/images/2c7d825bf937_232_1097.png';
const HERO_BG_IMAGE_URL = 'https://appimize.app/assets/apps/user_1097/images/8df0614c4061_739_1097.jpg';
const DDRIVE_IMAGE_URL = 'https://appimize.app/assets/apps/user_1097/images/4750f689086d_379_1097.png';
const STRAT_PLANNER_IMAGE_URL = 'https://appimize.app/assets/apps/user_1097/images/d6780c531792_34_1097.png';
const RTL_IMAGE_URL = 'https://appimize.app/assets/apps/user_1097/images/d479ce1cc4b2_113_1097.png';
const AI_SOLUTIONS_IMAGE_URL = 'https://appimize.app/assets/apps/user_1097/images/055b612d128d_302_1097.png';

const CATEGORIES: Category[] = ['Systems Thinking', 'Risk Management', 'Strategic Leadership', 'Disaster Resilience', 'AI Innovation', 'Compliance'];

const CATEGORY_COLORS: Record<Category, string> = {
  'Systems Thinking': '#3B82F6',
  'Risk Management': '#EF4444',
  'Strategic Leadership': '#10B981',
  'Disaster Resilience': '#F59E0B',
  'AI Innovation': '#8B5CF6',
  'Compliance': '#06B6D4',
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  analyst: 'Risk Analyst',
  field_officer: 'Field Officer',
  viewer: 'Viewer',
  lgu_official: 'LGU Official',
  ngo_partner: 'NGO Partner',
};

const ROLE_ACCESS: Record<UserRole, string[]> = {
  admin: ['dashboard', 'analytics', 'users', 'settings', 'reports', 'ai'],
  analyst: ['dashboard', 'analytics', 'reports', 'ai'],
  lgu_official: ['dashboard', 'reports', 'ai'],
  ngo_partner: ['dashboard', 'reports'],
  field_officer: ['dashboard', 'reports'],
  viewer: ['dashboard'],
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'critical', title: 'Typhoon Alert — Leyte Gulf', body: 'Category 4 typhoon signal. Activate DRRM protocols immediately.', time: '2 min ago', read: false, category: 'Disaster Resilience' },
  { id: '2', type: 'warning', title: 'Risk Assessment Overdue', body: 'Q2 ISO 31000 compliance assessment is 3 days past deadline.', time: '1 hr ago', read: false, category: 'Compliance' },
  { id: '3', type: 'success', title: 'DDRiVE-M Deployment Complete', body: 'Salcedo, Eastern Samar successfully onboarded to the platform.', time: '3 hr ago', read: true, category: 'Systems Thinking' },
  { id: '4', type: 'info', title: 'AI Report Generated', body: 'Quarterly resilience scorecard for Bangsamoro is ready for review.', time: 'Yesterday', read: true, category: 'AI Innovation' },
];

const MOCK_USER: UserProfile = {
  id: 'usr_001',
  name: 'Maria Santos',
  email: 'maria.santos@lgu-salcedo.gov.ph',
  role: 'lgu_official',
  organization: 'LGU Salcedo, Eastern Samar',
  phone: '+63 (917) 855-5134',
  twoFactorEnabled: false,
  notifEmail: true,
  notifSMS: false,
  notifPush: true,
  notifPriority: 'high',
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  aiStyle: 'concise',
  aiSuggestions: true,
  language: 'en',
  timezone: 'Asia/Manila',
  theme: 'dark',
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

const useIntersection = (threshold = 0.1) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
};

const useCounter = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const raf = (t: number) => {
      if (!startTime) startTime = t;
      const p = Math.min((t - startTime) / duration, 1);
      setCount(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [started, end, duration]);
  return [ref, count] as const;
};

// ─── Animated Counter ─────────────────────────────────────────────────────────

const Counter: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = '' }) => {
  const [ref, count] = useCounter(end);
  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
};

// ─── Glass Panel ──────────────────────────────────────────────────────────────

const GlassPanel: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md
      hover:border-white/20 hover:bg-white/8 transition-all duration-300 ${className}`}
    style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
  >
    {/* Specular highlight */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl pointer-events-none" />
    {children}
  </div>
);

// ─── Auth Modal ───────────────────────────────────────────────────────────────

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'lgu_official' as UserRole, org: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all required fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    onLogin({ ...MOCK_USER, email: form.email, name: form.name || MOCK_USER.name, role: form.role, organization: form.org || MOCK_USER.organization });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={onClose} />
      <GlassPanel className="relative w-full max-w-md p-8 bg-slate-900/90 z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 shadow-lg shadow-blue-500/30">
            <div className="w-full h-full bg-white rounded-lg flex items-center justify-center p-0.5">
              <img src={OFFICIAL_LOGO_URL} alt="ASilva" className="w-full h-full object-contain" />
            </div>
          </div>
          <div>
            <div className="font-bold text-white text-sm">ASilva Innovations</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Secure Portal</div>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-slate-800/50 mb-6">
          {(['login', 'register'] as AuthView[]).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${view === v ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}>
              {v === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Maria Santos"
                  className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 hover:border-white/20 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Role *</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
                  className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/20 transition-colors appearance-none">
                  {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Organization</label>
                <input type="text" value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))}
                  placeholder="LGU Salcedo, Eastern Samar"
                  className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 hover:border-white/20 transition-colors" />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Email Address *</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@organization.gov.ph"
              className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 hover:border-white/20 transition-colors" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Password *</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 hover:border-white/20 transition-colors" />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {view === 'login' && (
            <div className="flex justify-end">
              <button type="button" onClick={() => setView('forgot')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? (
              <><RefreshCw size={16} className="animate-spin" /> {view === 'login' ? 'Signing in…' : 'Creating account…'}</>
            ) : (
              <>{view === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
            )}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs text-slate-500 bg-transparent"><span className="px-2 bg-slate-900/90">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Google', 'Microsoft'].map(provider => (
              <button key={provider} type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all text-sm font-medium">
                <Shield size={14} /> {provider}
              </button>
            ))}
          </div>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          By signing in, you agree to our{' '}
          <a href="https://asilvainnovations.github.io/website/terms.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Terms</a>
          {' & '}
          <a href="https://asilvainnovations.github.io/website/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Privacy Policy</a>
        </p>
      </GlassPanel>
    </div>
  );
};

// ─── User Profile Panel ───────────────────────────────────────────────────────

interface ProfilePanelProps {
  user: UserProfile;
  onUpdate: (u: Partial<UserProfile>) => void;
  onClose: () => void;
  onLogout: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ user, onUpdate, onClose, onLogout }) => {
  const [tab, setTab] = useState<'profile' | 'settings' | 'notifications' | 'security'>('profile');
  const [editForm, setEditForm] = useState({ name: user.name, phone: user.phone || '', org: user.organization });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate({ name: editForm.name, phone: editForm.phone, organization: editForm.org });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
    { id: 'notifications' as const, label: 'Alerts', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-end p-4 pt-20">
      <div className="absolute inset-0" onClick={onClose} />
      <GlassPanel className="relative w-full max-w-sm bg-slate-900/95 z-10 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white truncate">{user.name}</div>
              <div className="text-xs text-slate-400 truncate">{user.email}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">{ROLE_LABELS[user.role]}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1"><X size={16} /></button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-wider transition-all ${tab === id ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 max-h-96 overflow-y-auto">
          {/* Profile Tab */}
          {tab === 'profile' && (
            <div className="space-y-4">
              {[
                { label: 'Full Name', key: 'name' as const, placeholder: 'Your name' },
                { label: 'Phone', key: 'phone' as const, placeholder: '+63 (917) 000-0000' },
                { label: 'Organization', key: 'org' as const, placeholder: 'Your organization' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">{label}</label>
                  <input value={editForm[key]} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-slate-800/70 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500 hover:border-white/20 transition-colors" />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Role</label>
                <div className="px-3 py-2.5 rounded-lg border border-white/10 bg-slate-800/30 text-slate-300 text-sm">
                  {ROLE_LABELS[user.role]}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">Access Level</label>
                <div className="flex flex-wrap gap-1.5">
                  {ROLE_ACCESS[user.role].map(a => (
                    <span key={a} className="text-[9px] px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 uppercase tracking-wider font-semibold">{a}</span>
                  ))}
                </div>
              </div>
              <button onClick={handleSave}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
                {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Settings Tab */}
          {tab === 'settings' && (
            <div className="space-y-5">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">General</div>
                <div className="space-y-3">
                  {[
                    { label: 'Language', options: [{ val: 'en', label: 'English' }, { val: 'fil', label: 'Filipino' }], key: 'language' as const },
                    { label: 'Timezone', options: [{ val: 'Asia/Manila', label: 'Asia/Manila (PHT)' }, { val: 'UTC', label: 'UTC' }], key: 'timezone' as const },
                  ].map(({ label, options, key }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{label}</span>
                      <select value={user[key] as string} onChange={e => onUpdate({ [key]: e.target.value })}
                        className="bg-slate-800/70 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
                        {options.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
                      </select>
                    </div>
                  ))}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Theme</span>
                    <button onClick={() => onUpdate({ theme: user.theme === 'dark' ? 'light' : 'dark' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs transition-colors">
                      {user.theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                      {user.theme === 'dark' ? 'Dark' : 'Light'}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Elektra AI</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Response style</span>
                    <select value={user.aiStyle} onChange={e => onUpdate({ aiStyle: e.target.value as 'concise' | 'detailed' })}
                      className="bg-slate-800/70 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="concise">Concise</option>
                      <option value="detailed">Detailed</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">AI suggestions in dashboard</span>
                    <button onClick={() => onUpdate({ aiSuggestions: !user.aiSuggestions })}
                      className={`w-10 h-5 rounded-full transition-all relative ${user.aiSuggestions ? 'bg-blue-500' : 'bg-slate-700'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${user.aiSuggestions ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {tab === 'notifications' && (
            <div className="space-y-5">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Channels</div>
                <div className="space-y-3">
                  {[
                    { label: 'Email notifications', icon: Mail, key: 'notifEmail' as const },
                    { label: 'SMS alerts', icon: Smartphone, key: 'notifSMS' as const },
                    { label: 'Push notifications', icon: Monitor, key: 'notifPush' as const },
                  ].map(({ label, icon: Icon, key }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Icon size={14} className="text-slate-400" />
                        {label}
                      </div>
                      <button onClick={() => onUpdate({ [key]: !user[key] })}
                        className={`w-10 h-5 rounded-full transition-all relative ${user[key] ? 'bg-blue-500' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${user[key] ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Priority Filter</div>
                <div className="grid grid-cols-2 gap-2">
                  {(['critical', 'high', 'medium', 'low'] as NotifPriority[]).map(p => (
                    <button key={p} onClick={() => onUpdate({ notifPriority: p })}
                      className={`py-2 rounded-lg text-xs font-semibold capitalize transition-all ${user.notifPriority === p ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-slate-400 border border-white/10 hover:text-white'}`}>
                      {p === 'critical' ? '🔴' : p === 'high' ? '🟠' : p === 'medium' ? '🟡' : '🟢'} {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Quiet Hours</div>
                <div className="flex items-center gap-2">
                  <input type="time" value={user.quietHoursStart} onChange={e => onUpdate({ quietHoursStart: e.target.value })}
                    className="flex-1 bg-slate-800/70 border border-white/10 rounded-lg px-2 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <span className="text-slate-500 text-xs">to</span>
                  <input type="time" value={user.quietHoursEnd} onChange={e => onUpdate({ quietHoursEnd: e.target.value })}
                    className="flex-1 bg-slate-800/70 border border-white/10 rounded-lg px-2 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {tab === 'security' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/10">
                <div>
                  <div className="text-sm font-semibold text-white">Two-Factor Authentication</div>
                  <div className="text-xs text-slate-400 mt-0.5">Add an extra layer of security</div>
                </div>
                <button onClick={() => onUpdate({ twoFactorEnabled: !user.twoFactorEnabled })}
                  className={`w-10 h-5 rounded-full transition-all relative ${user.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${user.twoFactorEnabled ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
              <button className="w-full p-3 rounded-xl bg-slate-800/50 border border-white/10 text-left hover:border-white/20 transition-all group">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                  <span className="text-sm text-white">Change Password</span>
                  <ChevronRight size={14} className="text-slate-500 ml-auto group-hover:text-white transition-colors" />
                </div>
              </button>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                  <AlertTriangle size={12} /> Session Management
                </div>
                <div className="text-xs text-slate-400">You are currently signed in on 1 device.</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm font-semibold">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </GlassPanel>
    </div>
  );
};

// ─── Notifications Panel ──────────────────────────────────────────────────────

interface NotifPanelProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}

const NOTIF_ICONS: Record<string, React.ReactNode> = {
  critical: <AlertTriangle size={14} className="text-red-400" />,
  warning: <AlertTriangle size={14} className="text-amber-400" />,
  success: <CheckCircle size={14} className="text-emerald-400" />,
  info: <Info size={14} className="text-blue-400" />,
};

const NOTIF_BG: Record<string, string> = {
  critical: 'border-l-red-500 bg-red-500/5',
  warning: 'border-l-amber-500 bg-amber-500/5',
  success: 'border-l-emerald-500 bg-emerald-500/5',
  info: 'border-l-blue-500 bg-blue-500/5',
};

const NotifPanel: React.FC<NotifPanelProps> = ({ notifications, onMarkRead, onMarkAllRead, onClose }) => (
  <div className="fixed inset-0 z-[150] flex items-start justify-end p-4 pt-20">
    <div className="absolute inset-0" onClick={onClose} />
    <GlassPanel className="relative w-full max-w-sm bg-slate-900/95 z-10 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div>
          <div className="font-bold text-white text-sm">Notifications</div>
          <div className="text-xs text-slate-400 mt-0.5">{notifications.filter(n => !n.read).length} unread</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onMarkAllRead} className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider font-semibold">
            Mark all read
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 ml-1"><X size={16} /></button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
        {notifications.map(n => (
          <div key={n.id} onClick={() => onMarkRead(n.id)}
            className={`p-4 border-l-2 cursor-pointer transition-all hover:bg-white/5 ${NOTIF_BG[n.type]} ${!n.read ? '' : 'opacity-60'}`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{NOTIF_ICONS[n.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-sm font-semibold ${!n.read ? 'text-white' : 'text-slate-300'}`}>{n.title}</span>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-1" />}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.body}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-slate-500">{n.time}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-400">{n.category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  </div>
);

// ─── Elektra AI Panel ─────────────────────────────────────────────────────────

interface ElektraProps {
  onClose: () => void;
  user: UserProfile | null;
  style: 'concise' | 'detailed';
}

const ElektraPanel: React.FC<ElektraProps> = ({ onClose, user, style }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello${user ? `, ${user.name.split(' ')[0]}` : ''}! I'm **Elektra**, your ASilva AI strategic advisor. How can I help you today?\n\nI can assist with:\n• Risk assessment & analysis\n• DDRiVE-M platform guidance\n• Strategic planning insights\n• Disaster resilience frameworks\n• Compliance reporting`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scroll = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scroll, [messages]);

  const SYSTEM_PROMPT = `You are Elektra, an expert AI strategic advisor for ASilva Innovations — a Philippine-based technology company specializing in disaster risk reduction (DRRM), resilience, AI for social impact, and government transformation. You help Local Government Units (LGUs), NGOs, and social enterprises with risk management, strategic planning, and disaster resilience.

Respond in a ${style === 'concise' ? 'brief, direct, actionable' : 'comprehensive, detailed, educational'} style. Always be professional, empathetic, and mission-driven. Reference ASilva's platforms: DDRiVE-M (disaster risk), Strategic Planner Pro, Real-Time Leadership, and AI & Automation Suite when relevant. Context: User is ${user ? `${user.name}, ${ROLE_LABELS[user.role || 'viewer']} at ${user.organization}` : 'a platform user'}. Focus on Philippine context: RA 10121 (DRRM Act), ISO 31000, UNDRR Sendai Framework.`;

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const text = data.content?.map((c: { text?: string }) => c.text || '').join('') || 'I apologize — I encountered an error. Please try again.';
      setMessages(m => [...m, { role: 'assistant', content: text, timestamp: new Date() }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Network error. Please check your connection and try again.', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = ['How do I start a DDRiVE-M risk assessment?', 'Explain ISO 31000 compliance steps', 'What is the Sendai Framework?', 'Help me write a DRRM contingency plan outline'];

  return (
    <div className="fixed inset-y-0 right-0 z-[140] flex items-stretch w-full max-w-md" style={{ top: '72px' }}>
      <GlassPanel className="flex flex-col w-full bg-slate-900/97 rounded-none rounded-l-2xl border-r-0 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-white/10 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm flex items-center gap-1.5">
              Elektra AI <Sparkles size={11} className="text-violet-400" />
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Online · Powered by Claude
            </div>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-white p-1 transition-colors"><X size={16} /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${msg.role === 'assistant' ? 'bg-gradient-to-br from-violet-500 to-blue-600' : 'bg-gradient-to-br from-blue-600 to-indigo-700'}`}>
                {msg.role === 'assistant' ? <Bot size={12} className="text-white" /> : (user?.name.charAt(0) || 'U')}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-slate-800/80 text-slate-200 rounded-tl-sm' : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-sm'}`}
                style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content.replace(/\*\*(.*?)\*\*/g, '$1')}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot size={12} className="text-white" />
              </div>
              <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2 flex-shrink-0">
            {QUICK_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => { setInput(p); }}
                className="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-800/50 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all text-left">
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask Elektra anything…"
              className="flex-1 bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder-slate-500 hover:border-white/20 transition-colors" />
            <button onClick={send} disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-blue-700 hover:from-violet-500 hover:to-blue-600 flex items-center justify-center text-white transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95">
              <Send size={14} />
            </button>
          </div>
          <div className="text-[9px] text-slate-600 text-center mt-2">Powered by Anthropic Claude · For strategic guidance only</div>
        </div>
      </GlassPanel>
    </div>
  );
};

// ─── Stats Section ────────────────────────────────────────────────────────────

const StatsSection: React.FC = () => {
  const [ref, visible] = useIntersection();
  const stats = [
    { end: 15, suffix: '+', label: 'Government Partners', icon: Building2 },
    { end: 3200, suffix: '+', label: 'Lives Protected', icon: Shield },
    { end: 70, suffix: '%', label: 'Faster Response Time', icon: Zap },
    { end: 98, suffix: '%', label: 'Client Retention', icon: Star },
  ];
  return (
    <section ref={ref} className={`py-20 px-6 bg-gradient-to-b from-slate-900 to-[#020617] transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ end, suffix, label, icon: Icon }, i) => (
          <GlassPanel key={i} className="p-8 text-center hover:scale-105 transition-transform duration-300 bg-slate-900/50">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-700/20 flex items-center justify-center">
              <Icon size={22} className="text-blue-400" />
            </div>
            <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-2 font-display">
              <Counter end={end} suffix={suffix} />
            </div>
            <div className="text-slate-400 font-medium text-sm">{label}</div>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
};

// ─── Service Card ─────────────────────────────────────────────────────────────

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  link: string;
  gradient: string;
  imageUrl: string;
  imageAlt: string;
}

const ServiceCard: React.FC<{ service: Service; active: boolean; onHover: () => void }> = ({ service, active, onHover }) => {
  const [ref, visible] = useIntersection();
  return (
    <div ref={ref}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={`group p-8 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col h-full hover:-translate-y-2 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${active ? 'bg-slate-900 border-blue-500/50 shadow-2xl shadow-blue-500/20 scale-[1.02]' : 'bg-slate-900/50 border-white/10 hover:border-white/20'}`}
      tabIndex={0}
      style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      {/* Specular */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-t-2xl pointer-events-none" />
      <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden border border-white/10 bg-slate-800/50">
        <img src={service.imageUrl} alt={service.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="text-xl">{service.icon}</span>
          <span className="text-white text-sm font-bold">{service.title}</span>
        </div>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 ${active ? `bg-gradient-to-br ${service.gradient} shadow-lg scale-110` : 'bg-slate-800/70'}`}>
        <span className="text-2xl">{service.icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors font-display">{service.title}</h3>
      <p className="text-slate-300 mb-5 leading-relaxed flex-grow text-sm">{service.description}</p>
      <ul className="space-y-2.5 mb-6">
        {service.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
            <Check size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>
      <a href={service.link} target="_blank" rel="noopener noreferrer"
        className={`mt-auto inline-flex items-center gap-2 font-bold transition-all duration-300 text-sm ${active ? 'text-blue-300' : 'text-slate-400 hover:text-white'}`}>
        Explore Solution <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────

export const Footer: React.FC<{ onCategorySelect?: (c: Category) => void }> = ({ onCategorySelect }) => {
  const [email, setEmail] = useState('');
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#010409] text-white">
      <div className="bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 font-display">Join 10,000+ Leaders Transforming Their Organizations</h3>
              <p className="text-white/80">Weekly insights on systems thinking, risk management & strategic leadership.</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); setEmail(''); }} className="flex gap-2 w-full md:w-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email"
                className="flex-1 md:w-72 px-5 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white" />
              <button type="submit" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2">
                Subscribe <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={OFFICIAL_LOGO_URL} alt="ASilva Innovations" className="h-12 w-12 object-contain" />
              <div>
                <h4 className="font-bold text-xl font-display">ASilva Innovations</h4>
                <p className="text-gray-400 text-sm">Transforming Systems, Empowering Resilience</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm text-sm leading-relaxed">
              Building resilient communities through ethical AI and human-centered tech. Headquartered in Alabang, Muntinlupa City, Philippines.
            </p>
            <div className="space-y-3 text-gray-400 text-sm">
              {[
                { icon: Mail, href: 'mailto:info@asilvainnovations.com', label: 'info@asilvainnovations.com' },
                { icon: Phone, href: 'tel:+639178555134', label: '+63 (917) 855-5134' },
                { icon: Globe, href: 'https://asilvainnovations.com', label: 'asilvainnovations.com' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} className="flex items-center gap-3 hover:text-white transition-colors">
                  <Icon size={16} /> {label}
                </a>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              {[
                { icon: Linkedin, href: 'https://linkedin.asilvainnovations.com', hoverClass: 'hover:bg-blue-600', label: 'LinkedIn' },
                { icon: Facebook, href: 'https://facebook.asilvainnovations.com', hoverClass: 'hover:bg-blue-700', label: 'Facebook' },
                { icon: Instagram, href: 'https://instagram.asilvainnovations.com', hoverClass: 'hover:bg-pink-600', label: 'Instagram' },
              ].map(({ icon: Icon, href, hoverClass, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className={`p-2.5 bg-gray-800 rounded-full ${hoverClass} transition-colors`}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-lg mb-4 font-display">Topics</h5>
            <ul className="space-y-3">
              {CATEGORIES.map(c => (
                <li key={c}>
                  <button onClick={() => onCategorySelect?.(c)} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm text-left">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[c] }} />
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-lg mb-4 font-display">Resources</h5>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Case Studies', href: 'https://asilvainnovations.github.io/case-studies' },
                { label: 'Whitepapers', href: 'https://asilvainnovations.github.io/white-papers/' },
                { label: 'DDRiVE-M', href: 'https://asilvainnovations.github.io/ddrive-m/' },
                { label: 'Strat Planner Pro', href: 'https://asilvainnovations.github.io/strat-planner-pwa/public/index.html' },
                { label: 'Real-Time Leadership', href: 'https://asilvainnovations.github.io/website/rtl.html' },
                { label: 'Smart Flood Detection', href: 'https://asilvainnovations.com/smart-flood-detection/' },
              ].map(({ label, href }) => (
                <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-lg mb-4 font-display">Company</h5>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'About Us', href: 'https://asilvainnovations.github.io/website/about-us.html' },
                { label: 'Our Solutions', href: 'https://asilvainnovations.github.io/website/solutions.html' },
                { label: 'Resources', href: 'https://asilvainnovations.github.io/website/resources.html' },
                { label: 'Pricing Plans', href: 'https://asilvainnovations.github.io/website/pricing.html/' },
                { label: 'Contact Us', href: '#contact' },
                { label: 'Partnerships', href: 'https://asilvainnovations.github.io/website/partnerships.html' },
              ].map(({ label, href }) => (
                <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© {year} ASilva Innovations. All rights reserved.</p>
          <div className="flex flex-wrap gap-5 text-xs">
            {[
              { label: 'Privacy Policy', href: 'https://asilvainnovations.github.io/website/privacy-policy.html' },
              { label: 'Terms of Service', href: 'https://asilvainnovations.github.io/website/terms.html' },
              { label: 'Cookie Policy', href: 'https://asilvainnovations.github.io/website/cookie-policy.html' },
              { label: 'Accessibility', href: 'https://asilvainnovations.github.io/website/accessibility-policy.html' },
              { label: 'AI Ethics', href: 'https://asilvainnovations.github.io/website/ai-ethics.html' },
              { label: 'Sitemap', href: 'https://asilvainnovations.com/site-map.xml' },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  // Core UI state
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ddrive');

  // Auth & User state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Elektra AI
  const [showElektra, setShowElektra] = useState(false);

  // Contact form
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); setShowAuth(false); setShowProfile(false); setShowNotifs(false); setShowElektra(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || showAuth) ? 'hidden' : 'unset';
  }, [menuOpen, showAuth]);

  const handleLogin = useCallback((loggedUser: UserProfile) => {
    setUser(loggedUser);
    setShowAuth(false);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setShowProfile(false);
  }, []);

  const handleUpdateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser(u => u ? { ...u, ...updates } : u);
  }, []);

  const handleMarkRead = useCallback((id: string) => {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  }, []);

  const services: Service[] = [
    { id: 'ddrive', title: 'DDRiVE-M', description: 'Flagship Enterprise Risk Management system delivering real-time vulnerability mapping, compliance tracking, and predictive analytics for LGUs and NGOs.', icon: '🛡️', features: ['Multi-Hazard Detection & Multi-Modal Risk Assessment Tools', 'ISO 31000-Compliant Risk Management System with AI Services', 'UNDRR Resilience Scorecard Assessment Integration', 'Customizable AI-Plan Generators and Dashboards'], link: 'https://asilvainnovations.github.io/ddrive-m/', gradient: 'from-blue-600 to-cyan-600', imageUrl: DDRIVE_IMAGE_URL, imageAlt: 'DDRiVE-M Platform Dashboard Interface' },
    { id: 'stratplanner', title: 'Strat Planner Pro', description: 'AI-powered strategic planning suite that transforms complex data into actionable roadmaps with automated analysis and performance tracking.', icon: '📊', features: ['Systems-Driven Context Analysis', 'AI-Supported Strategic Options Generation', 'Structured Strategy Mapping with Balanced Scorecard', 'Automated Real-Time MEL Dashboard'], link: 'https://asilvainnovations.github.io/strat-planner-pwa/public/index.html', gradient: 'from-amber-600 to-orange-600', imageUrl: STRAT_PLANNER_IMAGE_URL, imageAlt: 'Strategic Planner Pro Interface' },
    { id: 'rtl', title: 'Real-Time Leadership', description: 'Systems-based emergency and risk-reduction leadership framework with practical tools to navigate high-risk scenarios.', icon: '⚡', features: ['Tools on Mastery of Presence', 'Options Generations Toolkit', 'Validating Choices Framework', 'Cross-Agency Collaboration'], link: 'https://asilvainnovations.github.io/website/rtl.html', gradient: 'from-emerald-600 to-teal-600', imageUrl: RTL_IMAGE_URL, imageAlt: 'Real-Time Leadership Banner' },
    { id: 'ai-solutions', title: 'AI & Automation Suite', description: 'Specialized AI solutions for public sector challenges including flood prediction, damage assessment, and intelligent resource routing.', icon: '🤖', features: ['SPARC — Smart Predictive AI Resilience Calculator', 'AI Chatbots — Context-aware assistants', 'Customized DRRM Integration', 'Custom AI-Powered Online Courses on DRR-CCA'], link: 'https://asilvainnovations.github.io/website/ai-solutions.html', gradient: 'from-violet-600 to-purple-600', imageUrl: AI_SOLUTIONS_IMAGE_URL, imageAlt: 'AI Solutions Platform' },
  ];

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-2 shadow-2xl shadow-blue-500/40 animate-pulse">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center p-1">
              <img src={OFFICIAL_LOGO_URL} alt="ASilva Innovations" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map(i => <div key={i} className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
          </div>
          <div className="text-slate-500 text-sm font-medium tracking-wider uppercase">Loading platform…</div>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>ASilva Innovations | AI-Powered Resilience Solutions for Communities</title>
        <meta name="description" content="Enterprise-grade risk management platforms for Local Government Units, NGOs, and SMEs. DDRiVE-M delivers real-time vulnerability mapping, predictive analytics, and compliance tracking." />
        <meta name="keywords" content="disaster risk reduction, LGU software, NGO technology, resilience platform, AI for social impact, Philippine tech" />
        <meta property="og:title" content="ASilva Innovations: Building Resilient Communities Through Technology" />
        <meta property="og:description" content="Flagship DDRiVE-M platform empowers LGUs and NGOs with predictive analytics and real-time risk intelligence." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://asilvainnovations.com" />
        {/* Google Fonts — Montserrat + Poppins + Roboto Condensed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600&family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Skip nav */}
      <a href="#main-content" className="sr-only focus:not-sr-only fixed top-4 left-4 bg-blue-600 text-white px-5 py-3 rounded-lg z-[999] font-bold">
        Skip to main content
      </a>

      <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-500/30"
        style={{ fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif" }}>

        {/* ── NAVIGATION ── */}
        <nav className={`fixed w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-[#020617]/95 backdrop-blur-xl py-3 border-b border-blue-900/30 shadow-xl shadow-black/20' : 'bg-transparent py-5'}`}
          aria-label="Main navigation"
          style={{ backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none', WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none' }}>
          {/* Specular top line */}
          {scrolled && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none" />}

          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl p-1 -ml-1">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-1.5 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center p-1">
                  <img src={OFFICIAL_LOGO_URL} alt="ASilva Innovations logo" className="w-full h-full object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              </div>
              <div>
                <div className="text-lg font-bold tracking-tight leading-none group-hover:text-blue-300 transition-colors"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  ASilva <span className="text-blue-400">Innovations</span>
                </div>
                <div className="text-[9px] text-slate-400 font-medium tracking-[0.2em] uppercase hidden md:block">Building Resilient Futures</div>
              </div>
            </a>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {['Services', 'Impact', 'Contact'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-slate-300 hover:text-blue-300 transition-colors relative group py-1">
                  {item}
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                </a>
              ))}
              <a href="https://blog-leadership-analytics.deploypad.app/" target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-slate-300 hover:text-blue-300 transition-colors flex items-center gap-1">
                Blog <ArrowRight size={12} className="-rotate-45" />
              </a>

              {/* Action cluster */}
              <div className="flex items-center gap-2 ml-2">
                {/* Elektra AI button */}
                <button onClick={() => { setShowElektra(s => !s); setShowProfile(false); setShowNotifs(false); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${showElektra ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'bg-white/5 text-slate-300 border border-white/10 hover:border-violet-500/30 hover:text-violet-300'}`}>
                  <Bot size={15} />
                  <span className="hidden lg:inline">Elektra AI</span>
                </button>

                {/* Notifications */}
                {user && (
                  <button onClick={() => { setShowNotifs(s => !s); setShowProfile(false); setShowElektra(false); }}
                    className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all">
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Auth / Profile */}
                {user ? (
                  <button onClick={() => { setShowProfile(s => !s); setShowNotifs(false); setShowElektra(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors hidden lg:inline">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={12} className="text-slate-400" />
                  </button>
                ) : (
                  <button onClick={() => setShowAuth(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 active:scale-95">
                    <User size={14} /> Sign In
                  </button>
                )}

                <a href="https://asilvainnovations.github.io/ddrive-m/"
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 hidden lg:flex items-center gap-1.5">
                  Get Started <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {user && (
                <button onClick={() => setShowNotifs(s => !s)} className="relative p-2 rounded-xl bg-white/5 text-slate-300">
                  <Bell size={16} />
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>}
                </button>
              )}
              <button onClick={() => setMenuOpen(s => !s)} className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[110]" onClick={() => setMenuOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#020617]/98 z-[120] flex flex-col p-8 shadow-2xl border-l border-white/10">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>Menu</span>
                <button onClick={() => setMenuOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"><X size={20} /></button>
              </div>
              <nav className="flex flex-col gap-2 mt-6">
                {['Services', 'Impact', 'Contact'].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                    className="py-3 px-3 rounded-xl text-lg font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                    {item}
                  </a>
                ))}
                <a href="https://blog-leadership-analytics.deploypad.app/" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}
                  className="py-3 px-3 rounded-xl text-lg font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-between">
                  Blog <ArrowRight size={16} className="-rotate-45" />
                </a>
              </nav>
              <div className="mt-auto space-y-3">
                <button onClick={() => { setMenuOpen(false); setShowElektra(true); }}
                  className="w-full flex items-center gap-2 py-3 px-4 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 font-semibold">
                  <Bot size={16} /> Elektra AI Assistant
                </button>
                {user ? (
                  <button onClick={() => { setMenuOpen(false); setShowProfile(true); }}
                    className="w-full flex items-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold">
                    <User size={16} /> {user.name.split(' ')[0]}'s Profile
                  </button>
                ) : (
                  <button onClick={() => { setMenuOpen(false); setShowAuth(true); }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold">
                    <User size={16} /> Sign In
                  </button>
                )}
                <a href="https://asilvainnovations.github.io/ddrive-m/"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold">
                  Get Started <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </>
        )}

        {/* ── HERO ── */}
        <header id="main-content" className="relative pt-32 md:pt-48 pb-24 px-6 overflow-hidden min-h-screen flex items-center" tabIndex={-1}>
          <div className="absolute inset-0 z-0">
            <img src={HERO_BG_IMAGE_URL} alt="" role="presentation" className="w-full h-full object-cover" loading="eager"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/97 via-[#020617]/88 to-[#020617]/94" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
          </div>
          {/* Ambient blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
          </div>

          <div className="max-w-7xl mx-auto relative z-10 w-full">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-sm font-bold uppercase tracking-wide backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Trusted by 15+ LGUs Across Southeast Asia</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <span className="block text-white">Technology That</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 py-2">
                  Builds Unbreakable Communities
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
                Enterprise-grade risk intelligence platforms purpose-built for Local Government Units, NGOs, and social enterprises operating in high-risk environments.{' '}
                <span className="text-blue-300 font-semibold">Transform uncertainty into strategic advantage.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <a href="#contact"
                  className="group bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                  Schedule a Demo
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <button onClick={() => { setShowElektra(true); }}
                  className="group bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-violet-500/30 hover:border-violet-500/60 backdrop-blur-sm flex items-center justify-center gap-3 hover:scale-105 active:scale-95">
                  <Bot size={18} className="text-violet-400" />
                  Ask Elektra AI
                </button>
                <a href="https://asilvainnovations.github.io/website/solutions.html"
                  className="bg-slate-900/80 hover:bg-slate-800/80 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-white/15 backdrop-blur-sm text-center hover:scale-105 active:scale-95">
                  View Solutions
                </a>
              </div>

              <div className="flex flex-wrap gap-3 pt-2 justify-center">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm bg-emerald-950/30 px-4 py-2 rounded-full border border-emerald-500/25 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Aligned with Philippine Government Frameworks
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm bg-amber-950/30 px-4 py-2 rounded-full border border-amber-500/25 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                  ISO 31000 Compliant
                </div>
                <div className="flex items-center gap-2 text-violet-300 font-semibold text-sm bg-violet-950/30 px-4 py-2 rounded-full border border-violet-500/25 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-violet-300 animate-pulse" />
                  UNDRR Sendai Framework
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── STATS ── */}
        <StatsSection />

        {/* ── SERVICES ── */}
        <section id="services" className="py-24 px-6 bg-gradient-to-b from-[#020617] to-slate-900" aria-labelledby="services-heading">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-5">
              <h2 id="services-heading" className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Purpose-Built Solutions
              </h2>
              <div className="h-1 w-28 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 mx-auto rounded-full" />
              <p className="text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
                Enterprise-grade platforms designed specifically for resource-constrained environments.{' '}
                <span className="text-blue-300">Deployable in weeks, not years.</span>
              </p>
            </div>
            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {services.map(s => (
                <ServiceCard key={s.id} service={s} active={activeTab === s.id} onHover={() => setActiveTab(s.id)} />
              ))}
            </div>
            <div className="mt-16 text-center">
              <a href="https://asilvainnovations.github.io/website/solutions.html" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-300 font-bold hover:text-blue-200 transition-all text-lg group hover:scale-105">
                See Full Solutions Portfolio <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform -rotate-45" />
              </a>
            </div>
          </div>
        </section>

        {/* ── IMPACT ── */}
        <section id="impact" className="py-24 px-6 bg-gradient-to-b from-slate-900 via-[#030a23] to-slate-900" aria-labelledby="impact-heading">
          <div className="max-w-7xl mx-auto">
            <GlassPanel className="p-8 md:p-12 lg:p-16 bg-gradient-to-br from-blue-900/60 to-indigo-900/70 border-white/10 overflow-hidden relative">
              {/* Dot pattern */}
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <h2 id="impact-heading" className="text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-200"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Real Impact in Vulnerable Communities
                  </h2>
                  <p className="text-lg text-slate-200 leading-relaxed">
                    We measure success by <span className="text-blue-300 font-bold">lives protected</span>,{' '}
                    <span className="text-emerald-300 font-bold">resources optimized</span>, and{' '}
                    <span className="text-amber-300 font-bold">communities empowered</span> — not just software deployed.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { target: 'Local Government Units', desc: 'End-to-end digital transformation for disaster resilience and community protection.', icon: Building2, stat: '12+ Philippine LGUs', color: 'blue' },
                      { target: 'NGOs & Development Agencies', desc: 'Maximize field impact with predictive analytics for humanitarian operations.', icon: Users, stat: '37% faster deployment', color: 'rose' },
                      { target: 'SMEs & Social Enterprises', desc: 'Enterprise-grade risk intelligence at accessible pricing.', icon: BarChart3, stat: 'ROI in 6 months', color: 'amber' },
                      { target: 'Field Operations', desc: 'Mobile-first tools designed for use in low-connectivity environments.', icon: MapPin, stat: '70% faster response', color: 'emerald' },
                    ].map(({ target, desc, icon: Icon, stat, color }, i) => (
                      <GlassPanel key={i} className="p-5 hover:scale-105 transition-transform duration-300">
                        <div className={`w-10 h-10 rounded-xl bg-${color}-600/20 flex items-center justify-center mb-3`}>
                          <Icon size={18} className={`text-${color}-400`} />
                        </div>
                        <h3 className="font-bold text-white mb-1.5 text-sm">{target}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed mb-2.5">{desc}</p>
                        <div className={`text-xs font-bold text-${color}-300 flex items-center gap-1.5`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          {stat}
                        </div>
                      </GlassPanel>
                    ))}
                  </div>
                </div>

                {/* Testimonials */}
                <div className="space-y-5">
                  {[
                    { quote: "ASilva Innovations' approach in updating our Risk-informed Comprehensive Development Plan has truly been a game-changer giving us a clear and practical framework that integrates disaster risk reduction into our local development priorities.", name: 'Arnold Pica', title: 'Municipal DRRMO', org: 'Salcedo, Eastern Samar', date: 'December 2025', color: 'blue' },
                    { quote: "ASilva Innovations' customized Integrated Risk and Resilience Management (IRRM) has been transformative for Bangsamoro communities and civil society organizations.", name: 'Rhadzni Taalim', title: 'Executive Director', org: 'Bangsamoro Development Agency (BDA), Cotabato City', date: 'January 2026', color: 'emerald' },
                  ].map(({ quote, name, title, org, date, color }, i) => (
                    <GlassPanel key={i} className={`p-7 bg-black/30 border-l-2 border-${color}-500/50`}>
                      <div className="flex gap-0.5 mb-4" aria-hidden>
                        {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
                      </div>
                      <blockquote className={`text-sm italic text-blue-100 leading-relaxed border-l-2 border-${color}-500/40 pl-4 mb-5`}>
                        "{quote}"
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${color}-600 to-${color}-700 flex items-center justify-center text-white font-bold text-sm`}>
                          {name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{name}</div>
                          <div className={`text-xs text-${color}-300`}>{title}</div>
                          <div className="text-xs text-slate-500">{org}</div>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {date}
                        </div>
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="py-24 px-6 bg-gradient-to-b from-slate-900 to-[#020617]" aria-labelledby="contact-heading">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div>
                <h2 id="contact-heading" className="text-4xl md:text-5xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 leading-tight"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Start Your Resilience Journey
                </h2>
                <p className="text-slate-300 mt-5 text-lg leading-relaxed">
                  Join <span className="text-blue-300 font-bold">50+ forward-thinking organizations</span> across Southeast Asia who trust ASilva Innovations.{' '}
                  <span className="text-emerald-300 font-semibold">Let's build your custom solution.</span>
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { icon: '📅', title: 'Schedule a Consultation', desc: 'Free 60-minute strategy session with our resilience experts' },
                  { icon: '💡', title: 'Custom Solution Design', desc: "Tailored implementation roadmap for your organization's challenges" },
                  { icon: '🤖', title: 'Ask Elektra AI First', desc: 'Get instant strategic guidance from our AI advisor before your meeting' },
                ].map(({ icon, title, desc }, i) => (
                  <GlassPanel key={i} className="flex items-start gap-4 p-5 hover:scale-[1.02] transition-transform cursor-default"
                    onClick={icon === '🤖' ? () => setShowElektra(true) : undefined}>
                    <div className="w-11 h-11 rounded-xl bg-blue-600/15 flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                    <div>
                      <div className="font-bold text-white mb-0.5">{title}</div>
                      <div className="text-slate-400 text-sm">{desc}</div>
                    </div>
                    {icon === '🤖' && <Bot size={14} className="text-violet-400 ml-auto flex-shrink-0 mt-1" />}
                  </GlassPanel>
                ))}
              </div>
              <div className="pt-6 border-t border-white/10">
                <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-400" /> Why Partner With Us?
                </h3>
                <ul className="space-y-2.5 text-slate-300 text-sm">
                  {['Philippine-based team with deep LGU/NGO experience', '98% client retention rate since 2020', 'Compliance with Philippine DRRM Act (RA 10121)', 'Transparent pricing with no hidden fees'].map((item, i) => (
                    <li key={i} className="flex gap-2.5 hover:text-white transition-colors">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact form */}
            <GlassPanel className="p-8 bg-slate-900/80 shadow-2xl">
              {contactSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle size={32} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Request Received!</h3>
                  <p className="text-slate-400">Our team will contact you within 24 business hours. While you wait, try chatting with Elektra AI.</p>
                  <button onClick={() => setShowElektra(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 font-semibold hover:bg-violet-600/30 transition-colors">
                    <Bot size={16} /> Chat with Elektra AI
                  </button>
                  <button onClick={() => setContactSubmitted(false)} className="text-slate-500 hover:text-slate-400 text-sm transition-colors">Send another message</button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={e => { e.preventDefault(); setContactSubmitted(true); }} aria-label="Contact form">
                  {[
                    { id: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Maria Santos' },
                    { id: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'maria.santos@lgu.gov.ph' },
                    { id: 'organization', label: 'Organization', type: 'text', required: true, placeholder: 'LGU Salcedo, Eastern Samar' },
                  ].map(({ id, label, type, required, placeholder }) => (
                    <div key={id} className="space-y-1.5">
                      <label htmlFor={id} className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        {label} {required && <span className="text-red-400">*</span>}
                      </label>
                      <input id={id} name={id} type={type} required={required} placeholder={placeholder}
                        className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 hover:border-white/20 transition-colors" />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <label htmlFor="inquiry" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      Inquiry Type <span className="text-red-400">*</span>
                    </label>
                    <select id="inquiry" name="inquiry" required
                      className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none hover:border-white/20 transition-colors">
                      <option value="">Select an option</option>
                      <option value="ddrive">DDRiVE-M Implementation</option>
                      <option value="stratplanner">Strategic Planner Pro</option>
                      <option value="rtl">Real-Time Leadership</option>
                      <option value="custom">Custom AI Solution</option>
                      <option value="partnership">Partnership Inquiry</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Message (Optional)</label>
                    <textarea id="message" name="message" rows={4} placeholder="Tell us about your organization's needs…"
                      className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 resize-none hover:border-white/20 transition-colors" />
                  </div>
                  <button type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group">
                    Request Consultation <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
                    <Lock size={10} /> Your information is secure and used only to contact you.
                  </p>
                </form>
              )}
            </GlassPanel>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <Footer />

      </div>

      {/* ── OVERLAYS ── */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />}
      {showProfile && user && <ProfilePanel user={user} onUpdate={handleUpdateUser} onClose={() => setShowProfile(false)} onLogout={handleLogout} />}
      {showNotifs && <NotifPanel notifications={notifications} onMarkRead={handleMarkRead} onMarkAllRead={handleMarkAllRead} onClose={() => setShowNotifs(false)} />}
      {showElektra && <ElektraPanel onClose={() => setShowElektra(false)} user={user} style={user?.aiStyle || 'concise'} />}

      {/* ── ELEKTRA FAB (always visible) ── */}
      {!showElektra && (
        <button onClick={() => setShowElektra(true)}
          className="fixed bottom-6 right-6 z-[130] w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-700 hover:from-violet-500 hover:to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-violet-500/40 hover:scale-110 active:scale-95 transition-all group"
          aria-label="Open Elektra AI assistant">
          <Bot size={22} className="group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#020617] animate-pulse" />
        </button>
      )}

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@300;400;500;600&display=swap');
        
        .font-display { font-family: 'Montserrat', sans-serif; }
        
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }
        
        /* Liquid glass inner light */
        .liquid-glass-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        
        /* Hide Bolt badge */
        [class*="bolt"], [class*="Bolt"], [id*="bolt"], [id*="Bolt"],
        a[href*="bolt.new"], a[href*="bolt.host"],
        div[style*="position: fixed"][style*="bottom"][style*="right"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        body::after {
          content: '';
          position: fixed;
          bottom: 0;
          right: 0;
          width: 180px;
          height: 80px;
          background: #020617;
          pointer-events: none;
          z-index: 9999;
        }
      `}</style>
    </HelmetProvider>
  );
};

export default App;