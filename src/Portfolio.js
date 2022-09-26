import React,  { useState, useRef } from 'react'
import Stock from './Stock'
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios'

export default function Portfolio({ stocks, toggleSelected }) {

  const [stockList, setStocks] = useState(stocks)
  const stockInputRef = useRef()

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

  function addStock(ticker, p) {
    setStocks(prevStocks => {
      return [...prevStocks, {ticker:ticker, selected:false, price:p, id:ticker}]
    })
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
    stockInputRef.current.value = null // Clear the input text 
  }

  return (
    <>
      <h2>Portfolio 1</h2>
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
          // renderCell: (params) => <ProgressBar value={Number(params.value)} />,
          //renderEditCell: (params) => <EditProgress {...params} />,
        },
        {
          field: 'price',
          headerName: 'Last Trade Price',
          editable: false,
          // renderCell: (params) => <ProgressBar value={Number(params.value)} />,
          //renderEditCell: (params) => <EditProgress {...params} />,
        }
      ]}
    />
  </>
  )
}
