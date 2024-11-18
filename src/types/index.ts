// Voeg deze interface toe
export interface Offerte {
  id: string;
  calculatieId: string;
  datum: string;
  klantId: string;
  projectDetails: {
    projectNaam: string;
    projectLocatie: string;
    projectOmschrijving: string;
    winstRisicoPercentage: number;
    btwPercentage: number;
  };
  regels: Array<{
    regelId: string;
    aantal: number;
    hoofdstuk: string;
  }>;
  status: 'concept' | 'definitief' | 'geaccepteerd' | 'afgewezen';
  totalen: {
    arbeid: number;
    materiaal: number;
    materieel: number;
    onderaanneming: number;
    subtotaal: number;
    winstRisico: number;
    btw: number;
    totaalIncBtw: number;
  };
}

export type CalculatieStatus = 'concept' | 'in_behandeling' | 'goedgekeurd' | 'afgekeurd';

export interface Calculatie {
  id: string;
  datum: string;
  klantId: string;
  projectNaam: string;
  projectLocatie: string;
  projectOmschrijving: string;
  winstRisicoPercentage: number;
  btwPercentage: number;
  regels: Array<{
    regelId: string;
    aantal: number;
    hoofdstuk: string;
  }>;
  status: CalculatieStatus;
  totalen: {
    arbeid: number;
    materiaal: number;
    materieel: number;
    onderaanneming: number;
    subtotaal: number;
    winstRisico: number;
    btw: number;
    totaalIncBtw: number;
  };
}