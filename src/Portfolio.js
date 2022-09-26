import React,  { useState, useRef, useEffect } from 'react'
import Stock from './Stock'
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios'

export default function Portfolio({ portfolioName, localStorageKey }) {

  const [stockList, setStocks] = useState([])
  const stockInputRef = useRef()

  // Load stocks
  useEffect(() => {
    const storedStocks = JSON.parse(localStorage.getItem(localStorageKey))
    if (storedStocks) setStocks(storedStocks)
  }, [])

  // Save stocks whenever stocks list changes
  useEffect(() => {
    if (stockList.length > 0) // Make sure we don't clear 
      localStorage.setItem(localStorageKey, JSON.stringify(stockList))
    console.log(stockList)
  }, [stockList])

  // Update stockList with new selections
  function handleSelection(selections) {
    console.log(selections)
    const newStocks = [...stockList]
    const stock = newStocks.map(stock => {
      if (selections.some(item => stock.ticker === item))
        stock.selected = true 
      else 
        stock.selected = false
    })
    setStocks(newStocks)
  }

  function addStock(ticker, p, prevDayClosingPrice) {
    var currStocks = []
    setStocks(prevStocks => {
      currStocks = [...prevStocks, {ticker:ticker, selected:false, price:p, id:ticker, prevDayClosingPrice:prevDayClosingPrice, companyName:''}]
      return [...prevStocks, {ticker:ticker, selected:false, price:p, id:ticker, prevDayClosingPrice:prevDayClosingPrice, companyName:''}]
    })
    axios.get(`https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=O5xlHHsueMONXtvinQqNeBzTF2wUq5fI`) 
      .then(res => {
        console.log(res.data.results.name)
        addStockName(ticker, res.data.results.name, currStocks)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function addStockName(ticker, name, currStocks) {
    console.log(currStocks)
    currStocks.map(stock => {
      if (stock.ticker == ticker)
        stock.companyName = name
      else
        stock.companyName = stock.companyName
    })
    setStocks(currStocks)
  }

  // Remove stocks that are selected
  function handleRemoveSelected() {
    const newStocks = stockList.filter(stock => stock.selected === false)
    setStocks(newStocks)
  }

  function handleAddStock(e) {
    var ticker = stockInputRef.current.value
    if (ticker === '') return 
    ticker = ticker.toUpperCase()
    // If duplicate ticker, then don't add
    if (stockList.filter(
        stockObj => stockObj.ticker === ticker
      ).length > 0
    ) {
      console.log("This stock has already been added!")
      return
    }
    
    axios.get(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apiKey=O5xlHHsueMONXtvinQqNeBzTF2wUq5fI`)
        .then(res => {
            //console.log(res.data)
            const lastPrice = res.data.ticker.lastTrade.p
            const prevDayClosingPrice = res.data.ticker.prevDay.c
            addStock(ticker, lastPrice, prevDayClosingPrice)
        })
        .catch(err => {
            console.log(err)
        })

    stockInputRef.current.value = null // Clear the input text 
  }

  return (
    <>
      <h2>{portfolioName}</h2>
        <input ref={stockInputRef} type="text"/>
        <button onClick={handleAddStock}>Add Stock</button>
        <button onClick={handleRemoveSelected}>Remove Selected</button>
      <DataGrid
      autoHeight
      density="compact"
      hideFooter
      checkboxSelection
      onSelectionModelChange={handleSelection}
      rows={stockList}
      columns={[ // column definition example
        {
          field: 'ticker',
          headerName: 'Ticker',
          editable: false,
        },
        {
          field: 'companyName',
          headerName: 'Company Name',
          editable: false,
          width:300,
        },
        {
          field: 'prevDayClosingPrice',
          headerName: 'Prev Close',
          editable: false,
        },
        {
          field: 'price',
          headerName: 'Last Trade Price',
          editable: false,
        }
      ]}
    />
  </>
  )
}
