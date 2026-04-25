import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'affex starter-next',
  description: 'Reference Next.js app for the affex Engineering OS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#fafafa',
          color: '#09090b',
        }}
      >
        {children}
      </body>
    </html>
  );
}
