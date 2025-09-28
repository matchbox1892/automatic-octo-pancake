import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Header from '../components/Header';
import MainMenu from '../components/MainMenu';
import OverlayMask from '../components/OverlayMask';
import Banner from '../components/Banner';

export const metadata: Metadata = {
  title: 'SOAP Narrative Studio',
  description: 'Modernized interface for composing EMS SOAP narratives'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <OverlayMask />
        <main>
          <div className="nav-layout">
            <div style={{ gridArea: 'banner' }}>
              <Banner variant="page" />
            </div>
            <aside style={{ gridArea: 'menu' }}>
              <MainMenu />
            </aside>
            <section style={{ gridArea: 'content' }}>{children}</section>
          </div>
        </main>
      </body>
    </html>
  );
}
