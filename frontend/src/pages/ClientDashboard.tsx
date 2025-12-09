import Navbar from '@/components/layout/Navbar';

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-background-deep">
      <Navbar />
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Client Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            This is the Client Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
