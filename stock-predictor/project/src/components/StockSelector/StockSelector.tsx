import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Plus, Tag } from 'lucide-react';
import { searchStocks } from '../../services/stockService';
import styles from './StockSelector.module.css';

interface StockSelectorProps {
  onStocksSelected: (stocks: string[]) => void;
  defaultStocks?: string[];
}

const StockSelector: React.FC<StockSelectorProps> = ({ 
  onStocksSelected,
  defaultStocks = []
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedStocks, setSelectedStocks] = useState<string[]>(defaultStocks);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentStocks, setRecentStocks] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load recent stocks from localStorage
    const savedRecentStocks = localStorage.getItem('nebulastock-recent');
    if (savedRecentStocks) {
      setRecentStocks(JSON.parse(savedRecentStocks));
    }
    
    // Initialize with default stocks
    if (defaultStocks.length > 0) {
      setSelectedStocks(defaultStocks);
      onStocksSelected(defaultStocks);
    }
  }, [defaultStocks, onStocksSelected]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (inputValue.length > 0) {
        const results = await searchStocks(inputValue);
        setSearchResults(results);
        setIsDropdownOpen(true);
      } else {
        setSearchResults([]);
        setIsDropdownOpen(false);
      }
    }, 300);
    
    return () => clearTimeout(searchTimeout);
  }, [inputValue]);
  
  const handleAddStock = (symbol: string) => {
    if (!selectedStocks.includes(symbol)) {
      const newSelectedStocks = [...selectedStocks, symbol];
      setSelectedStocks(newSelectedStocks);
      onStocksSelected(newSelectedStocks);
      
      // Add to recent stocks
      const newRecentStocks = [symbol, ...recentStocks.filter(s => s !== symbol)].slice(0, 5);
      setRecentStocks(newRecentStocks);
      localStorage.setItem('nebulastock-recent', JSON.stringify(newRecentStocks));
    }
    
    setInputValue('');
    setIsDropdownOpen(false);
  };
  
  const handleRemoveStock = (symbol: string) => {
    const newSelectedStocks = selectedStocks.filter(s => s !== symbol);
    setSelectedStocks(newSelectedStocks);
    onStocksSelected(newSelectedStocks);
  };
  
  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      setIsDropdownOpen(true);
    }
  };
  
  const popularStocks = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA', 'META', 'NVDA'];

  return (
    <div className={styles.stockSelector}>
      <div className={styles.selectedStocks}>
        {selectedStocks.map(stock => (
          <div key={stock} className={styles.stockTag}>
            <span>{stock}</span>
            <button 
              className={styles.removeButton} 
              onClick={() => handleRemoveStock(stock)}
              aria-label={`Remove ${stock}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        <div className={styles.searchContainer} ref={dropdownRef}>
          <div className={styles.searchInputWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search stocks..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={handleInputFocus}
            />
          </div>
          
          {isDropdownOpen && (
            <div className={styles.dropdown}>
              {inputValue.length === 0 && (
                <>
                  {recentStocks.length > 0 && (
                    <div className={styles.dropdownSection}>
                      <h3 className={styles.dropdownTitle}>
                        <span>Recent</span>
                      </h3>
                      <div className={styles.dropdownList}>
                        {recentStocks.map(stock => (
                          <button
                            key={stock}
                            className={styles.dropdownItem}
                            onClick={() => handleAddStock(stock)}
                          >
                            <span>{stock}</span>
                            <Plus size={14} className={styles.addIcon} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.dropdownSection}>
                    <h3 className={styles.dropdownTitle}>
                      <span>Popular</span>
                    </h3>
                    <div className={styles.dropdownList}>
                      {popularStocks.map(stock => (
                        <button
                          key={stock}
                          className={styles.dropdownItem}
                          onClick={() => handleAddStock(stock)}
                          disabled={selectedStocks.includes(stock)}
                        >
                          <span>{stock}</span>
                          {!selectedStocks.includes(stock) && (
                            <Plus size={14} className={styles.addIcon} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {inputValue.length > 0 && (
                <div className={styles.dropdownSection}>
                  <h3 className={styles.dropdownTitle}>
                    <span>Search Results</span>
                  </h3>
                  <div className={styles.dropdownList}>
                    {searchResults.length > 0 ? (
                      searchResults.map(stock => (
                        <button
                          key={stock}
                          className={styles.dropdownItem}
                          onClick={() => handleAddStock(stock)}
                          disabled={selectedStocks.includes(stock)}
                        >
                          <span>{stock}</span>
                          {!selectedStocks.includes(stock) && (
                            <Plus size={14} className={styles.addIcon} />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className={styles.noResults}>No results found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.categoriesSection}>
        <Tag size={16} className={styles.tagIcon} />
        <div className={styles.categories}>
          <button className={`${styles.category} ${styles.active}`}>Tech</button>
          <button className={styles.category}>Crypto</button>
          <button className={styles.category}>Energy</button>
          <button className={styles.category}>Healthcare</button>
        </div>
      </div>
    </div>
  );
};

export default StockSelector;