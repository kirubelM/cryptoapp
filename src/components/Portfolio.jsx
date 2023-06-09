import React, { useState, useEffect } from "react";
import {
  Select,
  Card,
  Row,
  Col,
  InputNumber,
  Typography,
  Button,
  Modal,
} from "antd";
import axios from "axios";
import PortfolioTracker from "./PortfolioTracker ";
const Portfolio = ({ currentPortfolio }) => {
  const [searchedCoin, setSearchedCoin] = useState(null); //State of coin searched and selected to add to portfolio
  const [searchedPrice, setSearchedPrice] = useState(null); //State of price of the coin searched and selected to add to portfolio
  const [coinsList, SetCoinsList] = useState([]); //List of coins fetched from api
  const [coinsInPortfolio, setCoinsInPortfolio] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedPrice, setSselectedPrice] = useState(null);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/list"
        );
        SetCoinsList(response.data);
      } catch (error) {
        console.error("Error fetching coin list:", error);
      }
    };
    fetchCoins();
  }, []);

  useEffect(() => {
    if (searchedPrice) {
      setCoinsInPortfolio((prevCoinsInPortfolio) => [
        ...prevCoinsInPortfolio,
        [searchedCoin, searchedPrice],
      ]);
    }
  }, [searchedPrice]);

  const fetchPrice = async (coin) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
      );
      const coinData = response.data[coin.toLowerCase()];
      if (coinData) {
        const { usd } = coinData;
        const formattedNumber = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 10,
          maximumFractionDigits: 10,
        }).format(usd);
        setSearchedPrice(formattedNumber);
      } else {
        console.log("Price data not available for the selected coin.");
      }
    } catch (error) {
      console.error("Error fetching price data:", error);
    }
  };

  const handleSelectCoin = (value) => {
    setSearchedCoin(value);
    fetchPrice(value);
  };
  const handleBuy = (value) => {
    setIsModalVisible(true);
    setSelectedCoin(value);
  };
  const handleSell = (value) => {
    setIsModalVisible(true);
    setSelectedCoin(value);
  };
  return (
    <div>
      <Modal
        title="Add Transaction to My Portfolio"
        okText="Cancel"
        cancelText="Confirm"

        visible={isModalVisible}
        cancelButtonProps={{ style: { backgroundColor: '#58da69', color: '#fff' } }}
        okButtonProps={{ style: { backgroundColor: '#f73939' } }}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        reverseButton={false}
      >
        <p>Selected Coin: <b>{selectedCoin ? selectedCoin[0] : ""}</b></p>
        <p>Amount of Coin: <InputNumber size="small"></InputNumber></p>
        <p>Coin Price: <InputNumber className="my-input-number" defaultValue={selectedCoin ? selectedCoin[1] : ""} size="small"></InputNumber></p>
      </Modal>
      <Typography>Search to add coin to portfolio</Typography>
      <Select
        showSearch
        size="10"
        style={{ width: 150 }}
        className="select-coin-to-add"
        placeholder="Select a Crypto"
        optionFilterProp="children"
        onSelect={handleSelectCoin}>
        {coinsList.map((coin) => (
          <Select.Option key={coin.id} value={coin.id}>
            {coin.name}
          </Select.Option>
        ))}
      </Select>
      {searchedCoin &&
        coinsInPortfolio.map((coin) => (
          <div className="add-coin-card-container">
            <div>
              <h2>{coin[0]}</h2>
            </div>
            <div className="right-div">
              <p>$ {coin[1]}</p>
              <div className="buy-sell-buttons">
                <Button
                  id="coin-buy-button"
                  onClick={() => handleBuy(coin)}
                  placeholder="Enterquantity">
                  Buy
                </Button>
                <Button
                  id="coin-sell-button"
                  onClick={() => handleSell(coin)}
                  placeholder="Enterquantity"
                >
                  Sell
                </Button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Portfolio;
