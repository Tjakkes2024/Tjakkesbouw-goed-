import React from 'react';
import { Calculator, Library, Users, FileText } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <nav className="bg-red-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex space-x-6">
          <button
            onClick={() => handleTabChange('calculatie')}
            className={`flex items-center space-x-2 ${
              activeTab === 'calculatie' ? 'text-white font-bold' : 'hover:text-red-200'
            }`}
          >
            <Calculator size={20} />
            <span>Calculatie</span>
          </button>
          <button
            onClick={() => handleTabChange('bibliotheek')}
            className={`flex items-center space-x-2 ${
              activeTab === 'bibliotheek' ? 'text-white font-bold' : 'hover:text-red-200'
            }`}
          >
            <Library size={20} />
            <span>Bibliotheek</span>
          </button>
          <button
            onClick={() => handleTabChange('klanten')}
            className={`flex items-center space-x-2 ${
              activeTab === 'klanten' ? 'text-white font-bold' : 'hover:text-red-200'
            }`}
          >
            <Users size={20} />
            <span>Klanten</span>
          </button>
          <button
            onClick={() => handleTabChange('offertes')}
            className={`flex items-center space-x-2 ${
              activeTab === 'offertes' ? 'text-white font-bold' : 'hover:text-red-200'
            }`}
          >
            <FileText size={20} />
            <span>Offertes</span>
          </button>
        </div>
      </div>
    </nav>
  );
}