import axios from "axios";
import React, { useEffect, useState } from "react";
import { Spinner, NavBar } from "../Components/index.js";

const News = () => {
  const [news, setNews] = useState([]);

  const getData = async () => {
    try {
      const setHeader = {
        headers: {
          "x-rapidapi-key":
            "801cfd6090msh43ba5a116c51f0ep1004f8jsna6de03eee58b",
          "x-rapidapi-host": "cryptonews16.p.rapidapi.com",
        },
      };

      const res = await axios.get(
        "https://cryptonews16.p.rapidapi.com/news",
        setHeader
      );

      const response = res.data.data;
      console.log("res", response);
      setNews(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <NavBar />
      <div className="pt-24 flex flex-row flex-wrap justify-around mx-32 tablet:mx-5 laptop:mx-10 mobile:mx-2">
        {news ? (
          news.slice(0, 48).map((curElm, id) => {
            const { title, link } = curElm;
            return (
              <div
                key={id}
                className="flex flex-col my-5 overflow-x-hidden w-96 h-48 p-2 border border-gray-400 
                    rounded-lg shadow-md bg-gray-100 outline-none scrollbar-hide"
              >
                <div className="h-1/2 w-full flex flex-col gap-5 font-nunito">
                  <p className="text-xl font-semibold">{title}</p>
                  <p className="text-2xs text-blue-700 cursor-pointer">
                    <a target="_blank" rel="noopener noreferrer" href={link}>
                      {link}
                    </a>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <Spinner />
        )}
      </div>
    </>
  );
};

export default News;
