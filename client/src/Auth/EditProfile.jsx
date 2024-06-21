import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import ProfilePng from "../Images/profile.png";
import NavBar from "../Components/NavBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/login/success",
          { withCredentials: true }
        );

        const userData = response.data.data.user;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
        });
      } catch (error) {
        console.log("error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/v1/users/editprofile",
        {
          ...formData,
        },
        { withCredentials: true }
      );
      navigate("/profile");
      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error saving user details:", error);
    }
  };

  return (
    <>
      <NavBar />

      <div className="flex justify-center">
        <div className="font-nunito w-3/5 py-5 px-8 laptop:w-4/5 tablet:w-full mobile:w-full mobile:px-0">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="pt-40 pb-20 mobile:pt-24 mobile:pb-10">
              <div className="mx-5 px-5 bg-gray-50 py-10 border-2 border-gray-300 hover:border-black rounded-lg shadow-xl">
                <div className="flex items-center justify-around p-10 mobile:px-0 mobile:py-2">
                  <div>
                    <div className="pt-5">
                      <label className="text-lg lowercase text-gray-500">
                        Full Name :
                      </label>
                      <input
                        type="text"
                        minLength="2"
                        maxLength="20"
                        pattern="[a-zA-Z]+([ ]?[a-zA-Z]+)*"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="name"
                        className="text-md block px-3 py-2 rounded-lg w-full border-2 border-gray-300
                            shadow-md focus:bg-white focus:border-gray-600 focus:outline-none my-4"
                      />
                    </div>

                    <div className="pt-5">
                      <label className="text-lg lowercase text-gray-500">
                        Contact No :
                      </label>
                      <input
                        type="tel"
                        minLength="10"
                        maxLength="10"
                        // pattern="^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        placeholder="valid contact number only"
                        className="text-md block px-3 py-2 rounded-lg w-full border-2 border-gray-300
                            shadow-md focus:bg-white focus:border-gray-600 focus:outline-none my-4"
                      />
                    </div>

                    <div className="pt-5">
                      <label className="text-lg lowercase text-gray-500">
                        Email id :
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        pattern="[a-z0-9.]+@[a-z0-9.]+\.[a-z]{2,6}$"
                        placeholder="valid email@email.com only"
                        className="text-md block px-3 py-2 rounded-lg w-full border-2 border-gray-300
                            shadow-md focus:bg-white focus:border-gray-600 focus:outline-none my-4"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 text-2xl my-5 font-semibold rounded-lg"
                    >
                      Save Edit
                    </button>
                  </div>

                  <div
                    className="mobile:hidden tablet:hidden"
                    style={{ width: "600px" }}
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

export default EditProfile;
