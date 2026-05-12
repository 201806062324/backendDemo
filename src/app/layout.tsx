import Sidebar from '@/components/Sidebar';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js + Prisma + Supabase Template',
  description: 'Full-stack template with Next.js, TypeScript, Prisma, and Supabase',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <Sidebar />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
