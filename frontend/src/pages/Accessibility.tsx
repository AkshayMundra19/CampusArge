import { Accessibility as AccessibilityIcon, HeartHandshake, CheckCircle2, Monitor, Keyboard, MessageSquare } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Accessibility() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Helmet>
        <title>Accessibility Statement | WCAG 2.1 AA Compliance – CampusArge</title>
        <meta
          name="description"
          content="Learn about CampusArge's commitment to digital accessibility, inclusive design standards, and compliance with WCAG 2.1 Level AA for all students and educators."
        />
        <meta
          name="keywords"
          content="CampusArge accessibility statement, WCAG compliance, accessible higher education directory, digital inclusion, disability access"
        />
        <link rel="canonical" href="https://campusarge.com/accessibility" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy to-navy-dark border border-gold/20 flex items-center justify-center mx-auto mb-4 shadow-md">
            <AccessibilityIcon className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Accessibility Statement
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Equal Access &bull; Universal Usability &bull; WCAG 2.1 Level AA Standard
          </p>
        </div>

        {/* Content Container */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-10 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200/80 dark:border-slate-800">
          
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <strong>Universal Mission:</strong> Higher education exploration should be barrier-free for everyone. CampusArge is dedicated to providing an inclusive digital environment that accommodates individuals with sensory, motor, cognitive, and technological differences.
          </div>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-gold" />
              1. Conformance Standards (WCAG 2.1 AA)
            </h2>
            <p className="leading-relaxed">
              To guarantee broad usability across assistive technologies, CampusArge adheres to the World Wide Web Consortium's (W3C) <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. These guidelines establish four foundational principles: Perceivable, Operable, Understandable, and Robust (POUR).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gold" />
              2. Key Accessibility Features Implemented
            </h2>
            <p className="leading-relaxed">
              Our engineering team integrates accessible design directly into our core product architecture:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm mt-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-navy dark:text-gold" /> High Contrast & Scalability
                </h3>
                <p>Text elements adhere to minimum 4.5:1 contrast ratios. The user interface scales seamlessly up to 200% zoom without truncation.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                  <Keyboard className="w-4 h-4 text-navy dark:text-gold" /> Keyboard Navigation
                </h3>
                <p>All search inputs, filter toggles, comparison buttons, and links feature prominent focus indicators and are navigable via Tab/Shift+Tab.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Semantic HTML & ARIA</h3>
                <p>Screen readers receive accurate semantic structure via native landmark tags (<code>main</code>, <code>nav</code>, <code>header</code>) and ARIA attributes.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Image Descriptions (Alt Text)</h3>
                <p>University logos, campus graphics, and interactive icons carry descriptive alternative text for non-visual browsing.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-gold" />
              3. Assistive Technology Compatibility
            </h2>
            <p className="leading-relaxed">
              CampusArge is tested for compatibility across modern web browsers (Chrome, Edge, Firefox, Safari) and popular assistive tools including NVDA, JAWS, VoiceOver (macOS/iOS), and TalkBack (Android).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gold" />
              4. Accessibility Feedback and Remediation
            </h2>
            <p className="leading-relaxed">
              We continually audit our pages to eliminate barriers. If you encounter any accessibility hurdles while searching or comparing universities, please let us know so we can assist and remediate the issue immediately:
            </p>
            <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm space-y-1">
              <p><strong>Accessibility Support:</strong> <a href="mailto:info@campusarge.com" className="text-navy dark:text-gold font-semibold underline">info@campusarge.com</a></p>
              <p><strong>Online Form:</strong> <Link to="/contact" className="text-navy dark:text-gold font-semibold underline">Contact Us Page</Link></p>
              <p className="text-xs text-slate-500 pt-1">Please include the specific URL and a brief description of the assistive technology used.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
