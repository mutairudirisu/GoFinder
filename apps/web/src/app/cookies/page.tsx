function Cookies() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-16">
      <h1 className="text-4xl md:text-6xl font-bold text-neutral-dark text-center">Cookies Policy</h1>
      <p className="mt-2 text-center text-sm text-gray-500">Last Updated: March 11, 2026</p>
      <div className="prose prose-neutral max-w-3xl mt-8 text-base leading-relaxed">
        <div className="space-y-6">
          <section>
            <h2>What Are Cookies?</h2>
            <p className="mt-2">
              Cookies are small text files that are placed on your device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
            </p>
          </section>

          <section>
            <h2>How We Use Cookies</h2>
            <p className="mt-2">
              Hostel Finder uses cookies and similar tracking technologies for a variety of purposes, including:
            </p>
            <ul className="list-disc list-inside ml-6 space-y-2">
              <li>Remembering your preferences and settings</li>
              <li>Keeping you logged in and securing your account</li>
              <li>Analyzing how our site is used so we can improve performance and UX</li>
              <li>Delivering personalized content and ads when you consent</li>
            </ul>
            <p className="mt-2">
              We may also use cookies provided by third-party service providers such as analytics and advertising partners.
            </p>
          </section>

          <section>
            <h2>Types of Cookies</h2>
            <ul className="list-disc list-inside ml-6 space-y-2 mt-2">
              <li><strong>Essential cookies:</strong> necessary for the operation of the site.</li>
              <li><strong>Performance cookies:</strong> help us understand how visitors interact with the site.</li>
              <li><strong>Functional cookies:</strong> enable enhanced functionality and personalization.</li>
              <li><strong>Advertising cookies:</strong> used to deliver relevant ads and measure ad effectiveness.</li>
            </ul>
          </section>

          <section>
            <h2>Managing Cookies</h2>
            <p className="mt-2">
              You can control and/or delete cookies as you wish – for details, see aboutcookies.org. You can delete all cookies that are already on your device and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p className="mt-2">
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <p>
              Hostel Finder<br />
              Lagos, Nigeria<br />
              Email: <a href="mailto:privacy@hostelfinder.com" className="text-orange-500 hover:underline">privacy@hostelfinder.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Cookies;
