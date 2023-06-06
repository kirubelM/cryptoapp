import React, { } from 'react';
// import AddCoinForm from './?WAddCoinForm';
const Portfolio = ({ portfolio }) => {
  // const [totalValue, setTotalValue] = useState(0);
  // const [userPortfolio, setUserPortfolio] = useState([]);

  // const addCoin = (coin) => {
  //   setUserPortfolio([...portfolio, coin]);
  // };
  // useEffect(() => {
  //   const fetchPrices = async () => {
  //     const ids = userPortfolio.map((coin) => coin.id).join(',');
  //     const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
  //     const prices = await response.json();
  //     const value = userPortfolio.reduce((total, coin) => {
  //       const price = prices[coin.id].usd;
  //       return total + coin.quantity * price;
  //     }, 0);
  //     setTotalValue(value);
  //   };
  //   fetchPrices();
  // }, [userPortfolio]);

  return (
    <div>

      {/* <p>Total Value: {totalValue}</p> */}
    </div>
  )
}

export default Portfolio