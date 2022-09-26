import React, { useState, useRef, useEffect } from 'react';
import Portfolio from './Portfolio';
import axios from 'axios'
import FetchStockData from './FetchStockData';

const LOCAL_STORAGE_KEY = 'stockPortfolioApp.stocks'

function App() {
  // Get initial state containing the data 
  const [stocks, setStocks] = useState([])
  

  // Load stocks
  useEffect(() => {
    const storedStocks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (storedStocks) setStocks(storedStocks)
  }, [])

  // Save stocks whenever stocks list changes
  useEffect(() => {
    // if (stocks.length > 0) // Make sure we don't clear 
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stocks))
    console.log(stocks)
  }, [stocks])

  function toggleSelected(ticker) {
    const newStocks = [...stocks]
    const stock = newStocks.find(stock => stock.ticker === ticker)
    stock.selected = !stock.selected
    setStocks(newStocks)
  }

  function addStock(ticker, p) {
    setStocks(prevStocks => {
      return [...prevStocks, {ticker:ticker, selected:false, price:p, id:ticker}]
    })
  }

  /*function handleAddStock(e) {
    var ticker = stockInputRef.current.value
    if (ticker === '') return 
    ticker = ticker.toUpperCase()
    // If duplicate ticker, then don't add
    if (stocks.filter(
        stockObj => stockObj.ticker === ticker
      ).length > 0
    ) {
      console.log("This stock has already been added!")
      return
    }
    const result = axios.get(`https://api.polygon.io/v2/last/trade/${ticker}?apiKey=O5xlHHsueMONXtvinQqNeBzTF2wUq5fI`)
        .then(res => {
            console.log(res.data.results.p)
            addStock(ticker, res.data.results.p)
        })
        .catch(err => {
            console.log(err)
        })

    //setStocks(
    //  prevStocks => {
        
    //    return [...prevStocks, {ticker: ticker, selected: false, price: -1}]
    //  }
    //)
    stockInputRef.current.value = null // Clear the input text 
  }*/

  /*
  function handleRemoveSelected() {
    const newStocks = stocks.filter(stock => stock.selected === false)
    setStocks(newStocks)
  }*/

  function fetchStockData() {
  }

  return (
    <>
      <h1>My Investment Portfolios</h1>
      
      <Portfolio stocks={stocks} toggleSelected={toggleSelected}/>
    </>
    
  )
}

export default App;
