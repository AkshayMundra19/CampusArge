import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, ChevronDown, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home',           path: '/' },
    { label: 'Institutions',   path: '/institutions' },
    // { label: 'Faculty',        path: '/mentors' },
    // { label: 'Research Areas', path: '/research-areas' },
    { label: 'Blog',           path: '/blog' },
    { label: 'About',          path: '/about' },
    { label: 'Contact',        path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Pages with dark hero backgrounds — navbar text should be white when transparent
  const darkHeroPages = [
    '/institutions/', '/universities/', '/mentors/', '/research-areas/', '/blog/'
  ];
  const hasDarkHero = darkHeroPages.some(p => location.pathname.startsWith(p));

  // Use dark text on light hero (home, about, contact etc.)
  // Use white text on dark hero (detail pages)
  const isTransparent = !scrolled;
  const textOnTransparent = hasDarkHero ? 'text-white' : 'text-navy';
  const linkOnTransparent = hasDarkHero
    ? 'text-white/90 hover:text-white hover:bg-white/15'
    : 'text-slate-700 hover:text-navy hover:bg-navy-light/60';
  const activeLinkOnTransparent = hasDarkHero
    ? 'text-white bg-white/20 font-semibold'
    : 'text-navy bg-navy-light font-semibold';

  const logoTextClass = scrolled ? 'text-navy' : textOnTransparent;
  const navLinkClass = (active: boolean) => {
    if (scrolled) {
      return active
        ? 'text-navy bg-navy-light font-semibold'
        : 'text-slate-600 hover:text-navy hover:bg-navy-light/60';
    }
    return active ? activeLinkOnTransparent : linkOnTransparent;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-navy/10 border-b border-slate-200/50'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">

          {/* Logo — light tile with navy icon and gold text */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="CampusArge home">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#D5DCE6] shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-navy" aria-hidden="true" />
            </div>
            <span className={`font-display font-bold text-lg hidden sm:block transition-colors ${logoTextClass}`}>
              Campus<span className="text-gold">Arge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${navLinkClass(isActive(link.path))}`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${navLinkClass(isActive('/dashboard'))}`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side — only logged-in user menu, no Login/Register buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-navy-light transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white text-sm font-semibold">
                    {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
                    {profile?.full_name ?? 'User'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl py-2 animate-fade-in" role="menu">
                    <Link to="/dashboard" role="menuitem" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-navy-light transition-colors">
                      <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Dashboard
                    </Link>
                    <Link to="/dashboard/profile" role="menuitem" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-navy-light transition-colors">
                      <UserIcon className="w-4 h-4" aria-hidden="true" /> Profile
                    </Link>
                    <button onClick={handleSignOut} role="menuitem" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" aria-hidden="true" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-navy hover:bg-navy-light transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white rounded-xl mt-2 p-4 animate-fade-in border border-slate-200 shadow-lg" role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                    isActive(link.path)
                      ? 'text-navy bg-navy-light font-semibold'
                      : 'text-slate-600 hover:text-navy hover:bg-navy-light/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link to="/dashboard" className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-navy hover:bg-navy-light/60 min-h-[44px] flex items-center">
                    Dashboard
                  </Link>
                  <div className="border-t border-slate-200 mt-2 pt-3">
                    <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 w-full">
                      <LogOut className="w-4 h-4" aria-hidden="true" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
