import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Globe, Award, Users, Building2, DollarSign,
  Calendar, CheckCircle2, Star, BookOpen, ArrowRight, GraduationCap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { University, Faculty } from '@/types';
import FacultyCard from '@/components/FacultyCard';
import { Spinner, CardSkeleton, EmptyState } from '@/components/ui';

const generateGradient = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hues = [210, 250, 280, 320, 150, 180, 30, 0];
  const hue1 = hues[hash % hues.length];
  const hue2 = hues[(hash + 3) % hues.length];
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 40%), hsl(${hue2}, 70%, 20%))`;
};

export default function UniversityDetail() {
  const { id } = useParams<{ id: string }>();
  const [university, setUniversity] = useState<University | null>(null);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [logoError, setLogoError] = useState(false);


  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/universities/list.php`).then(res => res.json()),
      fetch(`/api/faculty/list.php`).then(res => res.json())
    ]).then(async ([uniRes, facRes]) => {
      const uni = uniRes.data.find((u: any) => u.id === id);
      setUniversity(uni || null);
      const fac = facRes.faculty.filter((f: any) => f.university_id === id);
      setFaculty(fac || []);
      
      setLoading(false);
    });
  }, [id, user, session]);


  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  if (!university) {
    return (
      <div className="pt-24 min-h-screen">
        <EmptyState icon={GraduationCap} title="University not found" description="The university you're looking for doesn't exist." action={<Link to="/universities" className="btn-primary">Back to Directory</Link>} />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'tuition', label: 'Tuition & Scholarships' },
    { id: 'programs', label: 'Programs' },
    { id: 'faculty', label: `Faculty (${faculty.length})` },
  ];

  const tuitionDisplay = () => {
    if (!university.tuition_min && !university.tuition_max) return 'Tuition not available';
    if (!university.tuition_max || university.tuition_max <= university.tuition_min!) {
      return `$${(university.tuition_min! / 1000).toFixed(0)}k+`;
    }
    return `$${(university.tuition_min! / 1000).toFixed(0)}k - $${(university.tuition_max / 1000).toFixed(0)}k`;
  };

  return (
    <div className="pt-20 pb-20 min-h-screen">
      {/* Hero banner */}
      <div 
        className="relative h-72 sm:h-96 overflow-hidden"
        style={{ background: generateGradient(university.id) }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <Link to="/universities" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Universities
            </Link>
            <div className="flex items-end gap-4">
              {university.logo_url && !logoError ? (
                <img 
                  src={university.logo_url} 
                  alt="" 
                  className="w-16 h-16 rounded-2xl object-cover hidden sm:block border-2 border-white/20 bg-white" 
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl hidden sm:flex items-center justify-center bg-white/10 border-2 border-white/20 backdrop-blur-sm">
                  <Building2 className="w-8 h-8 text-white/80" />
                </div>
              )}
              <div>
                <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white text-balance">{university.name}</h1>
                <div className="flex items-center gap-3 mt-2 text-white/80">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {university.city}, {university.country}</span>
                  {university.qs_rank && <span className="flex items-center gap-1"><Award className="w-4 h-4" /> QS Rank #{university.qs_rank}</span>}
                </div>
              </div>
            </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Verified Faculty', value: university.verified_faculty_count },
            { icon: Building2, label: 'Type', value: university.university_type.charAt(0).toUpperCase() + university.university_type.slice(1) },
            { icon: DollarSign, label: 'Tuition', value: tuitionDisplay() },
            { icon: Calendar, label: 'Established', value: university.established_year ?? 'N/A' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="glass-card rounded-2xl p-4">
                <Icon className="w-5 h-5 text-navy mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-navy text-navy dark:text-navy'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in space-y-8">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-3">About {university.name}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {university.description || 'Description not available.'}
              </p>
            </div>

            {university.gallery_urls && university.gallery_urls.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Campus Gallery</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {university.gallery_urls.map((url, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden group">
                      <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {university.campus_facilities && university.campus_facilities.length > 0 && (
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Campus Facilities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {university.campus_facilities.map((facility) => (
                     <div key={facility} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" /> {facility}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {university.website && (
              <a href={university.website.startsWith('http') ? university.website : 'https://' + university.website} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2">
                <Globe className="w-4 h-4" /> Visit Official Website
              </a>
            )}
          </div>
        )}

        {activeTab === 'admissions' && (
          <div className="animate-fade-in">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-3">Admission Details</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{university.admission_details ?? 'Admission information not available yet. Please visit the official website for details.'}</p>
            </div>
          </div>
        )}

        {activeTab === 'tuition' && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Tuition Information</h3>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {tuitionDisplay()}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">per year ({university.currency})</p>
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Estimated Cost of Attendance</h3>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <DollarSign className="w-8 h-8 text-navy" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {university.cost_of_attendance ? `$${university.cost_of_attendance.toLocaleString()}` : 'N/A'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">includes tuition, room/board & fees</p>
                  </div>
                </div>
              </div>
            </div>
            {university.scholarships_available && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-amber-500" />
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Scholarships Available</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{university.scholarship_info ?? 'Scholarship information available. Contact the university for details.'}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'programs' && (
          <div className="animate-fade-in">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Available Programs</h3>
              {university.programs && university.programs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {university.programs.map((program) => (
                    <div key={program} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <BookOpen className="w-5 h-5 text-navy flex-shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{program}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No specific programs listed.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'faculty' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Verified Faculty at {university.name}</h3>
              <Link to={`/mentors?university=${university.id}`} className="text-sm text-navy hover:text-navy flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {faculty.length === 0 ? (
              <EmptyState icon={Users} title="No verified faculty yet" description="Check back soon as we verify more professors from this institution." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {faculty.map((f) => <FacultyCard key={f.id} faculty={f} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
