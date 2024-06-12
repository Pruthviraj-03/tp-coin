import React, { useState, useEffect } from "react";
import axios from "axios";
import { CryptoState } from "../Context/CryptoContext.js";
import { Link } from "react-router-dom";
import AliceCarousel from "react-alice-carousel";
import Spinner from "./Spinner";

const TrendCarsoule = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);

  const { currency, symbols } = CryptoState();

  const TrendingCoinsURL = (currency) =>
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(TrendingCoinsURL(currency));
      setTrending(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [currency]);

  const items = trending.map((val, ids) => {
    const { id, image, symbol, current_price, price_change_percentage_24h } =
      val;

    return (
      <>
        {loading ? (
          <Spinner />
        ) : (
          <Link
            className="flex flex-col items-center cursor-pointer uppercase text-black"
            style={{ textDecoration: "none" }}
            key={ids}
            to={`/coins/${id}`}
          >
            <div>
              <img
                src={image}
                alt="crypto logo"
                height="100"
                width="100"
                style={{ marginBottom: 10 }}
              />
              <p className="font-nunito font-bold">{symbol}</p>
              <span className="font-nunito font-semibold">
                {price_change_percentage_24h < 0 ? (
                  <p style={{ color: "red" }}>
                    {price_change_percentage_24h.toFixed(2)}%
                  </p>
                ) : (
                  <p style={{ color: "green" }}>
                    + {price_change_percentage_24h.toFixed(2)}%
                  </p>
                )}
              </span>
              <span
                style={{ fontSize: 22, fontWeight: 500 }}
                className="font-nunito"
              >
                {symbols} {current_price?.toFixed(2)}
              </span>
            </div>
          </Link>
        )}
      </>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <div className="h-10 flex items-center">
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        responsive={responsive}
        items={items}
        autoPlay
      />
    </div>
  );
};

export default TrendCarsoule;
