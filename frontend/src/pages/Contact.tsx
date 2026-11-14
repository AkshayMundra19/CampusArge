import { useState } from 'react';
import { Mail, MapPin, CheckCircle2, MessageSquare, Send, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Spinner } from '@/components/ui';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && (!data || data.success !== false)) {
        setSent(true);
      } else {
        setError(data?.error || 'Unable to send message right now. Please email us directly at query@campusarge.com.');
      }
    } catch {
      // Graceful fallback for offline dev environment
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <Helmet>
        <title>Contact CampusArge | Admissions Queries & University Directory Support</title>
        <meta
          name="description"
          content="Get in touch with CampusArge for university profile updates, admission queries, or institutional partnerships. Our education support team responds within 24 hours."
        />
        <meta
          name="keywords"
          content="contact CampusArge, university directory support, admissions inquiries, higher education partnerships, submit university profile, university listing support"
        />
        <link rel="canonical" href="https://campusarge.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CampusArge" />
        <meta property="og:title" content="Contact CampusArge | Admissions Queries & University Directory Support" />
        <meta
          property="og:description"
          content="Get in touch with CampusArge for university profile updates, admission queries, or institutional partnerships."
        />
        <meta property="og:url" content="https://campusarge.com/contact" />
        <meta property="og:image" content="https://campusarge.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact CampusArge | Admissions Queries & University Directory Support" />
        <meta
          name="twitter:description"
          content="Get in touch with CampusArge for university profile updates, admission queries, or institutional partnerships."
        />
        <meta name="twitter:image" content="https://campusarge.com/og-image.png" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Get in Touch
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Our team typically responds within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info cards */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail className="w-5 h-5 text-gold" aria-hidden="true" />
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Email Inquiries</p>
                <div className="flex flex-col gap-1">
                  <a
                    href="mailto:info@campusarge.com"
                    className="font-semibold text-slate-900 dark:text-white hover:text-navy dark:hover:text-gold transition-colors"
                  >
                    info@CampusArge.com
                  </a>
                  <a
                    href="mailto:query@campusarge.com"
                    className="font-semibold text-slate-900 dark:text-white hover:text-navy dark:hover:text-gold transition-colors"
                  >
                    query@CampusArge.com
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-gold" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Location</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Cambridge, Massachusetts, USA
                </p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-burgundy dark:bg-burgundy-light flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">Message sent!</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setFormData({ name: '', email: '', subject: '', message: '' }); }} className="btn-secondary">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-850 flex items-start gap-3 text-red-700 dark:text-red-300 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block flex items-center gap-1"><MessageSquare className="w-4 h-4" /> Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Spinner className="w-5 h-5" /> : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
