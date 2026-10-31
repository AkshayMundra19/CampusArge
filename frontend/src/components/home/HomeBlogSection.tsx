import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blogData';

export default function HomeBlogSection() {
  // Take top 3 newest blog posts
  const recentPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="py-24 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-light text-navy text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5 text-navy" aria-hidden="true" />
            <span>From Our Blog</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            Latest Insights & Academic Perspectives
          </h2>
          <p className="mt-3.5 text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Stay informed with expert guidance on global academic partnerships, faculty networks, and higher education trends.
          </p>
        </div>

        {/* 3-Column Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-navy/30 dark:hover:border-navy/50 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-semibold text-burgundy bg-burgundy/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white leading-snug group-hover:text-navy dark:group-hover:text-gold transition-colors">
                  <Link to="/blog">
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">{post.date}</span>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy dark:text-gold hover:gap-2.5 transition-all"
                  aria-label={`Read article: ${post.title}`}
                >
                  Read article
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View all articles CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/blog"
            className="btn-secondary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
          >
            View all articles
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
