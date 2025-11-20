export type UserRole = 'client' | 'vendor' | 'freelancer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}
