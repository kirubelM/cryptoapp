import React, { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import { Typography, Space, Layout } from "antd";
// import { Auth } from "./components/auth";

import {
  Navbar,
  Portfolio,
  AddCoinForm,
  Homepage,
  Cryptocurrencies,
  CryptoDetails,
  News,
  PortfolioHeader,
  LoginButton,
} from "./components";

import "./App.css";
export const AppContext = createContext();
const App = () => {
  const [searchedCoin, setSearchedCoin] = useState(null); //State of coin searched and selected to add to portfolio
  const [searchedPrice, setSearchedPrice] = useState(null); //State of price of the coin searched and selected to add to portfolio
  const [coinsList, setCoinsList] = useState([]); //List of coins fetched from api
  const [coinsInPortfolio, setCoinsInPortfolio] = useState({}); //coin name,searchedPrice, coin amount,current price, buy price
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null); //coin selected: Buy/Sell
  const [transactionPrice, setTransactionPrice] = useState();
  const [transactionQuantity, setTransactionQuantity] = useState(1);
  const [portfolioBalance, setPortfolioBalance] = useState(0);

  const [navOpen, setNavOpen] = useState(false);
  const changeNav = () => {
    setNavOpen(!navOpen);
  };
  const handleCoinsInPortfolio = (prop) => {
    setCoinsInPortfolio(prop);
    // console.log("app", coinsInPortfolio);
  };
  const handlePortfolioBalance = (prop) => {
    setPortfolioBalance(prop);
    // console.log("bal", prop);
  };
  const handlePortfolioChange = (newIdToken) => {
    console.log(newIdToken);
    setCoinsInPortfolio(newIdToken);
    console.log("need: app", coinsInPortfolio);
  };
  useEffect(() => {
    console.log("qpp final:", coinsInPortfolio);
  }, [coinsInPortfolio]);
  return (
    <div className="app">
      <AppContext.Provider
        value={{
          searchedCoin,
          setSearchedCoin,
          searchedPrice,
          setSearchedPrice,
          coinsList,
          setCoinsList,
          transactionPrice,
          setTransactionPrice,
          setTransactionQuantity,
          transactionQuantity,
          coinsInPortfolio,
          setCoinsInPortfolio,
          portfolioBalance,
          setPortfolioBalance,
        }}>
        <Navbar
          handleNavClick={changeNav}
          portfolioBalance={portfolioBalance}
          coinsInPortfolio={coinsInPortfolio}
          // onPortfolioChange={handlePortfolioChange}
          // sendCoinInPortfolio={handleCoinsInPortfolio}
          sendCoinsInPortfolioApp={handlePortfolioChange}
        />
        <div className="main">
          <Layout>
            <div className="routes">
              <Routes>
                <Route exact path="/" element={<Homepage />}></Route>

                <Route exact path="/homepage" element={<Homepage />}></Route>
                <Route
                  exact
                  path="/cryptocurrencies"
                  element={<Cryptocurrencies />}></Route>
                <Route
                  exact
                  path="/crypto/:coinId"
                  element={<CryptoDetails />}></Route>
                <Route exact path="/news" element={<News />}></Route>
                <Route
                  exact
                  path="/Portfolio"
                  element={
                    <Portfolio
                      // coinsInPortfoliofromApp={coinsInPortfolio}
                      portfolioBalance={portfolioBalance}
                      onCoinsInPortfolio={handleCoinsInPortfolio}
                      {...{
                        onCoinsInPortfolio: handleCoinsInPortfolio,
                        onPortfolioBalance: handlePortfolioBalance,
                        // onSearchedCoin: handeSearchedCoin,
                      }}
                    />
                  }></Route>
              </Routes>
            </div>
          </Layout>
          {/* <PortfolioHeader /> */}
          {/* <Homepage /> */}
        </div>
        <div className="footer">
          <Space>
            <a href="/homepage">Home | </a>
            <a href="/portfolio">Portfolio | </a>
            <a href="/cryptocurrencies">Cryptocurrencies | </a>
            <a href="/news">News</a>
          </Space>
          <br></br>
          <Typography.Title
            className="footer-rights"
            level={5}
            style={{
              fontFamily: "Arial",
              fontWeight: "100",
              color: "white",
              textAlign: "center",
            }}>
            &#169; 2023 Cryptopia, All rights reserved
          </Typography.Title>
        </div>
      </AppContext.Provider>
    </div>
  );
};

export default App;
