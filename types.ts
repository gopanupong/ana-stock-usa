export interface KeyMetric {
  label: string;
  value: string | number;
  description: string;
}

export interface ValuationData {
  ticker: string;
  companyName: string;
  currentPriceEstimate: number;
  currency: string;
  fairValue: number;
  bearValue: number;
  bestValue: number;
  summary: string;
  metrics: KeyMetric[];
  valuationDate: string;
  sourceUrls?: string[];
}

export interface AnalysisState {
  loading: boolean;
  data: ValuationData | null;
  error: string | null;
}