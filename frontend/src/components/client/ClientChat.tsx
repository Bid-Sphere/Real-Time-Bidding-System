import { DashboardHeader } from '@/components/client';

export default function ClientChat() {
  return (
    <>
      <DashboardHeader
        title="Messages"
        subtitle="Communicate with organizations and manage conversations"
      />
      
      <div className="bg-background-card/60 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Conversations</h3>
        <p className="text-gray-400">Chat interface coming soon...</p>
      </div>
    </>
  );
}