import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, Edit2, Save, Settings } from 'lucide-react';
import { BibliotheekSelector } from './BibliotheekSelector';
import { HoofdstukSelector } from './HoofdstukSelector';
import { NieuweCalculatie } from './NieuweCalculatie';
import { RegelSelector } from './RegelSelector';
import { CalculatieStatus } from '../types';

export function Calculatie() {
  const { calculaties, klanten, addCalculatie, updateCalculatie, deleteCalculatie, bibliotheekItems } = useStore();
  const [toonBibliotheekSelector, setToonBibliotheekSelector] = useState(false);
  const [toonHoofdstukSelector, setToonHoofdstukSelector] = useState(false);
  const [toonNieuweCalculatie, setToonNieuweCalculatie] = useState(false);
  const [selectedRegels, setSelectedRegels] = useState<Array<{
    regelId: string;
    aantal: number;
    hoofdstuk: string;
    id: string;
  }>>([]);
  const [projectDetails, setProjectDetails] = useState({
    projectNaam: '',
    projectLocatie: '',
    projectOmschrijving: '',
    klantId: '',
    winstRisicoPercentage: 10,
    btwPercentage: 21,
  });
  const [bewerkCalculatie, setBewerkCalculatie] = useState<string | null>(null);

  const handleLosseRegelToevoegen = (regelId: string, aantal: number, hoofdstuk: string) => {
    const uniqueId = `${regelId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSelectedRegels(prev => [...prev, { regelId, aantal, hoofdstuk, id: uniqueId }]);
  };

  const handleHoofdstukToevoegen = (hoofdstuk: any) => {
    const nieuweRegels = hoofdstuk.regels.map((regel: any) => ({
      ...regel,
      id: `${regel.regelId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    setSelectedRegels(prev => [...prev, ...nieuweRegels]);
  };

  const handleRegelVerwijderen = (regelId: string) => {
    setSelectedRegels(prev => prev.filter(r => r.id !== regelId));
  };

  const handleAantalWijzigen = (regelId: string, aantal: number) => {
    setSelectedRegels(prev =>
      prev.map(regel =>
        regel.id === regelId ? { ...regel, aantal } : regel
      )
    );
  };

  const handleCalculatieOpslaan = () => {
    if (!projectDetails.klantId || !projectDetails.projectNaam || selectedRegels.length === 0) {
      alert('Vul alle verplichte velden in');
      return;
    }

    const nieuweCalculatie = {
      id: bewerkCalculatie || Date.now().toString(),
      ...projectDetails,
      datum: new Date().toISOString(),
      regels: selectedRegels,
      status: 'concept' as CalculatieStatus,
      totalen: berekenTotalen(),
    };

    if (bewerkCalculatie) {
      updateCalculatie(nieuweCalculatie);
    } else {
      addCalculatie(nieuweCalculatie);
    }

    setProjectDetails({
      projectNaam: '',
      projectLocatie: '',
      projectOmschrijving: '',
      klantId: '',
      winstRisicoPercentage: 10,
      btwPercentage: 21,
    });
    setSelectedRegels([]);
    setBewerkCalculatie(null);
    setToonNieuweCalculatie(false);
  };

  const handleCalculatieVerwijderen = (id: string) => {
    if (window.confirm('Weet u zeker dat u deze calculatie wilt verwijderen?')) {
      deleteCalculatie(id);
    }
  };

  const handleStatusUpdate = (calculatieId: string, nieuweStatus: CalculatieStatus) => {
    const calculatie = calculaties.find(c => c.id === calculatieId);
    if (calculatie) {
      updateCalculatie({
        ...calculatie,
        status: nieuweStatus
      });
    }
  };

  const berekenTotalen = () => {
    const winstFactor = 1 + (projectDetails.winstRisicoPercentage / 100);

    const totalen = selectedRegels.reduce(
      (acc, regel) => {
        const item = bibliotheekItems.find(i => i.id === regel.regelId);
        if (!item) return acc;

        const brutoPrijs = item.prijs * winstFactor;
        const totaalPrijs = brutoPrijs * regel.aantal;

        return {
          arbeid: acc.arbeid + (item.type === 'arbeid' ? totaalPrijs : 0),
          materiaal: acc.materiaal + (item.type === 'materiaal' ? totaalPrijs : 0),
          materieel: acc.materieel + (item.type === 'materieel' ? totaalPrijs : 0),
          onderaanneming: acc.onderaanneming,
        };
      },
      { arbeid: 0, materiaal: 0, materieel: 0, onderaanneming: 0 }
    );

    const subtotaal = totalen.arbeid + totalen.materiaal + totalen.materieel + totalen.onderaanneming;
    const btw = (subtotaal * projectDetails.btwPercentage) / 100;

    return {
      ...totalen,
      subtotaal,
      winstRisico: 0,
      btw,
      totaalIncBtw: subtotaal + btw,
    };
  };

  const totalen = berekenTotalen();
  const regelsByHoofdstuk = selectedRegels.reduce((acc, regel) => {
    if (!acc[regel.hoofdstuk]) {
      acc[regel.hoofdstuk] = [];
    }
    acc[regel.hoofdstuk].push(regel);
    return acc;
  }, {} as Record<string, typeof selectedRegels>);

  return (
    <div className="container mx-auto p-6">
      {/* Nieuwe Calculatie knop */}
      <div className="mb-6">
        <button
          onClick={() => {
            setToonNieuweCalculatie(true);
            setBewerkCalculatie(null);
            setSelectedRegels([]);
          }}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <Plus className="mr-2" />
          Nieuwe Calculatie
        </button>
      </div>

      {/* Bestaande Calculaties */}
      <div className="bg-white rounded-lg shadow-lg border border-red-100 overflow-hidden mb-6">
        <div className="p-4 bg-red-50 border-b border-red-100">
          <h2 className="text-lg font-semibold text-red-800">Bestaande Calculaties</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-200">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Klant</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">Totaal</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">Acties</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-red-200">
              {calculaties.map((calculatie) => {
                const klant = klanten.find(k => k.id === calculatie.klantId);
                return (
                  <tr key={calculatie.id} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(calculatie.datum).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{calculatie.projectNaam}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{klant?.bedrijf || klant?.naam}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      €{calculatie.totalen.totaalIncBtw.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        calculatie.status === 'concept' ? 'bg-yellow-100 text-yellow-800' :
                        calculatie.status === 'in_behandeling' ? 'bg-blue-100 text-blue-800' :
                        calculatie.status === 'goedgekeurd' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {calculatie.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setToonNieuweCalculatie(true);
                            setBewerkCalculatie(calculatie.id);
                            setProjectDetails({
                              projectNaam: calculatie.projectNaam,
                              projectLocatie: calculatie.projectLocatie,
                              projectOmschrijving: calculatie.projectOmschrijving,
                              klantId: calculatie.klantId,
                              winstRisicoPercentage: calculatie.winstRisicoPercentage,
                              btwPercentage: calculatie.btwPercentage,
                            });
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Project Details Bewerken"
                        >
                          <Settings size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setBewerkCalculatie(calculatie.id);
                            setProjectDetails({
                              projectNaam: calculatie.projectNaam,
                              projectLocatie: calculatie.projectLocatie,
                              projectOmschrijving: calculatie.projectOmschrijving,
                              klantId: calculatie.klantId,
                              winstRisicoPercentage: calculatie.winstRisicoPercentage,
                              btwPercentage: calculatie.btwPercentage,
                            });
                            setSelectedRegels(calculatie.regels);
                            setToonNieuweCalculatie(false);
                          }}
                          className="text-green-600 hover:text-green-800"
                          title="Calculatie Bewerken"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleCalculatieVerwijderen(calculatie.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Verwijderen"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculatie Bewerken */}
      {bewerkCalculatie && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-lg border border-red-100 p-4 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Project Details</h3>
                <p><span className="font-medium">Project:</span> {projectDetails.projectNaam}</p>
                <p><span className="font-medium">Locatie:</span> {projectDetails.projectLocatie}</p>
                <p><span className="font-medium">Klant:</span> {klanten.find(k => k.id === projectDetails.klantId)?.bedrijf}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Financiële Details</h3>
                <p><span className="font-medium">Winst & Risico:</span> {projectDetails.winstRisicoPercentage}%</p>
                <p><span className="font-medium">BTW:</span> {projectDetails.btwPercentage}%</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <RegelSelector
              onLosseRegel={() => setToonBibliotheekSelector(true)}
              onHoofdstuk={() => setToonHoofdstukSelector(true)}
            />
            <button
              onClick={handleCalculatieOpslaan}
              className="ml-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Save className="mr-2" />
              Wijzigingen Opslaan
            </button>
          </div>

          {/* Regels Tabel */}
          <div className="bg-white rounded-lg shadow-lg border border-red-100 overflow-hidden">
            <table className="min-w-full divide-y divide-red-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Omschrijving</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">Aantal</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">Prijs</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">Totaal</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-200">
                {Object.entries(regelsByHoofdstuk).map(([hoofdstuk, regels]) => (
                  <React.Fragment key={hoofdstuk}>
                    <tr className="bg-red-50">
                      <td colSpan={7} className="px-6 py-2 font-medium text-red-800">{hoofdstuk}</td>
                    </tr>
                    {regels.map((regel) => {
                      const item = bibliotheekItems.find(i => i.id === regel.regelId);
                      if (!item) return null;

                      const winstFactor = 1 + (projectDetails.winstRisicoPercentage / 100);
                      const prijsPerEenheid = item.prijs * winstFactor;
                      const totaal = prijsPerEenheid * regel.aantal;

                      return (
                        <tr key={regel.id} className="hover:bg-red-50">
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{item.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.naam}</td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{item.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <input
                              type="number"
                              value={regel.aantal}
                              onChange={(e) => handleAantalWijzigen(regel.id, Number(e.target.value))}
                              className="w-20 text-right rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                              min="1"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">€{prijsPerEenheid.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right font-medium">€{totaal.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleRegelVerwijderen(regel.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot className="bg-red-50">
                <tr>
                  <td colSpan={5} className="px-6 py-3 text-right font-medium text-red-800">Subtotaal:</td>
                  <td className="px-6 py-3 text-right font-medium">€{totalen.subtotaal.toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={5} className="px-6 py-3 text-right font-medium text-red-800">BTW ({projectDetails.btwPercentage}%):</td>
                  <td className="px-6 py-3 text-right font-medium">€{totalen.btw.toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr className="bg-red-100">
                  <td colSpan={5} className="px-6 py-3 text-right font-bold text-red-800">Totaal incl. BTW:</td>
                  <td className="px-6 py-3 text-right font-bold">€{totalen.totaalIncBtw.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {toonNieuweCalculatie && (
        <NieuweCalculatie
          onSave={(details) => {
            setProjectDetails(details);
            setToonNieuweCalculatie(false);
            if (!bewerkCalculatie) {
              setBewerkCalculatie(Date.now().toString());
            }
          }}
          onCancel={() => {
            setToonNieuweCalculatie(false);
            if (!selectedRegels.length) {
              setBewerkCalculatie(null);
            }
          }}
          klanten={klanten}
          initialData={bewerkCalculatie ? projectDetails : undefined}
        />
      )}

      {toonBibliotheekSelector && (
        <BibliotheekSelector
          onItemSelect={handleLosseRegelToevoegen}
          bestaandeHoofdstukken={Object.keys(regelsByHoofdstuk)}
          onClose={() => setToonBibliotheekSelector(false)}
        />
      )}

      {toonHoofdstukSelector && (
        <HoofdstukSelector
          onHoofdstukToevoegen={handleHoofdstukToevoegen}
          onClose={() => setToonHoofdstukSelector(false)}
        />
      )}
    </div>
  );
}