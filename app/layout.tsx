import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'OnlineAcademy — Learn Without Limits',
    template: '%s | OnlineAcademy',
  },
  description:
    'World-class online learning platform with courses in Uzbek, Russian, and English.',
  keywords: ['online learning', 'courses', 'education', 'uzbek', 'academy'],
  openGraph: {
    type: 'website',
    siteName: 'OnlineAcademy',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
