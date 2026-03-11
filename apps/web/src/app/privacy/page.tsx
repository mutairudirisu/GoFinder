function Privacy() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-16">
      <h1 className="text-4xl md:text-6xl font-bold text-neutral-dark text-center">Privacy Policy</h1>
      <p className="mt-2 text-center text-sm text-gray-500">Last Updated: March 11, 2026</p>
      <div className="prose prose-neutral max-w-3xl mt-8 text-base leading-relaxed">
        <div className="space-y-6">

          <section>
            <h2>Introduction</h2>
            <p className="mt-2">
              At Hostel Finder, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services to search, discover, and book hostel and short-stay rental spaces across Nigeria and beyond.
            </p>
          </section>

          <section>
            <h2>Information We Collect</h2>
            <p className="mt-2">
              We may collect information about you in a variety of ways. The information we may collect includes:
            </p>
            <ul className="list-disc list-inside ml-6 space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, phone number, date of birth, and other contact or identity information you provide during registration or booking</li>
              <li><strong>Listing & Rental Data:</strong> Information you submit when listing a property, including address, photos, pricing, and availability</li>
              <li><strong>Payment Data:</strong> Billing details, transaction history, and payment method information processed securely through our payment partners</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our website and services, including searches, saved listings, and booking history</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and analytics data collected automatically when you use our platform</li>
            </ul>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <p className="mt-2">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside ml-6 space-y-2">
              <li>Provide, operate, and maintain our hostel listing and booking services</li>
              <li>Facilitate secure connections between renters and property hosts</li>
              <li>Process your bookings, payments, and reservations</li>
              <li>Verify the identity of users and hosts to maintain platform trust and safety</li>
              <li>Improve, personalize, and expand our services based on user behaviour</li>
              <li>Communicate with you about bookings, updates, and promotional offers</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Analyze usage patterns and improve overall user experience</li>
              <li>Comply with applicable legal and regulatory obligations</li>
            </ul>
          </section>

          <section>
            <h2>Sharing Your Information</h2>
            <p className="mt-2">
              We do not sell your personal information to third parties. We may share your data in the following limited circumstances:
            </p>
            <ul className="list-disc list-inside ml-6 space-y-2">
              <li><strong>With Hosts or Renters:</strong> Relevant booking information is shared between parties to facilitate a reservation</li>
              <li><strong>With Service Providers:</strong> Trusted third-party vendors who assist in operating our platform, such as payment processors and cloud hosting providers</li>
              <li><strong>For Legal Compliance:</strong> When required by law, court order, or governmental authority</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction</li>
            </ul>
          </section>

          <section>
            <h2>Cookies & Tracking Technologies</h2>
            <p className="mt-2">
              Hostel Finder uses cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser at any time. Disabling cookies may affect certain features of our platform. For a more detailed explanation, see our <a href="/cookies" className="text-orange-500 hover:underline">Cookies Policy</a>.
            </p>
          </section>

          <section>
            <h2>Data Retention</h2>
            <p className="mt-2">
              We retain your personal information for as long as your account is active or as needed to provide our services. You may request deletion of your account and associated data at any time, subject to any legal obligations that require us to retain certain records.
            </p>
          </section>

          <section>
            <h2>Data Security</h2>
            <p className="mt-2">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted using industry-standard SSL technology. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2>Your Rights</h2>
            <p className="mt-2">
              You have the right to:
            </p>
            <ul className="list-disc list-inside ml-6 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict processing of your personal information</li>
              <li>Request a portable copy of your data</li>
              <li>Withdraw consent at any time where processing is based on consent</li>
            </ul>
          </section>

          <section>
            <h2>Children's Privacy</h2>
            <p className="mt-2">
              Hostel Finder is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a child has provided us with personal data, we will take steps to delete such information promptly.
            </p>
          </section>

          <section>
            <h2>Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new policy on this page with an updated date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p className="mt-2">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p>
              Hostel Finder<br />
              Lagos, Nigeria<br />
              Email: <a href="mailto:privacy@hostelfinder.com" className="text-orange-500 hover:underline">privacy@hostelfinder.com</a><br />
              Phone: +234 800 000 0000
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Privacy Policy | Hostel Finder',
};

export default Privacy;