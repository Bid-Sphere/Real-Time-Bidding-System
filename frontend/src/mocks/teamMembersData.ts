import type { TeamMember } from '@/types/organization';

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    organizationId: 'org-1',
    name: 'Alice Chen',
    role: 'Senior Full-Stack Developer',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    bio: 'Full-stack developer with 8+ years of experience building scalable web applications. Specialized in React and Node.js ecosystems.',
    avatar: '/avatars/alice-chen.jpg',
    linkedIn: 'https://linkedin.com/in/alicechen',
    portfolio: 'https://alicechen.dev',
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'team-2',
    organizationId: 'org-1',
    name: 'Marcus Rodriguez',
    role: 'Mobile Developer',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
    bio: 'Mobile development expert with a passion for creating beautiful, performant apps. 6 years of experience in cross-platform development.',
    avatar: '/avatars/marcus-rodriguez.jpg',
    linkedIn: 'https://linkedin.com/in/marcusrodriguez',
    createdAt: '2024-02-15T11:30:00Z'
  },
  {
    id: 'team-3',
    organizationId: 'org-1',
    name: 'Sarah Kim',
    role: 'UI/UX Designer',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    bio: 'Creative designer focused on user-centered design. 5 years of experience creating intuitive interfaces for web and mobile.',
    avatar: '/avatars/sarah-kim.jpg',
    linkedIn: 'https://linkedin.com/in/sarahkim',
    portfolio: 'https://sarahkim.design',
    createdAt: '2024-03-10T09:15:00Z'
  },
  {
    id: 'team-4',
    organizationId: 'org-1',
    name: 'David Okonkwo',
    role: 'DevOps Engineer',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    bio: 'DevOps specialist with expertise in cloud infrastructure and automation. 7 years of experience optimizing deployment pipelines.',
    avatar: '/avatars/david-okonkwo.jpg',
    linkedIn: 'https://linkedin.com/in/davidokonkwo',
    createdAt: '2024-04-05T14:20:00Z'
  },
  {
    id: 'team-5',
    organizationId: 'org-1',
    name: 'Emily Watson',
    role: 'QA Engineer',
    skills: ['Test Automation', 'Selenium', 'Jest', 'Cypress', 'API Testing'],
    bio: 'Quality assurance expert dedicated to delivering bug-free software. 5 years of experience in automated and manual testing.',
    avatar: '/avatars/emily-watson.jpg',
    linkedIn: 'https://linkedin.com/in/emilywatson',
    createdAt: '2024-05-12T10:45:00Z'
  },
  {
    id: 'team-6',
    organizationId: 'org-1',
    name: 'James Park',
    role: 'Backend Developer',
    skills: ['Python', 'Django', 'FastAPI', 'MongoDB', 'Redis'],
    bio: 'Backend developer specializing in Python and API development. 6 years of experience building robust server-side applications.',
    avatar: '/avatars/james-park.jpg',
    linkedIn: 'https://linkedin.com/in/jamespark',
    createdAt: '2024-06-18T13:00:00Z'
  }
];
