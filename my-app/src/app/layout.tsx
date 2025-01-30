"use client"
import "./globals.css";
import AdComponent from './components/AdComponent'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <AdComponent />
      </body>
    </html>
  );
}
