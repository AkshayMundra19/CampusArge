import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Star, BadgeCheck, MapPin, Languages, Clock, Calendar,
  Award, BookOpen, MessageSquare, ExternalLink, Heart, GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Faculty, Review } from '@/types';
import { Spinner, EmptyState, Badge } from '@/components/ui';
import { DUMMY_FACULTY, DUMMY_REVIEWS } from '@/lib/dummyData';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function FacultyProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/faculty/profile.php?id=${id}`)
      .then(res => res.ok ? res.json() : { error: true })
      .then(async data => {
        if (!data.error && data.faculty) {
          setFaculty(data.faculty);
          setReviews(data.reviews ?? []);
        } else {
          // Fallback to dummy data
          const dummy = DUMMY_FACULTY.find(f => f.id === id);
          if (dummy) {
            setFaculty(dummy);
            setReviews(DUMMY_REVIEWS.filter(r => r.faculty_id === dummy.id));
          }
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to dummy data on failure
        const dummy = DUMMY_FACULTY.find(f => f.id === id);
        if (dummy) {
          setFaculty(dummy);
          setReviews(DUMMY_REVIEWS.filter(r => r.faculty_id === dummy.id));
        }
        setLoading(false);
      });
  }, [id, user]);


  if (loading) {
    return <div className="pt-24 min-h-screen flex items-center justify-center"><Spinner className="w-10 h-10" /></div>;
  }

  if (!faculty) {
    return <div className="pt-24 min-h-screen"><EmptyState icon={GraduationCap} title="Faculty not found" description="This profile doesn't exist." action={<Link to="/mentors" className="btn-primary">Back to Mentors</Link>} /></div>;
  }

  return (
    <div className="pt-20 pb-20 min-h-screen">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy to-burgundy" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative">
        <Link to="/mentors" className="inline-flex items-center gap-2 text-white mb-4 text-sm hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Back to Mentors
        </Link>

        {/* Profile card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative">
              <img
                src={faculty.photo_url ?? 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg'}
                alt={faculty.full_name}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-xl"
              />
              {faculty.verification_status === 'verified' && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-burgundy border-4 border-white dark:border-slate-900 flex items-center justify-center">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">{faculty.full_name}</h1>
                  <p className="text-slate-600 dark:text-slate-400">{faculty.title}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {faculty.university_name}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {faculty.experience_years} years exp</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              {faculty.rating > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(faculty.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">{faculty.rating.toFixed(1)}</span>
                  <span className="text-sm text-slate-500">({faculty.review_count} reviews)</span>
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {faculty.verification_status === 'verified' && <Badge variant="accent"><BadgeCheck className="w-3 h-3 mr-1" /> Verified Faculty</Badge>}
                {faculty.is_available && <Badge variant="primary"><Clock className="w-3 h-3 mr-1" /> Available</Badge>}
                <Badge variant="neutral">{faculty.department}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Bio & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-3">About</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faculty.bio}</p>
            </div>

            {/* Research Interests */}
            {faculty.research_interests.length > 0 && (
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-navy" /> Research Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {faculty.research_interests.map((r) => (
                    <span key={r} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-navy dark:bg-navy-light text-navy dark:text-navy">{r}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Subject Expertise */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-burgundy" /> Subject Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {faculty.subjects.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-burgundy dark:bg-burgundy-light text-burgundy dark:text-burgundy">{s}</span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-navy" /> Student Reviews
              </h3>
              {reviews.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No reviews yet. Be the first to review after a session!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{review.comment ?? 'No comment provided.'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
