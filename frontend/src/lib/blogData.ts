export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image?: string;
  author?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'navigating-global-academic-partnerships',
    title: 'Navigating Global Academic Partnerships: A Guide for Research Institutions',
    excerpt: 'How leading universities structure cross-border faculty collaborations, joint labs, and international research initiatives.',
    category: 'Institutional Strategy',
    readTime: '5 min read',
    date: 'Oct 24, 2026',
    author: 'CampusArge Academic Council'
  },
  {
    slug: 'verified-faculty-networks-research',
    title: 'How Verified Faculty Networks Accelerate International Research',
    excerpt: 'Discover how verified academic credentials eliminate friction and help researchers connect with global co-investigators.',
    category: 'Research Collaboration',
    readTime: '4 min read',
    date: 'Oct 18, 2026',
    author: 'Dr. Elena Vance'
  },
  {
    slug: 'future-of-higher-education-trends',
    title: 'The Future of International Higher Education: Trends Shaping 2026 & Beyond',
    excerpt: 'From digital campuses to transnational credit recognition, explore the forces transforming higher education across continents.',
    category: 'Higher Ed Insights',
    readTime: '6 min read',
    date: 'Oct 10, 2026',
    author: 'Prof. Marcus Chen'
  }
];
