import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bell EQ — Frequency Response Visualizer',
  description: 'Interactive peaking biquad frequency response visualizer for Gen/Gen~.',
  openGraph: {
    title: 'Bell EQ — Frequency Response Visualizer',
    description: 'Shape a peaking biquad and watch its frequency response move in real time.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Bell EQ Frequency Response Visualizer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bell EQ — Frequency Response Visualizer',
    description: 'Shape a peaking biquad and watch its frequency response move in real time.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
