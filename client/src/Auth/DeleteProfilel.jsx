import axios from "axios";
import Cookies from "universal-cookie";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const DeleteProfile = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const deleteUser = async () => {
    try {
      await axios.delete(
        "https://crypto-exchange-backend.vercel.app/deleteUser"
      );
      cookies.remove("isLogin");
      localStorage.removeItem("watchlist_data");

      navigate("/");
      toast.success("Account deleted!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    deleteUser();
  });

  return <></>;
};

export default DeleteProfile;
