import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SingleCoin } from "../Config/Api";
import { CryptoState } from "../Context/CryptoContext";
import ChartCrypto from "./ChartCrypto";
import NavBar from "../Components/NavBar";
import { useNavigate } from "react-router-dom";
import Spinner from "../Components/Spinner";
import { useWatchlist } from "../Context/WatchlistContext";
import { usePortfolio } from "../Context//PortfolioContext";

const CryptoDetails = () => {
  const { addToWatchlist, watchlistItems } = useWatchlist();
  const { buyCoin } = usePortfolio();
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(false);
  const { currency, symbols } = CryptoState();

  const addWatchlist = () => {
    const watchListRes = watchlistItems.find(
      (e) => e.watchlist_name === coin?.name
    );

    if (watchListRes) {
      window.alert("Coin already added into watchlist !");
    } else {
      const coinData = {
        watchlist_coinId: coin?.id,
        watchlist_image: coin?.image.large,
        watchlist_symbol: coin?.symbol,
        watchlist_name: coin?.name,
      };

      addToWatchlist(coinData)
        .then(() => {
          window.alert("Coin added into watchlist !");
          navigate("/watchlist");
        })
        .catch((error) => {
          console.error("Failed to add coin to watchlist:", error);
        });
    }
  };

  //increment and decrement
  const [counter, setCounter] = useState(1);
  const incrementCounter = () => setCounter(counter + 1);
  let decrementCounter = () => setCounter(counter - 1);
  if (counter <= 1) {
    decrementCounter = () => setCounter(1);
  }

  //get details of selected coin
  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(SingleCoin(id));
      setCoin(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();

    const amountInRupees = coin.market_data.current_price.inr * counter;
    const amountInPaise = Math.round(amountInRupees * 100);
    const currency = "INR";
    const receiptId = "0123456789";

    if (!amountInPaise) {
      window.alert("Amount is not defined!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v2/razorpay/payment",
        { amount: amountInPaise, currency, receipt: receiptId }
      );
      const order = response.data.data.order;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_API_KEY,
        amount: amountInPaise,
        currency: order.currency,
        name: "Tp-Coin",
        description: `Transaction for buying ${counter} ${coin.name}(s).`,
        order_id: order.id,
        handler: async function (response) {
          try {
            alert(`Payment ID: ${response.razorpay_payment_id}`);
            alert(`Order ID: ${response.razorpay_order_id}`);
            window.alert("Payment success");

            await buyCoin(coin, counter);
            navigate("/portfolio");
          } catch (error) {
            console.error("Error adding to order:", error);
            window.alert("Failed to add products to order.");
          }
        },
        prefill: {
          name: "raj",
          email: "test.raj@example.com",
          contact: "9898989898",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const payment = new window.Razorpay(options);
      payment.open();
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };

  return (
    <>
      <NavBar />

      <div
        className="py-32 mobile:py-0 mobile:pt-32 mx-20 laptop:mx-10 tablet:mx-10 mobile:mx-0 
          flex gap-8 tablet:gap-0 mobile:gap-0 mobile:flex-col tablet:flex-col overflow-x-hidden"
      >
        {loading ? (
          <Spinner />
        ) : (
          <div className="w-1/2 mobile:pl-2 mobile:w-full tablet:w-full">
            <div className="flex flex-col gap-3">
              <div className="avatar flex gap-2">
                <div className="w-16 h-16 mask mask-squircle">
                  <img src={coin?.image.large} alt="crypto icon" />
                </div>
                <div className="font-nunito font-bold pt-5 text-2xl uppercase">
                  {coin?.symbol}
                </div>
                <div className="font-nunito font-semibold pt-5 text-2xl">
                  {coin?.name}
                </div>
              </div>
              <div>
                <p className="font-nunito text-xs py-8">
                  {coin?.description.en}.
                </p>
                <p className="font-nunito font-bold flex gap-1 text-lg py-1">
                  <p className="font-bold text-xl">Rank:</p>
                  {coin?.market_cap_rank}
                </p>
                <p className="font-nunito font-semibold flex gap-1 text-lg py-1">
                  <p className="font-bold flex gap-3 text-xl">
                    <p>Current price:</p>₹
                  </p>
                  {coin?.market_data.current_price.inr}
                </p>
                <p className="font-nunito font-semibold flex gap-1 text-lg py-1">
                  <p className="font-bold flex gap-3 text-xl">
                    <p>Market cap:</p>
                    {symbols}
                  </p>
                  {coin?.market_data.market_cap[currency.toLowerCase()]}M
                </p>

                <p className="font-nunito font-semibold flex gap-1 text-lg py-1">
                  <p className="font-bold flex gap-3 text-xl">
                    <p>Change:</p>
                    {symbols}
                  </p>
                  {coin?.market_data.price_change_24h_in_currency[
                    currency.toLowerCase()
                  ] < 0 ? (
                    <p className="text-red-600 font-bold">
                      {coin?.market_data.price_change_24h_in_currency[
                        currency.toLowerCase()
                      ].toFixed(2)}
                    </p>
                  ) : (
                    <p className="text-green-500 font-bold">
                      +{" "}
                      {coin?.market_data.price_change_24h_in_currency[
                        currency.toLowerCase()
                      ].toFixed(2)}
                    </p>
                  )}
                </p>

                <p className="font-nunito font-semibold flex gap-1 text-lg py-1">
                  <p className="font-bold flex gap-3 text-xl">
                    <p>Volume:</p>
                    {symbols}
                  </p>
                  {coin?.market_data.total_volume[currency.toLowerCase()]}
                </p>
                <p className="font-nunito font-semibold flex gap-1 text-lg py-1 text-blue-600">
                  <p className="font-bold flex gap-3 text-xl text-gray-900">
                    <p>Link:</p>
                  </p>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={coin?.links.homepage[0]}
                  >
                    {coin?.links.homepage[0]}
                  </a>
                </p>
                <p className="font-nunito font-semibold flex gap-1 text-lg py-1">
                  <p className="font-bold flex gap-3 text-lg">
                    <p>Last updated time:</p>
                  </p>
                  {coin?.last_updated}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="w-1/2 mobile:w-full tablet:w-full">
          <ChartCrypto />

          <div className="flex justify-center items-center gap-2 mt-8 pc:hidden laptop:hidden tablet:hidden">
            <button
              onClick={decrementCounter}
              className="bg-red-700 text-white text-4xl font-black rounded-lg shadow-md px-5 pt-1 pb-3"
            >
              -
            </button>

            <input
              value={
                localStorage.getItem("quantity")
                  ? localStorage.getItem("quantity")
                  : counter
              }
              className="border-2 border-gray-600 w-14 h-14 px-5 pt-1 pb-2 font-bold font-nunito rounded-lg"
            />

            <button
              onClick={incrementCounter}
              className="bg-green-700 text-white text-4xl font-black rounded-lg shadow-md px-4 pt-1 pb-3"
            >
              +
            </button>
          </div>

          <div className="flex justify-evenly font-nunito mt-10">
            {localStorage.getItem("isBuyCoin") ? (
              <button
                onClick={buyCoin}
                className="font-bold text-lg w-52 rounded-lg bg-green-400 border-2 border-gray-900 mobile:rounded-none 
                mobile:w-1/2 mobile:px-0 mobile:border-none hover:bg-green-600 hover:text-white"
              >
                Buy Now
              </button>
            ) : (
              <button
                onClick={handlePayment}
                className="font-bold text-lg w-52 rounded-lg bg-blue-400 border-2 border-indigo-900 mobile:rounded-none 
                mobile:w-1/2 mobile:px-0 mobile:border-none hover:bg-blue-600 hover:text-white"
              >
                Make Payment
              </button>
            )}

            <div className="flex justify-center items-center gap-2 mobile:hidden">
              <button
                onClick={decrementCounter}
                className="bg-red-700 text-white text-5xl font-black rounded-lg shadow-md text-center px-5 py-1"
              >
                -
              </button>

              <input
                value={
                  localStorage.getItem("quantity")
                    ? localStorage.getItem("quantity")
                    : counter
                }
                className="border-2 border-gray-600 w-14 h-14 px-5 py-1 font-bold font-nunito rounded-lg"
              />

              <button
                onClick={incrementCounter}
                className="bg-green-700 text-white text-5xl font-black rounded-lg shadow-md text-center px-4 py-1"
              >
                +
              </button>
            </div>

            <button
              onClick={addWatchlist}
              className="font-bold text-lg w-52 rounded-lg bg-gray-300 border-2 border-gray-600 mobile:rounded-none 
                mobile:w-1/2 mobile:px-0 mobile:border-none hover:bg-gray-600 hover:text-white"
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CryptoDetails;
