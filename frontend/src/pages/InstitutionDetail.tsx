import { useParams, Link } from 'react-router-dom';
import { REAL_UNIVERSITIES } from '@/lib/universitiesData';
import { MapPin, Globe, BookOpen, Award, CheckCircle2, Building2, ExternalLink, Users, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function InstitutionDetail() {
  const { slug } = useParams();
  
  // Find the university by ID (slug)
  const university = REAL_UNIVERSITIES.find(u => u.id === slug);

  if (!university) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
          <Building2 className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Institution Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          The institution you are looking for does not exist or has been removed.
        </p>
        <Link to="/institutions" className="btn-primary px-6 py-3">
          ← Back to Directory
        </Link>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": university.name,
    "url": university.website_url || `https://CampusArge.com/institutions/${university.id}`,
    "logo": university.logo_url,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": university.city,
      "addressCountry": university.country
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Helmet>
        <title>{university.name} | CampusArge</title>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      {/* Header / Hero */}
      <div className="relative pt-32 pb-16 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-teal-900/40" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/institutions" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white shadow-2xl flex items-center justify-center overflow-hidden flex-shrink-0 p-3">
              {university.logo_url ? (
                <img src={university.logo_url} alt={university.name} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-12 h-12 text-slate-300" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1.5 border border-green-500/20 backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Institution
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold backdrop-blur-md">
                  {university.university_type === 'public' ? 'Public' : 'Private'} University
                </span>
              </div>
              
              <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">
                {university.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-navy" />
                  {university.city}, {university.country}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-teal-400" />
                  Global Rank: #{university.qs_rank}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About the Institution</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {university.description}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Research & Academic Programs</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {university.programs.map(prog => (
                  <div key={prog} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <BookOpen className="w-5 h-5 text-navy flex-shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{prog}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Facts</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">QS World Ranking</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">#{university.qs_rank}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Type</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{university.university_type}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="glass-card bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-6 border-indigo-100 dark:border-indigo-800/30">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Interested in connecting?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Reach out to explore academic partnerships or research collaborations with {university.name}.
              </p>
              <Link to="/contact" className="btn-primary w-full flex items-center justify-center gap-2">
                Contact Institution <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
