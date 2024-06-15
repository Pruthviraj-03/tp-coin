import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import "react-alice-carousel/lib/alice-carousel.css";
import CryptoContext from "./Context/CryptoContext";
import { WatchlistProvider } from "./Context/WatchlistContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Router>
      <WatchlistProvider>
        <CryptoContext>
          <App />
          <ToastContainer className="foo" style={{ fontWeight: "bold" }} />
        </CryptoContext>
      </WatchlistProvider>
    </Router>
  </>
);
