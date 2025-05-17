
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="py-4 bg-black/40 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-bitcoin rounded-full flex items-center justify-center">
              <span className="font-bold">₿</span>
            </div>
            <h1 className="text-xl font-extrabold pixel-text bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
              Sats Race to Riches
            </h1>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pt-6 pb-12">
        {children}
      </main>
      
      <footer className="py-4 bg-black/40 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>Earn Bitcoin Sats rewards by being the fastest tapper!</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
