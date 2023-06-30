import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import PortfolioHeader from "./PortfolioHeader";
import SearchBar from "./SearchBar";
import CoinCard from "./CoinCard";
import { Alert } from 'antd'
import TransactionModal from "./TransactionModal";
import { AppContext } from "../App";

const Portfolio = () => {
  const { coinsInPortfolio, setCoinsInPortfolio, portfolioBalance, setPortfolioBalance, searchedCoin, setSearchedCoin, searchedPrice, setSearchedPrice, coinsList, setCoinsList } = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null); //coin selected: Buy/Sell
  const [transactionPrice, setTransactionPrice] = useState();
  const [transactionQuantity, setTransactionQuantity] = useState();
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
  }, [coinsInPortfolio]);

  useEffect(() => {
    if (searchedPrice) {
      setCoinsInPortfolio((prevCoinsInPortfolio) =>
        Object.assign({}, prevCoinsInPortfolio, {
          [searchedCoin]: [searchedCoin, searchedPrice, 0, 0, 0],
        })
      );
    }
    console.log("after:", coinsInPortfolio)
  }, [searchedPrice, searchedCoin]);

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

  const handleModalSubmit = () => {
    let currentTransactionPrice = transactionPrice
      ? transactionPrice
      : coinsInPortfolio[selectedCoin]?.[1];
    let currentTransactionQuantity = parseFloat(transactionQuantity);

    let balanceToAdd = currentTransactionPrice * currentTransactionQuantity;
    let quantityChange = (transactionType === "BUY" ? currentTransactionQuantity : (currentTransactionQuantity * -1));

    if ((transactionType === "BUY" && isSaleValid(quantityChange)) || (transactionType !== "BUY" && isSaleValid(Math.abs(quantityChange)))) {
      setPortfolioBalance((prevPortfolioBalance) => {
        return transactionType === "BUY" ? prevPortfolioBalance + balanceToAdd : prevPortfolioBalance - balanceToAdd;
      });
      setShowAlert(false);
      setAlertMessage("");
    } else {
      setShowAlert(true);
      setIsModalVisible(false);
      return;
    }

    setTransactionPrice("");

    setCoinsInPortfolio((prevCoinsInPortfolio) => {
      const newCoinsInPortfolio = { ...prevCoinsInPortfolio };
      let newQuantity = newCoinsInPortfolio[selectedCoin][2] + quantityChange;
      newCoinsInPortfolio[selectedCoin][2] = newQuantity;
      return newCoinsInPortfolio;
    });


    setTransactionType("");
    setIsModalVisible(false);
  };

  const isSaleValid = (amount) => {
    if (isNaN(amount) || amount <= 0.00000000000000000001) {
      setAlertMessage(`Enter a valid ${transactionType === "SELL" ? "Sell" : "Buy"} quantity for ${selectedCoin}`);
      return false;
    } else if (transactionType === "BUY" || amount <= coinsInPortfolio[selectedCoin][2]) {
      return true;
    } else if (transactionType === "SELL" && amount > coinsInPortfolio[selectedCoin][2]) {
      setAlertMessage(`You ${amount > 0 ? "only" : ""} have ${String(coinsInPortfolio[selectedCoin][2]).slice(0, 6)} ${selectedCoin} in your portfolio!`);
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
