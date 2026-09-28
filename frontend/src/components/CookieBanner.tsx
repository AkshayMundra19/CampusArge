import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('mentoring_path_cookie_consent');
    if (!consent) {
      // Small delay so it doesn't appear immediately on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('mentoring_path_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('mentoring_path_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-fade-in-up pointer-events-none">
      <div className="max-w-4xl mx-auto glass-card rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200/50 dark:border-slate-800/50 pointer-events-auto relative bg-white/80 dark:bg-slate-900/80">
        <button 
          onClick={declineCookies} 
          className="absolute top-2 right-2 sm:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex-1 pr-6 sm:pr-0">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies in accordance with our <a href="/privacy" className="text-navy dark:text-navy hover:underline">Privacy Policy</a>.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <button 
            onClick={declineCookies}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Decline
          </button>
          <button 
            onClick={acceptCookies}
            className="flex-1 sm:flex-none btn-primary px-5 py-2 text-sm"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
