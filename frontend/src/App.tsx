import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Universities from '@/pages/Universities';
import UniversityDetail from '@/pages/UniversityDetail';
import Mentors from '@/pages/Mentors';
import FacultyProfile from '@/pages/FacultyProfile';
import Roadmaps from '@/pages/Roadmaps';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Blog from '@/pages/Blog';
import BusinessPolicy from '@/pages/BusinessPolicy';
import Disclaimer from '@/pages/Disclaimer';
import CookieBanner from '@/components/CookieBanner';
import InstitutionsDirectory from '@/pages/InstitutionsDirectory';
import InstitutionDetail from '@/pages/InstitutionDetail';
import ResearchAreas from '@/pages/ResearchAreas';
import VerificationProcess from '@/pages/VerificationProcess';
import Accessibility from '@/pages/Accessibility';
import NotFound from '@/pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  const { pathname } = useLocation();
  // Pages that use their own footer or have no footer
  const hideFooter =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/institutions" element={<InstitutionsDirectory />} />
        <Route path="/institutions/:slug" element={<InstitutionDetail />} />
        <Route path="/research-areas" element={<Navigate to="/" replace />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/universities/:id" element={<UniversityDetail />} />
        <Route path="/mentors" element={<Navigate to="/" replace />} />
        <Route path="/mentors/:id" element={<Navigate to="/" replace />} />
        <Route path="/roadmaps" element={<Roadmaps />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} />
        <Route path="/business-policy" element={<BusinessPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/verification" element={<VerificationProcess />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideFooter && <Footer />}
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
