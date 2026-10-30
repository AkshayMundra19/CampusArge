import { Link } from "react-router-dom";
import { GraduationCap, Linkedin, Twitter, Youtube, Instagram } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Institutions", path: "/institutions" },
    // { label: "Faculty Directory", path: "/mentors" },
    // { label: "Research Areas", path: "/research-areas" },
    { label: "About Us", path: "/about" },
    { label: "Pricing", path: "/contact" },
  ],
  Resources: [
    { label: "Blog", path: "/blog" },
    { label: "Help Center", path: "/contact" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Guidelines", path: "/business-policy" },
  ],
  "For Institutions": [
    { label: "Institutional Benefits", path: "/about" },
    { label: "Contact Sales", path: "/contact" },
  ],
};

const contactLinks = [
  { label: "hello@campusarge.com", href: "mailto:hello@campusarge.com" },
];

const socialIcons = [
  { Icon: Linkedin,  href: "#", label: "LinkedIn" },
  { Icon: Twitter,   href: "#", label: "Twitter / X" },
  { Icon: Youtube,   href: "#", label: "YouTube" },
  { Icon: Instagram, href: "#", label: "Instagram" },
];

const legalLinks = [
  { label: "Privacy Policy",   path: "/privacy" },
  { label: "Terms of Service", path: "/terms" },
  { label: "Business Policy",  path: "/business-policy" },
  { label: "Disclaimer",       path: "/disclaimer" },
  { label: "Accessibility",    path: "/accessibility" },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-slate-200 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand — spans 2 cols */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="CampusArge home">
              <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-navy" aria-hidden="true" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Campus<span className="text-gold">Arge</span>
              </span>
            </Link>
            <p className="text-sm text-slate-300 max-w-xs leading-relaxed mb-2">
              CampusArge is an independent platform connecting verified academic institutions and faculty across the globe. Not affiliated with or endorsed by any listed university.
            </p>
            <p className="text-xs text-gold/80 font-semibold mb-5">Est. 2026</p>
            <div className="flex items-center gap-3">
              {socialIcons.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-slate-300 hover:bg-gold hover:text-navy transition-all"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Three link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm text-gold mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold text-sm text-gold mb-4">Contact Us</h4>
            <ul className="space-y-2.5">
              {contactLinks.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    className="text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              &copy; 2026 CampusArge. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
