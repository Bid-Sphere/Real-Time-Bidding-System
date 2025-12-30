import { DashboardHeader } from '@/components/client';

export default function ClientProfile() {
  return (
    <>
      <DashboardHeader
        title="Profile"
        subtitle="Manage your client profile and company information"
      />
      
      <div className="bg-background-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Settings</h3>
        <p className="text-gray-400">Profile management coming soon...</p>
      </div>
    </>
  );
}