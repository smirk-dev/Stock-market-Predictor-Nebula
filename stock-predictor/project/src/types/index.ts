// Stock Types
export type TimeFrame = '1W' | '1M' | '3M' | 'YTD' | 'MAX';

export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  priceHistory: Array<{
    date: Date;
    price: number;
  }>;
}

// Forecast Types
export interface ForecastData {
  symbol: string;
  predictions: Array<{
    date: Date;
    price: number;
    confidence: number;
  }>;
  metrics: {
    r2Score: number;
    mape: number;
    mae: number;
  };
  backtestInfo: {
    window: number;
    trainingData: string;
    lastUpdated: string;
  };
}

// News Types
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}