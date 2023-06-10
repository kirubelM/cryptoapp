import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Typography, Space, Layout } from "antd";

import {
  Navbar,
  Portfolio,
  AddCoinForm,
  Homepage,
  Cryptocurrencies,
  CryptoDetails,
  News,
} from "./components";

import "./App.css";

const App = () => {
  const [currentPortfolio, setCurrentPortfolio] = useState([]);

  const [navOpen, setNavOpen] = useState(false);
  const changeNav = () => {
    setNavOpen(!navOpen);
  };

  return (
    <div className="app">
      <Navbar handleNavClick={changeNav} />
      <div className="main">
        <Layout>
          <div className="routes">
            <Routes>
              <Route exact path="/" element={<Homepage />}></Route>

              <Route exact path="/homepage" element={<Homepage />}></Route>
              {/* <Route exact path="/exchanges" element={<Exchanges />}></Route> */}
              <Route
                exact
                path="/cryptocurrencies"
                element={<Cryptocurrencies />}></Route>
              <Route
                exact
                path="/crypto/:coinId"
                element={<CryptoDetails />}></Route>
              <Route exact path="/news" element={<News />}></Route>
              <Route exact path="/Portfolio" element={<Portfolio />}></Route>
            </Routes>
          </div>
        </Layout>
        {/* <Homepage /> */}
      </div>
      <div className="footer">
        <Space>
          <a href="/homepage">Home | </a>
          <a href="/cryptocurrencies">Cryptocurrencies | </a>
          <a href="/portfolio">Portfolio | </a>
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
    </div>
  );
};

export default App;
