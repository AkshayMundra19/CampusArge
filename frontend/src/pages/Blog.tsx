import { useState } from 'react';
import { BookOpen, ArrowRight, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '@/lib/blogData';

const CATEGORIES = ['All', 'Institutional Strategy', 'Research Collaboration', 'Higher Ed Insights'];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === selectedCategory);
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
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-navy text-white shadow-md shadow-navy'
                  : 'glass text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-navy'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Real posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.slug}
              className="glass-card rounded-2xl overflow-hidden card-hover group flex flex-col justify-between"
            >
              <div className="p-6">
                <span className="text-xs font-semibold text-burgundy uppercase tracking-wider bg-burgundy/10 px-2.5 py-1 rounded-full">{post.category}</span>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-4 mb-3 group-hover:text-navy dark:group-hover:text-navy transition-colors">{post.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{post.excerpt}</p>
              </div>
              <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-4">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                <span>{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
