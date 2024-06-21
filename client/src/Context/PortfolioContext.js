import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const navigate = useNavigate();

  const buyCoin = async (coin, counter) => {
    try {
      const coinData = {
        coinId: coin.id,
        image: coin.image.large,
        symbol: coin.symbol,
        name: coin.name,
        quantity: counter,
      };

      const response = await axios.post(
        "http://localhost:8000/api/v2/buyCoins",
        { coin: coinData },
        { withCredentials: true }
      );

      if (response.data.data.coin) {
        setPortfolioItems([...portfolioItems, response.data.data.coin]);
      } else {
        console.error("coin data is undefined in the response");
      }
    } catch (error) {
      navigate("/login");
      console.error("Failed to buy the coin:", error.response);
    }
  };

  const sellCoin = async (coinId, quantity) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v2/sellCoins/${coinId}/${quantity}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Failed to sell the coin:", error.response);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolioItems,
        setPortfolioItems,
        buyCoin,
        sellCoin,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioContext;
