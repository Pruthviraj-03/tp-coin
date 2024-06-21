import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "../Components/Spinner";

const LimNews = () => {
  const [news, setNews] = useState([]);
  const getData = async () => {
    try {
      const setHeader = {
        headers: {
          "X-RapidAPI-Key":
            "801cfd6090msh43ba5a116c51f0ep1004f8jsna6de03eee58b",
          "X-RapidAPI-Host": "cryptocurrency-news2.p.rapidapi.com",
        },
      };

      const res = await axios.get(
        "https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk",
        setHeader
      );

      const response = res.data.data;
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
      <p className="text-center text-3xl font-bold pt-14 uppercase font-nunito">
        News
      </p>

      <div className="flex flex-row flex-wrap justify-around mx-48 mobile:mx-2">
        {news ? (
          news.slice(0, 6).map((curElm, id) => {
            const { title, url } = curElm;
            return (
              <div
                key={id}
                className="flex flex-col my-5 overflow-x-hidden w-96 h-48 p-2 border border-gray-400 
                    rounded-lg shadow-md bg-gray-100 outline-none scrollbar-hide mx-2"
              >
                <div className="h-1/2 w-full flex flex-col gap-5 font-nunito">
                  <p className="text-xl font-semibold">{title}</p>
                  <p className="text-2xs text-blue-700 cursor-pointer">
                    <a target="_blank" rel="noopener noreferrer" href={url}>
                      {url}
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

      <p className="text-center text-gray-500 font-light pt-5 pb-5 font-nunito">
        <Link
          to="/news"
          className="inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white transition bg-blue-500 rounded-full shadow ripple hover:shadow-lg hover:bg-blue-600 focus:outline-none"
        >
          view more news
        </Link>
      </p>
    </>
  );
};

export default LimNews;
