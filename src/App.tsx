import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Bibliotheek } from './components/Bibliotheek';
import { KlantenBeheer } from './components/KlantenBeheer';
import { Calculatie } from './components/Calculatie';
import { OfferteOverzicht } from './components/OfferteOverzicht';
import { Login } from './components/Login';

function App() {
  const [activeTab, setActiveTab] = useState('calculatie');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="py-6">
        {activeTab === 'calculatie' && <Calculatie />}
        {activeTab === 'bibliotheek' && <Bibliotheek />}
        {activeTab === 'klanten' && <KlantenBeheer />}
        {activeTab === 'offertes' && <OfferteOverzicht />}
      </main>
    </div>
  );
}

export default App;