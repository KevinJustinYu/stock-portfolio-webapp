import React from 'react'
import { DataGrid } from "@mui/x-data-grid";

export default function Stock({ stock, toggleSelected }) {

  function handleStockToggle() {
    toggleSelected(stock.ticker)
  }

  return (
    <>
    <div>
        <label>
            <input type="checkbox" checked={stock.selected} onChange={handleStockToggle}></input>
            {stock.ticker}
        </label>
    </div>
    <DataGrid
    autoHeight
    density="compact"
    hideFooter
    rows={[
      {
        id: "abc",
        ticker: stock.ticker,
        lastPrice: stock.price,
      },
    ]}
    columns={[ // column definition example
      {
        field: 'ticker',
        headerName: 'Ticker',
        editable: false,
        // renderCell: (params) => <ProgressBar value={Number(params.value)} />,
        //renderEditCell: (params) => <EditProgress {...params} />,
      },
      {
        field: 'lastPrice',
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
