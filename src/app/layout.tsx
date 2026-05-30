import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Die Holy Trinity Matrix | Atzig, Mausig, Fotzig Quiz",
  description: "Mach den BFI-20 psychometrischen Test und entdecke dein wahres Ich. Bist du Atzig, Mausig oder Fotzig?",
  openGraph: {
    title: "Die Holy Trinity Matrix | Atzig, Mausig, Fotzig Quiz",
    description: "Mach den BFI-20 psychometrischen Test und entdecke dein wahres Ich. Bist du Atzig, Mausig oder Fotzig?",
    type: "website",
    locale: "de_DE",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 1024,
        alt: "Die Holy Trinity Matrix",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full scroll-smooth antialiased">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} min-h-full flex flex-col font-sans`}>
        {children}
      </body>
    </html>
  );
}
