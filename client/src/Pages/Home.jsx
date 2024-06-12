import React, { useEffect } from "react";
// import Cookies from "universal-cookie";
// import { toast } from "react-toastify";
import Aos from "aos";
import "aos/dist/aos.css";
import NavBar from "../Components/NavBar";
import Header from "../Components/Header";
import GlobalStats from "./GlobalStats";
import LimCryptos from "../LimPages/LimCryptos";
import Middle from "../Components/Middle";
import LimExchanges from "../LimPages/LimExchanges";
import LimNews from "../LimPages/LimNews";
import BasicQue from "../Components/BasicQue";
import CustomerReview from "../Components/CustomerReview";
import ScrollToTop from "../Components/ScrollToTop";
// import VoiceAss from "../voice-assistant/VoiceAss";
import Footer from "../Components/Footer";
// import { useNavigate } from "react-router";

const Home = () => {
  // const cookies = new Cookies();
  // const navigate = useNavigate();

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  // useEffect(() => {
  //   if (!cookies.get("isLogin")) {
  //     navigate("/login");
  //   } else {
  //     navigate("/");
  //   }
  // }, []);

  return (
    <div className="font-nunito scrollbar-hide overflow-x-hidden">
      <NavBar />
      <Header />
      <GlobalStats />
      <LimCryptos />

      <div data-aos="flip-up">
        <Middle />
      </div>

      <LimExchanges />
      <LimNews />
      <BasicQue />
      <CustomerReview />
      <ScrollToTop />
      {/* <VoiceAss /> */}
      <Footer />
    </div>
  );
};

export default Home;
