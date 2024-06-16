import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import cLogo from "../Images/icons8-cryptocurrency-64.png";
import cImg from "../Images/FinanceappMonochromatic.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscHome } from "react-icons/vsc";
import { MdFavoriteBorder } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiEye } from "react-icons/fi";
import { SiApacheecharts } from "react-icons/si";
import { RiMoneyCnyCircleLine } from "react-icons/ri";
import { BsNewspaper } from "react-icons/bs";
import axios from "axios";
import { CryptoState } from "../Context/CryptoContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { currency, setCurrency } = CryptoState();
  const [menu, setMenu] = useState(false);
  const [userData, setUserData] = useState(null);

  const getUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/users/login/success",
        { withCredentials: true }
      );
      console.log("User data response:", response.data);
      setUserData(response.data.data.user);
    } catch (error) {
      console.log("error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/v1/users/logout", {
        withCredentials: true,
      });
      window.alert("User logout success");
      setUserData(null);
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <>
      <div
        className="fixed select-none font-nunito w-full py-6 flex justify-between items-center z-40
          shadow-md text-xl bg-gray-400 text-gray-800 mobile:py-5 overflow-x-hidden border-b"
      >
        <div className="flex gap-4 items-center text-3xl px-2 mobile:text-xl mobile:gap-2">
          <span className="w-10 ml-10 mobile:ml-1 tablet:ml-2">
            <img src={cLogo} alt="app logo png" />
          </span>
          <p className="font-black text-black">
            <Link to="/">TP-COIN</Link>
          </p>
        </div>

        <div className="flex items-center text-lg absolute right-10 mobile:right-0 mobile:relative mobile:text-sm">
          {userData ? (
            <div className="mr-5">
              <button
                className="px-1 py-2 font-bold text-gray-800 hover:underline uppercase text-sm"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="mr-5">
              <button className="px-1 py-2 font-bold text-gray-800 hover:underline uppercase text-sm">
                <Link to="/login">Log In</Link>
              </button>
            </div>
          )}

          {userData ? (
            <select
              name="currencies"
              className="bg-gray-400 outline-none font-semibold cursor-pointer mr-5"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
              }}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          ) : (
            ""
          )}
        </div>

        <button
          className="menu-button overflow-x-hidden text-2xl mr-5"
          onClick={() => setMenu(true)}
        >
          <GiHamburgerMenu />
        </button>
      </div>

      {menu && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setMenu(false)}
          ></div>
          <div className="fixed font-nunito h-screen bg-gray-400 pt-10 w-1/5 mobile:w-2/3 tablet:w-2/5 laptop:w-1/4 z-50">
            <ul className="menu-list font-semibold flex flex-col gap-3 pt-6 laptop:pt-0 tablet:pt-8 mobile:pt-2 tablet:gap-5">
              <div className="px-10">
                <img src={cImg} alt="app logo png" />
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-500 hover:text-white px-8 py-2 mobile:py-1">
                <span className="text-2xl laptop:text-4xl tablet:text-4xl">
                  <VscHome />
                </span>
                <Link to="/">Home</Link>
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-500 hover:text-white px-8 py-2 mobile:py-1">
                <span className="text-2xl laptop:text-4xl tablet:text-4xl">
                  <SiApacheecharts />
                </span>
                <Link to="/coins">Buy Crypto's</Link>
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-500 hover:text-white px-8 py-2 mobile:py-1">
                <span className="text-2xl laptop:text-4xl tablet:text-4xl">
                  <MdFavoriteBorder />
                </span>
                <Link to="/portfolio">Portfolio</Link>
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-500 hover:text-white px-8 py-2 mobile:py-1">
                <span className="text-2xl laptop:text-4xl tablet:text-4xl">
                  <FiEye />
                </span>
                <Link to="/watchlist">WatchList</Link>
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-500 hover:text-white px-8 py-2 mobile:py-1">
                <span className="text-2xl laptop:text-4xl tablet:text-4xl">
                  <RiMoneyCnyCircleLine />
                </span>
                <Link to="/exchanges">Exchanges</Link>
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-500 hover:text-white px-8 py-2 mobile:py-1">
                <span className="text-2xl laptop:text-4xl tablet:text-4xl">
                  <BsNewspaper />
                </span>
                <Link to="/news">News</Link>
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-500 hover:text-white px-8 py-2 mobile:py-1">
                <span className="text-2xl laptop:text-4xl tablet:text-4xl">
                  <CgProfile />
                </span>
                <Link to="/profile">Profile</Link>
              </div>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
