import { BookOpen, ArrowRight, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

// CMS-ready structure — replace with real posts when ready
const BLOG_POSTS: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image?: string;
}[] = [
  // Add real posts here when ready
  // { slug: 'how-to-find-a-mentor', title: '...', ... }
];

const CATEGORIES = ['All', 'Career Guidance', 'University Insights', 'Mentorship Stories', 'Industry Trends'];

export default function Blog() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6">
            <BookOpen className="w-4 h-4 text-burgundy" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Knowledge Hub</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 dark:text-white text-balance mb-4">
            Career Guidance <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-pretty">
            Expert insights on university admissions, career planning, mentorship, and navigating your academic journey — written by verified faculty and career experts.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                cat === 'All'
                  ? 'bg-navy text-white shadow-md shadow-navy'
                  : 'glass text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-navy'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Coming Soon State */}
        {BLOG_POSTS.length === 0 && (
          <div className="glass-card rounded-3xl p-16 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy to-burgundy flex items-center justify-center mx-auto mb-6 shadow-xl shadow-navy">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-3">
              Articles Coming Soon
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 text-pretty">
              We're curating career guidance articles, mentorship stories, and university insights from our verified faculty network. Check back soon — or get notified when we launch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/mentors" className="btn-primary flex items-center justify-center gap-2">
                Browse Mentors Instead <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn About Us
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Topics we will cover:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Graduate Admissions', 'Career Switching', 'Research Tips', 'Interview Prep', 'Scholarship Guides', 'Mentorship 101'].map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Real posts grid — rendered when BLOG_POSTS is populated */}
        {BLOG_POSTS.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="glass-card rounded-2xl overflow-hidden card-hover group"
              >
                {post.image && (
                  <div className="h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <span className="text-xs font-semibold text-navy dark:text-navy uppercase tracking-wide">{post.category}</span>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-1 mb-2 group-hover:text-navy dark:group-hover:text-navy transition-colors">{post.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
