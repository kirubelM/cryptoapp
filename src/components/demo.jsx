import React, { useState, useEffect } from "react";
import {
  Select,
  Card,
  Row,
  Statistic,
  Input,
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
  const [coinsInPortfolio, setCoinsInPortfolio] = useState({});//coin name,coin,amount,current price, buy price
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null); //coin selected: Buy/Sell
  const [transactionPrice, setTransactionPrice] = useState();
  const [transactionQuantity, setTransactionQuantity] = useState(1);
  const [portfolioBalance, setPortfolioBalance] = useState(0);
  const [transactionType, setTransactionType] = useState("");
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
  }, [coinsInPortfolio]);

  useEffect(() => {
    if (searchedPrice) {
      setCoinsInPortfolio((prevCoinsInPortfolio) =>
        Object.assign({}, prevCoinsInPortfolio, {
          [searchedCoin]: [searchedCoin, searchedPrice, 0, 0, 0],
        })
      );
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
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        }).format(Number(usd));
        setSearchedPrice(usd);
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
    setTransactionType("BUY")
    setSelectedCoin(value);
  };
  const handleSell = (value) => {
    setIsModalVisible(true);
    setTransactionType("SELL")
    setSelectedCoin(value);
  };
  const handleModalSubmit = () => {
    let currentTransactionPrice = ((transactionPrice ? transactionPrice : coinsInPortfolio[selectedCoin]?.[1]))
    let currentTransactionQuantity = parseFloat(transactionQuantity);
    // console.log("price", currentTransactionPrice, "quantity", currentTransactionQuantity);
    if (transactionType === "BUY")
      handleBuyCalc(currentTransactionPrice, currentTransactionQuantity);
    else
      handleSellCalc(currentTransactionPrice, currentTransactionQuantity);
    setTransactionType("");
    setIsModalVisible(false)
  }

  const handleBuyCalc = (currentTransactionPrice, currentTransactionQuantity) => {
    setPortfolioBalance((prevPortfolioBalance) => prevPortfolioBalance + (currentTransactionPrice * currentTransactionQuantity));
    setCoinsInPortfolio((prevCoinsInPortfolio) => {
      const newCoinsInPortfolio = { ...prevCoinsInPortfolio };
      let newQuantity = newCoinsInPortfolio[selectedCoin][2] + currentTransactionQuantity;
      newCoinsInPortfolio[selectedCoin][2] = newQuantity;
      return newCoinsInPortfolio;
    });
  }
  const handleSellCalc = (currentTransactionPrice, currentTransactionQuantity) => {
    setPortfolioBalance((prevPortfolioBalance) => prevPortfolioBalance - (currentTransactionPrice * currentTransactionQuantity));
    setCoinsInPortfolio((prevCoinsInPortfolio) => {
      const newCoinsInPortfolio = { ...prevCoinsInPortfolio };
      let newQuantity = newCoinsInPortfolio[selectedCoin][2] - currentTransactionQuantity;
      newCoinsInPortfolio[selectedCoin][2] = newQuantity;
      return newCoinsInPortfolio;
    });
  }
  const handleDeleteCoin = (keyToDelete) => {
    setCoinsInPortfolio((prevCoinsInPortfolio) => {
      const newCoinsInPortfolio = { ...prevCoinsInPortfolio };
      delete newCoinsInPortfolio[keyToDelete];
      return newCoinsInPortfolio;
    });
  };
  // console.log("balance", transactionPrice, "end");
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
        onCancel={handleModalSubmit}
        reverseButton={false}
        forceRender={true}
      >
        <div className="portfolio-inputs">
          <p>Coin: <b>{coinsInPortfolio[selectedCoin]?.[0]}</b></p>
          <p><b>Amount of Coin</b> <Input id="transaction-input" size="small" onChange={(e) => setTransactionQuantity(e.target.value)}></Input></p>
          <p><b>Coin Price</b> <Input id="transaction-input" value={transactionPrice || coinsInPortfolio[selectedCoin]?.[1]}
            size="small"
            placeholder="Enter quantity"
            onChange={(e) => {
              console.log("transactionPrice changed:", e.target.value);
              setTransactionPrice(e.target.value);
            }}
          ></Input></p>
        </div>
      </Modal >
      <Statistic title="Portfolio Balance in USD"
        value={portfolioBalance < 1 ? 0 : (portfolioBalance)}
        precision={2}
        valueStyle={{ color: '#3f8600' }}
        prefix="$">
      </Statistic>
      <br></br>
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
      {
        coinsInPortfolio &&
        Object.entries(coinsInPortfolio).map(([key, values]) => (
          <div className="add-coin-card-container">
            <div>
              <h2>{key}</h2>
            </div>
            <div className="right-div">
              <p>$ {values[1]}</p>
              <div className="buy-sell-buttons">
                <Button
                  id="coin-buy-button"
                  onClick={() => handleBuy(key)}
                  placeholder="Enterquantity"
                >
                  Buy
                </Button>
                <Button
                  id="coin-sell-button"
                  onClick={() => handleSell(key)}
                  placeholder="Enterquantity"
                >
                  Sell
                </Button>
                <Button
                  id="coin-sell-button"
                  onClick={() => handleDeleteCoin(key)}
                  placeholder="Enterquantity"
                >
                  delete
                </Button>
              </div>
            </div>
          </div>
        ))
      }

    </div >
  );
};

export default Portfolio;