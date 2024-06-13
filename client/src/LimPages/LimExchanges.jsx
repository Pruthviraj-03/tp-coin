import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../Components/Spinner";

const LimExchanges = () => {
  const [limitedExchanges, setLimitedExchanges] = useState([]);

  const getData = async () => {
    try {
      const setHeader = {
        // headers: {
        //   "x-rapidapi-host": "coinranking1.p.rapidapi.com",
        //   "x-rapidapi-key":
        //     "3bf8ad2345msh9f75760d2fe9a1dp1ffbb3jsnc1cec33b9615",
        // },
        headers: {
          "X-RapidAPI-Key":
            "801cfd6090msh43ba5a116c51f0ep1004f8jsna6de03eee58b",
          "X-RapidAPI-Host": "coingecko.p.rapidapi.com",
        },
      };

      const res = await axios.get(
        // "https://coinranking1.p.rapidapi.com/coin/Qwsogvtv82FCd/exchanges",
        "https://coingecko.p.rapidapi.com/coins/markets",
        setHeader
      );

      const responce = res.data.data.exchanges;
      setLimitedExchanges(responce);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <p className="text-center text-3xl font-bold pt-14 uppercase font-nunito select-none">
        Exchanges
      </p>

      {limitedExchanges ? (
        limitedExchanges.slice(0, 5).map((curElem, id) => {
          const {
            name,
            lastTickerCreatedAt,
            price,
            numberOfMarkets,
            rank,
            volume,
            websiteUrl,
            iconUrl,
          } = curElem;

          return (
            <div
              key={id}
              className="collapse border border-base-300 rounded-md shadow-md my-5 py-4 mx-52 
                    laptop:mx-10 tablet:mx-10 mobile:mx-2"
            >
              <input type="checkbox" />

              <div className="collapse-title text-xl font-medium">
                <div className="flex items-center gap-5 px-5 cursor-pointer">
                  <div className="w-20 h-20">
                    <img src={iconUrl} alt="icons" />
                  </div>
                  <p className="font-bold text-2xl uppercase pb-2">{name}</p>
                </div>
              </div>

              <div className="collapse-content">
                <div className="flex justify-evenly items-center flex-wrap mobile:flex-col mobile:items-start mobile:px-5 mobile:pt-5">
                  <p className="font-semibold">Rank : {rank}</p>
                  <p className="font-semibold">
                    lastTickerCreatedAt :
                    <span className="text-sm px-2 font-light">
                      {lastTickerCreatedAt}
                    </span>
                  </p>
                  <p className="font-semibold">
                    price :
                    <span className="text-sm px-2 font-light">{price}</span>
                  </p>
                  <p className="font-semibold">
                    number Of Markets :
                    <span className="text-sm px-2 font-light">
                      {numberOfMarkets}
                    </span>
                  </p>
                  {/* <p className="font-semibold">
                    volume :
                    <span className="text-sm px-2 font-light">
                      {curElem.24hVolume}
                    </span>
                  </p> */}
                  <p className="text-xs text-blue-600 font-medium lowercase cursor-pointer">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={websiteUrl}
                    >
                      {websiteUrl}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <Spinner />
      )}

      <p className="text-center text-gray-500 font-light pt-5 font-nunito">
        <Link
          to="/exchanges"
          className="inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white transition bg-blue-500 rounded-full shadow ripple hover:shadow-lg hover:bg-blue-600 focus:outline-none"
        >
          view more exchanges
        </Link>
      </p>
    </>
  );
};

export default LimExchanges;
