export default function SafetyGuidelines() {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-[90px] z-10 bg-white max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-display font-bold mb-4">Safety Guidelines</h1>
        <p className="text-gray-600 mb-8">Your safety is our top priority. Follow these guidelines for a secure experience.</p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">For Tenants</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">Before You Book</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Read all reviews and property descriptions carefully</li>
                  <li>Verify the property's location and nearby amenities</li>
                  <li>Ask for additional photos or video tours if needed</li>
                  <li>Check the host's verification status and ratings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">During Your Stay</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Keep your door locked when you're away or sleeping</li>
                  <li>Don't share your access codes with strangers</li>
                  <li>Report any safety concerns to the host immediately</li>
                  <li>Keep emergency contact numbers saved</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">For Landlords</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">Property Safety</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Maintain all safety features and locks</li>
                  <li>Conduct regular property inspections</li>
                  <li>Ensure adequate lighting in common areas</li>
                  <li>Install working fire alarms and extinguishers</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Guest Verification</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Verify guest identities before check-in</li>
                  <li>Review past reviews and ratings</li>
                  <li>Document the property condition before and after</li>
                  <li>Communicate clearly about house rules</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Report Safety Issues</h2>
            <p className="text-gray-600 mb-4">If you experience a safety concern, please contact our support team immediately at support@hostelfinder.com or use the in-app reporting feature.</p>
          </section>
        </div>
      </div>
      </div>
  );
}
