"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Stepper from "./Stepper";
import { CiCircleInfo } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import Image from "next/image";

const GroupFormComp = () => {
  const groupMembers = useSelector((state) => state.user.selectedGroupUsers);
  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleNext = () => {
    if (activeStep < 4) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const renderContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="">
            <h1 className="text-2xl font-bold">Choose a group type</h1>
            <p className="my-7">
              Choose the group type that best meets your team's needs.
            </p>
            <ul>
              <div className="pb-5">
                <li className="flex items-center gap-4">
                  <input type="radio" />
                  <h1 className="font-bold">Type 1</h1>
                </li>
                <p className="ml-[29px] text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                  recusandae.
                </p>
              </div>
              <div className="pb-5">
                <li className="flex items-center gap-4">
                  <input type="radio" />
                  <h1 className="font-bold">Type 2</h1>
                </li>
                <p className="ml-[29px] text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                  recusandae.
                </p>
              </div>
              <div className="pb-5">
                <li className="flex items-center gap-4">
                  <input type="radio" />
                  <h1 className="font-bold">Type 3</h1>
                </li>
                <p className="ml-[29px] text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                  recusandae.
                </p>
              </div>
            </ul>
          </div>
        );
      case 1:
        return (
          <div>
            <h1 className="text-2xl font-bold">Set up the basics</h1>
            <p className="my-7">
              To get started, fill out the basic info about the group you'd like
              to create.
            </p>
            <form className="flex flex-col max-w-[400px]">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter group name"
                className="p-3 mb-4 outline-blue-600 border border-gray-400 rounded-lg"
              />
              <label>Description</label>
              <textarea
                rows={5}
                placeholder="Enter group description"
                className="p-3 mb-4 outline-blue-600 border border-gray-400 rounded-lg"
              />
            </form>
          </div>
        );
      case 2:
        return (
          <div>
            <h1 className="text-2xl font-bold">Assign owners</h1>
            <p className="my-7">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum rem
              eos in neque, similique placeat dignissimos ea temporibus illo
              quae tempore dolorem ipsa id nihil provident rerum ex, itaque eum?
            </p>
            <div className="flex items-center gap-2 bg-gray-300 p-2 rounded">
              <CiCircleInfo className="text-5xl" />
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
                distinctio, voluptatum, sed debitis deleniti, voluptate cum
                praesentium aperiam et quas eaque iusto.
              </p>
            </div>
            <div className="mt-8 h-[1px] w-full bg-gray-300" />
            <button className="flex items-center gap-2 text-lg my-2">
              <FaPlus className="text-blue-500" />
              <p>Assign owners</p>
            </button>
            <div className="grid grid-cols-2 mt-7">
              <div className="flex items-center gap-10">
                <input type="radio" />
                <p>Display Name</p>
              </div>
              <div>
                <p>Team enabled</p>
              </div>
            </div>
            <div className="w-full text-center mt-10 text-gray-600">
              <h1 className="text-xl font-bold">Add group owners</h1>
              <p>
                New owners will receive an email when you add them.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h1 className="text-2xl font-bold">Add members</h1>
            <p className="my-7">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum rem
              eos in neque, similique placeat dignissimos ea temporibus illo
              quae tempore dolorem ipsa id nihil provident rerum ex, itaque eum?
            </p>
            <div className="mt-8 h-[1px] w-full bg-gray-300" />
            <button className="flex items-center gap-2 text-lg my-2">
              <FaPlus className="text-blue-500" />
              <p>Add members</p>
            </button>
            <div className="grid grid-cols-2 mt-7">
              <div className="flex items-center gap-10">
                <input type="radio" />
                <p>Display Name</p>
              </div>
              <div>
                <p>Team enabled</p>
              </div>
            </div>
            <div className="w-full text-center mt-10 text-gray-600">
              <h1 className="text-xl font-bold">Add your first group member</h1>
              <p>
                New members will receive an email when you add them.
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex items-center justify-between">
            <Image src="/images/Checklist.jpg" width={500} height={500} />
            <div className="flex flex-col w-full items-center justify-center">
              <h1 className="text-gray-600 text-xl font-bold mb-5">
                All Steps Completed
              </h1>
              <button className="bg-blue-600 px-3 py-2 rounded-lg h-fit">
                Finish
              </button>
            </div>
          </div>
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div>
      <div className="flex w-full pr-4">
        <aside className="w-[30%] h-full border-r border-r-gray-300">
          <Stepper
            steps={["Group Type", "Basics", "Owners", "Members", "Finish"]}
            activeStep={activeStep}
            onStepChange={handleStepChange}
          />
        </aside>
        <div className="w-full p-10 flex flex-col justify-between">
          {renderContent()}
        </div>
      </div>
      <div className="flex justify-between items-center py-4 w-full border-t border-gray-300">
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            disabled={activeStep === 0}
            className={`border border-gray-300 px-3 py-2 rounded-lg h-fit ${
              activeStep === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={activeStep === 4}
            className={`bg-gray-600 px-3 py-2 rounded-lg h-fit ${
              activeStep === 4 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>
        <button
          onClick={() => alert("Finish!")}
          className="bg-gray-400 px-3 py-2 mr-4 rounded-lg h-fit"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default GroupFormComp;
