"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { FullPageLoader } from "@repo/ui/loader";
import { Header, Footer } from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";


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
  const pathname = usePathname();

  // Hide Header/Footer on property detail pages, create listing, and auth pages
  const isPropertyDetail = pathname.startsWith("/listings/") && pathname.split("/").length > 2;
  const isCreateListing = pathname === "/listings/create";
  const isAuthPage = pathname.startsWith("/auth") || pathname.startsWith("/signup");

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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#22c55e" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap" />
        <script src="https://unpkg.com/@phosphor-icons/web"></script>
        <title>GIGS Rental - Find Your Perfect Student Housing</title>
        <meta name="description" content="GIGS Rental connects students with affordable co-sharing spaces and rental opportunities. Discover the perfect rental accommodation while studying." />
        <meta name="keywords" content="student housing, rental, co-sharing, accommodation, student housing rental, flat sharing" />
      </head>
      <body className="antialiased">
        <AuthProvider>
        {isLoading ? (
          <FullPageLoader
            size="lg"
            color="blue"
            message="Finding your perfect space..."
          />
        ) : (
          <>
          {!isPropertyDetail && !isCreateListing && !isAuthPage && <Header />}
          {children}
          {!isPropertyDetail && !isCreateListing && !isAuthPage && <Footer />}
          </>
        )}
        </AuthProvider>
      </body>
    </html>
  );
}
