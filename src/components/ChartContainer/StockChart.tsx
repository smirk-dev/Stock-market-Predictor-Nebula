import React, { useEffect, useRef } from 'react';
import { Stock, TimeFrame, ForecastData } from '../../types';
import styles from './StockChart.module.css';

interface StockChartProps {
  stocks: Stock[];
  timeFrame: TimeFrame;
  showForecast: boolean;
  showIndicators: boolean;
  indicatorType: 'rsi' | 'macd';
  forecastData: ForecastData | null;
}

const StockChart: React.FC<StockChartProps> = ({
  stocks,
  timeFrame,
  showForecast,
  showIndicators,
  indicatorType,
  forecastData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || stocks.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw chart
    const drawChart = () => {
      const mainStock = stocks[0];
      const priceData = mainStock.priceHistory;
      
      // Find min and max prices
      let minPrice = Math.min(...priceData.map(point => point.price));
      let maxPrice = Math.max(...priceData.map(point => point.price));
      
      // Include forecast data in min/max calculation if showing forecast
      if (showForecast && forecastData) {
        const forecastMin = Math.min(...forecastData.predictions.map(point => point.price - point.confidence));
        const forecastMax = Math.max(...forecastData.predictions.map(point => point.price + point.confidence));
        
        minPrice = Math.min(minPrice, forecastMin);
        maxPrice = Math.max(maxPrice, forecastMax);
      }
      
      // Add some padding to min/max
      const range = maxPrice - minPrice;
      minPrice -= range * 0.05;
      maxPrice += range * 0.05;
      
      const xPadding = 40;
      const yPadding = 30;
      const chartWidth = canvas.width - xPadding * 2;
      const chartHeight = canvas.height - yPadding * 2;
      
      // Draw axes
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xPadding, yPadding);
      ctx.lineTo(xPadding, canvas.height - yPadding);
      ctx.stroke();
      
      // Draw price grid lines
      const gridLines = 5;
      ctx.textAlign = 'right';
      ctx.font = '10px Inter';
      ctx.fillStyle = '#94a3b8';
      
      for (let i = 0; i <= gridLines; i++) {
        const y = yPadding + (chartHeight / gridLines) * i;
        const price = maxPrice - (maxPrice - minPrice) * (i / gridLines);
        
        ctx.beginPath();
        ctx.moveTo(xPadding, y);
        ctx.lineTo(canvas.width - xPadding, y);
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.3)';
        ctx.stroke();
        
        ctx.fillText(`$${price.toFixed(2)}`, xPadding - 5, y + 3);
      }
      
      // Draw stock price line
      const drawPriceLine = (data: Array<{date: Date; price: number}>, color: string, lineWidth: number) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        
        for (let i = 0; i < data.length; i++) {
          const point = data[i];
          const x = xPadding + (i / (data.length - 1)) * chartWidth;
          const y = yPadding + (1 - (point.price - minPrice) / (maxPrice - minPrice)) * chartHeight;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      };
      
      // Draw main stock line
      drawPriceLine(priceData, '#8FBDD3', 2);
      
      // Draw comparison stocks with different colors
      const comparisonColors = ['#C06C84', '#6C5B7B', '#355C7D'];
      for (let i = 1; i < stocks.length; i++) {
        const color = comparisonColors[(i - 1) % comparisonColors.length];
        drawPriceLine(stocks[i].priceHistory, color, 1.5);
      }
      
      // Draw forecast if enabled
      if (showForecast && forecastData) {
        // Connect historical data with forecast
        ctx.beginPath();
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = '#6C5B7B';
        ctx.lineWidth = 2;
        
        const lastHistoricalPoint = priceData[priceData.length - 1];
        const firstForecastPoint = forecastData.predictions[0];
        
        const lastX = xPadding + ((priceData.length - 1) / (priceData.length - 1)) * chartWidth;
        const lastY = yPadding + (1 - (lastHistoricalPoint.price - minPrice) / (maxPrice - minPrice)) * chartHeight;
        
        const firstForecastX = lastX + (chartWidth / priceData.length);
        const firstForecastY = yPadding + (1 - (firstForecastPoint.price - minPrice) / (maxPrice - minPrice)) * chartHeight;
        
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(firstForecastX, firstForecastY);
        ctx.stroke();
        
        // Draw the rest of the forecast line
        ctx.beginPath();
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = '#6C5B7B';
        ctx.lineWidth = 2;
        
        ctx.moveTo(firstForecastX, firstForecastY);
        
        for (let i = 1; i < forecastData.predictions.length; i++) {
          const point = forecastData.predictions[i];
          const x = firstForecastX + (i / forecastData.predictions.length) * (chartWidth / 4);
          const y = yPadding + (1 - (point.price - minPrice) / (maxPrice - minPrice)) * chartHeight;
          
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw confidence interval
        ctx.fillStyle = 'rgba(108, 91, 123, 0.1)';
        ctx.beginPath();
        
        for (let i = 0; i < forecastData.predictions.length; i++) {
          const point = forecastData.predictions[i];
          const x = firstForecastX + (i / forecastData.predictions.length) * (chartWidth / 4);
          const yTop = yPadding + (1 - ((point.price + point.confidence) - minPrice) / (maxPrice - minPrice)) * chartHeight;
          
          if (i === 0) {
            ctx.moveTo(x, yTop);
          } else {
            ctx.lineTo(x, yTop);
          }
        }
        
        for (let i = forecastData.predictions.length - 1; i >= 0; i--) {
          const point = forecastData.predictions[i];
          const x = firstForecastX + (i / forecastData.predictions.length) * (chartWidth / 4);
          const yBottom = yPadding + (1 - ((point.price - point.confidence) - minPrice) / (maxPrice - minPrice)) * chartHeight;
          
          ctx.lineTo(x, yBottom);
        }
        
        ctx.closePath();
        ctx.fill();
      }
      
      // Draw indicators if enabled
      if (showIndicators) {
        // Simple implementation of RSI/MACD indicators
        const indicatorHeight = 60;
        const indicatorY = canvas.height - indicatorHeight;
        
        ctx.fillStyle = 'rgba(203, 213, 225, 0.2)';
        ctx.fillRect(xPadding, indicatorY, chartWidth, indicatorHeight);
        
        if (indicatorType === 'rsi') {
          // Draw RSI
          ctx.strokeStyle = '#F4A9A8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          
          const rsiValues = generateMockRSI(priceData.length);
          
          for (let i = 0; i < rsiValues.length; i++) {
            const x = xPadding + (i / (rsiValues.length - 1)) * chartWidth;
            // RSI ranges from 0-100, but we'll focus on 30-70 range
            const y = indicatorY + indicatorHeight - (rsiValues[i] / 100) * indicatorHeight;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          
          ctx.stroke();
          
          // Draw overbought/oversold lines
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.5)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          
          // Overbought line (70)
          const overboughtY = indicatorY + indicatorHeight - (70 / 100) * indicatorHeight;
          ctx.beginPath();
          ctx.moveTo(xPadding, overboughtY);
          ctx.lineTo(canvas.width - xPadding, overboughtY);
          ctx.stroke();
          
          // Oversold line (30)
          const oversoldY = indicatorY + indicatorHeight - (30 / 100) * indicatorHeight;
          ctx.beginPath();
          ctx.moveTo(xPadding, oversoldY);
          ctx.lineTo(canvas.width - xPadding, oversoldY);
          ctx.stroke();
          
          ctx.setLineDash([]);
          
          // RSI label
          ctx.fillStyle = '#94a3b8';
          ctx.textAlign = 'left';
          ctx.font = '10px Inter';
          ctx.fillText('RSI', xPadding + 5, indicatorY + 15);
        } else {
          // Draw MACD
          const macdValues = generateMockMACD(priceData.length);
          
          // Draw histogram
          for (let i = 0; i < macdValues.length; i++) {
            const x = xPadding + (i / (macdValues.length - 1)) * chartWidth;
            const value = macdValues[i];
            const midPoint = indicatorY + indicatorHeight / 2;
            const barHeight = value * (indicatorHeight / 4);
            
            ctx.fillStyle = value >= 0 ? 'rgba(74, 222, 128, 0.6)' : 'rgba(239, 68, 68, 0.6)';
            
            if (value >= 0) {
              ctx.fillRect(x - 1, midPoint - barHeight, 2, barHeight);
            } else {
              ctx.fillRect(x - 1, midPoint, 2, -barHeight);
            }
          }
          
          // MACD label
          ctx.fillStyle = '#94a3b8';
          ctx.textAlign = 'left';
          ctx.font = '10px Inter';
          ctx.fillText('MACD', xPadding + 5, indicatorY + 15);
        }
      }
    };
    
    drawChart();
    
    // Redraw when window resizes
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawChart();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [stocks, timeFrame, showForecast, showIndicators, indicatorType, forecastData]);
  
  // Generate mock RSI values for demonstration
  function generateMockRSI(length: number): number[] {
    const values: number[] = [];
    let value = 50;
    
    for (let i = 0; i < length; i++) {
      // Random walk with mean reversion
      value += (Math.random() - 0.5) * 10;
      
      // Mean reversion
      value = value + (50 - value) * 0.1;
      
      // Bound between 0 and 100
      value = Math.max(0, Math.min(100, value));
      
      values.push(value);
    }
    
    return values;
  }
  
  // Generate mock MACD values for demonstration
  function generateMockMACD(length: number): number[] {
    const values: number[] = [];
    let value = 0;
    
    for (let i = 0; i < length; i++) {
      // Random walk with mean reversion
      value += (Math.random() - 0.5) * 0.5;
      
      // Mean reversion
      value = value * 0.95;
      
      values.push(value);
    }
    
    return values;
  }
  
  return (
    <div className={styles.chartWrapper}>
      <canvas ref={canvasRef} className={styles.chart}></canvas>
      
      {stocks.length > 1 && (
        <div className={styles.legend}>
          {stocks.map((stock, index) => {
            const colors = ['#8FBDD3', '#C06C84', '#6C5B7B', '#355C7D'];
            return (
              <div key={stock.symbol} className={styles.legendItem}>
                <div 
                  className={styles.legendColor}
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span>{stock.symbol}</span>
              </div>
            );
          })}
          
          {showForecast && (
            <div className={styles.legendItem}>
              <div className={styles.legendDash}></div>
              <span>Forecast</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockChart;