"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Stepper from "./Stepper";
import { FaPlus } from "react-icons/fa";
import { fetchUsers } from "@/lib/Feature/UserSlice";
import { IoMdClose } from "react-icons/io";
import { createGroup } from "@/lib/Feature/GroupSlice";
import { useRouter } from "next/navigation";
import { fetchGroups } from "@/lib/Feature/GroupSlice";
import groupTypes from "./groupType/groupTypes.json";
const Dialog = ({ children, onClose }) => {
  return (
    <div className="absolute top-0 h-screen w-[91vw] flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-lg border dark:border-neutral-800 relative">
        <div
          className="text-xl cursor-pointer absolute top-2 right-2 scale-110 z-50"
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
  const [groupType, setGroupType] = useState(groupTypes[0].name);
  const [stepperFormData, setStepperFormData] = useState({
    groupType: groupTypes[0].name,
    basics: {
      name: "",
      description: "",
    },
    owners: [],
    members: [],
  });

  const dispatch = useDispatch();

  const router = useRouter();

  const handleClose = () => {
    setIsDialogOpen(false); // Close the modal
    router.push("/group/ActiveGroups"); // Replace "/previousScreen" with the route you want to navigate back to
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    // Fetch groups when the component mounts
    dispatch(fetchGroups());
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
            if (stepperFormData.owners.length > 0) {
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
  

  const handleCreateGroup = async () => {
    console.log("Frontend: Preparing group data:", stepperFormData);
  
    // Validate required fields
    if (stepperFormData.owners.length === 0) {
      alert("At least one owner must be selected.");
      return;
    }
    if (stepperFormData.members.length < 2) {
      alert("At least two members must be selected.");
      return;
    }
    if (!stepperFormData.basics.name || !stepperFormData.basics.description) {
      alert("Group name and description are required.");
      return;
    }
  
    // Map data for the API
    const requestData = {
      basics: stepperFormData.basics,
      owners: stepperFormData.owners, // These objects include `_id`
      members: stepperFormData.members, // These objects include `_id`
      groupType: stepperFormData.groupType // Include groupType here
    };
  
    try {
      const response = await fetch("/api/Groups/createGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      console.log("Frontend: API response received. Status:", response.status);
  
      if (!response.ok) {
        throw new Error("Failed to create group");
      }
  
      const data = await response.json();
      console.log("Frontend: Group successfully created. Data:", data);
  
      alert("Group created successfully!");
      router.push("/group/ActiveGroups");
    } catch (error) {
      console.error("Frontend: Error creating group:", error);
      alert("An error occurred while creating the group.");
    }
  };
  
  

  const renderContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div>
            <h1 className="text-2xl font-bold">Choose a group type</h1>
            <p className="my-7">
              Choose the group type that best meets your team's needs.
            </p>
            <ul>
              {groupTypes.map((type) => (
                <li key={type.id} className="pb-5">
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="groupType"
                      checked={groupType === type.name}
                      onChange={() => {
                        setGroupType(type.name);
                        setStepperFormData({ ...stepperFormData, groupType: type.name });
                      }}
                    />
                    <h1 className="font-bold">{type.name}</h1>
                  </div>
                  <p className="ml-[29px] text-sm">{type.description}</p>
                </li>
              ))}
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

            <div className="mt-8 h-[1px] w-full" />

            <button
              className="flex items-center gap-2 blue-button text-lg my-2"
              onClick={() => {
                setDialogType("owners");
                setIsDialogOpen(true);
              }}
            >
              <FaPlus className="text-blue-500" />
              <p>Assign owners</p>
            </button>

            <div className="grid grid-cols-2 mt-7">
              {/* <div className="flex items-center gap-10">
                <input type="radio" />
                <p>Display Name</p>
              </div> */}
            </div>

            <ul className="mt-4">
              {stepperFormData.owners.length > 0 ? (
                stepperFormData.owners.map((owner) => {
                 // const myOwner = users.find((user) => user.id === owner.id);
                  return (
                    <li
                      key={owner.id}
                      className="border dark:border-neutral-600 rounded-md p-2 my-2 bg-gray-100 dark:bg-neutral-800"
                    >
                      {owner.fullName} - {owner.email}
                    </li>
                  );
                })
              ) : (
                <div className="text-center">
                  <h1 className="text-xl font-bold">Add group owners</h1>
                  <p>New owners will receive an email when you add them.</p>
                </div>
              )}
            </ul>

            <div className="mt-8 h-[1px] w-full bg-gray-300" />
          </div>
        );
      case 3:
        return (
          <div>
            <h1 className="text-2xl font-bold">Add members</h1>
            <p className="my-7">
              Select the users who will be members of this group.
            </p>

            <div className="mt-8 h-[1px] w-full" />

            <button
              className="flex items-center gap-2 blue-button text-lg my-2"
              onClick={() => {
                setDialogType("members");
                setIsDialogOpen(true);
              }}
            >
              <FaPlus className="text-blue-500" />
              <p>Add members</p>
            </button>

            <div className="grid grid-cols-2 mt-7">
              {/* <div className="flex items-center gap-10">
                <input type="radio" />
                <p>Display Name</p>
              </div> */}
            </div>

            <div className="mt-4 p-2 overflow-auto h-40">
              <ul>
                {stepperFormData.members.length > 0 ? (
                  stepperFormData.members.map((member) => {
                 //   const myMember = users.find(
                 //     (user) => user.id === member.id
                 //   );
                    return (
                      <li
                        key={member.id}
                        className="border dark:border-neutral-600 rounded-md p-2 my-2 bg-gray-100 dark:bg-neutral-800"
                      >
                        {member.fullName} - {member.email}
                      </li>
                    );
                  })
                ) : (
                  <div className="text-center">
                    <h1 className="text-xl font-bold">Add group members</h1>
                    <p>New members will receive an email when you add them.</p>
                  </div>
                )}
              </ul>
            </div>
          </div>
        );
        case 4:
          return (
            <div className="flex flex-col items-center justify-center w-full p-10 bg-gray-50 dark:bg-neutral-800 rounded-lg shadow-lg">
              <img
                src="/images/Checklist.png"
                width="40%"
                height={300}
                alt="Checklist"
                className="mix-blend-multiply mb-8"
              />
              
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-5">All Steps Completed</h1>
        
              <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Group Details</h2>
        
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-300"><strong>Group Type:</strong> {stepperFormData.groupType}</p>
                  <p className="text-gray-600 dark:text-gray-300"><strong>Group Name:</strong> {stepperFormData.basics.name}</p>
                  <p className="text-gray-600 dark:text-gray-300"><strong>Description:</strong> {stepperFormData.basics.description}</p>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white mt-5">Owners:</h3>
                    {stepperFormData.owners.length > 0 ? (
                      <ul className="space-y-2">
                        {stepperFormData.owners.map((owner, index) => (
                          <li key={index} className="flex justify-between p-3 bg-gray-100 dark:bg-neutral-700 rounded-md">
                            <span>{owner.fullName}</span>
                            <span className="text-gray-500">{owner.email}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No owners selected</p>
                    )}
                  </div>
        
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white mt-5">Members:</h3>
                    {stepperFormData.members.length > 0 ? (
                      <ul className="space-y-2">
                        {stepperFormData.members.map((member, index) => (
                          <li key={index} className="flex justify-between p-3 bg-gray-100 dark:bg-neutral-700 rounded-md">
                            <span>{member.fullName}</span>
                            <span className="text-gray-500">{member.email}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No members selected</p>
                    )}
                  </div>
                </div>
              </div>
        
             {/* <div className="flex justify-center gap-5 mt-8">
                <button
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  onClick={handleCreateGroup}
                >
                  Finish
                </button>
              </div> */}
            </div>
         
        );
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="pl-4">
      <div className="flex w-full pr-4">
        <aside className="w-[30%] h-full border-r border-r-gray-300 dark:border-neutral-800">
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
      <div className="flex justify-between items-center py-4 w-full border-t border-gray-300 dark:border-neutral-800">
        <div className="flex gap-4">
        <button
          onClick={handleClose}
          className="border bg-gray-300 text-white h-fit  px-3 py-2 rounded-lg"
        >
         Cancel
        </button>
          <button
            onClick={handleBack}
            disabled={activeStep === 0}
            className={`border blue-button px-3 py-2 rounded-lg h-fit ${
              activeStep === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={activeStep === 4}
            className={`blue-button px-3 py-2 rounded-lg h-fit ${
              activeStep === 4 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>
        {activeStep === 4 && (
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
      className="blue-button px-3 py-2 mr-4 rounded-lg h-fit"
    >
      Finish
    </button>
  )}
      </div>
      {isDialogOpen && (
        <Dialog onClose={() => setIsDialogOpen(false)}>
          
          <ul className="w-fit h-[400px] overflow-y-auto relative">
            <div className="w-full flex items-center justify-between sticky top-0 bg-white dark:bg-neutral-800">
              <h1 className="text-2xl font-bold">
                Select {dialogType === "owners" ? "Owners" : "Members"}
              </h1>
            </div>
            {users?.map((user) => (
              <li
                key={user.id}
                className="border dark:border-neutral-700 rounded-md even:bg-gray-100 dark:even:bg-neutral-700 my-2 text-xs"
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
             {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <button
          className="blue-button px-4 py-2 rounded-lg"
          onClick={() => {
            // Logic to save selected owners or members
            if (dialogType === "owners") {
              console.log("Owners selected:", stepperFormData.owners);
            } else if (dialogType === "members") {
              console.log("Members selected:", stepperFormData.members);
            }
            setIsDialogOpen(false); // Close the dialog after saving
          }}
        >
          Save
        </button>
      </div>
          </ul>
          
        </Dialog>
      )}
    </div>
  );
};

export default GroupFormComp;
