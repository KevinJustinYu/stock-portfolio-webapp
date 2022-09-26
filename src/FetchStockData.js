import React, {useState, useEffect} from 'react'
import axios from 'axios'

function FetchStockData({ stock, toggleSelected }) {
  const [data, setData] = useState({})

  useEffect(() => {
    axios.get(`https://api.polygon.io/v2/last/trade/${stock.ticker}?apiKey=O5xlHHsueMONXtvinQqNeBzTF2wUq5fI`)
        .then(res => {
            console.log(res)
            setData(res.data)
        })
        .catch(err => {
            console.log(err)
        })
  }, [])
  
  function handleStockToggle() {
    toggleSelected(stock.ticker)
  }

  return (
    <div>
        <label>
            <input type="checkbox" checked={stock.selected} onChange={handleStockToggle}></input>
            {stock.ticker}
            {stock.price}
        </label>
    </div>
  )
}

export default FetchStockData