import React, { useState, useEffect } from 'react';
import { Select, Card, Row, Col, Input, Typography } from 'antd';
import axios from 'axios';
import PortfolioTracker from './PortfolioTracker ';
const Portfolio = ({ currentPortfolio }) => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [coins, setCoins] = useState([]);
  const [portfolio, setPortfolio] = useState(0);
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/list'
        );
        setCoins(response.data);
      } catch (error) {
        console.error('Error fetching coin list:', error);
      }
    };

    fetchCoins();
  }, []);
  const fetchPrice = async (coin) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
      );
      const coinData = response.data[coin.toLowerCase()];
      if (coinData) {
        const { usd } = coinData;
        const formattedNumber = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(usd);
        setSelectedPrice(formattedNumber);
      } else {
        console.log("Price data not available for the selected coin.");
      }
    } catch (error) {
      console.error('Error fetching price data:', error);
    }
  };

  const handleSelectCoin = (value) => {
    setSelectedCoin(value);
    fetchPrice(value);
  }


  console.log("FINAL PRICE:", selectedPrice, selectedCoin)
  return (
    <div>
      <PortfolioTracker />
      {/* {selectedPrice ? ( */}
      <Typography>Search to add coin to portfolio</Typography>
      {/* ) : (
        <p>Loading price data...</p>
      )} */}
      <Select
        showSearch
        size="10"
        style={{ width: 200 }}

        className='select-coin-to-add'
        placeholder='Select a Crypto'
        optionFilterProp='children'
        onSelect={handleSelectCoin}

      >
        {coins.map((coin) => (
          <Select.Option key={coin.id} value={coin.id}>
            {coin.name}
          </Select.Option>

        ))}
      </Select>

      {
        selectedCoin && (
          <Card className='add-coin-card-container'>
            <h2>{selectedCoin}</h2>
            <p>$ {selectedPrice}</p>
          </Card>
        )
      }
    </div >
  );
}

export default Portfolio