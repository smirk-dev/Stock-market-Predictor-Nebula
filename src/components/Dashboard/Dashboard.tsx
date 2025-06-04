import React, { useState, useEffect, useCallback } from 'react';
import Header from '../Header/Header';
import StockSelector from '../StockSelector/StockSelector';
import ChartContainer from '../ChartContainer/ChartContainer';
import AccuracyPanel from '../AccuracyPanel/AccuracyPanel';
import NewsPanel from '../NewsPanel/NewsPanel';
import { fetchStockData, fetchForecastData } from '../../services/stockService';
import { Stock, TimeFrame, ForecastData } from '../../types';
import styles from './Dashboard.module.css';

const DEFAULT_STOCKS = ['AAPL', 'TSLA', 'MSFT'];
const DEFAULT_TIMEFRAME: TimeFrame = '1M';

const Dashboard: React.FC = () => {
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(DEFAULT_TIMEFRAME);
  const [isLoading, setIsLoading] = useState(true);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStockData = useCallback(async (symbols: string[], selectedTimeFrame: TimeFrame) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stocksData = await Promise.all(
        symbols.map(symbol => fetchStockData(symbol, selectedTimeFrame))
      );
      
      const validStocks = stocksData.filter((stock): stock is Stock => stock !== null);
      setSelectedStocks(validStocks);
      
      if (validStocks.length > 0) {
        const forecast = await fetchForecastData(validStocks[0].symbol, selectedTimeFrame);
        setForecastData(forecast);
      }
    } catch (error) {
      console.error('Failed to load stock data:', error);
      setError('Failed to load stock data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStockData(DEFAULT_STOCKS, DEFAULT_TIMEFRAME);
  }, [loadStockData]);

  const handleStockSelect = useCallback(async (selectedSymbols: string[]) => {
    loadStockData(selectedSymbols, timeFrame);
  }, [loadStockData, timeFrame]);

  const handleTimeFrameChange = useCallback((newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame);
    loadStockData(selectedStocks.map(stock => stock.symbol), newTimeFrame);
  }, [loadStockData, selectedStocks]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Header />
      
      <main className={styles.dashboardContent}>
        <div className={styles.selectorRow}>
          <StockSelector 
            onStocksSelected={handleStockSelect} 
            defaultStocks={DEFAULT_STOCKS}
          />
        </div>
        
        <div className={styles.mainContent}>
          <div className={styles.chartSection}>
            <ChartContainer 
              stocks={selectedStocks}
              timeFrame={timeFrame}
              onTimeFrameChange={handleTimeFrameChange}
              isLoading={isLoading}
              forecastData={forecastData}
            />
          </div>
          
          <div className={styles.sidePanel}>
            <AccuracyPanel forecastData={forecastData} />
            <NewsPanel selectedStocks={selectedStocks} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;