"use client"
import { toggleTheme } from '@/lib/Feature/ThemeSlice';
import React from 'react';
import { FaCheck, FaCircle, FaEllipsisH, FaUser, FaCode, FaUsers } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

const cardsData = [
  {
    title: "Microsoft Teams",
    subtitle: "Support remote workers with Teams",
    description: "Learn how to manage Teams for remote work with setup guidance, short videos, and tips",
    items: [
      { text: "Teams is on for your organization", checked: true },
      { text: "Check setup status for new Teams users", checked: false },
      { text: "Guest access is on", checked: true }
    ],
    buttons: ["Manage Teams", "Learn more"]
  },
  {
    title: "User management",
    description: "Add, edit, and remove user accounts, and reset passwords.",
    buttons: ["Add user", "Edit a user"]
  },
  {
    title: "Billing",
    balance: "$0.00",
    subtext: "Total balance",
    buttons: ["Balance", "Subscription"]
  },
  {
    title: "Training & guides",
    items: [
      { icon: "user", text: "Training for admins", subtext: "Microsoft 365 tutorials and videos" },
      { icon: "code", text: "Customized setup guidance", subtext: "Choose a setup path to fit your org" },
      { icon: "users", text: "Training for users", subtext: "Learn to use Microsoft 365 and the Office apps" }
    ]
  }
];

const HomeP = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
          <h1 className="text-xl font-semibold text-gray-800">peritus.ae</h1>
          <div className="flex items-center space-x-4">
          <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
    >
      {isDarkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
            <button className="text-blue-600 hover:text-blue-800 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What's new?
            </button>
          </div>
        </div>
        <button className="mb-6 text-blue-600 hover:text-blue-800">+ Add cards (8 more available)</button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardsData.map((data, index) => (
            <Card key={index} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Card = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4 pb-4 border-b">
          <h2 className="text-base font-semibold text-gray-600">{data.title}</h2>
          <FaEllipsisH className="text-gray-400" />
        </div>
        {data.subtitle && <h3 className="text-xl font-bold mb-2">{data.subtitle}</h3>}
        {data.description && <p className="text-sm text-gray-600 mb-4">{data.description}</p>}
        {data.balance && (
          <div className="mb-4">
            <span className="text-2xl font-bold">{data.balance}</span>
            <span className="text-xs text-gray-500 ml-2">{data.subtext}</span>
          </div>
        )}
        {data.items && (
          <ul className="space-y-3 mb-4">
            {data.items.map((item, index) => (
              <li key={index} className="flex items-start">
                {item.checked !== undefined ? (
                  <span className={`mr-3 mt-1 ${item.checked ? 'text-green-500' : 'text-blue-500'}`}>
                    {item.checked ? <FaCheck /> : <FaCircle size={12} />}
                  </span>
                ) : (
                  <span className="mr-3 mt-1 text-gray-400 bg-gray-100 p-1 rounded">
                    {item.icon === 'user' && <FaUser />}
                    {item.icon === 'code' && <FaCode />}
                    {item.icon === 'users' && <FaUsers />}
                  </span>
                )}
                <div>
                  <p className="text-sm font-medium">{item.text}</p>
                  {item.subtext && <p className="text-xs text-gray-500">{item.subtext}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {data.buttons && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 mt-auto flex">
          {data.buttons.map((button, index) => (
            <button
              key={index}
              className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {button}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeP;