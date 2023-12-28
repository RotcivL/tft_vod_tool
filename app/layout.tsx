import type { Metadata } from 'next';
import { inter } from '@/app/ui/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'TFT Vod Tracker',
  description: `Follow and review your favourite streamers' vods`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col p-6">{children}</main>
      </body>
    </html>
  );
}

