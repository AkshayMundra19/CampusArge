export type UserRole = 'student' | 'faculty' | 'admin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled' | 'no_show';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface InstitutionFacts {
  about?: string | null;                       // CSV: About
  research_summary?: string | null;            // CSV: Research (prose)
  anchor_programs?: string[] | null;           // CSV: Anchor Programs
  school_classification?: string | null;       // CSV: School Classification
  accreditation_status?: string | null;        // CSV: Accreditation Status (display, as given)
  accreditor?: string | null;                  // derived code e.g. "NECHE", "HLC"
  campus_acreage?: { display: string; value: number | null } | null;
  undergrad_population?: { display: string; value: number | null } | null;
  graduate_population?: { display: string; value: number | null } | null;
  housing_capacity_beds?: { display: string; value: number | null } | null;
  athletic_conference?: string | null;
  varsity_sports?: { display: string; value: number | null } | null;
  student_faculty_ratio?: { display: string; value: number | null } | null; // "10:1" -> 10
  cost_of_living_index?: number | null;        // CSV: Cost of Living (Annual), see D1
  cost_of_living?: { display: string; value: number | null } | null;        // Full original text / index
  avg_home_price?: { display: string; value: number | null } | null;
  avg_apartment_rent?: { display: string; value: number | null } | null;  // per month
  crime_rate?: { display: string; level: 'low' | 'moderate' | 'high' | null } | null;
}

export interface University {
  id: string;
  name: string;
  country: string;
  country_code: string | null;
  city: string | null;
  state: string | null;
  qs_rank: number | null;
  logo_url: string | null;
  banner_url: string | null;
  campus_image_url: string | null;
  campus_image_attribution: string | null;
  gallery_urls: string[] | null;
  website: string | null;
  description: string | null;
  university_type: 'public' | 'private' | 'online';
  tuition_min: number | null;
  tuition_max: number | null;
  cost_of_attendance: number | null;
  currency: string;
  scholarships_available: boolean;
  scholarship_info: string | null;
  programs: string[] | null;
  admission_details: string | null;
  campus_facilities: string[] | null;
  established_year: number | null;
  student_count: number | null;
  verified_faculty_count: number;
  is_featured: boolean;
  created_at: string;
  facts?: InstitutionFacts;
}

export interface Faculty {
  id: string;
  user_id: string | null;
  university_id?: string | null;
  full_name: string;
  email?: string | null;
  title: string | null;
  department: string | null;
  subjects: string[];
  research_interests: string[];
  bio: string | null;
  photo_url: string | null;
  university_name: string | null;
  languages: string[];
  experience_years: number;
  session_fee?: number;
  currency?: string;
  rating: number;
  review_count: number;
  verification_status: VerificationStatus;
  is_available: boolean;
  created_at: string;
  updated_at?: string;
}

export interface FacultyAvailability {
  id: string;
  faculty_id: string;
  day_of_week: number | null;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  specific_date: string | null;
  is_booked: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  student_id: string;
  faculty_id: string;
  availability_id: string | null;
  status: BookingStatus;
  topic: string;
  description: string | null;
  session_date: string | null;
  session_time: string | null;
  duration_minutes: number;
  meeting_link: string | null;
  student_notes: string | null;
  faculty_notes: string | null;
  roadmap_recommendation: string | null;
  created_at: string;
  updated_at: string;
  faculty?: Faculty;
}

export interface Review {
  id: string;
  booking_id?: string;
  student_id: string;
  faculty_id: string;
  rating: number;
  comment: string | null;
  is_published: boolean;
  created_at: string;
}

export type Session = Booking;

export interface Testimonial {
  id: string;
  student_name: string;
  student_avatar: string | null;
  university: string;
  rating: number;
  quote: string;
  is_featured: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface CareerRoadmap {
  id: string;
  student_id: string;
  title: string;
  field: string | null;
  current_step: number;
  total_steps: number;
  steps: any;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface SavedUniversity {
  id: string;
  student_id: string;
  university_id: string;
  created_at: string;
  university?: University;
}

export interface FavoriteFaculty {
  id: string;
  faculty_id: string;
  student_id: string;
  created_at: string;
  faculty?: Faculty;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'faculty' | 'university' | 'booking' | 'review' | 'user';
  target_id: string;
  reason: string;
  description: string | null;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
}
