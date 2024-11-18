import React, { useState, useEffect } from 'react';
import { Building2, MapPin, ClipboardCheck, Receipt, Percent, CreditCard } from 'lucide-react';
import { Klant } from '../types';

interface NieuweCalculatieProps {
  onSave: (details: {
    projectNaam: string;
    projectLocatie: string;
    projectOmschrijving: string;
    klantId: string;
    winstRisicoPercentage: number;
    btwPercentage: number;
  }) => void;
  onCancel: () => void;
  klanten: Klant[];
  initialData?: {
    projectNaam: string;
    projectLocatie: string;
    projectOmschrijving: string;
    klantId: string;
    winstRisicoPercentage: number;
    btwPercentage: number;
  };
}

export function NieuweCalculatie({ onSave, onCancel, klanten, initialData }: NieuweCalculatieProps) {
  const [projectDetails, setProjectDetails] = useState({
    projectNaam: '',
    projectLocatie: '',
    projectOmschrijving: '',
    klantId: '',
    winstRisicoPercentage: 10,
    btwPercentage: 21,
  });

  useEffect(() => {
    if (initialData) {
      setProjectDetails(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectDetails.projectNaam || !projectDetails.klantId) {
      alert('Vul alle verplichte velden in');
      return;
    }
    onSave(projectDetails);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-red-800">Project Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Klant Selectie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-red-600" />
                  Klant
                </label>
                <select
                  value={projectDetails.klantId}
                  onChange={(e) => setProjectDetails({ ...projectDetails, klantId: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                >
                  <option value="">Selecteer een klant...</option>
                  {klanten.map((klant) => (
                    <option key={klant.id} value={klant.id}>
                      {klant.bedrijf || klant.naam}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Naam */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <ClipboardCheck className="w-4 h-4 mr-2 text-red-600" />
                  Project Naam
                </label>
                <input
                  type="text"
                  value={projectDetails.projectNaam}
                  onChange={(e) => setProjectDetails({ ...projectDetails, projectNaam: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              {/* Project Locatie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-red-600" />
                  Project Locatie
                </label>
                <input
                  type="text"
                  value={projectDetails.projectLocatie}
                  onChange={(e) => setProjectDetails({ ...projectDetails, projectLocatie: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              {/* Winst & Risico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Receipt className="w-4 h-4 mr-2 text-red-600" />
                  Winst & Risico %
                </label>
                <input
                  type="number"
                  value={projectDetails.winstRisicoPercentage}
                  onChange={(e) => setProjectDetails({ ...projectDetails, winstRisicoPercentage: Number(e.target.value) })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  min="0"
                  max="100"
                />
              </div>

              {/* BTW Percentage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Percent className="w-4 h-4 mr-2 text-red-600" />
                  BTW %
                </label>
                <input
                  type="number"
                  value={projectDetails.btwPercentage}
                  onChange={(e) => setProjectDetails({ ...projectDetails, btwPercentage: Number(e.target.value) })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  min="0"
                  max="100"
                />
              </div>

              {/* Project Omschrijving */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Omschrijving
                </label>
                <textarea
                  value={projectDetails.projectOmschrijving}
                  onChange={(e) => setProjectDetails({ ...projectDetails, projectOmschrijving: e.target.value })}
                  className="w-full rounded-lg border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  rows={4}
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
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {initialData ? 'Wijzigingen Opslaan' : 'Project Aanmaken'}
          </button>
        </div>
      </div>
    </div>
  );
}