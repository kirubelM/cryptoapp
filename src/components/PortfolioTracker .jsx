import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PortfolioTracker = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const apiKey = 'YOUR_API_KEY';
        const secretKey = 'YOUR_SECRET_KEY';

        // Fetch account balances
        const balancesResponse = await axios.get(
          'https://api.kucoin.com/api/v1/accounts',
          {
            headers: {
              'KC-API-KEY': apiKey,
              'KC-API-NONCE': Date.now(),
              'KC-API-SIGNATURE': generateSignature('/api/v1/accounts', '', secretKey),
            },
          }
        );

        // Extract relevant data from the balances response
        const balances = balancesResponse.data.data;
        const filteredBalances = balances.filter((balance) => balance.balance > 0);

        // Fetch market prices
        const marketPricesResponse = await axios.get(
          'https://api.kucoin.com/api/v1/market/allTickers'
        );

        // Create a map of symbol to price from the market prices response
        const marketPrices = {};
        marketPricesResponse.data.data.forEach((ticker) => {
          marketPrices[ticker.symbol] = parseFloat(ticker.ticker.price);
        });

        // Calculate portfolio value and update state
        const updatedPortfolio = filteredBalances.map((balance) => {
          const coinValue = balance.balance * marketPrices[balance.currency];
          return {
            coin: balance.currency,
            balance: balance.balance,
            value: coinValue,
          };
        });

        setPortfolio(updatedPortfolio);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };

    fetchPortfolio();
  }, []);

  const generateSignature = (endpoint, queryString, secretKey) => {
    // Implement your signature generation logic here
    // Refer to the KuCoin API documentation for details on how to generate the signature
    // This example assumes you have implemented the signature generation correctly
    return 'YOUR_SIGNATURE';
  };

  if (loading) {
    return <p>Loading portfolio data...</p>;
  }

  return (
    <div>
      <h2>Portfolio Tracker</h2>
      {portfolio.map((item) => (
        <div key={item.coin}>
          <p>Coin: {item.coin}</p>
          <p>Balance: {item.balance}</p>
          <p>Value: ${item.value.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default PortfolioTracker;
