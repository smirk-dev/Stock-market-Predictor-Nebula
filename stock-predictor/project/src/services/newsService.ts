import { NewsItem } from '../types';

// Sample news data with sentiment
const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Apple unveils revolutionary AI features for iPhone at WWDC 2025',
    source: 'TechCrunch',
    url: '#',
    date: '1 hour ago',
    sentiment: 'positive'
  },
  {
    id: '2',
    title: 'Tesla\'s robotaxi launch delayed again amidst production challenges',
    source: 'Reuters',
    url: '#',
    date: '3 hours ago',
    sentiment: 'negative'
  },
  {
    id: '3',
    title: 'Microsoft partners with OpenAI to bring advanced AI capabilities to Azure',
    source: 'Bloomberg',
    url: '#',
    date: '5 hours ago',
    sentiment: 'positive'
  },
  {
    id: '4',
    title: 'NVIDIA earnings exceed expectations, driven by AI chip demand',
    source: 'CNBC',
    url: '#',
    date: '7 hours ago',
    sentiment: 'positive'
  },
  {
    id: '5',
    title: 'Amazon faces antitrust lawsuit in three more states',
    source: 'Wall Street Journal',
    url: '#',
    date: '9 hours ago',
    sentiment: 'negative'
  },
  {
    id: '6',
    title: 'Meta\'s latest VR headset sales fall short of projected figures',
    source: 'The Verge',
    url: '#',
    date: '12 hours ago',
    sentiment: 'negative'
  },
  {
    id: '7',
    title: 'Google announces strategic investment in quantum computing start-up',
    source: 'TechRadar',
    url: '#',
    date: '1 day ago',
    sentiment: 'neutral'
  },
  {
    id: '8',
    title: 'Market volatility expected to continue amid interest rate uncertainty',
    source: 'Financial Times',
    url: '#',
    date: '1 day ago',
    sentiment: 'neutral'
  },
  {
    id: '9',
    title: 'Tech sector poised for growth in Q3, analysts predict',
    source: 'MarketWatch',
    url: '#',
    date: '2 days ago',
    sentiment: 'positive'
  },
  {
    id: '10',
    title: 'Federal Reserve signals potential rate cut in upcoming meeting',
    source: 'CNN Business',
    url: '#',
    date: '2 days ago',
    sentiment: 'positive'
  }
];

// Stock to news mapping
const stockNewsMapping: { [key: string]: string[] } = {
  'AAPL': ['1', '8', '9'],
  'TSLA': ['2', '8', '9'],
  'MSFT': ['3', '7', '8', '9'],
  'AMZN': ['5', '8', '9', '10'],
  'GOOGL': ['7', '8', '9'],
  'META': ['6', '8', '9'],
  'NVDA': ['4', '7', '8', '9']
};

// Fetch news data for selected stocks
export const fetchNewsData = async (symbols: string[]): Promise<NewsItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Get all relevant news IDs for the selected symbols
  const relevantNewsIds = symbols.reduce<Set<string>>((ids, symbol) => {
    const newsIds = stockNewsMapping[symbol] || [];
    newsIds.forEach(id => ids.add(id));
    return ids;
  }, new Set());
  
  // Filter and return the news items
  return mockNewsData
    .filter(news => relevantNewsIds.has(news.id))
    .sort((a, b) => {
      // Sort by date (recent first) - simplified for mock data
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });
};