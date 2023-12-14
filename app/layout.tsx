import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NOOK - Your Space, Your Rules.',
  description:
    'Anonymity: A private haven for secure, anonymous conversations, where your privacy is the priority.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
