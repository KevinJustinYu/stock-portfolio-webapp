import React, { useState, useRef, useEffect } from 'react';
import Portfolio from './Portfolio';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { v4 as uuidv4 } from 'uuid';

const PORTFOLIO_KEY_LOCATION = "app11.portfolio_keys"

function App() {
  const [portfolioStorageKeys, setPortfolioStorageKeys] = useState([])

  // Load portfolio save keys upon startup
  useEffect(() => {
    const keys = JSON.parse(localStorage.getItem(PORTFOLIO_KEY_LOCATION))
    console.log("Loading portfolio storage keys from " + PORTFOLIO_KEY_LOCATION + ": ")
    console.log(keys)
    setPortfolioStorageKeys(keys)
  }, [])

  // Save portfolio save keys whenever it changes
  useEffect(() => {
    localStorage.setItem(PORTFOLIO_KEY_LOCATION, JSON.stringify(portfolioStorageKeys))
    console.log("Saving portfolio storage keys at " + PORTFOLIO_KEY_LOCATION + ": ")
    console.log(JSON.stringify(portfolioStorageKeys))
  }, [portfolioStorageKeys])

  const theme = createTheme({
    palette: {
      mode: 
        "dark",
    },
  })

  function addPortfolio() {
    const uniqueID = uuidv4()
    console.log("Adding new portfolio using key: " + uniqueID)
    setPortfolioStorageKeys(prevKeys => 
      [...prevKeys, {key: uniqueID, path: 'app.port_' + uniqueID}]
    )
  }

  return (
    
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h5" align="center">
        Portfolio Manager
      </Typography>
      {portfolioStorageKeys.map(
      portfolioKey => {
        return <Portfolio key={portfolioKey} localStorageKey={portfolioKey}/>
      }
      )}

      <Button variant="outlined" startIcon={<AddIcon />} onClick={addPortfolio}>
        Add Portfolio
      </Button>
    </ThemeProvider>
    
  )
}

export default App;
