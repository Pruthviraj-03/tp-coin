import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import signImg from "../Images/signup.png";
import NavBar from "../Components/NavBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const loginWithGoogle = () => {
    window.open(
      "https://tp-coin-api.vercel.app/api/v1/users/google/callback",
      "_self"
    );
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleContinue = async () => {
    try {
      await axios.post(
        "https://tp-coin-api.vercel.app/api/v1/users/send-otp",
        {
          phoneNumber,
        },
        { withCredentials: true }
      );
      localStorage.setItem("phoneNumber", phoneNumber);
      navigate("/login/otp");
      toast.success(`OTP send on ${phoneNumber} successfully !`, {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Failed to send OTP:", error);
      toast.error(
        "Failed to send OTP. Please check the phone number or format.",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    }
  };

  return (
    <>
      <NavBar />

      <div className="flex justify-center pt-40 pb-20">
        <div className="shadow-lg rounded-lg border border-gray-200 py-5 px-8 laptop:w-4/5 tablet:w-full mobile:w-full">
          <div className="text-center font-bold text-4xl py-5 text-black mobile:text-3xl">
            Login or Register
          </div>
          <div className="flex items-center justify-center">
            <div className="mobile:hidden block">
              <img src={signImg} alt="register svg" />
            </div>
            <div className="container max-w-full">
              <div className="max-w-sm mx-auto px-6">
                <div className="relative flex flex-wrap gap-20">
                  <div className="w-full relative space-y-6">
                    {" "}
                    <div className="flex items-center gap-1 h-10 w-full py-2 px-4 border border-gray-300 rounded">
                      <span className="text-gray-600 text-base">+91</span>
                      <div className="w-px h-full bg-gray-300 mx-2"></div>
                      <input
                        className="text-gray-900 text-base w-full h-full border-none outline-none"
                        type="tel"
                        placeholder="Mobile Number"
                        maxLength="10"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                      />
                    </div>
                    <div
                      className="flex justify-center items-center w-full h-10 bg-blue-600 text-white font-bold rounded cursor-pointer hover:bg-blue-700"
                      onClick={handleContinue}
                    >
                      <span className="text-base">CONTINUE</span>
                    </div>
                    <h2 className="text-gray-600 text-center text-base font-bold">
                      ----------- or with Google account -----------
                    </h2>
                    <div
                      className="flex items-center justify-center gap-4 h-12 w-full bg-red-600 text-white font-bold rounded cursor-pointer hover:bg-red-700"
                      onClick={loginWithGoogle}
                    >
                      <FontAwesomeIcon className="text-xl" icon={faGoogle} />
                      <span className="text-lg">Google</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
