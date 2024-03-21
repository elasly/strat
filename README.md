# Strategy_Engine

Strategy_Engine is an innovative application designed to facilitate the testing of trading strategies across various assets including cryptocurrencies, commodities, and other securities. It enables users to download asset data from the internet using crypto exchange APIs or from public sources, define strategy rules, perform backtesting based on user inputs for selected assets and timeframes, and report on strategy performance. The application supports tracking of total trades, winning and losing trades, longs and shorts, maximum drawdown, maximum runup, Sharpe ratio, and compares the results to a buy and hold strategy for the asset.

## Overview

The application leverages Node.js and Express for backend operations, MongoDB for database management, and utilizes several libraries like CCXT for fetching asset data, technicalindicators for calculating trading indicator values, and Chart.js for data visualization. The frontend is developed with the EJS templating engine and Bootstrap for responsive design. Strategy_Engine is optimized for performance, ensuring fast backtesting and providing users with the ability to save calculated indicators to a database for future use.

## Features

- Download asset data from various exchanges using APIs.
- Define and manage trading strategies.
- Perform backtesting of strategies with detailed performance reporting.
- Optimize strategies by adjusting parameters to achieve better performance.
- Secure user authentication and session management.
- Subscription-based access with multiple tiers offering different levels of functionality and data access.

## Getting started

### Requirements

- Node.js
- MongoDB
- Internet connection for fetching asset data and sending emails.

### Quickstart

1. Clone the repository to your local machine.
2. Install the required Node.js packages using `npm install`.
3. Create a `.env` file based on `.env.example` and fill in your database URL, session secret, and email settings.
4. Run the application using `npm start`. The app will be available on `http://localhost:3000` or another port if specified in `.env`.

### License

Copyright (c) 2024."# strat" 
