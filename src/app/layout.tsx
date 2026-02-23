import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'GreenGrocer - Fresh From Farm',
  description: 'Premium fresh groceries delivered to your door',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body bg-white text-gray-900 antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1B5E20',
                color: '#fff',
                borderRadius: '12px',
                fontFamily: 'DM Sans, sans-serif',
              },
              success: { iconTheme: { primary: '#A5D6A7', secondary: '#1B5E20' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
