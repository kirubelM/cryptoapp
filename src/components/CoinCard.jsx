import React from "react";
import { Card, Button } from "antd";
import { AppContext } from "../App";

const CoinCard = ({ coinKey, values, handleBuy, handleSell, handleDeleteCoin, coinsInPortfolio }) => {

  const handleBuyClick = () => {
    handleBuy(coinKey);
  };

  const handleSellClick = () => {
    handleSell(coinKey);
  };

  const handleDeleteClick = () => {
    console.log("You still ", coinsInPortfolio[coinKey][2]);
    handleDeleteCoin(coinKey);
  };

  return (
    <div className="add-coin-card-container">
      <div>
        <h2>{coinKey}</h2>
      </div>
      <div className="right-div">
        <p>$ {values[1]}</p>
        <div className="buy-sell-buttons">
          <Button
            id="coin-buy-button"
            onClick={handleBuyClick}
            placeholder="Enter quantity"
          >
            Buy
          </Button>
          <Button
            id="coin-sell-button"
            onClick={handleSellClick}
            placeholder="Enter quantity"
          >
            Sell
          </Button>
          <Button
            id="coin-sell-button"
            onClick={handleDeleteClick}
            placeholder="Enter quantity"
          >
            Delete
          </Button>
        </div>
      </div>
    </div >
  );
};

export default CoinCard;
