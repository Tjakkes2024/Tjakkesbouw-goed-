import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, Edit2, Library, Search, Filter, Wrench, Box, Package, Calculator, ArrowUpDown } from 'lucide-react';
import { ItemType } from '../types';
import { SamengesteldeHoofdstukken } from './SamengesteldeHoofdstukken';

export function Bibliotheek() {
  const { bibliotheekItems, addBibliotheekItem, updateBibliotheekItem, deleteBibliotheekItem } = useStore();
  const [activeTab, setActiveTab] = useState<'arbeid' | 'materiaal' | 'materieel' | 'samengesteld'>('arbeid');
  const [zoekterm, setZoekterm] = useState('');
  const [sorteerOp, setSorteerOp] = useState<'code' | 'naam' | 'prijs'>('code');
  const [sorteerRichting, setSorteerRichting] = useState<'asc' | 'desc'>('asc');
  const [nieuwItem, setNieuwItem] = useState({
    naam: '',
    eenheid: '',
    prijs: 0,
    leverancier: '',
    artikelcode: '',
    opmerkingen: '',
  });
  const [bewerkItem, setBewerkItem] = useState<any>(null);
  const [toonNieuwForm, setToonNieuwForm] = useState(false);

  const getTabIcon = (tab: 'arbeid' | 'materiaal' | 'materieel' | 'samengesteld') => {
    switch (tab) {
      case 'arbeid': return <Wrench className="w-5 h-5" />;
      case 'materiaal': return <Box className="w-5 h-5" />;
      case 'materieel': return <Package className="w-5 h-5" />;
      case 'samengesteld': return <Calculator className="w-5 h-5" />;
    }
  };

  const handleItemToevoegen = () => {
    if (nieuwItem.naam && nieuwItem.eenheid) {
      addBibliotheekItem({
        type: activeTab,
        naam: nieuwItem.naam,
        eenheid: nieuwItem.eenheid,
        prijs: nieuwItem.prijs,
        leverancier: nieuwItem.leverancier,
        artikelcode: nieuwItem.artikelcode,
        opmerkingen: nieuwItem.opmerkingen,
      });
      setNieuwItem({
        naam: '',
        eenheid: '',
        prijs: 0,
        leverancier: '',
        artikelcode: '',
        opmerkingen: '',
      });
      setToonNieuwForm(false);
    }
  };

  const handleVerwijderItem = (id: string) => {
    if (window.confirm('Weet u zeker dat u dit item wilt verwijderen?')) {
      deleteBibliotheekItem(id);
    }
  };

  const getFilteredAndSortedItems = () => {
    return bibliotheekItems
      .filter(item => 
        item.type === activeTab && 
        (item.naam.toLowerCase().includes(zoekterm.toLowerCase()) ||
         item.code.toLowerCase().includes(zoekterm.toLowerCase()))
      )
      .sort((a, b) => {
        const factor = sorteerRichting === 'asc' ? 1 : -1;
        switch (sorteerOp) {
          case 'code':
            return factor * a.code.localeCompare(b.code);
          case 'naam':
            return factor * a.naam.localeCompare(b.naam);
          case 'prijs':
            return factor * (a.prijs - b.prijs);
          default:
            return 0;
        }
      });
  };

  const handleSort = (veld: 'code' | 'naam' | 'prijs') => {
    if (sorteerOp === veld) {
      setSorteerRichting(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSorteerOp(veld);
      setSorteerRichting('asc');
    }
  };

  const renderSortIcon = (veld: 'code' | 'naam' | 'prijs') => {
    if (sorteerOp !== veld) return null;
    return (
      <ArrowUpDown 
        className={`inline-block ml-1 w-4 h-4 transform ${
          sorteerRichting === 'desc' ? 'rotate-180' : ''
        }`}
      />
    );
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header met tabs */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-red-100">
        <div className="flex space-x-4">
          {(['arbeid', 'materiaal', 'materieel', 'samengesteld'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
                activeTab === tab
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-red-600 hover:bg-red-50 border border-red-200'
              }`}
            >
              {getTabIcon(tab)}
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'samengesteld' ? (
        <SamengesteldeHoofdstukken onTabChange={setActiveTab} />
      ) : (
        <>
          {/* Acties */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-red-100">
            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={zoekterm}
                  onChange={(e) => setZoekterm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-red-200 focus:border-red-500 focus:ring-red-500"
                  placeholder="Zoek op code of naam..."
                />
              </div>
              <button
                onClick={() => setToonNieuwForm(true)}
                className="ml-4 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Plus className="mr-2" />
                Nieuw Item
              </button>
            </div>
          </div>

          {/* Items tabel */}
          <div className="bg-white rounded-lg shadow-lg border border-red-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-red-200">
                <thead className="bg-red-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => handleSort('code')}
                    >
                      <span className="text-sm font-medium text-red-700 uppercase tracking-wider flex items-center">
                        Code {renderSortIcon('code')}
                      </span>
                    </th>
                    <th 
                      className="px-6 py-3 text-left cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => handleSort('naam')}
                    >
                      <span className="text-sm font-medium text-red-700 uppercase tracking-wider flex items-center">
                        Naam {renderSortIcon('naam')}
                      </span>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <span className="text-sm font-medium text-red-700 uppercase tracking-wider">
                        Eenheid
                      </span>
                    </th>
                    <th 
                      className="px-6 py-3 text-right cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => handleSort('prijs')}
                    >
                      <span className="text-sm font-medium text-red-700 uppercase tracking-wider flex items-center justify-end">
                        Prijs {renderSortIcon('prijs')}
                      </span>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <span className="text-sm font-medium text-red-700 uppercase tracking-wider">
                        Leverancier
                      </span>
                    </th>
                    <th className="px-6 py-3 text-right">
                      <span className="text-sm font-medium text-red-700 uppercase tracking-wider">
                        Acties
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-200">
                  {getFilteredAndSortedItems().map((item) => (
                    <tr key={item.id} className="hover:bg-red-50">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{item.code}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.naam}</div>
                        {item.opmerkingen && (
                          <div className="text-sm text-gray-500">{item.opmerkingen}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.eenheid}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                        €{item.prijs.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{item.leverancier}</div>
                        {item.artikelcode && (
                          <div className="text-sm text-gray-500">Art.nr: {item.artikelcode}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setBewerkItem(item)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                            title="Bewerk item"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleVerwijderItem(item.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                            title="Verwijder item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Nieuw Item Modal */}
      {toonNieuwForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
            <h3 className="text-lg font-bold mb-4 text-red-800">Nieuw {activeTab} toevoegen</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Naam</label>
                <input
                  type="text"
                  value={nieuwItem.naam}
                  onChange={(e) => setNieuwItem({ ...nieuwItem, naam: e.target.value })}
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Voer naam in..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eenheid</label>
                <input
                  type="text"
                  value={nieuwItem.eenheid}
                  onChange={(e) => setNieuwItem({ ...nieuwItem, eenheid: e.target.value })}
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="bijv. uur, m², st"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prijs</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                  <input
                    type="number"
                    step="0.01"
                    value={nieuwItem.prijs}
                    onChange={(e) => setNieuwItem({ ...nieuwItem, prijs: Number(e.target.value) })}
                    className="w-full pl-8 rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leverancier</label>
                <input
                  type="text"
                  value={nieuwItem.leverancier}
                  onChange={(e) => setNieuwItem({ ...nieuwItem, leverancier: e.target.value })}
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Naam leverancier"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Artikelcode</label>
                <input
                  type="text"
                  value={nieuwItem.artikelcode}
                  onChange={(e) => setNieuwItem({ ...nieuwItem, artikelcode: e.target.value })}
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Optionele artikelcode"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opmerkingen</label>
                <input
                  type="text"
                  value={nieuwItem.opmerkingen}
                  onChange={(e) => setNieuwItem({ ...nieuwItem, opmerkingen: e.target.value })}
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Optionele opmerkingen"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setToonNieuwForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuleren
              </button>
              <button
                onClick={handleItemToevoegen}
                disabled={!nieuwItem.naam || !nieuwItem.eenheid}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Toevoegen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bewerk Modal */}
      {bewerkItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
            <h3 className="text-lg font-bold mb-4 text-red-800">Item Bewerken</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Naam</label>
                <input
                  type="text"
                  value={bewerkItem.naam}
                  onChange={(e) => setBewerkItem({ ...bewerkItem, naam: e.target.value })}
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eenheid</label>
                <input
                  type="text"
                  value={bewerkItem.eenheid}
                  onChange={(e) => setBewerkItem({ ...bewerkItem, eenheid: e.target.value })}
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prijs</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                  <input
                    type="number"
                    step="0.01"
                    value={bewerkItem.prijs}
                    onChange={(e) => setBewerkItem({ ...bewerkItem, prijs: Number(e.target.value) })}
                    className="w-full pl-8 rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leverancier</label>
                <input
                  type="text"
                  value={bewerkItem.leverancier}
                  onChange={(e) => setBewerkItem({ ...bewerkItem, leverancier: e.target.value })}
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Artikelcode</label>
                <input
                  type="text"
                  value={bewerkItem.artikelcode}
                  onChange={(e) => setBewerkItem({ ...bewerkItem, artikelcode: e.target.value })}
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opmerkingen</label>
                <input
                  type="text"
                  value={bewerkItem.opmerkingen}
                  onChange={(e) => setBewerkItem({ ...bewerkItem, opmerkingen: e.target.value })}
                  className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setBewerkItem(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuleren
              </button>
              <button
                onClick={() => {
                  updateBibliotheekItem(bewerkItem);
                  setBewerkItem(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}