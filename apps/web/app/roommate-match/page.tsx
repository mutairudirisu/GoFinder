export default function RoommateMatch() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-gray-900 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-5xl font-display font-bold text-white mb-4">Roommate Match</h1>
        <p className="text-xl text-gray-300 mb-8">Find your perfect roommate match based on lifestyle, interests, and preferences.</p>
        
        <div className="space-y-6">
          <p className="text-gray-400">Our smart matching algorithm helps you find compatible roommates for your ideal living situation.</p>
          <div className="flex justify-center gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 border border-gray-500 focus:outline-none focus:border-brand-dark transition-colors"
            />
            <button className="px-6 py-3 bg-brand-dark text-white rounded-lg font-bold hover:bg-opacity-90 transition-all">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
