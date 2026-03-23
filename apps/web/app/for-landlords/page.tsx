export default function ForLandlords() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-gray-900">
      <div className="sticky top-[90px] z-10 bg-gradient-to-b from-brand-dark to-gray-900 flex items-center justify-center px-6">
        <div className="text-center">
        <h1 className="text-5xl font-display font-bold text-white mb-4">For Landlords</h1>
        <p className="text-xl text-gray-300 mb-8">Manage your student housing properties and connect with quality tenants.</p>
        
        <div className="space-y-6">
          <p className="text-gray-400">List your properties, manage inquiries, and reach thousands of student renters.</p>
          <div className="flex justify-center gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 border border-gray-500 focus:outline-none focus:border-brand-dark transition-colors"
            />
            <button className="px-6 py-3 bg-brand-dark text-white rounded-lg font-bold hover:bg-opacity-90 transition-all">
              Get Started
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
