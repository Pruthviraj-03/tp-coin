import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Spinner = () => {
  return (
    <div className="flex justify-center my-96 gap-5">
      <ClipLoader color="black" loading size={40} />
      <span className="font-nunito font-bold text-2xl text-gray-800">
        loading...
      </span>
    </div>
  );
};

export default Spinner;
