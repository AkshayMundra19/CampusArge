import { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Bookmark, Heart, Bell, Settings,
  Users, Shield, BarChart3, FileText, Clock, CheckCircle2, XCircle,
  Star, GraduationCap, ChevronRight, LogOut, User, Menu, X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';

import FacultyDashboard from '@/components/dashboards/FacultyDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';



const FACULTY_NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'requests', label: 'Booking Requests', icon: Calendar },
  { id: 'availability', label: 'Availability', icon: Clock },
  { id: 'history', label: 'Session History', icon: FileText },
  { id: 'ratings', label: 'Ratings & Reviews', icon: Star },
  { id: 'profile', label: 'Profile', icon: User },
];

const ADMIN_NAV = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'verification', label: 'Verification Queue', icon: Shield },
  { id: 'universities', label: 'Universities', icon: GraduationCap },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <div className="pt-24 min-h-screen flex items-center justify-center"><Spinner className="w-10 h-10" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = profile?.role ?? 'faculty';
  const nav = role === 'admin' ? ADMIN_NAV : FACULTY_NAV;

  return (
    <div className="pt-16 min-h-screen flex bg-slate-50/50 dark:bg-slate-950">
      {/* Sidebar - Desktop */}
      <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 glass border-r border-slate-200/50 dark:border-slate-800/50 z-40 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 h-full flex flex-col">
          {/* User info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
              {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{profile?.full_name ?? 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Sign out */}
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <span className="font-semibold text-slate-900 dark:text-white">Dashboard</span>
          <div className="w-9" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {role === 'admin' ? (
            <AdminDashboard tab={activeTab} />
          ) : (
            <FacultyDashboard tab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
}
