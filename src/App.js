import React, { useState, useEffect } from 'react';
import Portfolio from './Portfolio';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { v4 as uuidv4 } from 'uuid';

// This is the location we will store localstorage keys for each portfolio
const PORTFOLIO_KEY_LOCATION = "app.portfolio_keys"

// Dark theme to reduce eye strain during development :), can build toggle later 
const theme = createTheme({
  palette: {
    mode: 
      "dark",
  },
})


function App() {
  // Get portfolio local storage keys if possible, otherwise default to empty
  const [portfolioStorageKeys, setPortfolioStorageKeys] = useState(JSON.parse(localStorage.getItem(PORTFOLIO_KEY_LOCATION)) || [])

  // Save portfolio save keys whenever it changes
  useEffect(() => {
    localStorage.setItem(PORTFOLIO_KEY_LOCATION, JSON.stringify(portfolioStorageKeys))
    console.log("Saving portfolio storage keys at " + PORTFOLIO_KEY_LOCATION + ": ")
    console.log(JSON.stringify(portfolioStorageKeys))
  }, [portfolioStorageKeys])

  // Add portfolio function on button click
  function addPortfolio() {
    const uniqueID = uuidv4() // Generate unique ID to avoid key conflicts
    console.log("Adding new portfolio using key: " + uniqueID)
    setPortfolioStorageKeys(prevKeys => 
      [...prevKeys, {key: uniqueID, path: 'app.port_' + uniqueID}]
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div style={{marginLeft:50, marginTop: 15,}}>
        <CssBaseline />
        <Typography variant="h5" align="center" sx={{mb: 2}}>
          Stock Portfolio Manager
        </Typography> 
        {portfolioStorageKeys.map(
          portfolioKey => {
            return <Portfolio key={portfolioKey} localStorageKey={portfolioKey}/>
          }
        )}
        <Button variant="outlined" startIcon={<AddIcon />} onClick={addPortfolio} sx={{ml:80}}>
          Add Portfolio
        </Button>
      </div>
    </ThemeProvider>
  )
}

export default App;
