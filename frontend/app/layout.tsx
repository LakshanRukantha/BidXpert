import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SidebarComponent from "@/components/sidebar";

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
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarComponent>{children}</SidebarComponent>
        </ThemeProvider>
      </body>
    </html>
  );
}