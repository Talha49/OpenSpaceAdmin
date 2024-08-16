// pages/GroupCreationForm.js
"use client";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createGroup } from '@/lib/Feature/GroupSlice';

const GroupCreationForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [groupData, setGroupData] = useState({
    type: '',
    name: '',
    description: '',
    admins: [],
    members: JSON.parse(router.query?.users || '[]'),
  });

  const handleInputChange = (e) => {
    setGroupData({ ...groupData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createGroup(groupData));
    router.push('/group/ActiveGroups');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Group</h1>
      <div className="flex mb-4">
        <div className="w-1/4">
          <ul>
            <li className={step === 1 ? 'font-bold' : ''}>Group Type</li>
            <li className={step === 2 ? 'font-bold' : ''}>Group Details</li>
            <li className={step === 3 ? 'font-bold' : ''}>Review</li>
          </ul>
        </div>
        <div className="w-3/4">
          {step === 1 && (
            <div>
              <h2 className="text-xl mb-2">Select Group Type</h2>
              <select
                name="type"
                value={groupData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Type</option>
                <option value="team">Team</option>
                <option value="department">Department</option>
                <option value="project">Project</option>
              </select>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-xl mb-2">Group Details</h2>
              <input
                type="text"
                name="name"
                placeholder="Group Name"
                value={groupData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                name="description"
                placeholder="Group Description"
                value={groupData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-xl mb-2">Review Group Information</h2>
              <p><strong>Type:</strong> {groupData.type}</p>
              <p><strong>Name:</strong> {groupData.name}</p>
              <p><strong>Description:</strong> {groupData.description}</p>
              <p><strong>Members:</strong> {groupData.members.length}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        {step > 1 && <button onClick={handlePrevious} className="bg-gray-500 text-white px-4 py-2 rounded">Previous</button>}
        {step < 3 ? 
          <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button> :
          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">Create Group</button>
        }
      </div>
    </div>
  );
};

export default GroupCreationForm;