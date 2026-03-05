"use client";

import localFont from "next/font/local";
import { useEffect, useState } from "react";
import "./globals.css";
import { FullPageLoader } from "@repo/ui/loader";


// Note: Metadata export doesn't work with "use client", consider creating a separate metadata file
// export const metadata: Metadata = {
//   title: "GIGS Rental - Find Your Perfect Student Housing",
//   description: "GIGS Rental connects students with affordable co-sharing spaces and rental opportunities. Discover the perfect place to live while studying.",
//   keywords: ["student housing", "rental", "co-sharing", "accommodation", "student housing rental"],
//   authors: [{ name: "GIGS Rental Team" }],
//   openGraph: {
//     title: "GIGS Rental - Find Your Perfect Student Housing",
//     description: "Connect with students and find affordable co-sharing spaces",
//     type: "website",
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading on initial mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust duration as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap" />
        <script src="https://unpkg.com/@phosphor-icons/web"></script>
        <title>GIGS Rental - Find Your Perfect Student Housing</title>
        <meta name="description" content="GIGS Rental connects students with affordable co-sharing spaces and rental opportunities. Discover the perfect rental accommodation while studying." />
        <meta name="keywords" content="student housing, rental, co-sharing, accommodation, student housing rental, flat sharing" />
      </head>
      <body className="antialiased">
        {isLoading ? (
          <FullPageLoader
            size="lg"
            color="blue"
            message="Finding your perfect space..."
          />
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}
