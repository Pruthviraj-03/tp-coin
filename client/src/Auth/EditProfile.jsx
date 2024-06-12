import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ProfilePng from "../Images/profile.png";
import NavBar from "../Components/NavBar";

const EditProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    profilePic: "https://via.placeholder.com/150",
    fullName: "John Doe",
    email: "johndoe@example.com",
    contactNo: "123-456-7890",
  });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImage = (e) => {
    setUser({ ...user, profilePic: URL.createObjectURL(e.target.files[0]) });
  };

  useEffect(() => {
    const fetchData = () => {
      setUser({
        profilePic: "https://via.placeholder.com/150",
        fullName: "John Doe",
        email: "johndoe@example.com",
        contactNo: "123-456-7890",
      });
    };

    fetchData();
  }, []);

  const submitEditProfileDetails = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

  return (
    <>
      <NavBar />

      <div className="flex justify-center">
        <div className="font-nunito w-3/5 py-5 px-8 laptop:w-4/5 tablet:w-full mobile:w-full mobile:px-0">
          <form autoComplete="off" onSubmit={submitEditProfileDetails}>
            <div className="pt-40 pb-20 mobile:pt-24 mobile:pb-10">
              <div className="mx-5 px-5 bg-gray-50 py-10 border-2 border-gray-300 hover:border-black rounded-lg shadow-xl">
                <div className="flex items-center justify-around p-10 mobile:px-0 mobile:py-2">
                  <div>
                    <div className="avatar online">
                      <div className="rounded-full w-24 h-24">
                        <img src={user.profilePic} alt="user profile pic" />
                      </div>
                    </div>
                    <input
                      type="file"
                      name="myprofilePic"
                      onChange={handleImage}
                    />

                    <div className="pt-5">
                      <label className="text-lg lowercase text-gray-500">
                        Full Name :
                      </label>
                      <input
                        type="text"
                        minLength="2"
                        maxLength="20"
                        pattern="[a-zA-Z]+([ ]?[a-zA-Z]+)*"
                        name="fullName"
                        value={user.fullName}
                        onChange={handleInputs}
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
                        pattern="^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$"
                        name="contactNo"
                        value={user.contactNo}
                        onChange={handleInputs}
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
                        value={user.email}
                        onChange={handleInputs}
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
