import { DashboardHeader } from '@/components/client';

export default function ClientProjects() {
  return (
    <>
      <DashboardHeader
        title="Projects"
        subtitle="Manage all your posted projects"
      />
      
      <div className="bg-background-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">My Projects</h3>
        <p className="text-gray-400">Detailed project management coming soon...</p>
      </div>
    </>
  );
}