import React, { useState, useEffect } from "react";
import axios from "axios";
import PortfolioHeader from "./PortfolioHeader";
import SearchBar from "./SearchBar";
import CoinCard from "./CoinCard";
import { Alert } from 'antd'
import TransactionModal from "./TransactionModal";
import { db } from '../firebase'
const Portfolio = ({ onCoinsInPortfolio, onPortfolioBalance }) => {
  const [searchedCoin, setSearchedCoin] = useState(null); //State of coin searched and selected to add to portfolio
  const [searchedPrice, setSearchedPrice] = useState(null); //State of price of the coin searched and selected to add to portfolio
  const [coinsList, setCoinsList] = useState([]); //List of coins fetched from api
  const [coinsInPortfolio, setCoinsInPortfolio] = useState({});//coin name,searchedPrice, coin amount,current price, buy price
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null); //coin selected: Buy/Sell
  const [transactionPrice, setTransactionPrice] = useState();
  const [transactionQuantity, setTransactionQuantity] = useState(1);
  const [portfolioBalance, setPortfolioBalance] = useState(0);
  const [transactionType, setTransactionType] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/list"
        );
        setCoinsList(response.data);
      } catch (error) {
        console.error("Error fetching coin list:", error);
      }
    };
    fetchCoins();
    onCoinsInPortfolio(coinsInPortfolio)

  }, [coinsInPortfolio]);

  useEffect(() => {
    if (searchedPrice) {
      setCoinsInPortfolio((prevCoinsInPortfolio) =>
        Object.assign({}, prevCoinsInPortfolio, {
          [searchedCoin]: [searchedCoin, searchedPrice, 0, 0, 0],
        })
      );
      onCoinsInPortfolio(coinsInPortfolio)
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
    setTransactionType("BUY");
    setSelectedCoin(value);
  };

  const handleSell = (value) => {
    setIsModalVisible(true);
    setTransactionType("SELL");
    setSelectedCoin(value);
  };
  useEffect(() => {
    onPortfolioBalance(portfolioBalance)
  }, [portfolioBalance])

  const handleModalSubmit = () => {
    let currentTransactionPrice = transactionPrice
      ? transactionPrice
      : coinsInPortfolio[selectedCoin]?.[1];
    let currentTransactionQuantity = parseFloat(transactionQuantity);

    let balanceToAdd = currentTransactionPrice * currentTransactionQuantity
    let quantityChange = (transactionType === "BUY" ? currentTransactionQuantity : (currentTransactionQuantity * -1))
    if (transactionType === "BUY") {
      setPortfolioBalance((prevPortfolioBalance) => prevPortfolioBalance + balanceToAdd);
    } else {
      if (isSaleValid(Math.abs(quantityChange))) {
        setPortfolioBalance((prevPortfolioBalance) => prevPortfolioBalance - balanceToAdd);
        setShowAlert(false);
        setAlertMessage("")
      } else {
        setShowAlert(true);
        setIsModalVisible(false);
        return;

      }
      setTransactionPrice("")
    }
    setCoinsInPortfolio((prevCoinsInPortfolio) => {
      const newCoinsInPortfolio = { ...prevCoinsInPortfolio };
      let newQuantity = newCoinsInPortfolio[selectedCoin][2] + quantityChange;
      newCoinsInPortfolio[selectedCoin][2] = newQuantity;
      return newCoinsInPortfolio;
    });
    onCoinsInPortfolio(coinsInPortfolio)
    onPortfolioBalance(portfolioBalance)
    setTransactionType("");
    setIsModalVisible(false);
  };

  const isSaleValid = (amount) => {
    console.log(amount, coinsInPortfolio[selectedCoin][2])
    if (amount <= coinsInPortfolio[selectedCoin][2]) return true;
    else if (amount > coinsInPortfolio[selectedCoin][2]) {
      setAlertMessage("You only have " + String(coinsInPortfolio[selectedCoin][2]).slice(0, 6) + " " + selectedCoin + " in your portfolio!");
      return false;
    }
  }
  const handleDeleteCoin = (keyToDelete) => {
    if (coinsInPortfolio[keyToDelete][2] === 0) {
      setCoinsInPortfolio((prevCoinsInPortfolio) => {
        const newCoinsInPortfolio = { ...prevCoinsInPortfolio };
        delete newCoinsInPortfolio[keyToDelete];
        return newCoinsInPortfolio;
      });
      onCoinsInPortfolio(coinsInPortfolio)

      setShowAlert(false);
    } else if (coinsInPortfolio[keyToDelete][2] > 0) {
      setAlertMessage(`Sell your ${keyToDelete} before you can delete it!`);
      setShowAlert(true);
    }
  };

  return (
    <div>
      {showAlert && <Alert
        message="Error"
        description={alertMessage}
        type="error"
        showIcon
        closable
        onClose={() => setShowAlert(false)}

      />}
      <TransactionModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        selectedCoin={selectedCoin}
        transactionPrice={transactionPrice}
        setTransactionPrice={setTransactionPrice}
        transactionQuantity={transactionQuantity}
        setTransactionQuantity={setTransactionQuantity}
        transactionType={transactionType}
        handleModalSubmit={handleModalSubmit}
        coinsInPortfolio={coinsInPortfolio}
      />

      <PortfolioHeader portfolioBalance={portfolioBalance} />

      <SearchBar
        coinsList={coinsList}
        handleSelectCoin={handleSelectCoin}
      />

      {Object.entries(coinsInPortfolio).map(([key, values]) => (
        <CoinCard
          key={key}
          coinKey={key}
          values={values}
          handleBuy={handleBuy}
          handleSell={handleSell}
          handleDeleteCoin={handleDeleteCoin}
          coinsInPortfolio={coinsInPortfolio}
        />
      ))}
    </div>
  );
};

export default Portfolio;
