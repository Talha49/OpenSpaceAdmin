"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Stepper from "./Stepper";
import { FaPlus } from "react-icons/fa";
import { fetchUsers } from "@/lib/Feature/UserSlice";
import { IoMdClose } from "react-icons/io";
import { createGroup } from "@/lib/Feature/GroupSlice";

const Dialog = ({ children, onClose }) => {
  return (
    <div className="absolute top-0 h-screen w-[91vw] flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg border relative">
        <div
          className="text-xl cursor-pointer absolute top-2 right-2"
          onClick={onClose}
        >
          <IoMdClose />
        </div>
        {children}
      </div>
    </div>
  );
};

const GroupFormComp = () => {
  const groupMembers = useSelector((state) => state.user.selectedGroupUsers);
  const [activeStep, setActiveStep] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null); // 'owners' or 'members'
  const [groupType, setGroupType] = useState("Type 1");
  const [stepperFormData, setStepperFormData] = useState({
    groupType: "Type 1",
    basics: {
      name: "",
      description: "",
    },
    owners: [],
    members: [],
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const users = useSelector((state) => state.user.users);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleNext = () => {
    if (activeStep < 4) {
      switch (activeStep) {
        case 0:
          setActiveStep((prevStep) => prevStep + 1);
          break;
        case 1:
          if (
            stepperFormData.basics.name !== "" &&
            stepperFormData.basics.description !== ""
          ) {
            setActiveStep((prevStep) => prevStep + 1);
          } else {
            alert("Please fill out the fields");
          }
          break;
        case 2:
          if (stepperFormData.owners.length !== 0) {
            setActiveStep((prevStep) => prevStep + 1);
          } else {
            alert("Please select at least 1 owner");
          }
          break;
        case 3:
          if (stepperFormData.members.length >= 2) {
            setActiveStep((prevStep) => prevStep + 1);
          } else {
            alert("Please select at least 2 members");
          }
          break;
        default:
          break;
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setStepperFormData((prevData) => ({
      ...prevData,
      basics: {
        ...prevData.basics,
        [field]: value,
      },
    }));
  };

  const handleUserSelection = (user, type) => {
    setStepperFormData((prevData) => {
      const updatedList = prevData[type].includes(user)
        ? prevData[type].filter((userObj) => userObj !== user)
        : [...prevData[type], user];

      return {
        ...prevData,
        [type]: updatedList,
      };
    });
  };

  const handleCreateGroup = () => {
    dispatch(createGroup(stepperFormData))

    // alert("group created");
    // console.log(stepperFormData);
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
                  <input
                    type="radio"
                    name="groupType"
                    checked={groupType === "Type 1"}
                    onChange={() => {
                      setGroupType("Type 1");
                      setStepperFormData({
                        ...stepperFormData,
                        groupType: "Type 1",
                      });
                    }}
                  />
                  <h1 className="font-bold">Type 1</h1>
                </li>
                <p className="ml-[29px] text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                  recusandae.
                </p>
              </div>
              <div className="pb-5">
                <li className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="groupType"
                    checked={groupType === "Type 2"}
                    onChange={() => {
                      setGroupType("Type 2");
                      setStepperFormData({
                        ...stepperFormData,
                        groupType: "Type 2",
                      });
                    }}
                  />
                  <h1 className="font-bold">Type 2</h1>
                </li>
                <p className="ml-[29px] text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                  recusandae.
                </p>
              </div>
              <div className="pb-5">
                <li className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="groupType"
                    checked={groupType === "Type 3"}
                    onChange={() => {
                      setGroupType("Type 3");
                      setStepperFormData({
                        ...stepperFormData,
                        groupType: "Type 3",
                      });
                    }}
                  />
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
                value={stepperFormData.basics.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <label>Description</label>
              <textarea
                rows={5}
                placeholder="Enter group description"
                className="p-3 mb-4 outline-blue-600 border border-gray-400 rounded-lg"
                value={stepperFormData.basics.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </form>
          </div>
        );
      case 2:
        return (
          <div>
            <h1 className="text-2xl font-bold">Assign owners</h1>
            <p className="my-7">
              Select the users who will be assigned as owners of this group.
            </p>
            <div className="mt-8 h-[1px] w-full bg-gray-300" />
            <button
              className="flex items-center gap-2 text-lg my-2"
              onClick={() => {
                setDialogType("owners");
                setIsDialogOpen(true);
              }}
            >
              <FaPlus className="text-blue-500" />
              <p>Assign owners</p>
            </button>
            <ul className="mt-4">
              {stepperFormData.owners.map((owner) => {
                const myOwner = users.find((user) => user.id === owner.id);
                return (
                  <li
                    key={myOwner.id}
                    className="border rounded-md p-2 my-2 bg-gray-100"
                  >
                    {myOwner.fullName} - {myOwner.email}
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 h-[1px] w-full bg-gray-300" />
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
              <p>New owners will receive an email when you add them.</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h1 className="text-2xl font-bold">Add members</h1>
            <p className="my-7">
              Select the users who will be members of this group.
            </p>
            <div className="mt-8 h-[1px] w-full bg-gray-300" />
            <button
              className="flex items-center gap-2 text-lg my-2"
              onClick={() => {
                setDialogType("members");
                setIsDialogOpen(true);
              }}
            >
              <FaPlus className="text-blue-500" />
              <p>Add members</p>
            </button>

            <ul className="mt-4">
              {stepperFormData.members.map((member) => {
                const myMember = users.find((user) => user.id === member.id);
                return (
                  <li
                    key={myMember.id}
                    className="border rounded-md p-2 my-2 bg-gray-100"
                  >
                    {myMember.fullName} - {myMember.email}
                  </li>
                );
              })}
            </ul>
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
              <h1 className="text-xl font-bold">Add group members</h1>
              <p>New members will receive an email when you add them.</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex items-center justify-between">
            <img
              src="/images/Checklist.jpg"
              width={"50%"}
              height={400}
              alt="Checklist"
            />
            <div className="flex flex-col w-full items-center justify-center">
              <h1 className="text-gray-600 text-xl font-bold mb-5">
                All Steps Completed
              </h1>
              <button
                className="bg-blue-600 px-3 py-2 rounded-lg h-fit"
                onClick={handleCreateGroup}
              >
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
          onClick={() => {
            if (
              stepperFormData.basics.name !== "" &&
              stepperFormData.basics.description !== "" &&
              stepperFormData.owners.length >= 1 &&
              stepperFormData.members.length >= 2
            ) {
              handleCreateGroup();
            } else {
              alert("Please complete the process");
            }
          }}
          className="bg-gray-400 px-3 py-2 mr-4 rounded-lg h-fit"
        >
          Finish
        </button>
      </div>
      {isDialogOpen && (
        <Dialog onClose={() => setIsDialogOpen(false)}>
          <ul className="w-fit h-[400px] overflow-y-auto relative">
            <div className="w-fit flex items-center justify-between sticky top-0 bg-white">
              <h1 className="text-2xl font-bold">
                Select {dialogType === "owners" ? "Owners" : "Members"}
              </h1>
            </div>
            {users?.map((user) => (
              <li
                key={user.id}
                className="border rounded-md even:bg-gray-100 my-2 text-xs"
              >
                <div className="grid grid-cols-3 p-2 gap-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={stepperFormData[dialogType]?.includes(user)}
                      onChange={() => handleUserSelection(user, dialogType)}
                    />
                    <span>{user.fullName}</span>
                  </div>
                  <span>{user.email}</span>
                  <span className="text-center">{user.contact}</span>
                </div>
              </li>
            ))}
          </ul>
        </Dialog>
      )}
    </div>
  );
};

export default GroupFormComp;
