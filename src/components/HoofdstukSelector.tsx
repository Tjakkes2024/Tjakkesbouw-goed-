import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, Check, ChevronDown, ChevronRight } from 'lucide-react';

interface HoofdstukSelectorProps {
  onHoofdstukToevoegen: (hoofdstuk: any) => void;
  onClose: () => void;
}

export function HoofdstukSelector({ onClose, onHoofdstukToevoegen }: HoofdstukSelectorProps) {
  const { samengesteldeHoofdstukken, bibliotheekItems } = useStore();
  const [geselecteerdHoofdstuk, setGeselecteerdHoofdstuk] = useState<string>('');
  const [geselecteerdeRegels, setGeselecteerdeRegels] = useState<Array<{
    regelId: string;
    aantal: number;
    onderdeel: string;
  }>>([]);
  const [zoekterm, setZoekterm] = useState('');
  const [openOnderdelen, setOpenOnderdelen] = useState<string[]>([]);

  const hoofdstuk = samengesteldeHoofdstukken.find(h => h.id === geselecteerdHoofdstuk);

  const toggleOnderdeel = (onderdeelId: string) => {
    setOpenOnderdelen(prev =>
      prev.includes(onderdeelId)
        ? prev.filter(id => id !== onderdeelId)
        : [...prev, onderdeelId]
    );
  };

  const toggleSelectRegel = (regelId: string, aantal: number = 1, onderdeel: string) => {
    setGeselecteerdeRegels(prev => {
      const bestaand = prev.find(r => r.regelId === regelId);
      if (bestaand) {
        return prev.filter(r => r.regelId !== regelId);
      }
      return [...prev, { regelId, aantal, onderdeel }];
    });
  };

  const updateRegelAantal = (regelId: string, aantal: number) => {
    setGeselecteerdeRegels(prev =>
      prev.map(regel =>
        regel.regelId === regelId ? { ...regel, aantal } : regel
      )
    );
  };

  const handleToevoegen = () => {
    if (!hoofdstuk || geselecteerdeRegels.length === 0) return;

    onHoofdstukToevoegen({
      naam: hoofdstuk.naam,
      regels: geselecteerdeRegels.map(({ regelId, aantal, onderdeel }) => ({
        regelId,
        aantal,
        hoofdstuk: `${hoofdstuk.naam} - ${onderdeel}`,
      })),
      type: 'samengesteld',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-800">Hoofdstuk Toevoegen</h2>

          {/* Hoofdstuk selectie */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecteer Hoofdstuk
            </label>
            <select
              value={geselecteerdHoofdstuk}
              onChange={(e) => setGeselecteerdHoofdstuk(e.target.value)}
              className="w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="">Kies een hoofdstuk...</option>
              {samengesteldeHoofdstukken.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.naam}
                </option>
              ))}
            </select>
          </div>

          {hoofdstuk && (
            <>
              {/* Zoekbalk */}
              <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={zoekterm}
                  onChange={(e) => setZoekterm(e.target.value)}
                  className="block w-full pl-10 rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Zoek op naam of code..."
                />
              </div>

              {/* Onderdelen en regels */}
              <div className="space-y-4">
                {hoofdstuk.onderdelen.map(onderdeel => {
                  const isOpen = openOnderdelen.includes(onderdeel.id);
                  const filteredRegels = onderdeel.regels.filter(regel => {
                    const item = bibliotheekItems.find(bi => bi.id === regel.regelId);
                    if (!item) return false;
                    return (
                      item.naam.toLowerCase().includes(zoekterm.toLowerCase()) ||
                      item.code.toLowerCase().includes(zoekterm.toLowerCase())
                    );
                  });

                  if (zoekterm && filteredRegels.length === 0) return null;

                  return (
                    <div key={onderdeel.id} className="border border-red-100 rounded-lg">
                      <button
                        onClick={() => toggleOnderdeel(onderdeel.id)}
                        className="w-full px-4 py-2 text-left flex items-center justify-between bg-red-50 rounded-t-lg hover:bg-red-100"
                      >
                        <span className="font-medium text-red-800">{onderdeel.naam}</span>
                        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>

                      {isOpen && (
                        <div className="p-4">
                          <table className="min-w-full">
                            <thead className="bg-red-50">
                              <tr>
                                <th className="px-4 py-2 text-left">Code</th>
                                <th className="px-4 py-2 text-left">Type</th>
                                <th className="px-4 py-2 text-left">Naam</th>
                                <th className="px-4 py-2 text-left">Eenheid</th>
                                <th className="px-4 py-2 text-right">Prijs</th>
                                <th className="px-4 py-2 text-center">Aantal</th>
                                <th className="px-4 py-2 text-center">Selecteer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredRegels.map(regel => {
                                const item = bibliotheekItems.find(bi => bi.id === regel.regelId);
                                if (!item) return null;

                                const geselecteerd = geselecteerdeRegels.find(
                                  gr => gr.regelId === regel.regelId
                                );

                                return (
                                  <tr key={regel.id} className="hover:bg-red-50 border-t border-red-100">
                                    <td className="px-4 py-2 font-mono text-sm">{item.code}</td>
                                    <td className="px-4 py-2 capitalize">{item.type}</td>
                                    <td className="px-4 py-2">{item.naam}</td>
                                    <td className="px-4 py-2">{item.eenheid}</td>
                                    <td className="px-4 py-2 text-right">€{item.prijs.toFixed(2)}</td>
                                    <td className="px-4 py-2">
                                      {geselecteerd && (
                                        <input
                                          type="number"
                                          min="1"
                                          value={geselecteerd.aantal}
                                          onChange={(e) =>
                                            updateRegelAantal(regel.regelId, Number(e.target.value))
                                          }
                                          className="w-20 rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500 mx-auto block"
                                        />
                                      )}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                      <button
                                        onClick={() => toggleSelectRegel(regel.regelId, regel.aantal, onderdeel.naam)}
                                        className={`w-6 h-6 rounded ${
                                          geselecteerd 
                                            ? 'bg-red-600 text-white hover:bg-red-700' 
                                            : 'border border-red-300 text-transparent hover:border-red-400'
                                        } flex items-center justify-center transition-colors`}
                                      >
                                        <Check size={16} className={geselecteerd ? 'opacity-100' : 'opacity-0'} />
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {geselecteerdeRegels.length} {geselecteerdeRegels.length === 1 ? 'regel' : 'regels'} geselecteerd
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Annuleren
            </button>
            <button
              onClick={handleToevoegen}
              disabled={!hoofdstuk || geselecteerdeRegels.length === 0}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Toevoegen aan Calculatie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}