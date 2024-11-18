import React, { forwardRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Offerte as OfferteType, Klant } from '../types';
import { useStore } from '../store';
import { Phone, Mail, Building2, Calendar, FileText, Receipt, CreditCard } from 'lucide-react';

interface OfferteProps {
  offerte: OfferteType;
  klant: Klant;
  onClose: () => void;
}

const getOfferteNummer = (id: string) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const sequence = (parseInt(id.slice(-4)) + 1).toString().padStart(4, '0');
  return `OFF-${year}-${month}-${sequence}`;
};

const PrintableContent = forwardRef<HTMLDivElement, { offerte: OfferteType; klant: Klant }>(
  ({ offerte, klant }, ref) => {
    const { bibliotheekItems } = useStore();
    const datum = new Date().toLocaleDateString('nl-NL');
    
    const regelsByHoofdstuk = offerte.regels.reduce((acc, regel) => {
      if (!acc[regel.hoofdstuk]) {
        acc[regel.hoofdstuk] = [];
      }
      acc[regel.hoofdstuk].push(regel);
      return acc;
    }, {} as Record<string, typeof offerte.regels>);

    const winstFactor = 1 + (offerte.projectDetails.winstRisicoPercentage / 100);

    return (
      <div ref={ref} className="p-12 bg-white min-h-[297mm] w-[210mm] mx-auto">
        {/* Header met logo en offerte details */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-red-800 mb-4">TJAKKESBOUW</h1>
            <div className="text-gray-600 space-y-1">
              <p>De Viermaster 2</p>
              <p>9514EJ Gasselternijveen</p>
              <div className="flex items-center mt-2">
                <Phone className="w-4 h-4 mr-2 text-red-600" />
                <span>0628244928</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-red-600" />
                <span>info@tjakkesbouw.nl</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-red-50 px-6 py-4 rounded-lg border-l-4 border-red-600">
              <h2 className="text-3xl font-bold mb-2 text-red-800">OFFERTE</h2>
              <div className="text-gray-600">
                <div className="flex items-center justify-end mb-1">
                  <FileText className="w-4 h-4 mr-2 text-red-600" />
                  <span>{getOfferteNummer(offerte.id)}</span>
                </div>
                <div className="flex items-center justify-end">
                  <Calendar className="w-4 h-4 mr-2 text-red-600" />
                  <span>{datum}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Klantgegevens */}
        <div className="mb-8">
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-red-600">
            <div className="flex items-center text-red-800 mb-3">
              <Building2 className="w-5 h-5 mr-2" />
              <h3 className="font-bold text-lg">Geadresseerde</h3>
            </div>
            <div className="space-y-1 text-gray-700">
              <p className="font-semibold text-lg">{klant.bedrijf}</p>
              <p>T.a.v. {klant.naam}</p>
              <p>{klant.adres}</p>
              <p>{klant.postcode} {klant.plaats}</p>
              <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                {klant.kvkNummer && (
                  <div className="flex items-center">
                    <Receipt className="w-4 h-4 mr-1 text-red-600" />
                    <span>KvK: {klant.kvkNummer}</span>
                  </div>
                )}
                {klant.btwNummer && (
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-1 text-red-600" />
                    <span>BTW: {klant.btwNummer}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="mb-8">
          <div className="border-b-2 border-red-600 mb-4">
            <h3 className="text-lg font-bold text-red-800 pb-2">Project Details</h3>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="flex items-center text-gray-700">
                  <span className="font-semibold text-red-800 mr-2">Project:</span>
                  {offerte.projectDetails.projectNaam}
                </p>
              </div>
              <div>
                <p className="flex items-center text-gray-700">
                  <span className="font-semibold text-red-800 mr-2">Locatie:</span>
                  {offerte.projectDetails.projectLocatie}
                </p>
              </div>
            </div>
            {offerte.projectDetails.projectOmschrijving && (
              <div className="mt-4 p-4 bg-white rounded-lg text-gray-600 italic border border-gray-200">
                {offerte.projectDetails.projectOmschrijving}
              </div>
            )}
          </div>
        </div>

        {/* Specificatie per hoofdstuk */}
        {Object.entries(regelsByHoofdstuk).map(([hoofdstukNaam, hoofdstukRegels], index) => {
          const hoofdstukTotaal = hoofdstukRegels.reduce((sum, regel) => {
            const item = bibliotheekItems.find(i => i.id === regel.regelId);
            if (!item) return sum;
            return sum + (item.prijs * regel.aantal * winstFactor);
          }, 0);

          return (
            <div key={hoofdstukNaam} className={index > 0 ? 'mt-6' : ''}>
              <div className="border-b-2 border-red-600 mb-4">
                <h4 className="text-lg font-bold text-red-800 pb-2">{hoofdstukNaam}</h4>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-red-800 font-semibold">Omschrijving</th>
                      <th className="px-4 py-3 text-right text-red-800 font-semibold">Aantal</th>
                      <th className="px-4 py-3 text-left text-red-800 font-semibold">Eenheid</th>
                      <th className="px-4 py-3 text-right text-red-800 font-semibold">Prijs</th>
                      <th className="px-4 py-3 text-right text-red-800 font-semibold">Totaal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {hoofdstukRegels.map((regel) => {
                      const item = bibliotheekItems.find(i => i.id === regel.regelId);
                      if (!item) return null;

                      const prijsPerEenheid = item.prijs * winstFactor;
                      const totaal = prijsPerEenheid * regel.aantal;

                      return (
                        <tr key={regel.regelId} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">{item.naam}</div>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-700">{regel.aantal}</td>
                          <td className="px-4 py-3 text-gray-700">{item.eenheid}</td>
                          <td className="px-4 py-3 text-right text-gray-700">€{prijsPerEenheid.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-800">€{totaal.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan={4} className="px-4 py-3 text-right text-red-800">
                        Subtotaal {hoofdstukNaam}
                      </td>
                      <td className="px-4 py-3 text-right text-red-800">
                        €{hoofdstukTotaal.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* Totalen */}
        <div className="mb-8">
          <div className="w-1/2 ml-auto">
            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-3 text-gray-600">Subtotaal:</td>
                    <td className="px-6 py-3 text-right font-medium">
                      €{(offerte.totalen.subtotaal * winstFactor).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-gray-600">
                      BTW ({offerte.projectDetails.btwPercentage}%):
                    </td>
                    <td className="px-6 py-3 text-right font-medium">
                      €{offerte.totalen.btw.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-6 py-3 font-bold text-red-800">Totaal incl. BTW:</td>
                    <td className="px-6 py-3 text-right font-bold text-red-800">
                      €{offerte.totalen.totaalIncBtw.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Voorwaarden */}
        <div className="mb-8">
          <div className="border-b-2 border-red-600 mb-4">
            <h3 className="text-lg font-bold text-red-800 pb-2">Voorwaarden</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                Geldigheid offerte: 30 dagen
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                Levertijd: In overleg
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                Betalingsvoorwaarden: 14 dagen na factuurdatum
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                Op deze offerte zijn onze algemene voorwaarden van toepassing
              </li>
            </ul>
          </div>
        </div>

        {/* Ondertekening */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="font-bold mb-6 text-red-800">Voor akkoord opdrachtgever:</p>
            <div className="space-y-6 text-gray-600">
              <p className="border-b border-gray-200 pb-2">Naam: _______________________</p>
              <p className="border-b border-gray-200 pb-2">Datum: _______________________</p>
              <p className="border-b border-gray-200 pb-2">Handtekening: _______________</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="font-bold mb-6 text-red-800">Namens Tjakkesbouw:</p>
            <div className="space-y-6 text-gray-600">
              <p className="border-b border-gray-200 pb-2">Naam: _______________________</p>
              <p className="border-b border-gray-200 pb-2">Datum: {datum}</p>
              <p className="border-b border-gray-200 pb-2">Handtekening: _______________</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export function Offerte({ offerte, klant, onClose }: OfferteProps) {
  const offerteRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    content: () => offerteRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
    documentTitle: `Offerte-${offerte.id}-${new Date().toLocaleDateString('nl-NL')}`,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <PrintableContent ref={offerteRef} offerte={offerte} klant={klant} />
        
        {/* Knoppen */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-4 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Sluiten
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            PDF Genereren
          </button>
        </div>
      </div>
    </div>
  );
}