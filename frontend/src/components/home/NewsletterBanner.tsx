import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSent(true);
  };

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8" aria-labelledby="newsletter-heading">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 p-8 sm:p-12">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            {/* Icon + text */}
            <div className="flex items-start gap-5 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 id="newsletter-heading" className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
                  Stay Updated with Academic Opportunities
                </h2>
                <p className="text-indigo-100 text-sm sm:text-base max-w-lg">
                  Get the latest updates on new faculty, research collaborations, institutional partnerships, and platform news.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="w-full lg:w-auto lg:flex-shrink-0">
              {sent ? (
                <div className="flex items-center gap-2 text-white font-semibold bg-white/20 rounded-xl px-6 py-4">
                  <CheckCircle2 className="w-5 h-5 text-green-300" aria-hidden="true" />
                  You're subscribed! Welcome aboard.
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
                  aria-label="Newsletter subscription form"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address for newsletter"
                    className="flex-1 sm:w-72 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  />
                  <button
                    type="submit"
                    id="newsletter-subscribe-btn"
                    className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-colors text-sm flex-shrink-0 shadow-lg shadow-green-500/30"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
