import React,  { useState, useRef, useEffect } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios'
import Editable from 'react-editable-title'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function Portfolio({ localStorageKey }) {

  // Get stocks for this portfolio if exists, else default to empty portfolio
  const [stockList, setStocks] = useState(JSON.parse(localStorage.getItem(localStorageKey.path)) || [])
  const stockInputRef = useRef()

  // Get the portfolio name from localstorage 
  const [portfolioName, setPortfolioName] = useState(localStorage.getItem(localStorageKey.path + "_name") || "Untitled Portfolio")

  // Save stocks whenever stocks list changes
  useEffect(() => {
    localStorage.setItem(localStorageKey.path, JSON.stringify(stockList))
    console.log(stockList)
  }, [stockList])

  // Save portfolio name whenever it changes
  useEffect(() => {
    localStorage.setItem(localStorageKey.path + "_name", portfolioName)
    console.log("Saving new portfolio name: " + portfolioName)
    console.log(localStorage.getItem(localStorageKey.path + "_name"))
  }, [portfolioName])

  // Updates stockList with new selections
  function handleSelection(selections) {
    console.log(selections)
    const newStocks = [...stockList]
    newStocks.map(stock => {
      if (selections.some(item => stock.ticker === item)) {
        stock.selected = true
        return stock
      }
      else {
        stock.selected = false
        return stock
      }
    })
    setStocks(newStocks)
  }

  // Secondary function that gets called upon adding stock
  function addStock(ticker, p, prevDayClosingPrice) {
    var currStocks = []
    setStocks(prevStocks => {
      currStocks = [...prevStocks, {ticker:ticker, selected:false, price:p, id:ticker, key: ticker, prevDayClosingPrice:prevDayClosingPrice, companyName:''}]
      return [...prevStocks, {ticker:ticker, selected:false, price:p, id:ticker, key: ticker, prevDayClosingPrice:prevDayClosingPrice, companyName:''}]
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
  
  /* Adds company name to the corresponding input stock
   This is separate since there is a separate async API call */
  function addStockName(ticker, name, currStocks) {
    console.log(currStocks)
    currStocks.map(stock => {
      if (stock.ticker === ticker) {
        stock.companyName = name
        return stock
      }
      else return stock
    })
    setStocks(currStocks)
  }

  // Remove stocks that are selected
  function handleRemoveSelected() {
    const newStocks = stockList.filter(stock => stock.selected === false)
    setStocks(newStocks)
  }

  function updatePortfolioName(newName) {
    setPortfolioName(newName)
  }

  // Function that gets called when add stock button is clicked
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
    
    // Initiate async API call
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

  /* This function is called when in stock input field, and allows user to add stock
  by pressing the enter key */
  const handleKeyPress = e => {
      //it triggers by pressing the enter key
    if (e.key === 'Enter') {
      handleAddStock(e)
    }
  };

  return (
    <>
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <Editable cb={updatePortfolioName} text={portfolioName} placeholder='Enter portfolio name' editButton controlButtons/>
        <TextField inputRef={stockInputRef} onKeyPress={handleKeyPress} type="text" placeholder='Input stock ticker' size='small' sx={{ml: 6}}/>
        <Button onClick={handleAddStock} variant="outlined" sx={{ml: 1}}>Add Stock</Button>
        <Button onClick={handleRemoveSelected} variant="outlined" sx={{ml: 1}}>Remove Selected</Button>
      </div>
        <DataGrid
        autoHeight
        density="compact"
        hideFooter
        checkboxSelection
        onSelectionModelChange={handleSelection}
        // getRowClassName={(params) => `super-app-theme--${params.row.prevDayClosingPrice < params.row.price}`}
        sx={{ mt: 0.5, mb: 4, ml: 42, width:800,
          '& .super-app-theme--true': {
            color: '#4E9F3D'
          },
          '& .super-app-theme--false': {
            color: '#E94560'
          }
        }}
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
            headerName: 'Prev Day Close Price',
            editable: false,
            width: 175,
          },
          {
            field: 'price',
            headerName: 'Last Trade Price',
            editable: false,
            width:135,
            cellClassName: (params) =>
            `super-app-theme--${params.row.prevDayClosingPrice < params.row.price}`,
          }
        ]}
      />
    </>
  )
}
