import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Hoofdstuk, Klant, Calculatie, BibliotheekItem, SamengesteldHoofdstuk, Offerte } from '../types';

interface Store {
  hoofdstukken: Hoofdstuk[];
  klanten: Klant[];
  calculaties: Calculatie[];
  bibliotheekItems: BibliotheekItem[];
  samengesteldeHoofdstukken: SamengesteldHoofdstuk[];
  offertes: Offerte[];
  standaardWaarden: {
    uurloonMonteur: number;
    uurloonLeerling: number;
    winstRisicoPercentage: number;
    btwPercentage: number;
  };
  
  // Actions
  setHoofdstukken: (hoofdstukken: Hoofdstuk[]) => void;
  setKlanten: (klanten: Klant[]) => void;
  setCalculaties: (calculaties: Calculatie[]) => void;
  setStandaardWaarden: (waarden: Partial<Store['standaardWaarden']>) => void;
  
  // Klanten
  addKlant: (klant: Klant) => void;
  updateKlant: (klant: Klant) => void;
  deleteKlant: (id: string) => void;
  
  // Calculaties
  addCalculatie: (calculatie: Calculatie) => void;
  updateCalculatie: (calculatie: Calculatie) => void;
  deleteCalculatie: (id: string) => void;
  
  // Bibliotheek
  addBibliotheekItem: (item: Omit<BibliotheekItem, 'id' | 'code'>) => void;
  updateBibliotheekItem: (item: BibliotheekItem) => void;
  deleteBibliotheekItem: (id: string) => void;
  
  // Samengestelde hoofdstukken
  addSamengesteldHoofdstuk: (hoofdstuk: Omit<SamengesteldHoofdstuk, 'id'>) => void;
  updateSamengesteldHoofdstuk: (hoofdstuk: SamengesteldHoofdstuk) => void;
  deleteSamengesteldHoofdstuk: (id: string) => void;
  
  // Offertes
  addOfferte: (offerte: Offerte) => void;
  updateOfferte: (offerte: Offerte) => void;
  deleteOfferte: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      hoofdstukken: [],
      klanten: [],
      calculaties: [],
      bibliotheekItems: [],
      samengesteldeHoofdstukken: [],
      offertes: [],
      standaardWaarden: {
        uurloonMonteur: 45.00,
        uurloonLeerling: 32.50,
        winstRisicoPercentage: 10,
        btwPercentage: 21,
      },

      setHoofdstukken: (hoofdstukken) => set({ hoofdstukken }),
      setKlanten: (klanten) => set({ klanten }),
      setCalculaties: (calculaties) => set({ calculaties }),
      setStandaardWaarden: (waarden) =>
        set((state) => ({
          standaardWaarden: { ...state.standaardWaarden, ...waarden },
        })),

      addKlant: (klant) => set((state) => ({ klanten: [...state.klanten, klant] })),
      updateKlant: (klant) =>
        set((state) => ({
          klanten: state.klanten.map((k) => (k.id === klant.id ? klant : k)),
        })),
      deleteKlant: (id) =>
        set((state) => ({
          klanten: state.klanten.filter((k) => k.id !== id),
        })),

      addCalculatie: (calculatie) =>
        set((state) => ({ calculaties: [...state.calculaties, calculatie] })),
      updateCalculatie: (calculatie) =>
        set((state) => ({
          calculaties: state.calculaties.map((c) => (c.id === calculatie.id ? calculatie : c)),
        })),
      deleteCalculatie: (id) =>
        set((state) => ({
          calculaties: state.calculaties.filter((c) => c.id !== id),
        })),

      addBibliotheekItem: (item) =>
        set((state) => ({
          bibliotheekItems: [
            ...state.bibliotheekItems,
            {
              ...item,
              id: Date.now().toString(),
              code: `${item.type.toUpperCase()}-${(state.bibliotheekItems.length + 1)
                .toString()
                .padStart(4, '0')}`,
            },
          ],
        })),
      updateBibliotheekItem: (item) =>
        set((state) => ({
          bibliotheekItems: state.bibliotheekItems.map((i) =>
            i.id === item.id ? item : i
          ),
        })),
      deleteBibliotheekItem: (id) =>
        set((state) => ({
          bibliotheekItems: state.bibliotheekItems.filter((i) => i.id !== id),
        })),

      addSamengesteldHoofdstuk: (hoofdstuk) =>
        set((state) => ({
          samengesteldeHoofdstukken: [
            ...state.samengesteldeHoofdstukken,
            { ...hoofdstuk, id: Date.now().toString() },
          ],
        })),
      updateSamengesteldHoofdstuk: (hoofdstuk) =>
        set((state) => ({
          samengesteldeHoofdstukken: state.samengesteldeHoofdstukken.map((h) =>
            h.id === hoofdstuk.id ? hoofdstuk : h
          ),
        })),
      deleteSamengesteldHoofdstuk: (id) =>
        set((state) => ({
          samengesteldeHoofdstukken: state.samengesteldeHoofdstukken.filter(
            (h) => h.id !== id
          ),
        })),

      addOfferte: (offerte) =>
        set((state) => ({ offertes: [...state.offertes, offerte] })),
      updateOfferte: (offerte) =>
        set((state) => ({
          offertes: state.offertes.map((o) => (o.id === offerte.id ? offerte : o)),
        })),
      deleteOfferte: (id) =>
        set((state) => ({
          offertes: state.offertes.filter((o) => o.id !== id),
        })),
    }),
    {
      name: 'calculatie-storage',
    }
  )
);