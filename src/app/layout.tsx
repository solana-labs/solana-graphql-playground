import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    description: 'Solana RPC-GraphQL Playground',
    title: 'Solana GraphQL Playground',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="flex flex-col w-full h-screen divide-y divide-slate-300">
                    <h1 className="px-5 py-4 text-xl font-title-font text-transparent bg-clip-text bg-white">
                        Solana GraphQL Playground
                    </h1>
                    <div className="grow">{children}</div>
                </main>
            </body>
        </html>
    );
}
