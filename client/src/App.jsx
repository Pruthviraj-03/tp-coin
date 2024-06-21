import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Exchanges, News, Watchlist, Portfolio } from "./Pages/index.js";
import { Cryptos, CryptoDetails } from "./Cryptos/index.js";
import { EditProfile, Login, Otp, Profile } from "./Auth/index.js";
import ErrorPage from "./Components/ErrorPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/coins" exact element={<Cryptos />} />
      <Route path="/coins/:id" exact element={<CryptoDetails />} />
      <Route path="/exchanges" exact element={<Exchanges />} />
      <Route path="/news" exact element={<News />} />
      <Route path="/watchlist" exact element={<Watchlist />} />
      <Route path="/portfolio" exact element={<Portfolio />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/login/otp" element={<Otp />} />
      <Route path="/profile" exact element={<Profile />} />
      <Route path="/editprofile" exact element={<EditProfile />} />
      <Route path="*" exact element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
