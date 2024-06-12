import React from "react";
import { FaTwitter, FaYoutube, FaFacebookSquare } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const twitterUrl = "https://twitter.com/explore";
  const facebookUrl = "https://www.facebook.com/";
  const youtubeUrl = "https://www.youtube.com/";

  return (
    <footer className="font-nunito select-none p-10 text-base-content bg-gray-400 footer-center">
      <div className="grid grid-flow-col gap-4 font-semibold uppercase justify-center">
        <Link href="#" className="link link-hover hover:text-gray-100">
          About us
        </Link>
        <Link href="#" className="link link-hover hover:text-gray-100">
          Contact
        </Link>
        <Link href="#" className="link link-hover hover:text-gray-100">
          Jobs
        </Link>
      </div>
      <div className="flex justify-center gap-6 py-5 cursor-pointer">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={twitterUrl}
          className="text-2xl hover:text-gray-100"
        >
          <FaTwitter />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={youtubeUrl}
          className="text-2xl hover:text-gray-100"
        >
          <FaYoutube />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={facebookUrl}
          className="text-2xl hover:text-gray-100"
        >
          <FaFacebookSquare />
        </a>
      </div>
      <div className="text-center">
        <p className="text-sm">
          &copy; 2024-25 - All rights reserved by tp-coin
        </p>
      </div>
    </footer>
  );
};

export default Footer;
