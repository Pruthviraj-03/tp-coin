import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Cryptos from "./Cryptos/Cryptos";
import CryptoDetails from "./Cryptos/CryptoDetails";
import Exchanges from "./Pages/Exchanges";
import News3 from "./Pages/News3";
import Watchlist from "./Pages/Watchlist";
import Portfolio from "./Pages/Portfolio";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import Profile from "./Auth/Profile";
import EditProfile from "./Auth/EditProfile";
import DeleteProfile from "./Auth/DeleteProfile";
import ErrorPage from "./Components/ErrorPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/coins" exact element={<Cryptos />} />
      <Route path="/coins/:id" exact element={<CryptoDetails />} />
      <Route path="/exchanges" exact element={<Exchanges />} />
      <Route path="/news" exact element={<News3 />} />
      <Route path="/watchlist" exact element={<Watchlist />} />
      <Route path="/portfolio" exact element={<Portfolio />} />
      <Route path="/register" exact element={<Register />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/logout" exact element={<Logout />} />
      <Route path="/profile" exact element={<Profile />} />
      <Route path="/editprofile" exact element={<EditProfile />} />
      <Route path="/deleteprofile" exact element={<DeleteProfile />} />
      <Route path="*" exact element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
