import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ORG } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://maryjoyethiopia.org"),
  title: {
    default: "Mary Joy Ethiopia",
    template: "%s",
  },
  description: ORG.description,
  icons: {
    icon: [
      { url: "/uploads/2024/05/cropped-cropped-logo-1-1-64x64.png", sizes: "32x32" },
      { url: "/uploads/2024/05/cropped-cropped-logo-1-1-300x300.png", sizes: "192x192" },
    ],
    apple: "/uploads/2024/05/cropped-cropped-logo-1-1-300x300.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
