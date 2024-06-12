import React from "react";
import imgas from "../Images/user.jpg";

const CustomerReview = () => {
  const customerApi = [
    {
      id: 1,
      img: imgas,
      name: "Rahul Shinde.",
      location: "Mumbai, India.",
      review:
        "In this busy world, The instant deposits and withdrawals have made TP-Coin my go-to crypto trading platform.",
    },
    {
      id: 2,
      img: imgas,
      name: "Rashbhari Taneja.",
      location: "Delhi, India.",
      review:
        "IBeing an ardent stock trader, I made my way into cryptocurrencies through TP-Coin the live charts and information have helped me make informed choices.",
    },
    {
      id: 3,
      img: imgas,
      name: "Sushmita Gada.",
      location: "Gujrat, India.",
      review:
        "I have been reading docs for some time now and have found TP-Coin to be the simplest way to trade in cryptocurrencies.",
    },
    {
      id: 4,
      img: imgas,
      name: "Vijay Kumar.",
      location: "UP, India.",
      review:
        "I like how the interface is so user friendly; it handheld me at every step of making my first crypto trade. Well done tp-coin team.",
    },
    {
      id: 5,
      img: imgas,
      name: "Raj Verma.",
      location: "Hyderabad, India.",
      review:
        "The very first website where I was really impressed just because of their security and privacy settings. They don't hide anything and they are providing every option which is forcing me to believe that they are really working a lot on security.",
    },
    {
      id: 6,
      img: imgas,
      name: "Tanamay Lahkar.",
      location: "Nagaland, India.",
      review:
        "I don't know much about cryptocurrencies, trading, and their analysis but TP-coin made this easier by providing news, charts, tables, docs, easy buy-sell processes, and much more things.",
    },
  ];
  return (
    <>
      <div className="my-10 font-nunito select-none">
        <p className="font-semibold text-center text-2xl mobile:text-xl">
          Here’s what our customer's think :
        </p>

        <div className="min-w-full flex items-center gap-10 py-10 whitespace-nowrap scrollbar-hide animated-scroll">
          {customerApi.map((customer) => (
            <div
              className="p-2 h-52 min-w-1/3 laptop:min-w-2/5 tablet:min-w-full mobile:min-w-full 
              flex items-center bg-gray-200 rounded-lg shadow-xl border border-gray-300"
              key={customer.id}
            >
              <img
                className="h-40 w-40 rounded-full"
                src={customer.img}
                alt="user profilele"
              />
              <div className="my-4 mx-2 flex flex-col whitespace-normal">
                <h1 className="text-xl font-bold">{customer.name}</h1>
                <p className="text-gray-500 font-medium">{customer.location}</p>

                <p className="font-semibold text-sm">{customer.review}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomerReview;
