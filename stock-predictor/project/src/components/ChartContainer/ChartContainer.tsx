import React, { useState } from 'react';
import { ChevronDown, BarChart2, TrendingUp, Activity } from 'lucide-react';
import { Stock, TimeFrame, ForecastData } from '../../types';
import StockChart from './StockChart';
import styles from './ChartContainer.module.css';

interface ChartContainerProps {
  stocks: Stock[];
  timeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
  isLoading: boolean;
  forecastData: ForecastData | null;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  stocks,
  timeFrame,
  onTimeFrameChange,
  isLoading,
  forecastData
}) => {
  const [showForecast, setShowForecast] = useState(true);
  const [showIndicators, setShowIndicators] = useState(false);
  const [indicatorType, setIndicatorType] = useState<'rsi' | 'macd'>('rsi');
  const [isTimeFrameDropdownOpen, setIsTimeFrameDropdownOpen] = useState(false);
  
  const timeFrameOptions: { value: TimeFrame; label: string }[] = [
    { value: '1W', label: '1 Week' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: 'YTD', label: 'Year to Date' },
    { value: 'MAX', label: 'Max' }
  ];
  
  const handleTimeFrameSelect = (newTimeFrame: TimeFrame) => {
    onTimeFrameChange(newTimeFrame);
    setIsTimeFrameDropdownOpen(false);
  };
  
  const toggleIndicatorType = () => {
    setIndicatorType(prev => (prev === 'rsi' ? 'macd' : 'rsi'));
  };
  
  return (
    <div className={`${styles.chartContainer} glass-card`}>
      <div className={styles.chartHeader}>
        <div className={styles.stockInfo}>
          {stocks.length > 0 && (
            <>
              <h2 className={styles.stockTitle}>{stocks[0].name}</h2>
              <div className={styles.stockPrice}>
                ${stocks[0].currentPrice.toFixed(2)}
                <span 
                  className={`${styles.priceChange} ${stocks[0].priceChange >= 0 ? styles.positive : styles.negative}`}
                >
                  {stocks[0].priceChange >= 0 ? '+' : ''}{stocks[0].priceChange.toFixed(2)}%
                </span>
              </div>
            </>
          )}
        </div>
        
        <div className={styles.chartControls}>
          <div className={styles.timeFrameSelector}>
            <button 
              className={styles.timeFrameButton} 
              onClick={() => setIsTimeFrameDropdownOpen(!isTimeFrameDropdownOpen)}
            >
              {timeFrameOptions.find(option => option.value === timeFrame)?.label}
              <ChevronDown size={16} />
            </button>
            
            {isTimeFrameDropdownOpen && (
              <div className={styles.timeFrameDropdown}>
                {timeFrameOptions.map(option => (
                  <button 
                    key={option.value} 
                    className={`${styles.timeFrameOption} ${timeFrame === option.value ? styles.active : ''}`}
                    onClick={() => handleTimeFrameSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.chartOptions}>
            <button 
              className={`${styles.optionButton} ${showForecast ? styles.active : ''}`}
              onClick={() => setShowForecast(!showForecast)}
              title="Toggle Forecast"
            >
              <TrendingUp size={18} />
            </button>
            
            <button 
              className={`${styles.optionButton} ${showIndicators ? styles.active : ''}`}
              onClick={() => setShowIndicators(!showIndicators)}
              title="Toggle Indicators"
            >
              <Activity size={18} />
            </button>
            
            {showIndicators && (
              <button 
                className={styles.optionButton}
                onClick={toggleIndicatorType}
                title={`Current: ${indicatorType.toUpperCase()}`}
              >
                <BarChart2 size={18} />
                <span className={styles.indicatorLabel}>{indicatorType.toUpperCase()}</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.chartWrapper}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading chart data...</p>
          </div>
        ) : stocks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Select stocks to display chart</p>
          </div>
        ) : (
          <StockChart 
            stocks={stocks}
            timeFrame={timeFrame}
            showForecast={showForecast}
            showIndicators={showIndicators}
            indicatorType={indicatorType}
            forecastData={forecastData}
          />
        )}
      </div>
    </div>
  );
};

export default ChartContainer;