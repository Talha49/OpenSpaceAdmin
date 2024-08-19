import React from "react";
import { TiTick } from "react-icons/ti";

const Stepper = ({ steps, activeStep, onStepChange }) => {
  return (
    <ul className="flex flex-col py-10">
      {steps.map((step, i) => (
        <div key={i}>
          <li
            className="flex items-center gap-4"
            // onClick={() => onStepChange(i)}
          >
            <span
              className={`rounded-full w-5 h-5 flex items-center justify-center text-white ${
                i <= activeStep ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              {i <= activeStep ? <TiTick /> : i + 1}
            </span>
            <p>{step}</p>
          </li>
          {i !== steps.length - 1 && (
            <div
              className={`h-16 w-[1px] ml-[9px] ${
                i < activeStep ? "bg-blue-500" : "bg-gray-500"
              }`}
            />
          )}
        </div>
      ))}
    </ul>
  );
};

export default Stepper;
