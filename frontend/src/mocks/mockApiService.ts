import type {
  OrganizationProfile,
  AnalyticsData,
  Project,
  Bid,
  TeamMember,
  Conversation,
  Message,
  Notification,
  Activity,
  FilterState,
  Attachment
} from '@/types/organization';

import { currentOrganization } from './organizationData';
import { mockAnalyticsData } from './analyticsData';
import { mockProjects } from './projectsData';
import { mockBids } from './bidsData';
import { mockTeamMembers } from './teamMembersData';
import { mockConversations } from './conversationsData';
import { mockMessages } from './messagesData';
import { mockNotifications } from './notificationsData';
import { mockActivities } from './activitiesData';

// Utility function to simulate network latency
const delay = (ms: number = Math.random() * 300 + 200) => 
  new Promise(resolve => setTimeout(resolve, ms));

// LocalStorage keys
const STORAGE_KEYS = {
  PROFILE: 'org_profile',
  PROJECTS: 'org_projects',
  BIDS: 'org_bids',
  TEAM_MEMBERS: 'org_team_members',
  CONVERSATIONS: 'org_conversations',
  MESSAGES: 'org_messages',
  NOTIFICATIONS: 'org_notifications',
  VERIFICATION_STATUS: 'org_verification_status'
};

// Initialize localStorage with mock data if not present
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(currentOrganization));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(mockProjects));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BIDS)) {
    localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(mockBids));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS)) {
    localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(mockTeamMembers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(mockConversations));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(mockMessages));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(mockNotifications));
  }
};

// Initialize on module load
initializeStorage();

// Analytics Endpoints
export const analyticsApi = {
  getAnalytics: async (_orgId: string): Promise<AnalyticsData> => {
    await delay();
    return mockAnalyticsData;
  },

  getRecommendedProjects: async (_orgId: string, limit: number = 6): Promise<Project[]> => {
    await delay();
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}') as OrganizationProfile;
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]') as Project[];
    
    // Filter projects by industry match or interested flag
    const recommended = projects.filter(p => 
      p.isInterested || 
      p.category.toLowerCase().includes(profile.industry?.toLowerCase() || '')
    ).slice(0, limit);
    
    return recommended;
  },

  getRecentActivities: async (_orgId: string, limit: number = 10): Promise<Activity[]> => {
    await delay();
    return mockActivities.slice(0, limit);
  }
};

// Profile Endpoints
export const profileApi = {
  getProfile: async (_orgId: string): Promise<OrganizationProfile> => {
    await delay();
    const profile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return profile ? JSON.parse(profile) : currentOrganization;
  },

  updateProfile: async (_orgId: string, data: Partial<OrganizationProfile>): Promise<OrganizationProfile> => {
    await delay();
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}') as OrganizationProfile;
    
    // Calculate completion percentage
    const updatedProfile = { ...profile, ...data, updatedAt: new Date().toISOString() };
    const requiredFields = [
      updatedProfile.companyName,
      updatedProfile.businessRegistrationNumber,
      updatedProfile.taxId,
      updatedProfile.industry,
      updatedProfile.contactPerson,
      updatedProfile.emailVerified ? 'verified' : undefined
    ];
    
    const filledCount = requiredFields.filter(field => 
      field !== undefined && field !== ''
    ).length;
    
    updatedProfile.completionPercentage = Math.round((filledCount / 6) * 100);
    
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
    return updatedProfile;
  },

  uploadLogo: async (orgId: string, file: File): Promise<{ url: string }> => {
    await delay();
    // Simulate file upload
    const url = `/uploads/logos/${orgId}-${Date.now()}.${file.name.split('.').pop()}`;
    return { url };
  },

  uploadCoverImage: async (orgId: string, file: File): Promise<{ url: string }> => {
    await delay();
    const url = `/uploads/covers/${orgId}-${Date.now()}.${file.name.split('.').pop()}`;
    return { url };
  }
};

