import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import { getCurrentSession } from '@/actions/auth';
import { SanityLive } from '@/sanity/lib/live';
import HeaderCategorySelector from '@/components/layout/HeaderCategorySelector';
import Cart from '@/components/cart/Cart';
import Script from 'next/script';
import { Suspense } from 'react';
import AnalyticsTracker from '@/components/layout/AnalyticsTracker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Affinity Store',
    description: 'Shop your heart out!',
};

const RootLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { user } = await getCurrentSession();

    return (
        <html lang='en'>
            <body className={`${inter.className} antialiased bg-white min-h-[125vh]`}>
                <Header 
                    user={user}
                    categorySelector={<HeaderCategorySelector />}
                />
                <Script
                    src='https://cloud.umami.is/script.js'
                    data-website-id='e6e9c133-5635-4466-b7d9-f9b650c28aed'
                    strategy='beforeInteractive'
                />

                <Suspense>
                    <AnalyticsTracker
                        user={user}
                    />
                </Suspense>

                {children}

                <Cart />
                <SanityLive />
            </body>
        </html>
    );
};

export default RootLayout;