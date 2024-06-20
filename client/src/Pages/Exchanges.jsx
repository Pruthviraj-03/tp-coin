import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../Components/Spinner";
import NavBar from "../Components/NavBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);

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
        setExchanges(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching exchanges:", error);
      }
    };

    fetchExchanges();
  }, []);

  useEffect(() => {
    return toast.info("Tap to see Deatils!", {
      position: "top-center",
      autoClose: 3000,
    });
  }, []);

  return (
    <>
      <NavBar />
      <p className="text-center text-3xl font-bold pt-32 pb-10 uppercase font-nunito select-none">
        Exchanges
      </p>

      {exchanges ? (
        exchanges.map((curElem, id) => {
          const {
            name,
            last_updated,
            current_price,
            market_cap_rank,
            total_volume,
            // websiteUrl,
            image,
          } = curElem;

          return (
            <div
              key={id}
              className="collapse border border-base-300 rounded-md shadow-lg my-5 py-4 mx-52 
                    laptop:mx-10 tablet:mx-10 mobile:mx-2"
            >
              <input type="checkbox" />

              <div className="collapse-title text-xl font-medium">
                <div className="flex items-center gap-5 px-5 cursor-pointer">
                  <div className="w-20 h-20">
                    <img src={image} alt="icons" />
                  </div>
                  <p className="font-bold text-2xl uppercase pb-2">{name}</p>
                </div>
              </div>

              <div className="collapse-content">
                <div className="flex justify-evenly items-center flex-wrap mobile:flex-col mobile:items-start mobile:px-5 mobile:pt-5">
                  <p className="font-semibold">Rank : {market_cap_rank}</p>
                  <p className="font-semibold">
                    lastTickerCreatedAt :
                    <span className="text-sm px-2 font-light">
                      {last_updated}
                    </span>
                  </p>
                  <p className="font-semibold">
                    price :
                    <span className="text-sm px-2 font-light">
                      {current_price}
                    </span>
                  </p>
                  <p className="font-semibold">
                    volume :
                    <span className="text-sm px-2 font-light">
                      {total_volume}
                    </span>
                  </p>
                  {/* <p className="text-xs text-blue-600 font-medium lowercase cursor-pointer">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={websiteUrl}
                    >
                      {websiteUrl}
                    </a>
                  </p> */}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Exchanges;
