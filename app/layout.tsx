import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "SQUEEK PENALTY · Tiny paws. Big pressure.",
  description:
    "A tiny hamster. A massive moment. Play a fast, animated 1v1 penalty shootout. Practice for free, pick a direction, and go for the rematch.",
  icons: { icon: "./favicon.svg" },
  openGraph: {
    title: "SQUEEK PENALTY",
    description: "Tiny paws. Big pressure. The hamster penalty shootout.",
  },
  twitter: { card: "summary_large_image", title: "SQUEEK PENALTY" },
};
// Lets the page use the full screen on phones with notches, and colours the browser bar.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1220",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <style>{`@font-face{font-family:Outfit;src:url('./fonts/outfit-latin.woff2') format('woff2');font-style:normal;font-weight:100 900;font-display:swap}`}</style>
        <meta property="og:image" content="./og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="./og-image.png" />
        <meta name="squeekchain-project" content="4a43879b-dbde-43c9-a68a-971df70faa3b"/>
      </head>
      <body>{children}</body>
    </html>
  );
}