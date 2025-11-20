import { Code2, Building2, Package } from 'lucide-react';

export interface ProjectCategory {
  id: string;
  name: string;
  description: string;
  icon: typeof Code2;
  projectCount: number;
}

export const projectCategories: ProjectCategory[] = [
  {
    id: 'it',
    name: 'IT Projects',
    description: 'Software development, web applications, mobile apps, and IT infrastructure projects',
    icon: Code2,
    projectCount: 127,
  },
  {
    id: 'construction',
    name: 'Construction Projects',
    description: 'Building construction, renovation, infrastructure, and civil engineering projects',
    icon: Building2,
    projectCount: 89,
  },
  {
    id: 'procurement',
    name: 'Procurement Projects',
    description: 'Supply chain, equipment procurement, materials sourcing, and organization management',
    icon: Package,
    projectCount: 64,
  },
];
