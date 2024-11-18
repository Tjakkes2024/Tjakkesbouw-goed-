import React from 'react';
import { Plus, BookOpen, List } from 'lucide-react';

interface RegelSelectorProps {
  onLosseRegel: () => void;
  onHoofdstuk: () => void;
}

export function RegelSelector({ onLosseRegel, onHoofdstuk }: RegelSelectorProps) {
  return (
    <div className="flex space-x-4">
      <button
        onClick={onLosseRegel}
        className="flex-1 flex items-center h-14 px-4 bg-white rounded-lg border border-red-200 hover:border-red-500 hover:bg-red-50 transition-all group"
      >
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200">
          <List className="w-5 h-5 text-red-600" />
        </div>
        <span className="font-medium text-red-800">Losse Regel Toevoegen</span>
        <div className="ml-auto flex items-center text-red-600">
          <Plus className="w-4 h-4" />
        </div>
      </button>

      <button
        onClick={onHoofdstuk}
        className="flex-1 flex items-center h-14 px-4 bg-white rounded-lg border border-red-200 hover:border-red-500 hover:bg-red-50 transition-all group"
      >
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200">
          <BookOpen className="w-5 h-5 text-red-600" />
        </div>
        <span className="font-medium text-red-800">Hoofdstuk Toevoegen</span>
        <div className="ml-auto flex items-center text-red-600">
          <Plus className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}