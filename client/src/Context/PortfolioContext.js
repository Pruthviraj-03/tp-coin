import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const navigate = useNavigate();

  const buyCoin = async (coin) => {
    try {
      console.log("coin is:", coin);
      const response = await axios.post(
        "http://localhost:8000/api/v2/buyCoins",
        { coin: coin },
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

  return (
    <PortfolioContext.Provider
      value={{
        portfolioItems,
        setPortfolioItems,
        buyCoin,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioContext;
