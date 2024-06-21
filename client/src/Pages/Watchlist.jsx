import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { NavBar } from "../Components/index.js";
import { BsTrash } from "react-icons/bs";
import ShoppingCart from "../Images/ShoppingCart.png";
import { useWatchlist } from "../Context/WatchlistContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Watchlist = () => {
  const {
    watchlistItems,
    setWatchlistItems,
    removeFromWatchlist,
    removeAllWatchlist,
  } = useWatchlist();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserWatchlist = async () => {
      try {
        const response = await axios.get(
          "https://tp-coin-api.vercel.app/api/v3/getWatchlist",
          { withCredentials: true }
        );
        const { userWatchlist } = response.data.data;
        setWatchlistItems(userWatchlist);
      } catch (error) {
        navigate("/login");
        toast.warning("Login first to access watchlist page!", {
          position: "top-center",
          autoClose: 3000,
        });
        console.error("Failed to fetch user watchlist:", error);
      }
    };

    fetchUserWatchlist();
  }, [setWatchlistItems, navigate]);

  const removeCoinFromWatchlist = (coinName) => {
    removeFromWatchlist(coinName);
    toast.success("Coin removed from the watchlist.", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  return (
    <>
      <NavBar />
      <div className="flex justify-center pt-32">
        <div className="font-nunito w-3/5 shadow-xl rounded-lg border-2 py-5 px-8 mobile:px-0 laptop:w-4/5 tablet:w-full mobile:w-full mobile:rounded-none">
          <div className="flex items-center justify-around p-5 mobile:px-0 mobile:py-2">
            <div className="p-10 mobile:hidden tablet:hidden">
              <img src={ShoppingCart} alt="shopping cart" />
            </div>
            <div className="flex flex-col mx-10 w-1/2 mobile:w-full mobile:px-2 mobile:mx-2 tablet:w-full tablet:px-0 tablet:mx-2">
              <div className="-my-2 overflow-x-auto sm:-mx-0 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full mobile:px-0 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-200">
                        <tr>
                          <th
                            scope="col"
                            className="mobile:text-sm mobile:px-1 px-6 py-5 text-left text-xl font-bold text-gray-700 uppercase tracking-wider"
                          >
                            WatchList
                          </th>
                          <th
                            scope="col"
                            className="mobile:text-sm mobile:px-0 px-6 py-3 text-left text-xl font-bold text-gray-700 uppercase tracking-wider"
                          >
                            <button
                              onClick={removeAllWatchlist}
                              className="bg-red-700 text-white px-2 py-1 rounded-lg shadow-md text-xs"
                            >
                              Remove All
                            </button>
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200 min-w-full">
                        {watchlistItems.map((curElem, id) => (
                          <tr key={id}>
                            <td className="min-w-full flex justify-between items-center px-6 py-5 whitespace-nowrap mobile:px-10 tablet:px-10">
                              <div
                                className="flex items-center cursor-pointer"
                                onClick={() =>
                                  navigate(`/coins/${curElem.watchlist_coinId}`)
                                }
                              >
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={curElem.watchlist_image}
                                    alt="crypto icon"
                                  />
                                </div>
                                <div className="ml-4 flex gap-4 mobile:flex-col mobile:gap-2">
                                  <div className="mobile:text-sm text-lg font-bold text-gray-900 uppercase">
                                    {curElem.watchlist_symbol}
                                  </div>
                                  <div className="mobile:text-sm text-lg text-gray-500">
                                    {curElem.watchlist_name}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <button
                                  className="text-red-700 text-3xl font-bold rounded-lg p-2 mobile:pl-2 mobile:px-0"
                                  type="button"
                                  onClick={() =>
                                    removeCoinFromWatchlist(
                                      curElem.watchlist_name
                                    )
                                  }
                                >
                                  <BsTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Watchlist;
