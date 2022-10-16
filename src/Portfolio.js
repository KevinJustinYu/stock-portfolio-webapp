import React,  { useState, useRef, useEffect } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios'
import Editable from 'react-editable-title'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FetchTickerData from './FetchTickerData';

const INVALID_TICKER_MSG = "Please check your ticker input and try again."
const EXISTING_TICKER_MSG = "This stock is already in your porfolio."

export default function Portfolio({ localStorageKey, deletePortfolio }) {

  // Get stocks for this portfolio if exists, else default to empty portfolio
  const [stockList, setStocks] = useState(JSON.parse(localStorage.getItem(localStorageKey.path)) || [])
  const stockInputRef = useRef()

  const [inputStockIsValid, setInputStockIsValid] = useState(true)
  const [invalidInputText, setInvalidInputText] = useState(INVALID_TICKER_MSG)

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
    console.log("In handle selections. Selections: ")
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
    console.log("In handleSelection. New stockList:")
    console.log(JSON.stringify(newStocks))
    setStocks(newStocks)
    console.log(JSON.stringify(stockList))
  }


  // Function to delete the portfolio
  function handleDeletePortfolio() {
    deletePortfolio(localStorageKey.key)
  }

  const handleClose = () => {
    setInputStockIsValid(true);
  };

  // Adds stock to list with data
  function addStock(ticker, p, prevClosePrice, name) {
    // Set stock list (without price data)
    setStocks(prevStocks => {
      return [...prevStocks, {ticker:ticker, selected:false, id:ticker, key: ticker, price:p, prevClosePrice:prevClosePrice, companyName:name}]
    })
  }

  // Remove stocks that are selected
  function handleRemoveSelected() {
    const newStocks = stockList.filter(stock => stock.selected === false)
    setStocks(newStocks)
  }

  function updatePortfolioName(newName) {
    setPortfolioName(newName)
  }

  // Fetches stock data using API calls and adds single stock
  async function fetchAndAddStock(ticker) {
    try{
      const res = await FetchTickerData(ticker)
      addStock(ticker, res.lastPrice, res.prevClosePrice, res.companyName)
      setInputStockIsValid(true)
    } catch (err) {
      console.log(err)
      setInputStockIsValid(false)
      setInvalidInputText(INVALID_TICKER_MSG)
      console.log(inputStockIsValid)
    }
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
      console.log(EXISTING_TICKER_MSG)
      setInputStockIsValid(false)
      setInvalidInputText(EXISTING_TICKER_MSG)
      return
    }
    // Initiate async API call
    fetchAndAddStock(ticker)

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
        <Button onClick={handleRemoveSelected} variant="outlined" sx={{ml: 1}}>Remove Selected Stocks</Button>
        <Button onClick={handleDeletePortfolio} variant='outlined'sx={{ml: 1}}>Delete Portfolio</Button>
        <Dialog
          open={!inputStockIsValid}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Invalid stock ticker"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {invalidInputText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
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
            field: 'prevClosePrice',
            headerName: 'Prev Close Price',
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
