import React, {useState, useEffect} from 'react'
import axios from 'axios'

  // Wraps API calls and returns data async
  async function FetchTickerData(ticker) {
    const resPrice = await axios.get(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apiKey=O5xlHHsueMONXtvinQqNeBzTF2wUq5fI`)
    const resName = await axios.get(`https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=O5xlHHsueMONXtvinQqNeBzTF2wUq5fI`) 
    const prevClose = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=L8kLWRfuqRapQu6ppgXKNfAJqQkzjejp`)
    console.log(resPrice)
    console.log(resName)
    console.log(prevClose)
    const lastPrice = resPrice.data.ticker.lastTrade.p
    const prevClosePrice = prevClose.data.results[0].c
    console.log(prevClosePrice)
    const companyName = resName.data.results.name
    return {lastPrice: lastPrice, prevClosePrice: prevClosePrice, companyName:companyName}
}

export default FetchTickerData