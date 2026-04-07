import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { MessageProvider } from "@/context/MessageContext";
import { AdminRouteGuard } from "@/components/auth/AdminRouteGuard";
import { ToastProvider } from "@repo/ui/toast";

export const metadata: Metadata = {
  title: "GIGS Rentals - Student Housing Platform",
  description: "Find your perfect student housing, list your properties, connect with roommates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#22c55e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <script src="https://unpkg.com/@phosphor-icons/web"></script>
      </head>
      <body className="antialiased font-sans">
        <AuthProvider>
          <MessageProvider>
            <ToastProvider>
              <AdminRouteGuard>{children}</AdminRouteGuard>
            </ToastProvider>
          </MessageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
