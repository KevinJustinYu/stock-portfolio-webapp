import React, { useState, useRef, useEffect } from 'react';
import Portfolio from './Portfolio';
import axios from 'axios'
import FetchStockData from './FetchStockData';

const PORTFOLIO_STORAGE_KEY = 'stockPortfolioApp.stocks'

function App() {
  const [portfolioStorageKeys, setPortfolioStorageKeys] = useState([])

  return (
    <>
      <h1>Portfolio Manager</h1>
      
      <Portfolio portfolioName='Portfolio 1' localStorageKey={PORTFOLIO_STORAGE_KEY}/>
    </>
    
  )
}

export default App;
