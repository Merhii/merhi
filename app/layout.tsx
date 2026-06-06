import type { Metadata } from "next";
import { FadePet } from "@/components/FadePet";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karim Merhi | Software Engineer",
  description:
    "Karim Merhi's software engineering portfolio, projects, and technical profile.",
  openGraph: {
    title: "Karim Merhi | Software Engineer",
    description:
      "Java, SQL, side projects, and suspicious amounts of coffee.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <FadePet />
      </body>
    </html>
  );
}
