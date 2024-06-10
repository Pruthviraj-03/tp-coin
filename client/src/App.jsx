import React from "react";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Home />} />
    </Routes>
  );
};

export default App;
