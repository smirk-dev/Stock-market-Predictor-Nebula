import { Stock, TimeFrame, ForecastData } from '../types';

// Mock data for stock API
const generateMockPriceHistory = (
  basePrice: number,
  volatility: number,
  days: number,
  trend: number = 0
): Array<{ date: Date; price: number }> => {
  const history = [];
  let price = basePrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk with trend
    const randomChange = (Math.random() - 0.5) * volatility;
    const trendChange = trend * (1 / days);
    price = price * (1 + randomChange + trendChange);
    
    history.push({
      date,
      price
    });
  }
  
  return history;
};

// Mock stock data
const mockStocksData: { [key: string]: Omit<Stock, 'priceHistory'> & { basePrice: number; volatility: number; trend: number } } = {
  'AAPL': { 
    symbol: 'AAPL', 
    name: 'Apple Inc.', 
    currentPrice: 191.33, 
    priceChange: 1.23,
    basePrice: 180,
    volatility: 0.01,
    trend: 0.05
  },
  'MSFT': { 
    symbol: 'MSFT', 
    name: 'Microsoft Corporation', 
    currentPrice: 417.88, 
    priceChange: 0.78,
    basePrice: 400,
    volatility: 0.008,
    trend: 0.03
  },
  'TSLA': { 
    symbol: 'TSLA', 
    name: 'Tesla, Inc.', 
    currentPrice: 248.42, 
    priceChange: -2.15,
    basePrice: 260,
    volatility: 0.025,
    trend: -0.04
  },
  'AMZN': { 
    symbol: 'AMZN', 
    name: 'Amazon.com, Inc.', 
    currentPrice: 178.87, 
    priceChange: 0.45,
    basePrice: 175,
    volatility: 0.012,
    trend: 0.02
  },
  'GOOGL': { 
    symbol: 'GOOGL', 
    name: 'Alphabet Inc.', 
    currentPrice: 165.27, 
    priceChange: -0.32,
    basePrice: 168,
    volatility: 0.009,
    trend: -0.01
  },
  'META': { 
    symbol: 'META', 
    name: 'Meta Platforms, Inc.', 
    currentPrice: 486.18, 
    priceChange: 2.54,
    basePrice: 470,
    volatility: 0.015,
    trend: 0.06
  },
  'NVDA': { 
    symbol: 'NVDA', 
    name: 'NVIDIA Corporation', 
    currentPrice: 124.56, 
    priceChange: 3.87,
    basePrice: 115,
    volatility: 0.02,
    trend: 0.08
  }
};

// Helper to determine days based on timeframe
const getDaysForTimeFrame = (timeFrame: TimeFrame): number => {
  switch (timeFrame) {
    case '1W': return 7;
    case '1M': return 30;
    case '3M': return 90;
    case 'YTD': {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    }
    case 'MAX': return 365;
    default: return 30;
  }
};

// Fetch stock data
export const fetchStockData = async (symbol: string, timeFrame: TimeFrame): Promise<Stock | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!mockStocksData[symbol]) {
    return null;
  }
  
  const stockData = mockStocksData[symbol];
  const days = getDaysForTimeFrame(timeFrame);
  
  const priceHistory = generateMockPriceHistory(
    stockData.basePrice,
    stockData.volatility,
    days,
    stockData.trend
  );
  
  return {
    symbol,
    name: stockData.name,
    currentPrice: stockData.currentPrice,
    priceChange: stockData.priceChange,
    priceHistory
  };
};

// Search stocks
export const searchStocks = async (query: string): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const normalizedQuery = query.toLowerCase();
  
  return Object.keys(mockStocksData).filter(symbol => {
    const stock = mockStocksData[symbol];
    return symbol.toLowerCase().includes(normalizedQuery) || 
           stock.name.toLowerCase().includes(normalizedQuery);
  });
};

// Fetch forecast data
export const fetchForecastData = async (symbol: string, timeFrame: TimeFrame): Promise<ForecastData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const stockData = mockStocksData[symbol] || mockStocksData.AAPL;
  const days = 7; // Forecast for 7 days
  
  // Generate forecast predictions with confidence intervals
  const predictions = [];
  const now = new Date();
  let lastPrice = stockData.currentPrice;
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    // Random walk with trend
    const randomChange = (Math.random() - 0.5) * stockData.volatility * 2;
    const trendChange = stockData.trend * (1 / 7);
    lastPrice = lastPrice * (1 + randomChange + trendChange);
    
    // Confidence grows with time
    const confidence = stockData.volatility * lastPrice * (i / 3);
    
    predictions.push({
      date,
      price: lastPrice,
      confidence
    });
  }
  
  // Mock metrics based on volatility and trend
  const r2Score = 0.9 - (stockData.volatility * 5);
  const mape = stockData.volatility * 200;
  const mae = stockData.basePrice * stockData.volatility;
  
  return {
    symbol,
    predictions,
    metrics: {
      r2Score,
      mape,
      mae
    },
    backtestInfo: {
      window: days,
      trainingData: `${getDaysForTimeFrame(timeFrame)} days`,
      lastUpdated: new Date().toLocaleDateString()
    }
  };
};