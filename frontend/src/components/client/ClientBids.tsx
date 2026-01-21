import { DashboardHeader } from '@/components/client';

export default function ClientBids() {
  return (
    <>
      <DashboardHeader
        title="Bids & Proposals"
        subtitle="Review and manage bids from organizations"
      />
      
      <div className="bg-background-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Received Bids</h3>
        <p className="text-gray-400">Bid management interface coming soon...</p>
      </div>
    </>
  );
}