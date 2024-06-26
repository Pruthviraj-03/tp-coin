import React, { useState, useEffect } from "react";
import TrendCarsoule from "./TrendCarsoule";
import { useNavigate } from "react-router";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const getUser = async () => {
    try {
      const response = await axios.get(
        "https://tp-coin-api.vercel.app/api/v1/users/login/success",
        { withCredentials: true }
      );
      setUserData(response.data.data.user);
    } catch (error) {
      console.log("error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="select-none relative top-28 px-52 mb-20 bg-gray-200 mobile:px-1 tablet:px-10 laptop:px-32">
      <div className="bg-taj-mahal bg-no-repeat bg-right bg-opacity-0">
        <div className="p-10 font-nunito">
          <p className="text-5xl font-bold my-5">Welcome to TP-Coin</p>
          <p className="text-gray-700 mobile:text-sm">
            Crypto Currency Exchange.
          </p>
          <p className="text-gray-700 mobile:text-sm">
            Invest in Crypto-Currency in One-Click for a better future.
          </p>
          <div>
            {userData ? (
              ""
            ) : (
              <button
                className="my-5 text-2xl font-semibold bg-gray-800 hover:bg-black text-gray-50 rounded-md px-5 py-2 mobile:text-xl"
                onClick={() => navigate("/login")}
              >
                Register Now
              </button>
            )}
          </div>
        </div>
        <div className="mt-12 mobile:mt-2">
          <TrendCarsoule />
        </div>
      </div>
    </div>
  );
};

export default Header;
