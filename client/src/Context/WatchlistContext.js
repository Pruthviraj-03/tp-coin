import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const navigate = useNavigate();

  const addToWatchlist = async (coin) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v3/addWatchlistCoin",
        { coin: coin },
        { withCredentials: true }
      );
      if (response.data.data.coin) {
        setWatchlistItems([...watchlistItems, response.data.data.coin]);
      } else {
        console.error("coin data is undefined in the response");
      }
    } catch (error) {
      navigate("/login");
      console.error("Failed to add coin to watchlist:", error.response);
    }
  };

  const removeFromWatchlist = async (coinName) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v3/removeWatchlistCoin/${coinName}`,
        { withCredentials: true }
      );
      const updatedWatchlist = watchlistItems.filter(
        (coin) => coin.name !== coinName
      );
      setWatchlistItems(updatedWatchlist);
      console.log("Remove coin from watchlist");
    } catch (error) {
      console.error("Failed to remove coin from watchlist:", error.response);
    }
  };

  const removeAllWatchlist = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/v3/removeAllWatchlist",
        { withCredentials: true }
      );
      console.log("Watchlist cleared:", response.data);
      setWatchlistItems([]);
    } catch (error) {
      console.error("Failed to clear watchlist:", error.response);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlistItems,
        setWatchlistItems,
        addToWatchlist,
        removeFromWatchlist,
        removeAllWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export default WatchlistContext;
