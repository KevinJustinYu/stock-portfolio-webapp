# Stock Portfolio Webapp [WIP]

This is a simple webapp for: https://gist.github.com/davidtsai/21b12d2c5a9cf1a7f68d029a54f272b9

## Features
* Add/remove stocks
* Add portfolios
* Persist across refresh (using localstorage for now)
* Fetch and display last trade price for stock
* Color indicator for determining if current price is higher or lower than previous close price
* Fetch and display full company name
* Add stock using enter key rather than requiring button click
* Datagrid display for each portfolio (allowing sorting/filtering/bulk selecting)
* Remove portfolio functionality
* Customized alert message when input is invalid or existing ticker
* Shows previous close price (rather than previous day close price)

## To Do: 
* Fix stlying issues (get rid of hardcoded CSS params and make compatible with different browsers/sizes, make portfolio names bigger, fix portfolio name textbox color, etc)
* Sparkline vizualization for each stock
* Remove uneccesary template files from project to improve readability/navigability
