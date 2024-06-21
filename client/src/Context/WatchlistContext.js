import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const navigate = useNavigate();

  const addToWatchlist = async (coin) => {
    try {
      const response = await axios.post(
        "https://tp-coin-api.vercel.app/api/v3/addWatchlistCoin",
        { coin: coin },
        { withCredentials: true }
      );
      if (response.data.data.coin) {
        setWatchlistItems([...watchlistItems, response.data.data.coin]);
      }
    } catch (error) {
      navigate("/login");
      console.error("Failed to add coin to watchlist:", error.response);
    }
  };

  const removeFromWatchlist = async (coinName) => {
    try {
      await axios.delete(
        `https://tp-coin-api.vercel.app/api/v3/removeWatchlistCoin/${coinName}`,
        { withCredentials: true }
      );
      const updatedWatchlist = watchlistItems.filter(
        (coin) => coin.watchlist_name !== coinName
      );
      setWatchlistItems(updatedWatchlist);
    } catch (error) {
      console.error("Failed to remove coin from watchlist:", error.response);
    }
  };

  const removeAllWatchlist = async () => {
    try {
      if (watchlistItems.length === 0) {
        toast.info("Watchlist is already empty!", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }

      const response = await axios.delete(
        "https://tp-coin-api.vercel.app/api/v3/removeAllWatchlist",
        { withCredentials: true }
      );

      setWatchlistItems([]);
      toast.success("Watchlist is empty now!", {
        position: "top-center",
        autoClose: 3000,
      });
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
