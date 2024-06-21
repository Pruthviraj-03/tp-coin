import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import {
  NavBar,
  Header,
  Middle,
  BasicQue,
  CustomerReview,
  ScrollToTop,
  Footer,
} from "../Components/index.js";
import GlobalStats from "./GlobalStats";
import { LimCryptos, LimExchanges, LimNews } from "../LimPages/index.js";

const Home = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

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
      <Footer />
    </div>
  );
};

export default Home;
