import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedInstitutions from '@/components/home/FeaturedInstitutions';
import HomeBlogSection from '@/components/home/HomeBlogSection';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import NewsletterBanner from '@/components/home/NewsletterBanner';
import { Helmet } from 'react-helmet-async';

const FAQ_ITEMS = [
  {
    q: 'What is CampusArge?',
    a: 'CampusArge is a platform that connects academic institutions with verified faculty members, helping universities build their global presence and helping faculty extend their professional visibility.'
  },
  {
    q: 'Who can join CampusArge?',
    a: 'CampusArge is designed for universities, research institutions, and verified faculty members looking to build academic partnerships and collaborations.'
  },
  {
    q: 'How does institution verification work?',
    a: 'Institutions submit their details for review, and our team verifies their credentials and accreditation before listing them on the platform.'
  },
  {
    q: 'How does faculty verification work?',
    a: 'Faculty members provide documentation of their academic affiliation, which our team manually reviews before granting a Verified badge.'
  },
  {
    q: 'How can my institution join CampusArge?',
    a: 'Institutions can reach out through our Contact page to begin the onboarding process and get listed on the platform.'
  },
  {
    q: 'How can faculty members create a profile?',
    a: 'Verified faculty can request to join through the Contact page, after which our team assists with setting up and verifying their profile.'
  },
  {
    q: 'Is there a cost for institutions to join?',
    a: 'Pricing and partnership details are shared directly with institutions during onboarding. Contact us to learn more.'
  },
  {
    q: 'What research areas does CampusArge cover?',
    a: 'CampusArge spans a wide range of academic disciplines including AI Research, Engineering, Medical Sciences, Business, Law, Sustainability, and Data Science, with more areas added regularly.'
  },
  {
    q: 'How can I explore faculty by research area?',
    a: 'Visit the Research Areas page to browse specific fields and view faculty members whose expertise matches that discipline.'
  },
  {
    q: 'Who do I contact for support?',
    a: 'You can reach the CampusArge team anytime through the Contact page for any questions related to institutions, faculty profiles, or the platform.'
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CampusArge",
    "url": "https://CampusArge.com",
    "logo": "https://CampusArge.com/favicon.svg",
    "description": "CampusArge connects academic institutions with verified faculty members, helping universities build their global presence."
  };

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>CampusArge | Connect Universities with Global Faculty Talent</title>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      {/* 1. Hero */}
      <HeroSection />


      {/* 3.5 Featured Institutions */}
      <FeaturedInstitutions />

      {/* 4. Latest Blog Posts */}
      <HomeBlogSection />

      {/* 5. How It Works */}
      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* 6. Testimonials */}
      <Testimonials />

      {/* 7. Newsletter Banner */}
      <NewsletterBanner />

      {/* 8. FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-navy bg-navy-light mb-3">
              FAQ
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg">
              Everything you need to know about CampusArge
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span className="font-semibold text-slate-900 dark:text-white pr-4">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {openFaq === i && (
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-fade-in"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
