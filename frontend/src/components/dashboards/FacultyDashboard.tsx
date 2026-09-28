import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, BadgeCheck, Star, AlertCircle, User as UserIcon, BookOpen, Briefcase, Globe, Award, Settings, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Faculty } from '@/types';
import { Spinner, Badge, Button } from '@/components/ui';

export default function FacultyDashboard({ tab }: { tab: string }) {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [facultyProfile, setFacultyProfile] = useState<Faculty | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch('/api/dashboard/faculty.php', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    })
    .then(res => res.json())
    .then(data => {
      if (!data.error) {
        setFacultyProfile(data.facultyProfile);
      }
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="w-10 h-10" /></div>;

  if (tab === 'profile') {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Faculty Profile</h2>
          {facultyProfile && (
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
        
        <div className="glass-card rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-navy to-burgundy" />
          
          {!facultyProfile ? (
            <div className="text-center py-12 relative z-10">
              <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Profile Not Found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">You don't have a faculty profile yet. Contact an administrator to get your credentials verified and profile published.</p>
              <Button variant="primary">Request Verification</Button>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="relative">
                  <img src={facultyProfile.photo_url ?? ''} alt={facultyProfile.full_name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl" />
                  {facultyProfile.verification_status === 'verified' && (
                    <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 rounded-full p-1 shadow-lg">
                      <BadgeCheck className="w-8 h-8 text-green-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mb-1">{facultyProfile.full_name}</h3>
                  <p className="text-lg text-navy dark:text-navy font-medium mb-3">{facultyProfile.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="neutral" className="px-3 py-1 bg-white/50 backdrop-blur-md border-slate-200/50">
                      <Briefcase className="w-3 h-3 mr-1.5" />
                      {facultyProfile.department}
                    </Badge>
                    <Badge variant="neutral" className="px-3 py-1 bg-white/50 backdrop-blur-md border-slate-200/50">
                      <Globe className="w-3 h-3 mr-1.5" />
                      {facultyProfile.university_name}
                    </Badge>
                    {facultyProfile.verification_status === 'pending' && (
                      <Badge variant="warning" className="px-3 py-1">
                        <Clock className="w-3 h-3 mr-1.5" />
                        Pending Review
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">About Me</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{facultyProfile.bio}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Research Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {facultyProfile.research_interests?.map(interest => (
                        <span key={interest} className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 space-y-4 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400"><Award className="w-4 h-4 mr-2" /> Experience</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{facultyProfile.experience_years} years</div>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400"><Globe className="w-4 h-4 mr-2" /> Languages</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{facultyProfile.languages?.join(', ')}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400"><BookOpen className="w-4 h-4 mr-2" /> Subjects</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white text-right max-w-[150px] truncate">{facultyProfile.subjects?.join(', ')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Overview
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Welcome, {profile?.full_name?.split(' ')[0] ?? 'Professor'}!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your faculty profile and settings</p>
      </div>

      {/* Verification status banner */}
      {facultyProfile && facultyProfile.verification_status !== 'verified' && (
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3 border-l-4 border-l-amber-500">
          <Clock className="w-5 h-5 text-amber-500" />
          <div>
            <p className="font-semibold text-sm text-slate-900 dark:text-white">Verification {facultyProfile.verification_status}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your profile is being reviewed by our admin team.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      {facultyProfile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-6 border border-slate-200/50 hover:border-amber-500/30 transition-colors group">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <p className="font-display font-extrabold text-3xl text-slate-900 dark:text-white mb-1">
              {facultyProfile.rating?.toFixed(1) ?? '0.0'}
            </p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Average Rating</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 border border-slate-200/50 hover:border-navy transition-colors group">
            <div className="w-12 h-12 bg-navy dark:bg-navy-light rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-navy" />
            </div>
            <p className="font-display font-extrabold text-3xl text-slate-900 dark:text-white mb-1">
              {facultyProfile.review_count ?? '0'}
            </p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Reviews</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 border border-slate-200/50 hover:border-green-500/30 transition-colors group">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ExternalLink className="w-6 h-6 text-green-500" />
            </div>
            <p className="font-display font-extrabold text-3xl text-slate-900 dark:text-white mb-1">
              1,245
            </p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Profile Views</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 border border-slate-200/50 hover:border-blue-500/30 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full" />
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
              <Award className="w-6 h-6 text-blue-500" />
            </div>
            <p className="font-display font-extrabold text-3xl text-slate-900 dark:text-white mb-1 relative z-10">
              Top 5%
            </p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 relative z-10">Global Ranking</p>
          </div>
        </div>
      )}
    </div>
  );
}
