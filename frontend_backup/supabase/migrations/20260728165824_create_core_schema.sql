/*
# Student Career Companion - Core Schema

## Overview
Creates the complete database schema for a Verified Faculty Mentorship & Career Guidance Marketplace.

## New Tables
1. profiles - Extends auth.users with role (student/faculty/admin)
2. universities - Directory of universities with rankings, tuition, programs
3. faculty - Verified professor profiles linked to universities
4. faculty_availability - Time slots faculty offer for sessions
5. bookings - Session requests (request → approve → attend → notes)
6. session_notes - Post-session notes and career roadmap recommendations
7. reviews - Student reviews of faculty sessions
8. career_roadmaps - Personalized career roadmaps for students
9. saved_universities - Student's bookmarked universities
10. favorite_faculty - Student's favorite mentors
11. notifications - In-app notifications
12. reports - Admin trust console reports
13. testimonials - Public testimonials for homepage

## Security
- RLS enabled on all tables
- Public read on universities, faculty, reviews, testimonials
- Owner-scoped policies using auth.uid() for private data
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
  avatar_url text,
  bio text,
  phone text,
  location text,
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_profiles" ON profiles;
CREATE POLICY "select_profiles" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ UNIVERSITIES ============
CREATE TABLE IF NOT EXISTS universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  country_code text,
  city text,
  qs_rank integer,
  logo_url text,
  banner_url text,
  gallery_urls text[] DEFAULT '{}',
  website text,
  description text,
  university_type text DEFAULT 'public' CHECK (university_type IN ('public', 'private', 'online')),
  tuition_min integer,
  tuition_max integer,
  currency text DEFAULT 'USD',
  scholarships_available boolean DEFAULT true,
  scholarship_info text,
  programs text[] DEFAULT '{}',
  admission_details text,
  campus_facilities text[] DEFAULT '{}',
  established_year integer,
  student_count integer,
  verified_faculty_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_universities" ON universities;
CREATE POLICY "select_universities" ON universities FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_universities" ON universities;
CREATE POLICY "insert_universities" ON universities FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_universities" ON universities;
CREATE POLICY "update_universities" ON universities FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_universities" ON universities;
CREATE POLICY "delete_universities" ON universities FOR DELETE
  TO authenticated USING (true);

-- ============ FACULTY ============
CREATE TABLE IF NOT EXISTS faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  university_id uuid REFERENCES universities(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text,
  title text,
  department text,
  subjects text[] DEFAULT '{}',
  research_interests text[] DEFAULT '{}',
  bio text,
  photo_url text,
  university_name text,
  languages text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  session_fee integer DEFAULT 0,
  currency text DEFAULT 'USD',
  rating numeric(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_faculty" ON faculty;
CREATE POLICY "select_faculty" ON faculty FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_faculty" ON faculty;
CREATE POLICY "insert_faculty" ON faculty FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_faculty" ON faculty;
CREATE POLICY "update_faculty" ON faculty FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_faculty" ON faculty;
CREATE POLICY "delete_faculty" ON faculty FOR DELETE
  TO authenticated USING (true);

-- ============ FACULTY AVAILABILITY ============
CREATE TABLE IF NOT EXISTS faculty_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id uuid REFERENCES faculty(id) ON DELETE CASCADE,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_recurring boolean DEFAULT true,
  specific_date date,
  is_booked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faculty_availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_availability" ON faculty_availability;
CREATE POLICY "select_availability" ON faculty_availability FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_availability" ON faculty_availability;
CREATE POLICY "insert_availability" ON faculty_availability FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_availability" ON faculty_availability;
CREATE POLICY "update_availability" ON faculty_availability FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_availability" ON faculty_availability;
CREATE POLICY "delete_availability" ON faculty_availability FOR DELETE
  TO authenticated USING (true);

-- ============ BOOKINGS ============
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  faculty_id uuid REFERENCES faculty(id) ON DELETE CASCADE,
  availability_id uuid REFERENCES faculty_availability(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled', 'no_show')),
  topic text NOT NULL,
  description text,
  session_date date,
  session_time time,
  duration_minutes integer DEFAULT 60,
  meeting_link text,
  student_notes text,
  faculty_notes text,
  roadmap_recommendation text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_bookings" ON bookings;
CREATE POLICY "select_bookings" ON bookings FOR SELECT
  TO authenticated USING (auth.uid() = student_id OR EXISTS (
    SELECT 1 FROM faculty WHERE faculty.id = bookings.faculty_id AND faculty.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "insert_bookings" ON bookings;
CREATE POLICY "insert_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "update_bookings" ON bookings;
CREATE POLICY "update_bookings" ON bookings FOR UPDATE
  TO authenticated USING (auth.uid() = student_id OR EXISTS (
    SELECT 1 FROM faculty WHERE faculty.id = bookings.faculty_id AND faculty.user_id = auth.uid()
  )) WITH CHECK (auth.uid() = student_id OR EXISTS (
    SELECT 1 FROM faculty WHERE faculty.id = bookings.faculty_id AND faculty.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "delete_bookings" ON bookings;
CREATE POLICY "delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (auth.uid() = student_id);

-- ============ SESSION NOTES ============
CREATE TABLE IF NOT EXISTS session_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  faculty_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  roadmap_recommendation text,
  resources text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_session_notes" ON session_notes;
CREATE POLICY "select_session_notes" ON session_notes FOR SELECT
  TO authenticated USING (auth.uid() = student_id OR auth.uid() = faculty_id);

DROP POLICY IF EXISTS "insert_session_notes" ON session_notes;
CREATE POLICY "insert_session_notes" ON session_notes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = faculty_id OR auth.uid() = student_id);

DROP POLICY IF EXISTS "update_session_notes" ON session_notes;
CREATE POLICY "update_session_notes" ON session_notes FOR UPDATE
  TO authenticated USING (auth.uid() = faculty_id OR auth.uid() = student_id) WITH CHECK (auth.uid() = faculty_id OR auth.uid() = student_id);

DROP POLICY IF EXISTS "delete_session_notes" ON session_notes;
CREATE POLICY "delete_session_notes" ON session_notes FOR DELETE
  TO authenticated USING (auth.uid() = faculty_id);

-- ============ REVIEWS ============
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  faculty_id uuid REFERENCES faculty(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_reviews" ON reviews;
CREATE POLICY "select_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_reviews" ON reviews;
CREATE POLICY "insert_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "update_reviews" ON reviews;
CREATE POLICY "update_reviews" ON reviews FOR UPDATE
  TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "delete_reviews" ON reviews;
CREATE POLICY "delete_reviews" ON reviews FOR DELETE
  TO authenticated USING (auth.uid() = student_id);

-- ============ CAREER ROADMAPS ============
CREATE TABLE IF NOT EXISTS career_roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  field text,
  current_step integer DEFAULT 1,
  total_steps integer DEFAULT 5,
  steps jsonb DEFAULT '[]',
  progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE career_roadmaps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_career_roadmaps" ON career_roadmaps;
CREATE POLICY "select_career_roadmaps" ON career_roadmaps FOR SELECT
  TO authenticated USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "insert_career_roadmaps" ON career_roadmaps;
CREATE POLICY "insert_career_roadmaps" ON career_roadmaps FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "update_career_roadmaps" ON career_roadmaps;
CREATE POLICY "update_career_roadmaps" ON career_roadmaps FOR UPDATE
  TO authenticated USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "delete_career_roadmaps" ON career_roadmaps;
CREATE POLICY "delete_career_roadmaps" ON career_roadmaps FOR DELETE
  TO authenticated USING (auth.uid() = student_id);

-- ============ SAVED UNIVERSITIES ============
CREATE TABLE IF NOT EXISTS saved_universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  university_id uuid REFERENCES universities(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, university_id)
);

ALTER TABLE saved_universities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_saved_universities" ON saved_universities;
CREATE POLICY "select_saved_universities" ON saved_universities FOR SELECT
  TO authenticated USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "insert_saved_universities" ON saved_universities;
CREATE POLICY "insert_saved_universities" ON saved_universities FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "delete_saved_universities" ON saved_universities;
CREATE POLICY "delete_saved_universities" ON saved_universities FOR DELETE
  TO authenticated USING (auth.uid() = student_id);

-- ============ FAVORITE FACULTY ============
CREATE TABLE IF NOT EXISTS favorite_faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id uuid REFERENCES faculty(id) ON DELETE CASCADE,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(faculty_id, student_id)
);

ALTER TABLE favorite_faculty ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_favorite_faculty" ON favorite_faculty;
CREATE POLICY "select_favorite_faculty" ON favorite_faculty FOR SELECT
  TO authenticated USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "insert_favorite_faculty" ON favorite_faculty;
CREATE POLICY "insert_favorite_faculty" ON favorite_faculty FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "delete_favorite_faculty" ON favorite_faculty;
CREATE POLICY "delete_favorite_faculty" ON favorite_faculty FOR DELETE
  TO authenticated USING (auth.uid() = student_id);

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_notifications" ON notifications;
CREATE POLICY "select_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_notifications" ON notifications;
CREATE POLICY "insert_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_notifications" ON notifications;
CREATE POLICY "update_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_notifications" ON notifications;
CREATE POLICY "delete_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============ REPORTS ============
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('faculty', 'university', 'booking', 'review', 'user')),
  target_id uuid NOT NULL,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_reports" ON reports;
CREATE POLICY "select_reports" ON reports FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "select_reports" ON reports;
CREATE POLICY "select_reports" ON reports FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_reports" ON reports;
CREATE POLICY "insert_reports" ON reports FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "update_reports" ON reports;
CREATE POLICY "update_reports" ON reports FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_reports" ON reports;
CREATE POLICY "delete_reports" ON reports FOR DELETE
  TO authenticated USING (true);

-- ============ TESTIMONIALS ============
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  student_avatar text,
  university text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  quote text NOT NULL,
  is_featured boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_testimonials" ON testimonials;
CREATE POLICY "select_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_testimonials" ON testimonials;
CREATE POLICY "insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_testimonials" ON testimonials;
CREATE POLICY "update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_testimonials" ON testimonials;
CREATE POLICY "delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_faculty_university ON faculty(university_id);
CREATE INDEX IF NOT EXISTS idx_faculty_verification ON faculty(verification_status);
CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_faculty ON bookings(faculty_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_faculty ON reviews(faculty_id);
CREATE INDEX IF NOT EXISTS idx_universities_country ON universities(country);
CREATE INDEX IF NOT EXISTS idx_universities_featured ON universities(is_featured);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_univ_student ON saved_universities(student_id);
CREATE INDEX IF NOT EXISTS idx_favorite_faculty_student ON favorite_faculty(student_id);

-- ============ UPDATED_AT TRIGGER ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS faculty_updated_at ON faculty;
CREATE TRIGGER faculty_updated_at BEFORE UPDATE ON faculty
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS career_roadmaps_updated_at ON career_roadmaps;
CREATE TRIGGER career_roadmaps_updated_at BEFORE UPDATE ON career_roadmaps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS reports_updated_at ON reports;
CREATE TRIGGER reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============ AUTO-CREATE PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
