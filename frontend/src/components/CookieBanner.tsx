import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('campusarge_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('campusarge_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('campusarge_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in-up">
      <div className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-2xl px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-slate-700 dark:text-slate-300 flex-1">
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies in accordance with our{' '}
          <a href="/privacy" className="text-navy dark:text-gold font-semibold hover:underline">Privacy Policy</a>.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={declineCookies}
            className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="btn-primary px-6 py-2 text-sm"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
