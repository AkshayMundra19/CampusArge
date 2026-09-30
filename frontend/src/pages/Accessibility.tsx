import { Accessibility as AccessibilityIcon, HeartHandshake } from 'lucide-react';

export default function Accessibility() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy to-burgundy flex items-center justify-center mx-auto mb-4">
            <AccessibilityIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Accessibility Statement
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Last updated: August 2026</p>
        </div>
        
        <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-8 text-slate-700 dark:text-slate-300">
          <section>
            <h3 className="font-sans font-bold text-xl text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-navy" />
              Our Commitment
            </h3>
            <p className="leading-relaxed">
              CampusArge is committed to ensuring digital accessibility for all users, including individuals with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to guarantee an inclusive academic platform.
            </p>
          </section>
          
          <section>
            <h3 className="font-sans font-bold text-xl text-slate-900 dark:text-white mb-3">Conformance Status</h3>
            <p className="leading-relaxed">
              We strive to adhere to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA. These guidelines define how to make web content more accessible to people with a wide array of disabilities, and adopting them helps ensure our platform remains accessible to a global academic audience.
            </p>
          </section>
          
          <section>
            <h3 className="font-sans font-bold text-xl text-slate-900 dark:text-white mb-3">Continuous Improvement</h3>
            <p className="leading-relaxed mb-3">
              We are actively working to increase the accessibility and usability of CampusArge. Our ongoing efforts include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Regular accessibility audits of our core user flows.</li>
              <li>Ensuring sufficient color contrast across all interfaces.</li>
              <li>Maintaining consistent keyboard navigation support.</li>
              <li>Providing appropriate text alternatives for non-text content.</li>
            </ul>
          </section>
          
          <section>
            <h3 className="font-sans font-bold text-xl text-slate-900 dark:text-white mb-3">Feedback and Support</h3>
            <p className="leading-relaxed">
              We welcome your feedback on the accessibility of CampusArge. If you encounter accessibility barriers on any part of the platform, please contact our support team at <a href="mailto:accessibility@CampusArge.com" className="text-navy dark:text-navy hover:underline">accessibility@CampusArge.com</a>. We aim to respond to accessibility feedback within 3 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
