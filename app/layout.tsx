
import { Inter } from 'next/font/google';
import './globals.css';
import Provider from './components/Provider';


const inter = Inter({ subsets: ['latin'] });

// Removed metadata export as it's not allowed in a 'use client' component.
// export const metadata = {
//   title: 'Kointos',
//   description: 'Your crypto portfolio tracker',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 

  return (
    <html lang="en" >
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
