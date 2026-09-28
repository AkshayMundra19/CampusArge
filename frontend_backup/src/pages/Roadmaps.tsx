import { useState } from 'react';
import { Compass, BookOpen, FlaskConical, Award, Globe, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/components/ui';
import { Link } from 'react-router-dom';

const ROADMAPS = [
  {
    id: 'tenure-track',
    title: 'Tenure-Track Preparation',
    icon: Award,
    color: 'from-primary-500 to-primary-700',
    steps: ['Ph.D. Completion', 'Postdoctoral Fellowship', 'First Faculty Position', 'Publishing & Grants', 'Mid-Career Review', 'Tenure Decision'],
    duration: '5-7 years',
    skills: ['Grant Writing', 'Academic Publishing', 'Teaching Excellence', 'Committee Leadership', 'Networking', 'Lab Management'],
  },
  {
    id: 'intl-postdoc',
    title: 'International Postdoc Journey',
    icon: Globe,
    color: 'from-accent-500 to-accent-700',
    steps: ['Identify Global Labs', 'Reach out to PIs', 'Visa & Funding Applications', 'Relocation & Onboarding', 'High-Impact Research', 'Transition to Faculty'],
    duration: '2-4 years',
    skills: ['Cross-cultural Communication', 'Fellowship Applications', 'Advanced Lab Techniques', 'Independent Research', 'Global Networking'],
  },
  {
    id: 'research-grants',
    title: 'Research & Grant Funding',
    icon: FlaskConical,
    color: 'from-blue-500 to-cyan-600',
    steps: ['Identify Funding Agencies', 'Draft Specific Aims', 'Form Research Team', 'Budget Preparation', 'Proposal Submission', 'Grant Management'],
    duration: '6-12 months',
    skills: ['Proposal Writing', 'Budgeting', 'Project Management', 'Compliance & Ethics', 'Peer Review'],
  },
  {
    id: 'academic-publishing',
    title: 'High-Impact Publishing',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-600',
    steps: ['Select Target Journal', 'Manuscript Preparation', 'Pre-print Submission', 'Navigating Peer Review', 'Revisions & Resubmission', 'Publication & Outreach'],
    duration: '3-9 months',
    skills: ['Data Presentation', 'Academic Writing', 'Addressing Reviewers', 'Open Access', 'Science Communication'],
  },
  {
    id: 'academic-leadership',
    title: 'Academic Leadership',
    icon: Rocket,
    color: 'from-violet-500 to-purple-600',
    steps: ['Committee Member', 'Department Chair Preparation', 'Dean / Provost Track', 'Strategic Planning', 'Fundraising', 'Institutional Leadership'],
    duration: '5-10 years',
    skills: ['Conflict Resolution', 'Strategic Planning', 'Fundraising', 'Budget Allocation', 'Mentorship'],
  }
];

export default function Roadmaps() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedRoadmap = ROADMAPS.find((r) => r.id === selected);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Career Paths"
          title="Career Roadmaps"
          subtitle="Follow structured learning paths designed by verified faculty to reach your career goals"
        />

        {/* Roadmap cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ROADMAPS.map((roadmap) => {
            const Icon = roadmap.icon;
            return (
              <button
                key={roadmap.id}
                onClick={() => setSelected(roadmap.id)}
                className="glass-card rounded-2xl p-6 text-left card-hover group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roadmap.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">{roadmap.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{roadmap.duration} - {roadmap.steps.length} steps</p>
                <div className="flex flex-wrap gap-1.5">
                  {roadmap.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{skill}</span>
                  ))}
                  <span className="px-2 py-0.5 rounded text-xs font-medium text-slate-400">+{roadmap.skills.length - 3}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected roadmap detail */}
        {selectedRoadmap && (
          <div className="glass-card rounded-3xl p-8 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedRoadmap.color} flex items-center justify-center`}>
                <selectedRoadmap.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">{selectedRoadmap.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{selectedRoadmap.duration} - {selectedRoadmap.steps.length} milestones</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4 mb-8">
              {selectedRoadmap.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    {i < selectedRoadmap.steps.length - 1 && <div className="w-0.5 h-12 bg-gradient-to-b from-primary-300 to-transparent mt-1" />}
                  </div>
                  <div className="pt-1.5 pb-8">
                    <p className="font-semibold text-slate-900 dark:text-white">{step}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Skills You'll Learn</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRoadmap.skills.map((skill) => (
                  <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/mentors" className="btn-primary flex items-center gap-2">
                Find a Mentor for This Path <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/register" className="btn-secondary">Save to My Roadmaps</Link>
            </div>
          </div>
        )}

        {!selectedRoadmap && (
          <div className="text-center py-8">
            <Compass className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">Select a career path above to see the detailed roadmap</p>
          </div>
        )}
      </div>
    </div>
  );
}
