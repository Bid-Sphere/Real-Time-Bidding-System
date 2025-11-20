import Layout from '@/components/layout/Layout';

export default function VendorDashboard() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Vendor Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            This is the Vendor Dashboard
          </p>
        </div>
      </div>
    </Layout>
  );
}
