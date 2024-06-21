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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NavBar = () => {
  const NavBar = [
    {
      id: 1,
      logo: <VscHome />,
      to: "/",
      title: "Home",
    },
    {
      id: 2,
      logo: <SiApacheecharts />,
      to: "/coins",
      title: "Buy Crypto's",
    },
    {
      id: 3,
      logo: <MdFavoriteBorder />,
      to: "/portfolio",
      title: "Portfolio",
    },
    {
      id: 4,
      logo: <FiEye />,
      to: "/watchlist",
      title: "WatchList",
    },
    {
      id: 5,
      logo: <RiMoneyCnyCircleLine />,
      to: "/exchanges",
      title: "Exchanges",
    },
    {
      id: 6,
      logo: <BsNewspaper />,
      to: "/news",
      title: "News",
    },
    {
      id: 7,
      logo: <CgProfile />,
      to: "/profile",
      title: "Profile",
    },
  ];

  const navigate = useNavigate();
  const { currency, setCurrency } = CryptoState();
  const [menu, setMenu] = useState(false);
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

  const handleLogout = async () => {
    try {
      await axios.get("https://tp-coin-api.vercel.app/api/v1/users/logout", {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
      toast.success("User logged out successfully !", {
        position: "top-center",
        autoClose: 3000,
      });
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
              {NavBar.map((items) => (
                <Link to={items.to} key={items.id}>
                  <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-500 hover:text-white px-8 py-2 mobile:py-1">
                    <span className="text-2xl laptop:text-4xl tablet:text-4xl">
                      {items.logo}
                    </span>
                    {items.title}
                  </div>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
