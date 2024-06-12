import axios from "axios";
import Cookies from "universal-cookie";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Logout = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const LogoutFunction = async () => {
    try {
      await axios.get("http://localhost:5000/logout");
      cookies.remove("isLogin");
      localStorage.removeItem("watchlist_data");

      navigate("/login");
      toast.success("Logout Successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    LogoutFunction();
  });

  return <></>;
};

export default Logout;
