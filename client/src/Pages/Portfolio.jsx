import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import NavBar from "../Components/NavBar";
import portfolio from "../Images/portfolio.png";
import Spinner from "../Components/Spinner";

const Portfolio = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coin, setCoin] = useState([]);
  const [portfolioCoinArr, setPortfolioCoinArr] = useState([]);

  const getPortfolioData = async () => {
    setLoading(true);
    try {
      const dummyData = [
        {
          coinId: "bitcoin",
          image: "https://via.placeholder.com/50",
          symbol: "BTC",
          name: "Bitcoin",
          quantity: 1.5,
        },
        {
          coinId: "ethereum",
          image: "https://via.placeholder.com/50",
          symbol: "ETH",
          name: "Ethereum",
          quantity: 10,
        },
      ];
      setCoin(dummyData);
      setLoading(false);

      const newPortfolioCoinArr = dummyData.map((coin) => ({
        name: coin.name,
        quantity: coin.quantity,
      }));
      setPortfolioCoinArr(newPortfolioCoinArr);
    } catch (error) {
      navigate("/login");
      toast.warning("Login to access a portfolio!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    getPortfolioData();
  }, []);

  const handleSellCoin = (curElem) => {
    const sellQty = prompt("Enter Quantity you want to sell.", 1);
    const portfolioRes = portfolioCoinArr.find((e) => e.name === curElem.name);

    if (sellQty !== null) {
      if (sellQty <= 0 || sellQty > portfolioRes.quantity) {
        toast.warning("Invalid Quantity", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        return;
      }

      const updatedCoin = coin.map((item) =>
        item.name === curElem.name
          ? { ...item, quantity: item.quantity - sellQty }
          : item
      );

      setCoin(updatedCoin);

      toast.success("Coin sold, refund will get in 3 working days!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex justify-center pt-32">
        <div className="font-nunito w-3/5 shadow-xl rounded-lg border-2 py-5 px-8 mobile:px-0 laptop:w-4/5 tablet:w-full mobile:w-full mobile:rounded-none">
          <div className="flex items-center justify-around p-5 mobile:px-0 mobile:py-2">
            <div className="mobile:hidden tablet:hidden">
              <img src={portfolio} alt="login svg" />
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
                        {loading ? (
                          <Spinner />
                        ) : (
                          coin.map((curElem, id) => {
                            const { image, symbol, name, quantity } = curElem;
                            return (
                              quantity !== 0 && (
                                <tr key={id}>
                                  <td className="flex justify-between items-center px-6 py-5 whitespace-nowrap mobile:px-2 tablet:px-2">
                                    <div
                                      className="flex items-center cursor-pointer"
                                      onClick={() =>
                                        navigate(`/coins/${curElem.coinId}`)
                                      }
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
                                        <button
                                          className="py-1 whitespace-nowrap mobile:pl-2 text-lg bg-red-700 text-white font-semibold font-nunito mobile:text-md mobile:px-2 px-4 rounded-md"
                                          onClick={() =>
                                            handleSellCoin(curElem)
                                          }
                                        >
                                          sell coin
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )
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

export default Portfolio;
