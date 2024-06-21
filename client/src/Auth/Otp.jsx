import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import signImg from "../Images/signup.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Otp = () => {
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [timer, setTimer] = useState(30);
  const phoneNumber = localStorage.getItem("phoneNumber");
  const navigate = useNavigate();

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/login");
    }

    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [navigate, phoneNumber]);

  const handleChange = (element, index) => {
    const value = element.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (element.nextElementSibling) {
        element.nextElementSibling.focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      if (element.previousElementSibling) {
        element.previousElementSibling.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    try {
      const response = await axios.post(
        "https://tp-coin-api.vercel.app/api/v1/users/verify-otp",
        {
          phoneNumber,
          otp: enteredOtp,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/");
        toast.success("User logged in successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      toast.error("Failed to verify OTP. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(
        "https://tp-coin-api.vercel.app/api/v1/users/resend-otp",
        {
          phoneNumber,
        }
      );
      setTimer(30);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  return (
    <div className="flex justify-center pt-40 pb-20">
      <div className="shadow-lg rounded-lg border border-gray-200 py-5 px-8 laptop:w-4/5 tablet:w-full mobile:w-full">
        <div className="text-center font-bold text-4xl py-5 text-black mobile:text-3xl">
          Verify with OTP
        </div>
        <div className="flex items-center justify-center">
          <div className="mobile:hidden block">
            <img src={signImg} alt="register svg" />
          </div>
          <div className="container max-w-full">
            <h3 className="text-gray-600 text-sm mobile:text-base">
              Sent to {phoneNumber}
            </h3>
            <div className="flex flex-row flex-wrap gap-4 justify-center mt-6 mobile:mt-10">
              {otp.map((data, index) => (
                <input
                  key={index}
                  className="text-xl mobile:text-3xl text-center w-16 h-16 mobile:w-20 mobile:h-20 border border-gray-300 rounded-lg outline-none"
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[index] && index > 0) {
                      e.preventDefault();
                      if (e.target.previousElementSibling) {
                        e.target.previousElementSibling.focus();
                      }
                    }
                  }}
                />
              ))}
            </div>
            <button
              className="bg-blue-600 text-white font-bold rounded-full h-12 w-40 mt-8 ml-40 tablet:ml-32 laptop:ml-48 mobile:ml-48 mobile:h-14 mobile:w-40 mobile:text-lg cursor-pointer"
              onClick={handleSubmit}
            >
              VERIFY OTP
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 mobile:mt-6">
              <span className="text-gray-600 text-sm mobile:text-base">
                Resend OTP in:
              </span>
              <span
                className="font-bold text-main-color text-sm mobile:text-base cursor-pointer"
                onClick={handleResend}
                disabled={timer > 0}
              >
                {timer > 0
                  ? `00:${timer.toString().padStart(2, "0")}`
                  : "Resend"}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 mobile:mt-6">
              <span className="text-main-color text-sm mobile:text-base">
                Log in using
              </span>
              <a href="/login">
                <span className="font-bold text-main-color text-sm mobile:text-base cursor-pointer">
                  Google
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
