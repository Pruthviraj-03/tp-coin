import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfilePng from "../Images/profile.png";
import NavBar from "../Components/NavBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await axios.get(
        "https://tp-coin-api.vercel.app/api/v1/users/login/success",
        { withCredentials: true }
      );
      setUserData(response.data.data.user);
    } catch (error) {
      navigate("/login");
      toast.warning("Login first to access profile page!", {
        position: "top-center",
        autoClose: 3000,
      });
      console.log("error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleAction = () => {
    navigate("/editprofile");
    toast.info("You can now edit your profile!", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        "https://tp-coin-api.vercel.app/api/v1/users/deleteUser",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Account deleted successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        setUserData({});
        navigate("/login");
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      toast.error("Failed to delete account. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
      console.log("Error deleting account:", error);
    }
  };

  return (
    <>
      <NavBar />

      <div className="flex justify-center">
        <div className="font-nunito w-3/5 py-5 px-8 laptop:w-4/5 tablet:w-full mobile:w-full mobile:px-0">
          <form method="GET">
            <div className="pt-32 pb-20 mobile:pt-24 mobile:pb-10">
              <div className="mx-5 px-5 bg-gray-50 border-2 border-gray-300 hover:border-black rounded-lg shadow-md">
                <div className="flex items-center justify-around p-10 mobile:px-0 mobile:py-2">
                  <div>
                    <div className="avatar online"></div>
                    <div className="pt-5">
                      <label className="text-lg lowercase text-gray-500">
                        Full Name :
                      </label>
                      <p className="text-xl font-medium text-gray-700">
                        {userData.name}
                      </p>
                    </div>
                    <div className="pt-5">
                      <label className="text-lg lowercase text-gray-500">
                        Contact No :
                      </label>
                      <p className="text-xl font-medium text-gray-700">
                        {userData.phoneNumber}
                      </p>
                    </div>
                    <div className="pt-5">
                      <label className="text-lg lowercase text-gray-500">
                        Email id :
                      </label>
                      <p className="text-xl font-medium text-gray-700">
                        {userData.email}
                      </p>
                    </div>

                    <div className="flex flex-col">
                      <button
                        className="bg-gray-600 text-white font-nunito font-semibold p-2 rounded-md shadow-md mt-10 
                          mobile:py-2 w-48 mobile:w-full"
                        onClick={handleAction}
                      >
                        Edit Profile
                      </button>

                      <button
                        className="bg-red-600 text-white font-nunito font-semibold p-2 text-sm rounded-md shadow-md mt-10 
                          mobile:text-base mobile:py-2 w-48 mobile:w-full"
                        type="button"
                        onClick={handleDelete}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>

                  <div
                    className="mobile:hidden tablet:hidden"
                    style={{ width: "500px" }}
                  >
                    <img src={ProfilePng} alt="login svg" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
