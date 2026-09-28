import { Briefcase } from 'lucide-react';

export default function BusinessPolicy() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
            Business Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Last updated: August 2026</p>
        </div>
        <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-8 text-slate-700 dark:text-slate-300">
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">1. Platform Role, Connector and Not an Employer</h3>
            <p className="leading-relaxed">Mentoring Path operates solely as a technology platform that connects academic institutions with independently verified faculty members from accredited universities. Mentoring Path is not an employer, staffing agency, or contractor of any faculty member. All faculty members operate independently, and any collaboration formed through the platform is between the institution and the faculty member directly. Mentoring Path does not supervise, direct, or control the content of individual partnerships.</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">2. Faculty and Institution Verification Standard</h3>
            <p className="leading-relaxed">Institutions and faculty members who apply for a Verified badge must provide accurate documentation of their current credentials. Our admin team manually reviews submitted credentials before approving the badge. Mentoring Path reserves the right to revoke verification and suspend accounts if credentials are found to be inaccurate or misrepresented.</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">3. Interaction and Booking Conduct</h3>
            <p className="leading-relaxed mb-3">All participants agree to the following conduct standards when connecting through the platform:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Interactions are strictly for professional academic collaboration, research, and institutional partnerships.</li>
              <li>Both parties must treat each other with respect. Harassment, discrimination, or inappropriate conduct of any kind will result in immediate account suspension.</li>
              <li>Users must provide accurate context for their connection requests and not misrepresent their academic or institutional status.</li>
            </ul>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">4. Dispute Resolution</h3>
            <p className="leading-relaxed">In the event of a dispute between an institution and a faculty member, either party may contact our support team at support@mentoringpath.com. We will investigate reported incidents within 5 business days and take appropriate action, which may include mediation, warning issuance, or account suspension. Mentoring Path's decision in dispute matters is final.</p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">5. Changes to This Policy</h3>
            <p className="leading-relaxed">We reserve the right to update this Business Policy at any time. Registered users will be notified of material changes via email. Continued use of the platform after any change constitutes acceptance of the updated policy.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
