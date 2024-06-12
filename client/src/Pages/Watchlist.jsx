import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";
import { BsTrash } from "react-icons/bs";
import ShoppingCart from "../Images/ShoppingCart.png";
import Spinner from "../Components/Spinner";

const Watchlist = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coin, setCoin] = useState([]);

  const getPortfolioData = async () => {
    try {
      setLoading(true);
      // Simulating an API call with dummy data
      const dummyData = [
        {
          watchlist_coinId: "bitcoin",
          watchlist_image: "https://via.placeholder.com/50",
          watchlist_symbol: "BTC",
          watchlist_name: "Bitcoin",
        },
        {
          watchlist_coinId: "ethereum",
          watchlist_image: "https://via.placeholder.com/50",
          watchlist_symbol: "ETH",
          watchlist_name: "Ethereum",
        },
      ];
      setCoin(dummyData);
      setLoading(false);
    } catch (error) {
      navigate("/login");
      return toast.warning("Login to access a watchlist!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    getPortfolioData();
  }, []);

  const emptyWatchlist = async () => {
    try {
      // Simulate clearing the watchlist
      setCoin([]);
      toast.success("Watchlist is empty now!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeCoinFromWatchlist = (id) => {
    setCoin((prevCoins) =>
      prevCoins.filter((coin) => coin.watchlist_coinId !== id)
    );
    toast.success("Coin removed from watchlist!", {
      position: toast.POSITION.TOP_CENTER,
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
              <img src={ShoppingCart} alt="login svg" />
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
                              onClick={emptyWatchlist}
                              className="bg-red-700 text-white px-2 py-1 rounded-lg shadow-md text-xs"
                            >
                              Remove All
                            </button>
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200 min-w-full">
                        {loading ? (
                          <Spinner />
                        ) : (
                          coin.map((curElem, id) => {
                            const {
                              watchlist_coinId,
                              watchlist_image,
                              watchlist_symbol,
                              watchlist_name,
                            } = curElem;
                            return (
                              <tr key={id}>
                                <td
                                  className="min-w-full flex justify-between items-center px-6 py-5 
                                    whitespace-nowrap mobile:px-10 tablet:px-10"
                                >
                                  <div
                                    className="flex items-center cursor-pointer"
                                    onClick={() =>
                                      navigate(`/coins/${watchlist_coinId}`)
                                    }
                                  >
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <img
                                        className="h-10 w-10 rounded-full"
                                        src={watchlist_image}
                                        alt="crypto icon"
                                      />
                                    </div>
                                    <div className="ml-4 flex gap-4 mobile:flex-col mobile:gap-2">
                                      <div className="mobile:text-sm text-lg font-bold text-gray-900 uppercase">
                                        {watchlist_symbol}
                                      </div>
                                      <div className="mobile:text-sm text-lg text-gray-500">
                                        {watchlist_name}
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    onClick={() =>
                                      removeCoinFromWatchlist(watchlist_coinId)
                                    }
                                  >
                                    <button className="text-red-700 text-3xl font-bold rounded-lg p-2 mobile:pl-2 mobile:px-0">
                                      <BsTrash />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
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
