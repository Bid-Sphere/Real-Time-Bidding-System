import type { Bid } from '@/types/organization';

export const mockBids: Bid[] = [
  {
    id: 'bid-1',
    projectId: 'proj-2',
    projectTitle: 'Mobile Banking App',
    organizationId: 'org-1',
    proposedPrice: 42000,
    estimatedTimeline: '12 weeks',
    coverLetter: 'We have extensive experience in developing secure mobile banking applications. Our team has delivered similar projects for major financial institutions with a focus on security and user experience.',
    attachments: [
      {
        id: 'att-bid-1',
        filename: 'portfolio.pdf',
        url: '/attachments/portfolio.pdf',
        size: 1500000,
        mimeType: 'application/pdf'
      }
    ],
    status: 'shortlisted',
    submittedAt: '2024-11-26T10:30:00Z',
    updatedAt: '2024-12-02T14:20:00Z',
    ranking: 3
  },
  {
    id: 'bid-2',
    projectId: 'proj-7',
    projectTitle: 'Healthcare Management System',
    organizationId: 'org-1',
    proposedPrice: 35000,
    estimatedTimeline: '16 weeks',
    coverLetter: 'Our team specializes in HIPAA-compliant healthcare solutions. We understand the critical importance of data security and patient privacy in healthcare IT.',
    status: 'accepted',
    submittedAt: '2024-12-01T09:15:00Z',
    updatedAt: '2024-12-06T11:00:00Z',
    ranking: 1
  },
  {
    id: 'bid-3',
    projectId: 'proj-1',
    projectTitle: 'E-commerce Platform Development',
    organizationId: 'org-1',
    proposedPrice: 22000,
    estimatedTimeline: '10 weeks',
    coverLetter: 'We have built multiple e-commerce platforms with seamless payment integration and excellent user experience. Our solutions are scalable and maintainable.',
    status: 'pending',
    submittedAt: '2024-12-03T14:45:00Z',
    updatedAt: '2024-12-03T14:45:00Z'
  },
  {
    id: 'bid-4',
    projectId: 'proj-4',
    projectTitle: 'AI-Powered Chatbot Development',
    organizationId: 'org-1',
    proposedPrice: 18000,
    estimatedTimeline: '8 weeks',
    coverLetter: 'Our AI team has developed several NLP-based chatbots with high accuracy rates. We use state-of-the-art machine learning models and can integrate with any CRM system.',
    status: 'pending',
    submittedAt: '2024-11-29T16:20:00Z',
    updatedAt: '2024-11-29T16:20:00Z'
  },
  {
    id: 'bid-5',
    projectId: 'proj-5',
    projectTitle: 'Corporate Website Redesign',
    organizationId: 'org-1',
    proposedPrice: 12000,
    estimatedTimeline: '6 weeks',
    coverLetter: 'We specialize in modern, responsive web design with a focus on user experience and SEO. Our designs are conversion-optimized and mobile-first.',
    status: 'rejected',
    submittedAt: '2024-12-02T11:30:00Z',
    updatedAt: '2024-12-05T09:45:00Z'
  },
  {
    id: 'bid-6',
    projectId: 'proj-8',
    projectTitle: 'Real Estate Listing Platform',
    organizationId: 'org-1',
    proposedPrice: 25000,
    estimatedTimeline: '14 weeks',
    coverLetter: 'We have experience building property listing platforms with advanced search capabilities and map integration. Our solutions include virtual tour support and lead management.',
    status: 'pending',
    submittedAt: '2024-12-04T10:00:00Z',
    updatedAt: '2024-12-04T10:00:00Z'
  },
  {
    id: 'bid-7',
    projectId: 'proj-10',
    projectTitle: 'Educational Learning Platform',
    organizationId: 'org-1',
    proposedPrice: 23000,
    estimatedTimeline: '12 weeks',
    coverLetter: 'Our team has built several EdTech platforms with video streaming, quiz engines, and progress tracking. We understand the unique challenges of online education.',
    status: 'shortlisted',
    submittedAt: '2024-12-01T15:30:00Z',
    updatedAt: '2024-12-03T16:15:00Z',
    ranking: 2
  },
  {
    id: 'bid-8',
    projectId: 'proj-11',
    projectTitle: 'Social Media Analytics Dashboard',
    organizationId: 'org-1',
    proposedPrice: 19000,
    estimatedTimeline: '10 weeks',
    coverLetter: 'We specialize in data visualization and analytics dashboards. Our solutions provide real-time insights with beautiful, intuitive interfaces.',
    status: 'pending',
    submittedAt: '2024-12-02T13:20:00Z',
    updatedAt: '2024-12-02T13:20:00Z'
  },
  {
    id: 'bid-9',
    projectId: 'proj-13',
    projectTitle: 'Fitness Tracking Mobile App',
    organizationId: 'org-1',
    proposedPrice: 17000,
    estimatedTimeline: '9 weeks',
    coverLetter: 'We have developed multiple fitness and health tracking apps with wearable device integration. Our apps are user-friendly and feature-rich.',
    status: 'rejected',
    submittedAt: '2024-12-03T11:45:00Z',
    updatedAt: '2024-12-06T10:30:00Z'
  },
  {
    id: 'bid-10',
    projectId: 'proj-16',
    projectTitle: 'Cryptocurrency Trading Bot',
    organizationId: 'org-1',
    proposedPrice: 21000,
    estimatedTimeline: '11 weeks',
    coverLetter: 'Our team has expertise in cryptocurrency trading systems and technical analysis. We build robust, secure trading bots with comprehensive risk management.',
    status: 'pending',
    submittedAt: '2024-12-04T16:00:00Z',
    updatedAt: '2024-12-04T16:00:00Z'
  },
  {
    id: 'bid-11',
    projectId: 'proj-17',
    projectTitle: 'Event Management Platform',
    organizationId: 'org-1',
    proposedPrice: 22000,
    estimatedTimeline: '13 weeks',
    coverLetter: 'We have built event management platforms with ticketing, registration, and attendee tracking. Our solutions handle high-volume events seamlessly.',
    status: 'pending',
    submittedAt: '2024-12-02T14:30:00Z',
    updatedAt: '2024-12-02T14:30:00Z'
  },
  {
    id: 'bid-12',
    projectId: 'proj-21',
    projectTitle: 'Customer Support Ticketing System',
    organizationId: 'org-1',
    proposedPrice: 18000,
    estimatedTimeline: '10 weeks',
    coverLetter: 'We specialize in customer support solutions with live chat and knowledge base integration. Our systems improve response times and customer satisfaction.',
    status: 'shortlisted',
    submittedAt: '2024-12-01T10:15:00Z',
    updatedAt: '2024-12-04T13:45:00Z',
    ranking: 4
  }
];