// Email Verification Endpoints
export const verificationApi = {
  sendVerificationCode: async (_orgId: string): Promise<{ message: string; expiresAt: string }> => {
    await delay();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
    localStorage.setItem(STORAGE_KEYS.VERIFICATION_STATUS, JSON.stringify({
      status: 'pending',
      code: '123456', // Mock code
      expiresAt
    }));
    return {
      message: 'Verification code sent to your email',
      expiresAt
    };
  },

  verifyCode: async (_orgId: string, code: string): Promise<{ verified: boolean; message: string }> => {
    await delay();
    const verificationData = JSON.parse(localStorage.getItem(STORAGE_KEYS.VERIFICATION_STATUS) || '{}');
    
    if (code === verificationData.code || code === '123456') {
      // Update profile
      const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}') as OrganizationProfile;
      profile.emailVerified = true;
      
      // Recalculate completion percentage
      const requiredFields = [
        profile.companyName,
        profile.businessRegistrationNumber,
        profile.taxId,
        profile.industry,
        profile.contactPerson,
        'verified' // email is now verified
      ];
      const filledCount = requiredFields.filter(field => 
        field !== undefined && field !== ''
      ).length;
      profile.completionPercentage = Math.round((filledCount / 6) * 100);
      
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEYS.VERIFICATION_STATUS, JSON.stringify({ status: 'verified' }));
      
      return { verified: true, message: 'Email verified successfully' };
    }
    
    return { verified: false, message: 'Invalid verification code' };
  }
};

// Teams Endpoints
export const teamsApi = {
  getTeamMembers: async (_orgId: string): Promise<TeamMember[]> => {
    await delay();
    const members = localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS);
    return members ? JSON.parse(members) : mockTeamMembers;
  },

  addTeamMember: async (orgId: string, data: Omit<TeamMember, 'id' | 'organizationId' | 'createdAt'>): Promise<TeamMember> => {
    await delay();
    const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS) || '[]') as TeamMember[];
    
    const newMember: TeamMember = {
      ...data,
      id: `team-${Date.now()}`,
      organizationId: orgId,
      createdAt: new Date().toISOString()
    };
    
    members.push(newMember);
    localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(members));
    return newMember;
  },

  updateTeamMember: async (_orgId: string, memberId: string, data: Partial<TeamMember>): Promise<TeamMember> => {
    await delay();
    const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS) || '[]') as TeamMember[];
    const index = members.findIndex(m => m.id === memberId);
    
    if (index === -1) {
      throw new Error('Team member not found');
    }
    
    members[index] = { ...members[index], ...data };
    localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(members));
    return members[index];
  },

  deleteTeamMember: async (_orgId: string, memberId: string): Promise<{ success: boolean }> => {
    await delay();
    const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS) || '[]') as TeamMember[];
    const filtered = members.filter(m => m.id !== memberId);
    localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(filtered));
    return { success: true };
  },

  uploadAvatar: async (_orgId: string, memberId: string, file: File): Promise<{ url: string }> => {
    await delay();
    const url = `/uploads/avatars/${memberId}-${Date.now()}.${file.name.split('.').pop()}`;
    return { url };
  }
};

// Project Discovery Endpoints
export const projectsApi = {
  getProjects: async (filters?: FilterState, page: number = 1, limit: number = 20): Promise<{
    projects: Project[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    await delay();
    let projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]') as Project[];
    
    // Apply filters
    if (filters) {
      if (filters.category) {
        projects = projects.filter(p => 
          p.category.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }
      
      if (filters.budgetMin !== undefined) {
        projects = projects.filter(p => p.budgetMax >= filters.budgetMin!);
      }
      
      if (filters.budgetMax !== undefined) {
        projects = projects.filter(p => p.budgetMin <= filters.budgetMax!);
      }
      
      if (filters.location) {
        projects = projects.filter(p => 
          p.location?.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        projects = projects.filter(p => 
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }
      
      if (filters.deadline) {
        const now = new Date();
        projects = projects.filter(p => {
          const deadline = new Date(p.deadline);
          const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          switch (filters.deadline) {
            case 'urgent':
              return daysUntil <= 7;
            case 'this_week':
              return daysUntil <= 7;
            case 'this_month':
              return daysUntil <= 30;
            case 'any':
            default:
              return true;
          }
        });
      }
    }
    
    const total = projects.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedProjects = projects.slice(start, start + limit);
    
    return {
      projects: paginatedProjects,
      total,
      page,
      totalPages
    };
  },

  getProject: async (projectId: string): Promise<Project> => {
    await delay();
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]') as Project[];
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    return project;
  },

  markAsInterested: async (projectId: string, organizationId: string): Promise<{ success: boolean }> => {
    await delay();
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]') as Project[];
    const index = projects.findIndex(p => p.id === projectId);
    
    if (index !== -1) {
      projects[index].isInterested = true;
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      
      // Create conversation if it doesn't exist
      const conversations = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || '[]') as Conversation[];
      const conversationExists = conversations.some(c => c.projectId === projectId);
      
      if (!conversationExists) {
        const project = projects[index];
        const newConversation: Conversation = {
          id: `conv-${Date.now()}`,
          projectId: project.id,
          projectTitle: project.title,
          clientId: project.clientId,
          clientName: project.clientName,
          clientAvatar: project.clientAvatar,
          organizationId,
          unreadCount: 0,
          createdAt: new Date().toISOString()
        };
        conversations.push(newConversation);
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
      }
    }
    
    return { success: true };
  },

  getInterestedProjects: async (_orgId: string): Promise<Project[]> => {
    await delay();
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]') as Project[];
    return projects.filter(p => p.isInterested);
  }
};

