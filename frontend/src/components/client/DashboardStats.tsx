import { BarChart3, Users, CheckCircle, DollarSign } from 'lucide-react';
import Card from '@/components/ui/Card';
import type { DashboardStats } from '@/types/project';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export default function DashboardStatsCards({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Total Projects
            </p>
            <p className="text-3xl font-bold text-[var(--text-primary)]">
              {stats.totalProjects}
            </p>
          </div>
          <div className="p-3 bg-[var(--accent-blue)]/10 rounded-full">
            <BarChart3 className="h-6 w-6 text-[var(--accent-blue)]" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Active Bids
            </p>
            <p className="text-3xl font-bold text-[var(--text-primary)]">
              {stats.activeBids}
            </p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-full">
            <Users className="h-6 w-6 text-green-500" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Completed Projects
            </p>
            <p className="text-3xl font-bold text-[var(--text-primary)]">
              {stats.completedProjects}
            </p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Avg. Bid Amount
            </p>
            <p className="text-3xl font-bold text-[var(--text-primary)]">
              ${stats.averageBidAmount?.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-full">
            <DollarSign className="h-6 w-6 text-yellow-500" />
          </div>
        </div>
      </Card>
    </div>
  );
}