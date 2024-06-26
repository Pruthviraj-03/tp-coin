import React, { useState } from "react";

const BasicQue = () => {
  const BasicQue = [
    {
      id: 1,
      question: "What is cryptocurrency and how it works ?",
      answer:
        "Cryptocurrency is a form of payment that can be exchanged online for goods and services. Many companies have issued their own currencies, often called tokens, and these can be traded specifically for the good or service that the company provides. Cryptocurrencies work using a technology called blockchain.",
    },
    {
      id: 2,
      question: "Is crypto real money ?",
      answer:
        "You exchange real currency, like dollars, to buy “coins” or “tokens” of a certain kind of cryptocurrency. Craft a harder-working money plan with a trusted financial pro.",
    },
    {
      id: 3,
      question: "Can cryptocurrency be converted to cash ?",
      answer:
        "The first method to convert any cryptocurrency into cash is through an exchange or a broker, this is quite similar to the currency exchange system at airports of a foreign country. Transfer your Bitcoins to the exchange that supports buying and selling in INR.",
    },
    {
      id: 4,
      question: "How do I cash out bitcoin ?",
      answer:
        "How To Cash Out Your Bitcoin And What You Should Know Before You Do. If you find your Bitcoin is worth way more than you bought it for, you'll want to get your hands on the profits. Let's walk through selling your bitcoins so you can convert these digital assets to cash.",
    },
    {
      id: 5,
      question: "What can I purchase with cryptocurrency ?",
      answer:
        "The number of retailers and payment processors accepting bitcoin has increased in recent years, although there are still some major holdouts. Among the products that can be purchased using bitcoin today are electronics, luxury watches, and even cars.",
    },
    {
      id: 6,
      question: "Is crypto safe ?",
      answer:
        "Due to their nature, cryptocurrencies are not regulated, which carries risk of market volatility and loss for investors. However, the security risks and risk of fraud when using Bitcoin and other cryptocurrencies are vastly reduced.",
    },
    {
      id: 7,
      question: "What is the Future of Cryptocurrency Trading in India ?",
      answer:
        "Since 2020, Crores of Indians have dipped their toes into cryptocurrencies, and with the number going up every day, India looks exciting for the crypto revolution. The government is also actively trying to set up a regulatory framework for its smooth functioning, the recent MCA amendment being the first step.",
    },
    {
      id: 8,
      question: "What is cryptocurrency mining ?",
      answer:
        " Cryptocurrency mining is a process through which miners verify transactions on the blockchain and receive cryptocurrencies in exchange as rewards. It helps in the smooth sustenance of the network.",
    },
  ];
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleQuestion = (id) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="font-nunito select-none shadow-lg mx-60 mb-14 p-2 laptop:mx-10 tablet:mx-10 mobile:mx-2 mobile:p-0 mobile:shadow-lg bg-white">
      <p className="text-center font-bold text-2xl py-5 pb-10 mobile:text-xl text-gray-800">
        Frequently Asked Questions.
      </p>
      {BasicQue.map((que) => (
        <div
          className="border border-gray-300 rounded-md mb-2 mobile:py-2 bg-gray-50"
          key={que.id}
        >
          <div
            className="px-5 py-4 bg-gray-100 hover:bg-gray-200 cursor-pointer"
            onClick={() => toggleQuestion(que.id)}
          >
            <p className="font-bold text-xl capitalize text-gray-800">
              {que.question}
            </p>
          </div>
          {openQuestions[que.id] && (
            <div className="text-lg font-medium px-5 mobile:text-base bg-white text-gray-700">
              <p className="font-medium py-2">{que.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BasicQue;