// Bidding Endpoints
export const bidsApi = {
  submitBid: async (data: Omit<Bid, 'id' | 'submittedAt' | 'updatedAt' | 'status' | 'ranking'>): Promise<Bid> => {
    await delay();
    
    // Check email verification
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}') as OrganizationProfile;
    if (!profile.emailVerified) {
      throw new Error('EMAIL_NOT_VERIFIED');
    }
    
    const bids = JSON.parse(localStorage.getItem(STORAGE_KEYS.BIDS) || '[]') as Bid[];
    
    const newBid: Bid = {
      ...data,
      id: `bid-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    bids.push(newBid);
    localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(bids));
    
    // Update project bid count and hasBid flag
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]') as Project[];
    const projectIndex = projects.findIndex(p => p.id === data.projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].bidCount += 1;
      projects[projectIndex].hasBid = true;
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }
    
    // Create conversation if it doesn't exist
    const conversations = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || '[]') as Conversation[];
    const conversationExists = conversations.some(c => c.projectId === data.projectId);
    
    if (!conversationExists && projectIndex !== -1) {
      const project = projects[projectIndex];
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        projectId: project.id,
        projectTitle: project.title,
        clientId: project.clientId,
        clientName: project.clientName,
        clientAvatar: project.clientAvatar,
        organizationId: data.organizationId,
        unreadCount: 0,
        createdAt: new Date().toISOString()
      };
      conversations.push(newConversation);
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    }
    
    return newBid;
  },

  getBids: async (orgId: string, status?: string, _page: number = 1, _limit: number = 50): Promise<{
    bids: Bid[];
    total: number;
  }> => {
    await delay();
    let bids = JSON.parse(localStorage.getItem(STORAGE_KEYS.BIDS) || '[]') as Bid[];
    
    bids = bids.filter(b => b.organizationId === orgId);
    
    if (status) {
      bids = bids.filter(b => b.status === status);
    }
    
    // Sort by submittedAt descending
    bids.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    
    return {
      bids,
      total: bids.length
    };
  },

  getBid: async (bidId: string): Promise<Bid> => {
    await delay();
    const bids = JSON.parse(localStorage.getItem(STORAGE_KEYS.BIDS) || '[]') as Bid[];
    const bid = bids.find(b => b.id === bidId);
    
    if (!bid) {
      throw new Error('Bid not found');
    }
    
    return bid;
  },

  updateBid: async (bidId: string, data: Partial<Pick<Bid, 'proposedPrice' | 'estimatedTimeline' | 'coverLetter'>>): Promise<Bid> => {
    await delay();
    const bids = JSON.parse(localStorage.getItem(STORAGE_KEYS.BIDS) || '[]') as Bid[];
    const index = bids.findIndex(b => b.id === bidId);
    
    if (index === -1) {
      throw new Error('Bid not found');
    }
    
    if (bids[index].status !== 'pending') {
      throw new Error('Can only update pending bids');
    }
    
    bids[index] = {
      ...bids[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(bids));
    return bids[index];
  },

  withdrawBid: async (bidId: string): Promise<{ success: boolean }> => {
    await delay();
    const bids = JSON.parse(localStorage.getItem(STORAGE_KEYS.BIDS) || '[]') as Bid[];
    const bid = bids.find(b => b.id === bidId);
    
    if (!bid) {
      throw new Error('Bid not found');
    }
    
    if (bid.status !== 'pending') {
      throw new Error('Can only withdraw pending bids');
    }
    
    const filtered = bids.filter(b => b.id !== bidId);
    localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(filtered));
    
    // Update project bid count
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]') as Project[];
    const projectIndex = projects.findIndex(p => p.id === bid.projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].bidCount = Math.max(0, projects[projectIndex].bidCount - 1);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }
    
    return { success: true };
  },

  uploadAttachment: async (bidId: string, file: File): Promise<Attachment> => {
    await delay();
    const attachment: Attachment = {
      id: `att-${Date.now()}`,
      filename: file.name,
      url: `/uploads/bids/${bidId}/${file.name}`,
      size: file.size,
      mimeType: file.type
    };
    return attachment;
  }
};

// Chat Endpoints
export const chatApi = {
  getConversations: async (orgId: string): Promise<Conversation[]> => {
    await delay();
    const conversations = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || '[]') as Conversation[];
    return conversations.filter(c => c.organizationId === orgId)
      .sort((a, b) => {
        const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : new Date(a.createdAt).getTime();
        const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
  },

  getMessages: async (conversationId: string, _page: number = 1, _limit: number = 50): Promise<{
    messages: Message[];
    total: number;
  }> => {
    await delay();
    const allMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '{}');
    const messages = allMessages[conversationId] || mockMessages[conversationId] || [];
    
    return {
      messages,
      total: messages.length
    };
  },

  sendMessage: async (conversationId: string, content: string, attachments?: Attachment[]): Promise<Message> => {
    await delay();
    const allMessages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '{}');
    const conversationMessages = allMessages[conversationId] || mockMessages[conversationId] || [];
    
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}') as OrganizationProfile;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: profile.id,
      senderName: profile.companyName,
      senderRole: 'organization',
      content,
      attachments,
      sentAt: new Date().toISOString()
    };
    
    conversationMessages.push(newMessage);
    allMessages[conversationId] = conversationMessages;
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));
    
    // Update conversation last message
    const conversations = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || '[]') as Conversation[];
    const convIndex = conversations.findIndex(c => c.id === conversationId);
    if (convIndex !== -1) {
      conversations[convIndex].lastMessage = content;
      conversations[convIndex].lastMessageAt = newMessage.sentAt;
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    }
    
    return newMessage;
  },

  markAsRead: async (conversationId: string): Promise<{ success: boolean }> => {
    await delay();
    const conversations = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) || '[]') as Conversation[];
    const index = conversations.findIndex(c => c.id === conversationId);
    
    if (index !== -1) {
      conversations[index].unreadCount = 0;
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    }
    
    return { success: true };
  }
};

// Notifications Endpoints
export const notificationsApi = {
  getNotifications: async (orgId: string, unreadOnly: boolean = false, limit?: number): Promise<Notification[]> => {
    await delay();
    let notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]') as Notification[];
    
    notifications = notifications.filter(n => n.userId === orgId.replace('org-', 'user-'));
    
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }
    
    // Sort by createdAt descending
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (limit) {
      notifications = notifications.slice(0, limit);
    }
    
    return notifications;
  },

  markAsRead: async (notificationId: string): Promise<{ success: boolean }> => {
    await delay();
    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]') as Notification[];
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
      notifications[index].read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
    
    return { success: true };
  },

  markAllAsRead: async (orgId: string): Promise<{ success: boolean }> => {
    await delay();
    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]') as Notification[];
    const userId = orgId.replace('org-', 'user-');
    
    notifications.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return { success: true };
  },

  createNotification: async (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> => {
    await delay();
    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]') as Notification[];
    
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    notifications.unshift(newNotification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    
    return newNotification;
  }
};

// Export all APIs
export const mockApiService = {
  analytics: analyticsApi,
  profile: profileApi,
  verification: verificationApi,
  teams: teamsApi,
  projects: projectsApi,
  bids: bidsApi,
  chat: chatApi,
  notifications: notificationsApi
};

export default mockApiService;
