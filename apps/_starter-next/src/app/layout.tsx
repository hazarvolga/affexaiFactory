import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'affex starter-next',
  description: 'Reference Next.js app for the affex Engineering OS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-canvas text-primary font-sans antialiased">{children}</body>
    </html>
  );
}
