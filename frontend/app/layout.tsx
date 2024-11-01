import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SidebarComponent from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/lib/AuthProvider";
import { EdgeStoreProvider } from "@/lib/edgestore";

export const metadata: Metadata = {
  title: "BidXpert | Smart & Efficient Online Bidding Platform",
  description: "Smart & Efficient Online Bidding Platform in Sri Lanka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarComponent>{children}</SidebarComponent>
              <Toaster />
            </ThemeProvider>
          </EdgeStoreProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
