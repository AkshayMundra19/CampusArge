import type { Faculty, University, Review, Session } from '@/types';
import { REAL_UNIVERSITIES } from './universitiesData';

export const DUMMY_UNIVERSITIES: University[] = REAL_UNIVERSITIES;

export const DUMMY_FACULTY: Faculty[] = [
  {
    id: 'f1',
    user_id: 'u1',
    full_name: 'Dr. Sarah Chen',
    title: 'Professor of Computer Science',
    bio: 'Specializing in Artificial Intelligence and Machine Learning. Published over 50 papers in top conferences.',
    photo_url: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=400',
    university_name: 'Massachusetts Institute of Technology (MIT)',
    department: 'Computer Science',
    experience_years: 15,
    research_interests: ['Artificial Intelligence', 'Deep Learning', 'Computer Vision'],
    subjects: ['CS101', 'Advanced ML', 'Neural Networks'],
    languages: ['English', 'Mandarin'],
    is_available: true,
    verification_status: 'verified',
    rating: 4.9,
    review_count: 128,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'f2',
    user_id: 'u2',
    full_name: 'Dr. James Wilson',
    title: 'Associate Professor',
    bio: 'Researching quantum computing and cryptography. Previously at CERN.',
    photo_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    university_name: 'University of Oxford',
    department: 'Physics',
    experience_years: 12,
    research_interests: ['Quantum Computing', 'Cryptography', 'Theoretical Physics'],
    subjects: ['Quantum Mechanics', 'Advanced Cryptography'],
    languages: ['English', 'French'],
    is_available: true,
    verification_status: 'verified',
    rating: 4.8,
    review_count: 85,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'f3',
    user_id: 'u3',
    full_name: 'Dr. Elena Rodriguez',
    title: 'Research Director',
    bio: 'Leading research in renewable energy systems and sustainable materials.',
    photo_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    university_name: 'Stanford University',
    department: 'Materials Science',
    experience_years: 20,
    research_interests: ['Renewable Energy', 'Nanomaterials', 'Sustainability'],
    subjects: ['Materials Science 101', 'Energy Systems'],
    languages: ['English', 'Spanish'],
    is_available: true,
    verification_status: 'verified',
    rating: 5.0,
    review_count: 210,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'f4',
    user_id: 'u4',
    full_name: 'Dr. Michael Chang',
    title: 'Assistant Professor',
    bio: 'Expert in behavioral economics and game theory. Recipient of the Clark Medal.',
    photo_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    university_name: 'Harvard University',
    department: 'Economics',
    experience_years: 8,
    research_interests: ['Behavioral Economics', 'Game Theory', 'Microeconomics'],
    subjects: ['Econ 101', 'Advanced Microeconomics'],
    languages: ['English', 'Korean'],
    is_available: true,
    verification_status: 'verified',
    rating: 4.7,
    review_count: 56,
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: 'f5',
    user_id: 'u5',
    full_name: 'Prof. Aisha Diallo',
    title: 'Professor of Public Health',
    bio: 'Internationally recognized for work on global health inequalities and epidemiology.',
    photo_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    university_name: 'Johns Hopkins University',
    department: 'Public Health',
    experience_years: 22,
    research_interests: ['Epidemiology', 'Global Health', 'Health Policy'],
    subjects: ['Intro to Epidemiology', 'Global Health Systems'],
    languages: ['English', 'French', 'Wolof'],
    is_available: true,
    verification_status: 'verified',
    rating: 4.9,
    review_count: 142,
    created_at: '2024-01-03T00:00:00Z'
  }
];

export const DUMMY_REVIEWS: Review[] = [
  {
    id: 'r1',
    student_id: 's1',
    faculty_id: 'f1',
    rating: 5,
    comment: 'An incredible mentor who provided invaluable guidance on my research proposal.',
    created_at: '2024-02-15T10:00:00Z',
    is_published: true
  },
  {
    id: 'r2',
    student_id: 's2',
    faculty_id: 'f1',
    rating: 4,
    comment: 'Very knowledgeable and helped me navigate the publishing process successfully.',
    created_at: '2024-03-01T14:30:00Z',
    is_published: true
  }
];
