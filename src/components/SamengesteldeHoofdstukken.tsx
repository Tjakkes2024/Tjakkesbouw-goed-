import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, Edit2, FolderPlus, ChevronDown, ChevronRight } from 'lucide-react';
import { BibliotheekSelector } from './BibliotheekSelector';

interface SamengesteldeHoofdstukkenProps {
  onTabChange?: (tab: 'arbeid' | 'materiaal' | 'materieel' | 'samengesteld') => void;
}

export function SamengesteldeHoofdstukken({ onTabChange }: SamengesteldeHoofdstukkenProps) {
  const { samengesteldeHoofdstukken, bibliotheekItems, addSamengesteldHoofdstuk, updateSamengesteldHoofdstuk, deleteSamengesteldHoofdstuk } = useStore();
  const [toonBibliotheekSelector, setToonBibliotheekSelector] = useState(false);
  const [geselecteerdHoofdstukId, setGeselecteerdHoofdstukId] = useState<string | null>(null);
  const [geselecteerdOnderdeelId, setGeselecteerdOnderdeelId] = useState<string | null>(null);
  const [nieuwHoofdstuk, setNieuwHoofdstuk] = useState(false);
  const [nieuweHoofdstukNaam, setNieuweHoofdstukNaam] = useState('');
  const [openOnderdelen, setOpenOnderdelen] = useState<string[]>([]);
  const [openHoofdstukken, setOpenHoofdstukken] = useState<string[]>([]);

  const handleNieuwHoofdstuk = () => {
    if (nieuweHoofdstukNaam.trim()) {
      const hoofdstukId = Date.now().toString();
      addSamengesteldHoofdstuk({
        naam: nieuweHoofdstukNaam,
        onderdelen: [],
      });
      setNieuweHoofdstukNaam('');
      setNieuwHoofdstuk(false);
      setOpenHoofdstukken(prev => [...prev, hoofdstukId]);
    }
  };

  const handleNieuwOnderdeel = (hoofdstukId: string) => {
    const hoofdstuk = samengesteldeHoofdstukken.find(h => h.id === hoofdstukId);
    if (hoofdstuk) {
      const onderdeelId = Date.now().toString();
      updateSamengesteldHoofdstuk({
        ...hoofdstuk,
        onderdelen: [
          ...hoofdstuk.onderdelen,
          {
            id: onderdeelId,
            naam: 'Nieuw Onderdeel',
            regels: [],
          },
        ],
      });
      setOpenOnderdelen(prev => [...prev, onderdeelId]);
    }
  };

  const handleOnderdeelNaamWijzigen = (hoofdstuk: any, onderdeel: any, nieuweNaam: string) => {
    const nieuweOnderdelen = hoofdstuk.onderdelen.map((o: any) =>
      o.id === onderdeel.id ? { ...o, naam: nieuweNaam } : o
    );
    updateSamengesteldHoofdstuk({
      ...hoofdstuk,
      onderdelen: nieuweOnderdelen,
    });
  };

  const handleVerwijderHoofdstuk = (id: string) => {
    if (window.confirm('Weet u zeker dat u dit hoofdstuk wilt verwijderen?')) {
      deleteSamengesteldHoofdstuk(id);
      setOpenHoofdstukken(prev => prev.filter(hId => hId !== id));
    }
  };

  const handleVerwijderOnderdeel = (hoofdstuk: any, onderdeelId: string) => {
    if (window.confirm('Weet u zeker dat u dit onderdeel wilt verwijderen?')) {
      updateSamengesteldHoofdstuk({
        ...hoofdstuk,
        onderdelen: hoofdstuk.onderdelen.filter((o: any) => o.id !== onderdeelId),
      });
      setOpenOnderdelen(prev => prev.filter(oId => oId !== onderdeelId));
    }
  };

  const handleVerwijderRegel = (hoofdstuk: any, onderdeelId: string, regelId: string) => {
    const nieuweOnderdelen = hoofdstuk.onderdelen.map((onderdeel: any) => {
      if (onderdeel.id === onderdeelId) {
        return {
          ...onderdeel,
          regels: onderdeel.regels.filter((regel: any) => regel.id !== regelId),
        };
      }
      return onderdeel;
    });

    updateSamengesteldHoofdstuk({
      ...hoofdstuk,
      onderdelen: nieuweOnderdelen,
    });
  };

  const handleRegelsToevoegen = (items: Array<{ regelId: string; aantal: number; id: string }>) => {
    const hoofdstuk = samengesteldeHoofdstukken.find(h => h.id === geselecteerdHoofdstukId);
    if (!hoofdstuk) return;

    const nieuweOnderdelen = hoofdstuk.onderdelen.map(onderdeel => {
      if (onderdeel.id === geselecteerdOnderdeelId) {
        return {
          ...onderdeel,
          regels: [...onderdeel.regels, ...items],
        };
      }
      return onderdeel;
    });

    updateSamengesteldHoofdstuk({
      ...hoofdstuk,
      onderdelen: nieuweOnderdelen,
    });

    setToonBibliotheekSelector(false);
    setGeselecteerdHoofdstukId(null);
    setGeselecteerdOnderdeelId(null);
  };

  const toggleOnderdeel = (onderdeelId: string) => {
    setOpenOnderdelen(prev =>
      prev.includes(onderdeelId)
        ? prev.filter(id => id !== onderdeelId)
        : [...prev, onderdeelId]
    );
  };

  const toggleHoofdstuk = (hoofdstukId: string) => {
    setOpenHoofdstukken(prev =>
      prev.includes(hoofdstukId)
        ? prev.filter(id => id !== hoofdstukId)
        : [...prev, hoofdstukId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-red-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-red-800">Samengestelde Hoofdstukken</h2>
          <button
            onClick={() => setNieuwHoofdstuk(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nieuw Hoofdstuk
          </button>
        </div>
      </div>

      {/* Hoofdstukken */}
      <div className="space-y-4">
        {samengesteldeHoofdstukken.map((hoofdstuk) => {
          const isOpen = openHoofdstukken.includes(hoofdstuk.id);
          return (
            <div key={hoofdstuk.id} className="bg-white rounded-lg shadow-lg border border-red-100">
              <div 
                className="p-4 bg-red-50 border-b border-red-100 flex justify-between items-center cursor-pointer hover:bg-red-100"
                onClick={() => toggleHoofdstuk(hoofdstuk.id)}
              >
                <div className="flex items-center">
                  {isOpen ? <ChevronDown size={20} className="text-red-600 mr-2" /> : <ChevronRight size={20} className="text-red-600 mr-2" />}
                  <h3 className="text-lg font-semibold text-red-800">{hoofdstuk.naam}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNieuwOnderdeel(hoofdstuk.id);
                    }}
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100"
                    title="Nieuw onderdeel"
                  >
                    <FolderPlus size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerwijderHoofdstuk(hoofdstuk.id);
                    }}
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100"
                    title="Verwijder hoofdstuk"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="p-4 space-y-4">
                  {hoofdstuk.onderdelen.map((onderdeel) => {
                    const isOnderdeelOpen = openOnderdelen.includes(onderdeel.id);
                    return (
                      <div key={onderdeel.id} className="border border-red-100 rounded-lg">
                        <div className="bg-red-50 p-3 flex items-center justify-between">
                          <div className="flex items-center flex-1">
                            <button
                              onClick={() => toggleOnderdeel(onderdeel.id)}
                              className="mr-2 text-red-600 hover:text-red-800"
                            >
                              {isOnderdeelOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </button>
                            <input
                              type="text"
                              value={onderdeel.naam}
                              onChange={(e) => handleOnderdeelNaamWijzigen(hoofdstuk, onderdeel, e.target.value)}
                              className="font-medium text-red-800 bg-transparent border-none focus:ring-0 focus:outline-none hover:bg-white px-2 py-1 rounded flex-1"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setGeselecteerdHoofdstukId(hoofdstuk.id);
                                setGeselecteerdOnderdeelId(onderdeel.id);
                                setToonBibliotheekSelector(true);
                              }}
                              className="text-red-600 hover:text-red-800 flex items-center"
                            >
                              <Plus size={18} className="mr-1" />
                              <span>Regels Toevoegen</span>
                            </button>
                            <button
                              onClick={() => handleVerwijderOnderdeel(hoofdstuk, onderdeel.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {isOnderdeelOpen && onderdeel.regels.length > 0 && (
                          <div className="p-4">
                            <table className="min-w-full divide-y divide-red-200">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">Code</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">Naam</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-red-700 uppercase">Type</th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-red-700 uppercase">Aantal</th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-red-700 uppercase">Prijs</th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-red-700 uppercase">Acties</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-red-100">
                                {onderdeel.regels.map((regel) => {
                                  const item = bibliotheekItems.find(i => i.id === regel.regelId);
                                  if (!item) return null;

                                  return (
                                    <tr key={regel.id} className="hover:bg-red-50">
                                      <td className="px-4 py-2 whitespace-nowrap font-mono text-sm">{item.code}</td>
                                      <td className="px-4 py-2 whitespace-nowrap">{item.naam}</td>
                                      <td className="px-4 py-2 whitespace-nowrap capitalize">{item.type}</td>
                                      <td className="px-4 py-2 whitespace-nowrap text-right">{regel.aantal}</td>
                                      <td className="px-4 py-2 whitespace-nowrap text-right">€{item.prijs.toFixed(2)}</td>
                                      <td className="px-4 py-2 whitespace-nowrap text-right">
                                        <button
                                          onClick={() => handleVerwijderRegel(hoofdstuk, onderdeel.id, regel.id)}
                                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nieuw Hoofdstuk Modal */}
      {nieuwHoofdstuk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-red-800">Nieuw Hoofdstuk</h3>
            <input
              type="text"
              value={nieuweHoofdstukNaam}
              onChange={(e) => setNieuweHoofdstukNaam(e.target.value)}
              className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 mb-4"
              placeholder="Voer hoofdstuk naam in..."
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setNieuwHoofdstuk(false);
                  setNieuweHoofdstukNaam('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Annuleren
              </button>
              <button
                onClick={handleNieuwHoofdstuk}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hoofdstuk Aanmaken
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BibliotheekSelector Modal */}
      {toonBibliotheekSelector && (
        <BibliotheekSelector
          onItemsSelect={handleRegelsToevoegen}
          onClose={() => {
            setToonBibliotheekSelector(false);
            setGeselecteerdHoofdstukId(null);
            setGeselecteerdOnderdeelId(null);
          }}
          showChapterSelection={false}
          multiSelect={true}
        />
      )}
    </div>
  );
}