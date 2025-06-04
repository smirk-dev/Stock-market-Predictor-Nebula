import React, { useState, useEffect, useCallback } from 'react';
import { Newspaper, TrendingUp, TrendingDown, Repeat } from 'lucide-react';
import { Stock } from '../../types';
import { fetchNewsData } from '../../services/newsService';
import styles from './NewsPanel.module.css';

interface NewsPanelProps {
  selectedStocks: Stock[];
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const NewsPanel: React.FC<NewsPanelProps> = ({ selectedStocks }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const getNews = useCallback(async () => {
    if (selectedStocks.length === 0) {
      setNews([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const symbols = selectedStocks.map(stock => stock.symbol);
      const newsData = await fetchNewsData(symbols);
      setNews(newsData);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStocks]);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getNews();
    }, 300); // Add debounce delay

    return () => clearTimeout(timeoutId);
  }, [getNews]);
  
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp size={16} className={styles.sentimentPositive} />;
      case 'negative':
        return <TrendingDown size={16} className={styles.sentimentNegative} />;
      default:
        return <Repeat size={16} className={styles.sentimentNeutral} />;
    }
  };
  
  return (
    <div className={`${styles.newsPanel} glass-card`}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>
          <Newspaper size={16} />
          Market Sentiment
        </h3>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading news...</p>
        </div>
      ) : news.length === 0 ? (
        <div className={styles.emptyState}>
          <Newspaper size={24} />
          <p>Select a stock to view relevant news</p>
        </div>
      ) : (
        <div className={styles.newsList}>
          {news.map(item => (
            <a 
              key={item.id} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.newsItem}
            >
              <div className={styles.newsHeader}>
                <span className={styles.newsSource}>{item.source}</span>
                <span className={styles.newsDate}>{item.date}</span>
              </div>
              <h4 className={styles.newsTitle}>{item.title}</h4>
              <div className={styles.newsSentiment}>
                {getSentimentIcon(item.sentiment)}
                <span className={styles.sentimentLabel}>
                  {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)} Sentiment
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
      
      <div className={styles.sentimentSummary}>
        <div className={styles.sentimentTitle}>Overall Market Sentiment</div>
        <div className={styles.sentimentMeter}>
          <div 
            className={styles.sentimentIndicator} 
            style={{ width: '65%' }}
          ></div>
        </div>
        <div className={styles.sentimentLabels}>
          <span>Bearish</span>
          <span>Neutral</span>
          <span>Bullish</span>
        </div>
      </div>
    </div>
  );
};

export default NewsPanel;