import React, { useState } from 'react';
import { useStore } from '../store';
import { Klant } from '../types';
import { UserPlus, Trash2, Edit2, Building2, Mail, Phone, MapPin, Receipt, CreditCard } from 'lucide-react';

export function KlantenBeheer() {
  const { klanten, addKlant, deleteKlant, updateKlant } = useStore();
  const [toonNieuweKlant, setToonNieuweKlant] = useState(false);
  const [nieuweKlant, setNieuweKlant] = useState<Partial<Klant>>({});
  const [bewerkKlant, setBewerkKlant] = useState<Klant | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nieuweKlant.naam && nieuweKlant.email) {
      addKlant({
        id: Date.now().toString(),
        naam: nieuweKlant.naam,
        bedrijf: nieuweKlant.bedrijf || '',
        email: nieuweKlant.email,
        telefoon: nieuweKlant.telefoon || '',
        adres: nieuweKlant.adres || '',
        postcode: nieuweKlant.postcode || '',
        plaats: nieuweKlant.plaats || '',
        kvkNummer: nieuweKlant.kvkNummer,
        btwNummer: nieuweKlant.btwNummer,
      });
      setNieuweKlant({});
      setToonNieuweKlant(false);
    }
  };

  const handleBewerkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bewerkKlant && bewerkKlant.naam && bewerkKlant.email) {
      updateKlant(bewerkKlant);
      setBewerkKlant(null);
    }
  };

  const handleVerwijderKlant = (id: string) => {
    if (window.confirm('Weet u zeker dat u deze klant wilt verwijderen?')) {
      deleteKlant(id);
    }
  };

  const KlantFormulier = ({ klant, onSubmit, onCancel, titel }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-red-800">{titel}</h2>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Bedrijfsnaam */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-red-600" />
                  Bedrijfsnaam
                </label>
                <input
                  type="text"
                  value={klant.bedrijf || ''}
                  onChange={(e) => klant === bewerkKlant 
                    ? setBewerkKlant({ ...bewerkKlant, bedrijf: e.target.value })
                    : setNieuweKlant({ ...nieuweKlant, bedrijf: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              {/* Contactpersoon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <UserPlus className="w-4 h-4 mr-2 text-red-600" />
                  Contactpersoon
                </label>
                <input
                  type="text"
                  value={klant.naam || ''}
                  onChange={(e) => klant === bewerkKlant 
                    ? setBewerkKlant({ ...bewerkKlant, naam: e.target.value })
                    : setNieuweKlant({ ...nieuweKlant, naam: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-red-600" />
                  Email
                </label>
                <input
                  type="email"
                  value={klant.email || ''}
                  onChange={(e) => klant === bewerkKlant 
                    ? setBewerkKlant({ ...bewerkKlant, email: e.target.value })
                    : setNieuweKlant({ ...nieuweKlant, email: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              {/* Telefoon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-red-600" />
                  Telefoon
                </label>
                <input
                  type="tel"
                  value={klant.telefoon || ''}
                  onChange={(e) => klant === bewerkKlant 
                    ? setBewerkKlant({ ...bewerkKlant, telefoon: e.target.value })
                    : setNieuweKlant({ ...nieuweKlant, telefoon: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              {/* Adres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-red-600" />
                  Adres
                </label>
                <input
                  type="text"
                  value={klant.adres || ''}
                  onChange={(e) => klant === bewerkKlant 
                    ? setBewerkKlant({ ...bewerkKlant, adres: e.target.value })
                    : setNieuweKlant({ ...nieuweKlant, adres: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              {/* Postcode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  value={klant.postcode || ''}
                  onChange={(e) => klant === bewerkKlant 
                    ? setBewerkKlant({ ...bewerkKlant, postcode: e.target.value })
                    : setNieuweKlant({ ...nieuweKlant, postcode: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              {/* Plaats */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plaats
                </label>
                <input
                  type="text"
                  value={klant.plaats || ''}
                  onChange={(e) => klant === bewerkKlant 
                    ? setBewerkKlant({ ...bewerkKlant, plaats: e.target.value })
                    : setNieuweKlant({ ...nieuweKlant, plaats: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              {/* KvK Nummer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Receipt className="w-4 h-4 mr-2 text-red-600" />
                  KvK Nummer
                </label>
                <input
                  type="text"
                  value={klant.kvkNummer || ''}
                  onChange={(e) => klant === bewerkKlant 
                    ? setBewerkKlant({ ...bewerkKlant, kvkNummer: e.target.value })
                    : setNieuweKlant({ ...nieuweKlant, kvkNummer: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              {/* BTW Nummer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-red-600" />
                  BTW Nummer
                </label>
                <input
                  type="text"
                  value={klant.btwNummer || ''}
                  onChange={(e) => klant === bewerkKlant 
                    ? setBewerkKlant({ ...bewerkKlant, btwNummer: e.target.value })
                    : setNieuweKlant({ ...nieuweKlant, btwNummer: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4 rounded-b-lg">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Annuleren
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
          >
            {klant === bewerkKlant ? 'Wijzigingen Opslaan' : 'Klant Toevoegen'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      {/* Nieuwe Klant knop */}
      <div className="mb-6">
        <button
          onClick={() => setToonNieuweKlant(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <UserPlus className="mr-2" />
          Nieuwe Klant
        </button>
      </div>

      {/* Klantenlijst */}
      <div className="bg-white rounded-lg shadow-lg border border-red-100 overflow-hidden">
        <div className="p-4 bg-red-50 border-b border-red-100">
          <h2 className="text-lg font-semibold text-red-800">Klantenlijst</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-200">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Bedrijf</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Contactpersoon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Adres</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">KvK/BTW</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">Acties</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-red-200">
              {klanten.map((klant) => (
                <tr key={klant.id} className="hover:bg-red-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{klant.bedrijf}</div>
                  </td>
                  <td className="px-6 py-4">{klant.naam}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {klant.email}
                      </div>
                      {klant.telefoon && (
                        <div className="flex items-center text-gray-600 mt-1">
                          <Phone className="w-4 h-4 mr-2" />
                          {klant.telefoon}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {klant.adres}<br />
                      {klant.postcode} {klant.plaats}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {klant.kvkNummer && <div>KvK: {klant.kvkNummer}</div>}
                      {klant.btwNummer && <div>BTW: {klant.btwNummer}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setBewerkKlant(klant)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100"
                        title="Bewerken"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleVerwijderKlant(klant.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100"
                        title="Verwijderen"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {toonNieuweKlant && (
        <KlantFormulier
          klant={nieuweKlant}
          onSubmit={handleSubmit}
          onCancel={() => setToonNieuweKlant(false)}
          titel="Nieuwe Klant"
        />
      )}

      {bewerkKlant && (
        <KlantFormulier
          klant={bewerkKlant}
          onSubmit={handleBewerkSubmit}
          onCancel={() => setBewerkKlant(null)}
          titel="Klant Bewerken"
        />
      )}
    </div>
  );
}