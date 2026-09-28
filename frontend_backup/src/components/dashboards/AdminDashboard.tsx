import { useState, useEffect } from 'react';
import {
  Shield, Users, GraduationCap, BarChart3, FileText, CheckCircle2,
  XCircle, Clock, AlertCircle, TrendingUp, BadgeCheck, Star, Calendar, MessageSquare, Quote
} from 'lucide-react';
import type { Faculty, University, Report, Booking, Review, Testimonial } from '@/types';
import { Spinner, EmptyState, Badge } from '@/components/ui';

export default function AdminDashboard({ tab }: { tab: string }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  const token = localStorage.getItem('access_token');
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/overview.php', { headers }).then(r => r.json()),
      fetch('/api/admin/users.php', { headers }).then(r => r.json()),
      fetch('/api/admin/verify_faculty.php', { headers }).then(r => r.json()),
      fetch('/api/admin/universities.php', { headers }).then(r => r.json()),
      fetch('/api/admin/reports.php', { headers }).then(r => r.json()),
      fetch('/api/admin/reviews.php', { headers }).then(r => r.json()),
      fetch('/api/admin/testimonials.php', { headers }).then(r => r.json()),
    ]).then(([statRes, userRes, facRes, uniRes, repRes, revRes, testRes]) => {
      setStats(statRes.stats ?? {});
      setUsers(userRes.users ?? []);
      setFaculty(facRes.faculty ?? []);
      setUniversities(uniRes.universities ?? []);
      setReports(repRes.reports ?? []);
      setReviews(revRes.reviews ?? []);
      setTestimonials(testRes.testimonials ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function updateUserAction(userId: string, action: string) {
    const res = await fetch('/api/admin/users.php', { method: 'PUT', headers, body: JSON.stringify({ id: userId, action }) });
    const data = await res.json();
    if (!data.error) {
      setUsers(users.map(u => u.id === userId ? data.user : u));
    }
  }

  async function updateVerification(facultyId: string, action: string) {
    const res = await fetch('/api/admin/verify_faculty.php', { method: 'PUT', headers, body: JSON.stringify({ id: facultyId, action }) });
    if (res.ok) {
      setFaculty(faculty.filter((f) => f.id !== facultyId));
      setStats({ ...stats, pending_verification: stats.pending_verification - 1 });
    }
  }

  async function updateReportStatus(reportId: string, resolution_notes: string) {
    const res = await fetch('/api/admin/reports.php', { method: 'PUT', headers, body: JSON.stringify({ id: reportId, resolution_notes }) });
    const data = await res.json();
    if (!data.error) {
      setReports(reports.map((r) => r.id === reportId ? data.report : r));
    }
  }

  async function toggleReview(reviewId: string) {
    const res = await fetch('/api/admin/reviews.php', { method: 'PUT', headers, body: JSON.stringify({ id: reviewId }) });
    const data = await res.json();
    if (!data.error) {
      setReviews(reviews.map((r) => r.id === reviewId ? data.review : r));
    }
  }

  async function toggleTestimonial(testId: string) {
    const res = await fetch('/api/admin/testimonials.php', { method: 'PUT', headers, body: JSON.stringify({ id: testId }) });
    const data = await res.json();
    if (!data.error) {
      setTestimonials(testimonials.map((t) => t.id === testId ? data.testimonial : t));
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner className="w-10 h-10" /></div>;

  if (tab === 'verification') {
    return (
      <div className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Faculty Verification Queue</h2>
        {faculty.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="No pending verifications" description="All faculty applications have been reviewed." />
        ) : (
          <div className="space-y-3">
            {faculty.map((f) => (
              <div key={f.id} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={f.photo_url ?? ''} alt={f.full_name} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{f.full_name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{f.title} - {f.university_name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateVerification(f.id, 'approve')} className="px-4 py-2 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4" /> Verify
                    </button>
                    <button onClick={() => updateVerification(f.id, 'reject')} className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (tab === 'universities') {
    return (
      <div className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">University Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {universities.map((uni) => (
            <div key={uni.id} className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{uni.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{uni.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === 'users') {
    return (
      <div className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">User Management</h2>
        <div className="glass-card rounded-2xl p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(u => (
                <tr key={u.id} className="group">
                  <td className="py-4 font-medium text-slate-900 dark:text-white">{u.full_name}</td>
                  <td className="py-4 text-slate-500">{u.email}</td>
                  <td className="py-4 capitalize text-slate-700 dark:text-slate-300">{u.role}</td>
                  <td className="py-4">
                    <Badge variant={u.status === 'suspended' ? 'danger' : 'accent'}>{u.status}</Badge>
                  </td>
                  <td className="py-4 text-right space-x-2">
                    {u.status === 'active' ? (
                      <button onClick={() => updateUserAction(u.id, 'suspend')} className="text-red-500 hover:underline">Suspend</button>
                    ) : (
                      <button onClick={() => updateUserAction(u.id, 'reactivate')} className="text-accent-500 hover:underline">Reactivate</button>
                    )}
                    {u.role !== 'admin' && (
                      <button onClick={() => updateUserAction(u.id, 'promote_admin')} className="text-primary-500 hover:underline">Make Admin</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (tab === 'reports') {
    return (
      <div className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Reports & Disputes</h2>
        {reports.length === 0 ? (
          <EmptyState icon={FileText} title="No reports filed" description="All clear! No user reports to review." />
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="glass-card rounded-2xl p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={report.status === 'open' ? 'danger' : 'accent'}>{report.status}</Badge>
                    <span className="text-xs text-slate-400 capitalize">{report.target_type}</span>
                  </div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">Reason: {report.reason}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{report.description}</p>
                  
                  {report.status === 'open' && (
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => updateReportStatus(report.id, 'Resolved without action')} className="px-3 py-1.5 rounded-lg bg-accent-500 text-white text-xs font-semibold">Resolve</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }


  if (tab === 'reviews') {
    return (
      <div className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Reviews</h2>
        <div className="space-y-3">
          {reviews.map((r: any) => (
            <div key={r.id} className="glass-card rounded-2xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{r.rating}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{r.comment}</p>
                  <p className="text-xs text-slate-500 mt-2">By {r.student_name} for {r.faculty_name}</p>
                </div>
                <button onClick={() => toggleReview(r.id)} className={`px-3 py-1 text-xs rounded-lg ${r.is_published ? 'bg-red-100 text-red-600' : 'bg-accent-100 text-accent-600'}`}>
                  {r.is_published ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === 'testimonials') {
    return (
      <div className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Testimonials</h2>
        <div className="space-y-3">
          {testimonials.map((t: any) => (
            <div key={t.id} className="glass-card rounded-2xl p-4 flex justify-between items-start">
              <div>
                <p className="text-sm italic">"{t.content}"</p>
                <p className="text-xs text-slate-500 mt-2">- {t.full_name} ({t.role})</p>
              </div>
              <button onClick={() => toggleTestimonial(t.id)} className={`px-3 py-1 text-xs rounded-lg ${t.is_featured ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                {t.is_featured ? 'Featured' : 'Feature'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Overview
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">Trust Console</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Platform monitoring and administration overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Students', value: stats.total_students, color: 'text-primary-500' },
          { icon: Users, label: 'Total Faculty', value: stats.total_faculty, color: 'text-blue-500' },
          { icon: Shield, label: 'Pending Verifications', value: stats.pending_verification, color: 'text-amber-500' },
          { icon: GraduationCap, label: 'Universities', value: stats.total_universities, color: 'text-indigo-500' },
          { icon: AlertCircle, label: 'Open Reports', value: stats.open_reports, color: 'text-red-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card rounded-2xl p-5">
              <Icon className={`w-6 h-6 ${stat.color} mb-3`} />
              <p className="font-display font-bold text-2xl text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
