import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../Components/Spinner";

const LimExchanges = () => {
  const [limitedExchanges, setLimitedExchanges] = useState([]);
  const [openExchanges, setOpenExchanges] = useState({});

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const options = {
          method: "GET",
          url: "https://coingecko.p.rapidapi.com/coins/markets",
          params: {
            vs_currency: "usd",
            page: "1",
            per_page: "100",
            order: "market_cap_desc",
          },
          headers: {
            "X-RapidAPI-Key":
              "801cfd6090msh43ba5a116c51f0ep1004f8jsna6de03eee58b",
            "X-RapidAPI-Host": "coingecko.p.rapidapi.com",
          },
        };
        const response = await axios.request(options);
        setLimitedExchanges(response.data || []);
      } catch (error) {
        console.error("Error fetching exchanges:", error);
      }
    };

    fetchExchanges();
  }, []);

  const toggleExchanges = (id) => {
    setOpenExchanges((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <p className="text-center text-3xl font-bold pt-14 uppercase font-nunito select-none">
        Exchanges
      </p>

      {limitedExchanges.length > 0 ? (
        limitedExchanges.slice(0, 5).map((curElem, id) => {
          const {
            name,
            last_updated,
            current_price,
            market_cap_rank,
            total_volume,
            image,
          } = curElem;

          return (
            <div
              key={id}
              className="border border-base-300 rounded-md shadow-lg my-5 py-4 mx-52 laptop:mx-10 tablet:mx-10 mobile:mx-2 hover:bg-gray-200"
            >
              <div
                className="text-xl font-medium px-5 py-4 cursor-pointer"
                onClick={() => toggleExchanges(id)}
              >
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20">
                    <img src={image} alt={`${name} icon`} />
                  </div>
                  <p className="font-bold text-2xl uppercase">{name}</p>
                </div>
              </div>

              {openExchanges[id] && (
                <div className="px-5 py-4 bg-white">
                  <div className="flex justify-evenly items-center flex-wrap mobile:flex-col mobile:items-start">
                    <p className="font-semibold">Rank: {market_cap_rank}</p>
                    <p className="font-semibold">
                      Last Updated:
                      <span className="text-sm px-2 font-light">
                        {last_updated}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Price:
                      <span className="text-sm px-2 font-light">
                        {current_price}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Volume:
                      <span className="text-sm px-2 font-light">
                        {total_volume}
                      </span>
                    </p>
                  </div>
                </div>
              )}
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
          View more exchanges
        </Link>
      </p>
    </>
  );
};

export default LimExchanges;
