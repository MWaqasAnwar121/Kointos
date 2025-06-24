import { Inter } from 'next/font/google';
import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import Provider from './components/Provider';
import './globals.css';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Your App",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 

  return (
    <html lang="en" >
      <body>
        <Provider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
