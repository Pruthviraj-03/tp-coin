import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NavBar } from "../Components/index.js";
import portfolio from "../Images/portfolio.png";
import { usePortfolio } from "../Context/PortfolioContext.js";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Portfolio = () => {
  const { portfolioItems, setPortfolioItems, sellCoin } = usePortfolio();
  const navigate = useNavigate();
  const [sellQuantity, setSellQuantity] = useState({});

  useEffect(() => {
    const fetchUserPortfolio = async () => {
      try {
        const response = await axios.get(
          "https://tp-coin-api.vercel.app/api/v2/getPortfolio",
          { withCredentials: true }
        );
        const { userPortfolio } = response.data.data;
        setPortfolioItems(userPortfolio);
      } catch (error) {
        navigate("/login");
        toast.warning("Login first to access portfolio page!", {
          position: "top-center",
          autoClose: 3000,
        });
        console.error("Failed to fetch user portfolio:", error);
      }
    };

    fetchUserPortfolio();
  }, [setPortfolioItems, navigate]);

  const handleSellCoin = async (coinId) => {
    const quantity = sellQuantity[coinId];

    if (!quantity) {
      toast.warning("Please enter a valid quantity to sell.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const coin = portfolioItems.find((item) => item.coinId === coinId);
    if (!coin) {
      toast.info("Coin not found in portfolio.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (quantity > coin.quantity) {
      toast.info("Insufficient quantity to sell.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      await sellCoin(coinId, quantity);
      toast.success(`${quantity} coins of ${coin.name} sold successfully!`, {
        position: "top-center",
        autoClose: 3000,
      });

      const updatedPortfolio = await axios.get(
        "https://tp-coin-api.vercel.app/api/v2/getPortfolio",
        { withCredentials: true }
      );
      setPortfolioItems(updatedPortfolio.data.data.userPortfolio);
      setSellQuantity((prev) => ({ ...prev, [coinId]: 0 }));
    } catch (error) {
      console.error("Failed to sell the coin:", error);
      toast.error("Failed to sell the coin. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const updateSellQuantity = (coinId, quantity) => {
    setSellQuantity((prev) => ({ ...prev, [coinId]: quantity }));
  };

  return (
    <>
      <NavBar />
      <div className="flex justify-center pt-32">
        <div className="font-nunito w-3/5 shadow-xl rounded-lg border-2 py-5 px-8 mobile:px-0 laptop:w-4/5 tablet:w-full mobile:w-full mobile:rounded-none">
          <div className="flex items-center justify-around p-5 mobile:px-0 mobile:py-2">
            <div className="mobile:hidden tablet:hidden">
              <img src={portfolio} alt="portfolio" />
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
                            className="mobile:text-sm px-6 py-5 text-left text-xl font-bold text-gray-700 uppercase tracking-wider"
                          >
                            Portfolio
                          </th>
                          <th
                            scope="col"
                            className="mobile:text-sm mobile:px-0 px-6 py-3 text-left text-xl font-bold text-gray-700 uppercase tracking-wider"
                          ></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {portfolioItems.map((curElem, id) => {
                          const { coinId, image, symbol, name, quantity } =
                            curElem;
                          return (
                            quantity > 0 && (
                              <tr key={id}>
                                <td className="flex justify-between items-center px-6 py-5 whitespace-nowrap mobile:px-2 tablet:px-2">
                                  <div
                                    className="flex items-center cursor-pointer"
                                    onClick={() => navigate(`/coins/${coinId}`)}
                                  >
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <img
                                        className="h-10 w-10 rounded-full"
                                        src={image}
                                        alt="crypto icon"
                                      />
                                    </div>
                                    <div className="ml-4 flex gap-4 mobile:flex-col mobile:gap-2">
                                      <div className="mobile:text-sm text-lg font-bold text-gray-900 uppercase">
                                        {symbol}
                                      </div>
                                      <div className="mobile:text-sm text-lg text-gray-500">
                                        {name}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex justify-evenly items-center">
                                    <div className="mobile:text-sm text-lg font-bold text-gray-900 uppercase px-10">
                                      QTY: {quantity}
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                      <input
                                        type="number"
                                        min="0"
                                        className="py-1 px-2 text-lg bg-red-100 font-semibold font-nunito rounded-md"
                                        value={sellQuantity[coinId] || ""}
                                        onChange={(e) =>
                                          updateSellQuantity(
                                            coinId,
                                            parseInt(e.target.value) || 0
                                          )
                                        }
                                      />

                                      <button
                                        className="py-1 whitespace-nowrap mt-2 text-lg bg-red-700 text-white font-semibold font-nunito px-4 rounded-md"
                                        onClick={() =>
                                          handleSellCoin(
                                            coinId,
                                            sellQuantity[coinId]
                                          )
                                        }
                                      >
                                        Sell Coin
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )
                          );
                        })}
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

export default Portfolio;
