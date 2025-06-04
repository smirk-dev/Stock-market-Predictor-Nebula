import React from 'react';
import { BarChart, PieChart, Target } from 'lucide-react';
import { ForecastData } from '../../types';
import styles from './AccuracyPanel.module.css';

interface AccuracyPanelProps {
  forecastData: ForecastData | null;
}

const AccuracyPanel: React.FC<AccuracyPanelProps> = ({ forecastData }) => {
  return (
    <div className={`${styles.accuracyPanel} glass-card`}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Forecast Accuracy</h3>
        <div className={styles.modelSelector}>
          <button className={`${styles.modelButton} ${styles.active}`}>LSTM</button>
          <button className={styles.modelButton}>ARIMA</button>
        </div>
      </div>
      
      {!forecastData ? (
        <div className={styles.emptyState}>
          <Target size={24} />
          <p>Select a stock to view forecast accuracy metrics</p>
        </div>
      ) : (
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <Target size={18} />
            </div>
            <div className={styles.metricContent}>
              <h4 className={styles.metricTitle}>R² Score</h4>
              <div className={styles.metricValue}>{forecastData.metrics.r2Score}</div>
            </div>
          </div>
          
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <PieChart size={18} />
            </div>
            <div className={styles.metricContent}>
              <h4 className={styles.metricTitle}>MAPE</h4>
              <div className={styles.metricValue}>{forecastData.metrics.mape}%</div>
            </div>
          </div>
          
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <BarChart size={18} />
            </div>
            <div className={styles.metricContent}>
              <h4 className={styles.metricTitle}>MAE</h4>
              <div className={styles.metricValue}>${forecastData.metrics.mae}</div>
            </div>
          </div>
          
          <div className={styles.metricCard}>
            <div className={`${styles.accuracyIndicator} ${getAccuracyClass(forecastData.metrics.r2Score)}`}>
              <span className={styles.accuracyValue}>{Math.round(forecastData.metrics.r2Score * 100)}%</span>
              <span className={styles.accuracyLabel}>Accuracy</span>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.backtestSection}>
        <h4 className={styles.sectionTitle}>Backtest Results</h4>
        {forecastData ? (
          <div className={styles.backtestInfo}>
            <div className={styles.backtestResult}>
              <span className={styles.backtestLabel}>Prediction Window:</span>
              <span className={styles.backtestValue}>{forecastData.backtestInfo.window} days</span>
            </div>
            <div className={styles.backtestResult}>
              <span className={styles.backtestLabel}>Training Data:</span>
              <span className={styles.backtestValue}>{forecastData.backtestInfo.trainingData}</span>
            </div>
            <div className={styles.backtestResult}>
              <span className={styles.backtestLabel}>Last Updated:</span>
              <span className={styles.backtestValue}>{forecastData.backtestInfo.lastUpdated}</span>
            </div>
          </div>
        ) : (
          <div className={styles.emptyBacktest}>No backtest data available</div>
        )}
      </div>
    </div>
  );
};

// Helper function to get accuracy class based on R² score
function getAccuracyClass(r2Score: number): string {
  if (r2Score >= 0.9) return styles.excellent;
  if (r2Score >= 0.8) return styles.good;
  if (r2Score >= 0.7) return styles.average;
  return styles.poor;
}

export default AccuracyPanel;