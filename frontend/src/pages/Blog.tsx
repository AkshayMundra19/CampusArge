import { useState } from 'react';
import { BookOpen, ArrowRight, Clock, Tag, Building2, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS } from '@/lib/blogData';

const CATEGORIES = ['All', 'Institutional Strategy', 'Research Collaboration', 'Higher Ed Insights'];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === selectedCategory);
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <Helmet>
        <title>Higher Education Insights, Admissions & College Guides | CampusArge Blog</title>
        <meta
          name="description"
          content="Explore expert guides, college admissions advice, university comparison tips, and academic partnership insights written by verified education experts on CampusArge."
        />
        <meta
          name="keywords"
          content="higher education blog, college admissions guide, university comparison tips, study abroad guide, academic career advice, college rankings insights"
        />
        <link rel="canonical" href="https://campusarge.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CampusArge" />
        <meta property="og:title" content="Higher Education Insights, Admissions & College Guides | CampusArge Blog" />
        <meta
          property="og:description"
          content="Explore expert guides, college admissions advice, university comparison tips, and academic partnership insights."
        />
        <meta property="og:url" content="https://campusarge.com/blog" />
        <meta property="og:image" content="https://campusarge.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Higher Education Insights, Admissions & College Guides | CampusArge Blog" />
        <meta
          name="twitter:description"
          content="Explore expert guides, college admissions advice, university comparison tips, and academic partnership insights."
        />
        <meta name="twitter:image" content="https://campusarge.com/og-image.png" />
      </Helmet>
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
